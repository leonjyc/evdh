/* main.js, used in node.js, main js part for evdh : EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 * version 0.1.4.0 test201502051645 (public win version) 
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

// require modules needed by other evdh modules
var fs_ 	= require('fs');	// b.js, dl.js, 
var url_ 	= require('url');	// b.js, 
var http_ 	= require('http');	//     , dl.js, 
var readline_ 	= require('readline');	//            , ui.js, 
var path_ 	= require('path');	//                   , main.js

var child_process_ = require('child_process');	// main.js

var xmldom_ = require('xmldom');	// b.js, 

// require all other evdh modules
var b_js 	= require('./b.js');
var conf_js 	= require('./conf.js');
var log_js 	= require('./log.js');
var dl_js 	= require('./dl.js');
var ui_js 	= require('./ui.js');
var aurl_js 	= require('./aurl.js');
var task_js 	= require('./task.js');

// exports required_modules
exports.fs_ 		= fs_;
exports.url_ 		= url_;
exports.http_ 		= http_;
exports.readline_ 	= readline_;
exports.path_ 		= path_;
exports.child_process_ 	= child_process_;

exports.xmldom_ 	= xmldom_;

exports.b_ 	= b_js;
exports.conf_ 	= conf_js;
exports.log_ 	= log_js;
exports.dl_ 	= dl_js;
exports.ui_ 	= ui_js;
exports.aurl_ 	= aurl_js;
exports.task_ 	= task_js;

// modules needed by this module: main.js
var fs = fs_;
var path = path_;
var child_process = child_process_;
var path = path_;

var _b 		= b_js;
var _conf 	= conf_js;
var _log 	= log_js;
var _dl 	= dl_js;
var _ui 	= ui_js;
var _aurl 	= aurl_js;
var _task 	= task_js;

// main js global objects
var etc = {};
var _ = {};

etc.evdh_merge_js = './bin/merge_video.js';

etc.config_file = '';

_.ci = null;	// config info object
_.ol = null;	// global o_log log object
_.dl = null;	// global o_host_file_dl file download host object
_.oh = null;	// global o_host_task task host manage object

// import time_log from log.js _log for global use
function time_log(output) {
	_log.time_log(output);
}

/* functions */


// load config file
function load_config_file(config_file, callback) {	// finish callback(error);
	var _host = {};
	
	_host.config_file = config_file;
	_host.callback = callback;
	
	_host.error = null;
	
	var _next = load_config_next;
	_next(1, _host);
}

