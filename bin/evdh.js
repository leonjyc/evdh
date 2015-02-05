/* evdh.js, used in node.js, main bin file for evdh : EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 * version 0.1.5.0 test201502051701 (public win version) 
 * author sceext <sceext@foxmail.com> 2015.02 
 * copyright 2015 sceext 
 *
 * This is FREE SOFTWARE, released under GNU GPLv3+ 
 * please see README.md and LICENSE for more information. 
 *
 *    evdh : EisF Video Download Helper, auto download videos with analyse service provided by flv.cn (api.flvxz.com) 
 *    Copyright (C) 2015 sceext <sceext@foxmail.com> 
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* require import modules */
var _m = require('../lib/main.js');	// evdh main module

// get modules from _m
var _b = _m.b_;
var _log = _m.log_;
var _ui = _m.ui_;
var _aurl = _m.aurl_;

var fs = _m.fs_;

// set main module

// set config
_m.etc.config_file = './etc/evdh.conf.xml';	// main config file location

_m.etc.refresh_log_timeout_ms = 5e3;	// refresh log every 5s

// import time_log from _m for global use
var time_log = _m.time_log;

// get main global object
var _ = _m._;


/* functions */


// watch_dl, auto watch dl status
function watch_dl() {	// no callback
	var _host = {};
	
	_host.error = null;
	_host.timeout = null;	// timeout object
	
	_host.index = {};
	_host.first_show = true;
	
	_host.last_line = 0;
	_host.moved = false;
	
	_host.stop = false;
	
	var _next = watch_dl_next;
	_next(1, _host);
	
	return function(){
		_host.stop = true;
		
		clearTimeout(_host.timeout);
	};	// use this function to stop watch
}

function watch_dl_next(_step, _host) {
	var _next = watch_dl_next;
	switch (_step) {
	case 1:	// first step
		
		// set timeout to show download status
		_host.timeout = setTimeout(function(){
			_next('show_status', _host);
		}, 1e3);	// every 1s
		
		break;
	case 'show_status':
	case 2:	//
		_step = 2;
		
		// get o_host_task all file and done file
		var oh_st = _.oh.get_status();
		var oh_all_file = oh_st.count.all_file;
		var oh_done_file = oh_st.count.done;
		var oh_error_file = oh_st.count.error;
		
		// get ids
		var ids = _.dl.get_id_list();
		for (var j = 0; j < ids.length; j++) {	// process each ids
			var id = ids[j];
			var st = _.dl.get_status(id);
			
			var old_byte = 0;
			
			// get old byte
			if (!_host.index[id]) {
				_host.index[id] = {};
				
				_host.index[id].old_byte = 0;
			} else {
				old_byte = _host.index[id].old_byte;
			}
			
			var ed_byte = st.ed_byte;
			
			_host.index[id].old_byte = ed_byte;
			
			var speed = ed_byte - old_byte;
			var ed_ms = ((new Date()).getTime()) - (st.start_time.getTime());
			var ed_s = Math.floor(ed_ms / 1e3);
			
			// check first show
			if (_host.first_show) {
				console.log('');
				_host.first_show = false;
			}
			
			// move up
			if (!_host.moved) {
				_ui.move_by(0, - _host.last_line);
				_host.last_line = 0;
				
				_host.moved = true;
			}
			
			var fw = _ui.force_width;
			// console out
			console.log('(' + fw(oh_done_file, 2, true) + '/' + fw(oh_all_file, 2, true) + ') [ ' + fw(oh_error_file, 2, true) + ' ] ' + fw(id, 2, true) + ' : [ ' + st.status + ' ] ' + _ui.get_show_file_size(ed_byte) + ' ' + _ui.get_show_time(ed_s) + ' ' + _ui.get_show_dl_speed(speed) + ' ');
			
			// count last line
			_host.last_line ++;
		}
		
		_host.moved = false;
		
		
		if (_host.stop) {
			return;
		}
		
		// re set timeout
		if (!this.error) {
			_host.timeout = setTimeout(function(){
				_next('show_status', _host);
			}, 1e3);
		}
		
		break;
	case 0:	// ok finish step
		
		_host.callback();
		
		break;
	case -1:	// error step
		
		_host.callback(_host.error);
		
		break;
	default:	// step error
		time_log('ERROR: evdh.js watch_dl_file_next: step error ! ');
	}
}