function load_config_next(_step, _host) {
	var _next = load_config_next;
	switch (_step) {
	case 1:	// first step
		
		// create o_config
		_host.oc = new _conf.o_config();
		
		// set oc
		_host.oc.config_file = _host.config_file;
		
		_host.oc.callback = function(err){
			if (err) {
				time_log('ERROR: load config file \'' + _host.oc.config_file + '\' failed ! ');
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		};
		
		// load config
		_host.oc.load();
		
		break;
	case 2:	// load config done
		
		// save config info
		_.ci = _host.oc.config_info;
		
		// set config to modules
		_conf.set_config(_.ci);
		
		time_log('INFO: use config file \"' + _host.oc.config_file + '\" ');
		
		// ok callback
		_next(0, _host);
		
		break;
	case 0:	// ok finish step
		
		_host.callback(null);
		
		break;
	case -1:	// error step
		_host.callback(_host.error);
		
		break;
	default:	// step error
		time_log('ERROR: main.js load_config_next: step error ! ');
	}
}


// load token
function load_token(token_file, callback) {	// finish callback(error);
	var _host = {};
	
	_host.token_file = token_file;
	_host.callback = callback;
	
	_host.error = null;	// error info object
	
	var _next = load_token_next;
	_next(1, _host);
}

function load_token_next(_step, _host) {
	var _next = load_token_next;
	switch (_step) {
	case 1:	// first step
		
		// get token file size
		_b.get_file_size(_host.token_file, function(err, size){
			if (err) {
				time_log('ERROR: can not access token file \'' + _host.token_file + '\' ! ');
				_host.error = err;
				
				_next(-1, _host);
			} else {
				// save size
				_host.token_file_size = size;
				
				_next(_step + 1, _host);
			}
		});
		
		break;		
	case 2:	// got token file size
		
		// check token file size
		if (_host.token_file_size > 256) {	// more than 256 Byte, too big
			time_log('ERROR: token file size too big ! (' + _host.token_file_size + ' Byte) ');
			
			_host.error = true;
			
			_next(-1, _host);
			
			return;
		}
		
		// get token from token file
		
		// create file reader
		_host.fr = new _b.o_file_reader();
		
		// set fr
		_host.fr.file = _host.token_file;
		
		_host.fr.callback = function(err){
			if (err) {
				time_log('ERROR: can not read token file \'' + _host.token_file + '\' ! ');
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		};
		
		// read it
		_host.fr.load();
		
		break;
	case 3:	// got token from file
		
		var token = _host.fr.data.toString('utf-8');
		
		// remove space, tab, or \n before or after token string
		token = _b.pure_string(token);
		
		// check token
		if (_b.check_char16(token) || (token.length < 8)) {	// token error
			time_log('ERROR: token error: check token of length ' + token.length + ' from token file \'' + _host.token_file + '\' failed ! Please write a right token in token file. ');
			
			_host.error = true;
			
			_next(-1, _host);
		}
		
		// token ok, use it, set token to _aurl module
		_aurl.etc.token = token;
		
		time_log('[ OK ] load token (' + token.length + ') from \"' + _host.token_file + '\" ');
		
		// ok callback
		_next(0, _host);
		
		break;
	case 0:	// ok finish step
		
		_host.callback(null);	// ok callback
		
		break;
	case -1:	// error step
		
		_host.callback(_host.error);	// error callback
		
		break;
	default:	// step error
		time_log('ERROR: main.js load_token_next: step error ! ');
	}
}


/* init */
function init(callback) {	// init function, finish callback(error);	// for evdh global main init 
	var _host = {};
	
	_host.callback = callback;
	
	_host.error = null;	// host error info
	
	var _next = init_next;
	_next(1, _host);
}

function init_next(_step, _host) {	// init next function
	var _next = init_next;
	
	switch (_step) {
	case 1:	// first step
		
		// load config file
		load_config_file(etc.config_file, function(err){
			if (err) {
				this.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 2:	// load token
		
		load_token(_.ci.token_file, function(err){
			if (err) {
				this.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		});
		
		break;
	case 3:	// create global objects
		
		_.ol = new _log.o_log();		// global log object
		_.dl = new _dl.o_host_file_dl();	// global file download host object
		
		_.oh = new _task.o_host_task();		// global task host manage object
		
		// set oh
		_.oh.dl = _.dl;
		
		// init done
		_next(0, _host);
		
		break;
	case 0:	// finish step, init done
		
		// callback ok
		_host.callback(null);
		
		break;
	case -1:	// init error
		
		// callback error
		_host.callback(_host.error);
		
		break;
	default:
		time_log('ERROR: main.js init_next: step error ! ');
	}
}

// show video info
function show_video_info(info) {
	
	// out put show video info
	var vs = info;	// video array
	
	// make same site and title video into one item
	var sites = {};
	for (var i = 0; i < vs.length; i++) {
		var site = vs[i].site;
		
		if (sites[site]) {
			sites[site].push(vs[i]);
		} else {
			sites[site] = [vs[i]];
		}
	}
	
	// make each site with same title video into one item
	for (var site in sites) {
		var titles = {};
		
		var ns = sites[site];
		for (var i = 0; i < ns.length; i++) {
			var title = ns[i].title;
			
			if (titles[title]) {
				titles[title].push(ns[i]);
			} else {
				titles[title] = [ns[i]];
			}
		}
		
		// replace this site with titles
		sites[site] = titles;
	}
	
	// show each video
	var video_count = 1;
	
	for (var site in sites) {
		console.log('\nsite [' + site + '] ');
		
		var ns = sites[site];
		for (var title in ns) {
			console.log('\n  title [' + title + '] ');
			var nt = ns[title];
			for (var i = 0; i < nt.length; i++) {
				var v = nt[i];	// one video
				
				show_one_video(v, video_count);
				
				video_count ++;
			}
		}
	}
	
	// done
}

function show_one_video(info, video_count) {
	// sum data
	var all_size = 0;
	var all_time_s = 0;
	var types = {};
	
	var f = info.file;
	
	for (var i = 0; i < f.length; i++) {
		var nf = f[i];	// now file
		
		all_size += nf.size;
		all_time_s += nf.time_s;
		
		types[nf.type] = true;
	}
	
	// make type string
	var type_string = '';
	for (var i in types) {
		type_string += (i + ' ');
	}
	
	// remove ' ' after type_string
	if (type_string.charAt(type_string.length - 1) == ' ') {
		type_string = type_string.slice(0, type_string.length - 1);
	}
	
	var fw = _ui.force_width;
	var get_show_file_size = _ui.get_show_file_size;
	var get_show_time = _ui.get_show_time;
	// print video info
	console.log('\n    ' + fw(video_count, 2, true) + ':  hd ' + info.hd + ' quality ' + fw('[' + info.quality + ']', 18) + fw(info.file.length, 3, true) + ' files, size ' + fw(get_show_file_size(all_size), 27, true) + ', time ' + fw(get_show_time(all_time_s), 25, true) + ', type [' + type_string + '] ');
	
	// done
}


// select quality
function select_quality(info, callback) {	// finish callback(error, info);
	var _host = {};
	var _next = select_q_next;
	
	_host.callback = callback;
	_host.info = info;
	
	_host.error = null;	// error info
	_host.ni = null;	// new info, use to callback return info
	
	// use next to start
	_next(1, _host);
}

function select_q_next(_step, _host) {
	var _next = select_q_next;
	
	switch (_step) {
	case 1:	// first step
		
		// get first config to use quality
		_host.fq = _.ci.video_quality;
		
		// make same quality to one group
		var qg = {};
		var best_quality = 0;
		
		for (var i = 0; i < _host.info.length; i++) {
			var video = _host.info[i];
			var quality = video.hd.toString();
			
			// set best quality
			if (quality > best_quality) {
				best_quality = quality;
			}
			
			if (qg[quality]) {
				qg[quality].push(video);
			} else {
				qg[quality] = [video];
			}
		}
		
		// make best quality
		if (_host.fq == 'best') { 
			// auto get best quality
			_host.fq = best_quality.toString();
		}
		
		// make sure it use string
		_host.fq = _host.fq.toString();
		
		// check quality
		_host.now_set = qg[_host.fq];
		
		if (_host.now_set) {
			// check if only one video
			if (_host.now_set.length > 1) {
				_next(_step + 1, _host);
			} else if (_host.now_set.length == 1) {	// only one video
				_host.ni = _host.now_set[0];
				
				_next(0, _host);
			} else {
				time_log('ERROR: main.js select_q_next: unknow error ! ');
			}
		} else {	// no such quality
			_host.ni = null;
			
			_next(0, _host);
		}
		
		break;
	case 2:	// more than one video, ask user to select
		
		time_log('INFO: there are ' + _host.now_set.length + ' videos of quality ' + _.ci.video_quality + ' (' + _host.fq + ') \n');
		
		// print video info
		show_video_info(_host.now_set);
		
		// get select from user
		_ui.ask_line('\n    Please choose one : ', function(text){
			_host.input = text;
			
			_next(_step + 1, _host);
		});
		
		break;
	case 3:	// got user input
		
		var input = _host.input;
		var n_video = parseInt(input, 10) - 1;
		
		if ((n_video >= 0) && (n_video < _host.now_set.length)) {
			_host.ni = _host.now_set[n_video];
			
			time_log('INFO: you choose video ' + n_video + ' : ');
			
			show_video_info([_host.ni]);
			
			_next(0, _host);
		} else {	// error input
			time_log('ERROR: input error, no such video ! ');
			
			_next(_step - 1, _host);
		}
		
		break;
	case 0:	// finish step
		
		// ok callback
		_host.callback(null, _host.ni);
		
		break;
	case -1:	// error step
		
		// error callback
		_host.callback(_host.error, null);
		
		break;
	default:	// step error
		time_log('ERROR: main.js select_q_next: step error ! ');
	}
}


// refresh log
function refresh_log(callback) {	// finish callback(error);
	// get log object from o_host_file_dl
	var item = _.dl.get_log();
	
	// make log object
	var olog = {};
	
	olog.type = 'o_host_file_dl';
	olog.json = item;
	
	// clear log item list
	_.ol.clear_list();
	
	// add item
	_.ol.add_item(olog);
	
	// get log from _.oh
	item = _.oh.get_log();
	
	olog = {};
	
	olog.type = 'o_host_task';
	olog.json = item;
	
	// add item
	_.ol.add_item(olog);
	
	// write it
	_.ol.refresh(function(err){
		callback(err);
	});
	
	// done
}

// merge video
function merge_video(info, callback) {	// finish callback(exit_code);
	
	// get out name and file list
	var tmp_path = _.ci.tmp_path;
	var out_name = make_out_name(info);
	var file_list = make_merge_file_list(info, tmp_path);
	var merge_tool = _.ci.merge_tool;
	
	out_name = path.join(info.base_path, out_name);
	
	var merge_args = [tmp_path, out_name].concat(file_list);
	
	// make log
	var merge_log = path.join(_.ci.log_path, '/merge_video.log');
	
	var ws = fs.createWriteStream(merge_log);
	
	// process for evdh win version, merge_video.js
	merge_args = [etc.evdh_merge_js, merge_tool].concat(merge_args);
	
	// create child process
	var cs = child_process.spawn(process.argv[0], merge_args);
	
	// set output
	cs.stdout.on('data', function(data){
		ws.write(data);
	});
	
	cs.stderr.on('data', function(data){
		ws.write(data);
	});
	
	cs.on('close', function(code){
		// end write stream
		ws.end();
		
		// callback
		callback(code);
	});
}

function make_merge_file_list(info, tmp_path) {
	var name = [];
	var bp = info.base_path;	// base path
	
	// add each file
	for (var i = 0; i < info.list.length; i++) {
		var file = info.list[i];
		
		var p = file.path;	// file path
		
		// add to list
		var to_push = path.relative('.', path.join(bp, p));
		name.push(to_push);
	}
	
	// done
	return name;
}

function make_out_name(info) {
	var title = info.title;
	
	var tn = get_first_number_from_string(title);
	
	var name = make_num_l(tn, 4) + '_' + title + '_.mp4';
	
	name = remove_chars(name);
	
	// done
	return name;
}

function remove_chars(text) {
	var t = '';
	
	for (var i = 0; i < text.length; i++) {
		var c = text.charAt(i);
		
		switch (c) {
		case ' ':	// space
		case '	':	// tab
		case '\'':	// '
		case '\"':	// "
			break;	// ignore these chars
		default:
			t += c;
		}
	}
	
	return t;
}

function make_num_l(num, length) {
	var text = num.toString();
	
	while (text.length < length) {
		text = '0' + text;
	}
	
	return text;
}

function get_first_number_from_string(text) {
	var fi = 0;
	var found = false;
	
	// find first number char
	for (var i = 0; i < text.length; i++) {
		var c = text.charAt(i);
		
		if ((c >= '0') && (c <= '9')) {
			fi = i;
			found = true;
			
			break;
		}
	}
	
	// check found
	if (found) {
		var sub = text.slice(fi, text.length);
		
		return parseInt(sub, 10);
	} else {
		// not found
		return 0;
	}
}


/* exports */

// evdh main global objects
exports.etc = etc;
exports._ = _;

// exports functions
exports.time_log = time_log;

exports.init = init;

exports.show_video_info = show_video_info;
exports.select_quality = select_quality;

exports.merge_video = merge_video;

exports.refresh_log = refresh_log;

exports.remove_chars = remove_chars;
exports.make_num_l = make_num_l;
exports.get_first_number_from_string = get_first_number_from_string;

/* end main.js */