// test host task
function test_host_task(callback) {	// finish callback(error);
	var _host = {};
	
	_host.callback = callback;
	
	_host.error = null;
	
	var _next = test_host_task_next;
	_next(1, _host);
}

function test_host_task_next(_step, _host) {
	var _next = test_host_task_next;
	switch (_step) {
	case 1:	// first step
		
		// check log file
		_host.log_file = _.ol.log_file;
		
		// check it exist
		fs.exists(_host.log_file, function(exist){
			_host.log_file_exist = exist;
			
			_next(_step + 1, _host);
		});
		
		break;
	case 2:	// read log
		if (!_host.log_file_exist) {
			// not exist
			_next('create_new_task', _host);
			
			return;
		}
		
		_.ol.read(function(err){
			if (err) {
				time_log('错误: 读取日志文件失败 ! ');
				
				// just start a new task
				_next('create_new_task', _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 3:	// check log
		
		var logs = _.ol.get_list();
		var found = [false, false];
		var item_l = [];
		
		// check log items
		for (var i = 0; i < logs.length; i++) {
			var ilog = logs[i];
			
			switch (ilog.type) {
			case 'o_host_file_dl':
				if (ilog.json !== null) {
					found[0] = true;
					
					item_l[0] = ilog;
				}
				
				break;
			case 'o_host_task':
				if (ilog.json !== null) {
					found[1] = true;
					
					item_l[1] = ilog;
				}
				
				break;
			}
		}
		
		// check found
		if (!found[1]) {	// not found unfinished task
			time_log('信息: 没有发现未完成的任务 ');
			
			_next('create_new_task', _host);
			return;
		}
		
		// save found, and item_l to host
		_host.log_item_found = found;
		_host.log_item_item_l = item_l;
		
		// print task info
		var task_i = item_l[1].json;
		
		console.log('');
		time_log('信息: 发现 1 个未完成的任务; 任务信息如下: ');
		
		console.log('    视频播放页面URL    : ' + task_i.host_url);
		console.log('    保存文件的基础位置 : ' + task_i.base_path);
		console.log('    视频网站           : ' + task_i.site);
		console.log('    清晰度代码 : ' + task_i.hd + ',  视频质量 : ' + task_i.quality);
		console.log('    标题               : ' + task_i.title);
		// count
		console.log('\n    总计 ' + task_i.count.all_file + ' 个文件, ' + _ui.get_show_file_size(task_i.count.all_byte) + ' ' + _ui.get_show_time(task_i.count.all_time_s) + ', 正在下载 ' + task_i.count.doing + ', 等待 ' + task_i.count.wait + ', 错误 ' + task_i.count.error + ' ');
		console.log('    已完成 ' + task_i.count.done + ' 个文件, ' + _ui.get_show_file_size(task_i.count.ed_byte) + ', ' + (_ui.make_rest_num((task_i.count.ed_byte / task_i.count.all_byte) * 1e2, 2)) + '% \n');
		
		// ask user
		_ui.ask_line('    你想继续吗? (y/N) : ', function(text){
			_host.answer = text;
			
			_next(_step + 1, _host);
		});
		
		break;
	case 4:	// got answer
		console.log('');
		
		if (_host.answer == 'N') {
			// start new task
			_next('create_new_task', _host);
			return;
		}
		
		// re get found, item_l
		var found = _host.log_item_found;
		var item_l = _host.log_item_item_l;
		
		// set o_host_task log
		_.oh.set_log(item_l[1].json);
		
		time_log('信息: 正在 继续任务 ... ');
		// now, read log, load task, and restart done
		_next('start_task', _host);
		
		break;
	case 'create_new_task':
	case 5:	//
		_step = 5;
		
		console.log('');
		
		// input a url
		_ui.ask_line('    请输入一个 视频播放页面的 URL : ', function(text){
			_host.input_url = _b.pure_string(text);
			
			_next(_step + 1, _host);
		});
		
		break;
	case 6:	// got url
		console.log('');
		
		time_log('信息: 已输入 URL [[' + _host.input_url + ']] \n');
		
		// analyse it
		_aurl.aurl(_host.input_url, function(err, info){
			if (err) {
				time_log('错误: 解析 URL 失败 ! ');
				
				_host.error = err;
				_next(-1, _host);
			} else {
				_host.ainfo = info;
				
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 7:	// got info
		
		// check video numbers
		var info = _host.ainfo.video;
		
		var v_num = info.length;
		if (v_num > 0) {
			time_log('[ OK ] 发现 ' + v_num + ' 个视频 ! ');
		} else {
			time_log('错误: 发现 ' + v_num + ' 个视频 ! ');
		}
		
		// auto choose quality
		_m.select_quality(info, function(err, info){
			if (err) {
				time_log('错误: 自动选择视频质量失败 ! ');
				
				_host.error = err;
				_next(-1, _host);
			} else {
				_host.auto_info = info;
				
				// check selected info
				if (!info) {
					time_log('错误: 没有这样的视频: 自动选择视频质量失败 ! ');
					
					_host.error = true;
					_next(-1, _host);
					
					return;
				}
				
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 8:	// got selected video
		
		// print video info
		time_log('信息: 自动选择了这个视频: ');
		
		_m.show_video_info([_host.auto_info]);
		
		console.log('');
		
		// ask ok
		_ui.ask_line('    这可以吗? (Y/n) : ', function(text){
			var t = _b.pure_string(text);
			if (t != 'Y') {
				time_log('信息: 你选择了退出. ');
				
				_next(0, _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 9:	// got answer, yes, continue
		
		// try to add task, get info
		var t_url = _host.input_url;
		
		var v_info = _host.auto_info;
		var t_hd = v_info.hd;
		var t_quality = v_info.quality;
		var t_title = v_info.title;
		
		var t_base_path = _.ci.download_path;
		
		// set path
		v_info.base_path = t_base_path;
		
		// set path of each file
		make_dl_path(v_info);
		
		// try to add task
		_.oh.create(t_url, t_hd, t_quality, t_title, _host.ainfo.video);
		
		// print out
		time_log('[ OK ] 添加 1 个任务, 任务信息如下: ');
		console.log('    URL                : ' + t_url);
		console.log('    清晰度代码 : ' + t_hd + ',    视频质量 : ' + t_quality);
		console.log('    标题               : ' + t_title);
		console.log('    保存文件的基础位置 : ' + t_base_path);
		console.log('    自动生成的文件名举例 : ');
		
		// show some paths
		for (var i = 0; i < v_info.file.length; i++) {
			var path = v_info.file[i].path;
			
			console.log('        ' + path);
			
			if (i > 3) {	// show at most 5 paths
				break;
			}
		}
		
		console.log('');
		
		// ask user
		_ui.ask_line('    这可以吗? (Y/n) : ', function(text){
			_host.answer = _b.pure_string(text);
			
			_next(_step + 1, _host);
		});
		
		break;
	case 10:	// got answer
		
		// check answer
		if (_host.answer != 'Y') {
			time_log('信息: 你选择了退出. ');
			
			_next(0, _host);
			
			return;
		}
		
		// refresh log
		_m.refresh_log(function(err){
			if (err) {
				time_log('错误: 刷写日志文件失败 ! 3 \n\n\n\n\n');
			}
		});
		
		_next(_step + 1, _host);
		
		break;
	case 'start_task':
	case 11:	// 
		_step = 11;
		
		// before start task, set something
		_.oh.callback = function(event){
			time_log('发生了事件: [' + event.type + '] id ' + event.id + ' \n\n\n\n');
			
			// refresh log
			_m.refresh_log(function(err){
				if (err) {
					time_log('错误: 刷写日志文件失败 ! 4 \n\n\n\n');
				}
			});
			
			// check event is 'dl_done'
			if (event.type == 'dl_done') {
				// next step
				_next(_step + 1, _host);
				
				return;
			}
			
			// check event is part_error
			if (event.type == 'part_error') {
				console.log(event.list);	// show detile error info
			}
		};
		
		time_log('信息: 开始下载 ... ');
		
		// start watch
		_host.stop_watch = watch_dl();
		
		// start id
		_.oh.start();
		
		// start refresh log
		_.refresh_log_obj = setTimeout(function refresh_log(){
			_m.refresh_log(function(err){
				if (err) {
					time_log('错误: 刷写日志文件失败 ! 7 \n\n\n\n\n');
				}
			});
			
			// set this
			if (_.refresh_log_flag) {
				_.refresh_log_obj = setTimeout(refresh_log, _m.etc.refresh_log_timeout_ms);
			}
		}, _m.etc.refresh_log_timeout_ms);
		
		_.refresh_log_flag = true;
		
		break;
	case 12:	// all file dl ok
		console.log('');
		time_log('[ OK ] 全部文件下载完成 ! ');
		
		// stop refresh_log
		_.refresh_log_flag = false;
		clearTimeout(_.refresh_log_obj);
		
		// stop watch
		_host.stop_watch();
		
		// remove task, and save info
		_host.task_info = _.oh.remove();
		
		// refresh log
		_m.refresh_log(function(err){
			if (err) {
				time_log('错误: 刷写日志文件失败 ! 5 \n\n\n\n');
			}
		});
		
		// start merge
		time_log('信息: 开始 自动合并视频 ... ');
		
		_m.merge_video(_host.task_info, function(code){
			_host.exit_code = code;
			
			_next(_step + 1, _host);
		});
		
		break;
	case 13:	// merge video done
		
		time_log('[ OK ] 合并视频完成. exit_code : ' + _host.exit_code);
		
		// ok finished
		_next(0, _host);
		
		break;
	case 0:	// ok finish step
		
		_host.callback(null);
		
		break;
	case -1:	// err step
		
		_host.callback(_host.error);
		
		break;
	default:	// step error
		time_log('ERROR: evdh.js test_host_task_next: step error ! ');
	}
}


// make path
function make_dl_path(video_object) {
	var vs = video_object.file;
	
	var title = video_object.title;
	
	// get first number from title
	var fn = _m.get_first_number_from_string(title);
	
	var title2 = _m.make_num_l(fn, 4) + '_' + title;
	// make each path
	for (var j = 0; j < vs.length; j++) {
		var f = vs[j];
		var type = f.type;
		
		var path2 = title2 + '_' + _m.make_num_l(j + 1, 4) + '.' + type;
		
		f.path = _m.remove_chars(path2);
	}
	
	// done
}


/* main function */

function main() {
	
	// use main _next for steps
	var _host = {};
	
	_host.error = null;	// error info object
	
	var _next = main_next;
	_next(1, _host);
}

function main_next(_step, _host) {
	var _next = main_next;
	switch (_step) {
	case 1:	// first step
		
		// print out free software info, specially for win version
		time_log('\n' + 
			'    evdh  Copyright (C) 2015  sceext <sceext@foxmail.com> \n' + 
			'    This program comes with ABSOLUTELY NO WARRANTY. \n' + 
			'    This is FREE SOFTWARE, and you are welcome to redistribute it \n' + 
			'    under certain conditions.\n' + 
			' Please see README.md and LICENSE for more information. \n' + 
			'\n' + 
			'    请注意: evdh 是 自由软件, 在 GNU GPLv3+ 许可证之下发布. \n' + 
			'    你可以根据自己的需求修改 evdh. \n' + 
			' 请阅读 README.md 和 LICENSE.txt 获取更多信息. \n' + 
			'\n');
		
		// init
		_m.init(function(err){	// init finish callback
			if (err) {
				time_log('错误: 初始化失败 ! ');
				
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 2:	// after init
		
		// print init done
		time_log('[ OK ] 初始化完成. ');
		
		// start test
		test_host_task(function(err){
			if (err) {
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 3:	// done
		
		// remember to close ui CLI interface
		_ui.close();
		
		_next(0, _host);
		
		break;
	case 0:	// finish step
		
		break;
	case -1:	// error
		
		time_log('错误: 发生了错误 ! ');
		
		// close ui interface
		_ui.close();
		
		// print error info
		if (_host.error !== true) {
			console.log(_host.error);
		}
		
		break;
	default:	// step error
		time_log('ERROR: evdh.js main_next: step error ! ');
	}
}

/* start from main */

	main();

/* end evdh.js */


