/* task.js, used in node.js, task manage part for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
 * version 0.1.1.0 test201502031432 (public version) 
 * author sceext <sceext@foxmail.com> 2015.01 
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

// node.js modules

// evdh modules
var _log = require('./log.js');

// this module global config object
var etc = {};

etc.dl_thread = 2;	// download threads
etc.file_size_error_k = 0.01;

// import time_log for global use
var time_log = function(output){
	_log.time_log(output);
};

/* objects */


/* object o_host_task start oht */
	function o_host_task() {
		// methods
		this.create = oht_create;	// create a new task
		this.remove = oht_remove;	// remove a exist task, this task
		
		this.get_log = oht_get_log;	// export log info object
		this.set_log = oht_set_log;	// import replace now task
		
		this.pause = oht_pause;	// pause now task, pause download
		this.start = oht_start;	// start now task, (start download) or (continue download)
		
		this.set_status = oht_set_status;	// set status of one part file, finish status
		this.get_status = oht_get_status;	// get this task status object
		
		this.stop_update = oht_stop_update;
		
		this.check_refresh_url = oht_check_refresh_url;
		
		// private methods
		this._check_add_item = oht_check_add_item;	// check to add item to dl
		this._add_item = oht_add_item;
		
		this._update_sub_status = oht_update_sub_status;	// get file download status
		this._check_sub_status = oht_check_sub_status;
		
		this._make_info_obj = oht_make_info_obj;	// make a task info object
		this._make_file_obj = oht_make_file_obj;	// make a info object of a file in task
		this._make_event_obj = oht_make_event_obj;	// make a null callback event object
		
		this._check_task_info = oht_check_task_info;	// check task info, make sure no errors, check if it is right
		
		this._select_video = oht_select_video;
		
		this._on_sub_event = oht_on_sub_event;	// sub download file event, callback
		
		this._update = oht_update;
		
		// attributes
		this.callback = null;	// event callback(event); with event object
		
		this.dl = null;	// o_host_file_dl object, used by this object
		
		this.update_timeout_ms = 1000;	// 1s update
		
		// private attributes
		this._info = null;	// task info object
		
		this._timeout_obj = null;
		this._flag_stop = false;
	}
	
	function oht_stop_update() {
		clearTimeout(this._timeout_obj);
		this._timeout_obj = null;
		
		this._flag_stop = true;
	}
	
	function oht_make_info_obj() {	// make a null info obj
		var info = {};	// task info object
		
		// set task info
		info.host_url = '';	// url of the video play page, use this url
					// to analyse and get urls of files to download
		info.base_path = '';	// base path of files to save, really path = base_path + file.path
		
		info.site = '';	// video site, use this to check analyse result
		
		// to select which video to download, hd quality, title
		info.hd = '';	// hd, quality and title : all to decide which video to download
		info.quality = '';	// video quality selected
		info.title = '';	// title of this video
		
		info.count = {};	// statistics count info object
		
		info.count.all_file = 0;	// all files in this task
		info.count.done = 0;	// download finished file
		info.count.doing = 0;	// doing download files number
		info.count.wait = 0;	// files wait to download
		info.count.error = 0;	// files download error
		
		info.count.all_byte = 0;	// all bytes of all files to download
		info.count.ed_byte = 0;	// finished bytes
		
		info.count.all_time_s = 0;	// sum of all video time in seconds
		
		info.list = [];	// list of file info objects
		
		// done
		return info;
	}
	
	function oht_make_file_obj() {	// make a null file info obj
		var info = {};	// file info object
		
		// set file info
		info.url = '';	// url of this file to download
		info.path = '';	// path of this file to save, actually path of file is base_path + path
		
		info.id = '';	// id of this file, used for o_host_file_dl
		
		info.all_byte = 0;	// this file all size
		info.ed_byte = 0;	// finished download size
		
		info.time_s = 0;	// time of this video file to play in seconds
		info.format = '';	// file format, in video type
		
		info.status = '';	// file download status, in [none, wait, doing, done, error]
		
		// done
		return info;
	}
	
	function oht_make_event_obj() {	// make null event object
		var event = {};
		
		// set event info
		event.type = '';	// event type, must
			// these type can be used
			// 'dl_done'	all files download has been finished
			// 'part_done'	one part file download finished
			// 'part_error'	one part file download error
			// 'error'	other error
		
		event.id = '';	// id of part file, optional, for part file event
		
		event.list = [];	// error object list, contain all error info objects
		
		// done
		return event;
	}
	
	function oht_check_task_info() {	// check task info, if it is right, and crooect them
		var info = this._info;
		var err_l = [];	// error level
		var err_c = 0;	// error count
			// error level
			//	0 can ignore
			//	1 can fix
			//	2 stop work, can not fix
		
		// init count
		var count = {};
		
		count.all_file = 0;
		count.done = 0;
		count.doing = 0;
		count.wait = 0;
		count.error = 0;
		
		count.all_byte = 0;
		count.ed_byte = 0;
		
		count.all_time_s = 0;
		
		// check files info
		var list = info.list;
		for (var i = 0; i < list.length; i++) {
			// check each file
			var file = list[i];
			
			if (file.all_byte < 0) {
				err_l[2] = true;
				err_c ++;
				
				file.all_byte = 0;
			}
			
			if (file.ed_byte < 0) {
				err_l[2] = true;
				err_c ++;
				
				file.ed_byte = 0;
			}
			
			if (file.ed_byte > file.all_byte) {
				// level 3 error
				err_l[2] = true;
				err_c ++;
				
				file.ed_byte = file.all_byte;
			}
			
			if (file.time_s < 0) {
				err_l[2] = true;
				err_c ++;
				
				file.time_s = 0;
			}
			
			// check status
			switch (file.status) {
			case 'none':
				err_l[1] = true;
				err_c ++;
				
				// fix it
				file.status = 'wait';
				
				count.wait ++;
				
				break;
			case 'wait':
				count.wait ++;
				
				break;
			case 'doing':
				count.doing ++;
				
				break;
			case 'done':
				count.done ++;
				
				break;
			case 'error':
				count.error ++;
				
				break;
			default:
				// error
				err_l[2] = true;
				err_c ++;
				
				count.error ++;
			}
			
			// count
			count.all_file ++;
			count.all_byte += file.all_byte;
			count.ed_byte += file.ed_byte;
			count.all_time_s += file.time_s;
		}
		
		// check count
		if (count.all_file != (count.done + count.doing + count.wait + count.error)) {
			err_l[2] = true;
			err_c ++;
			
			return [err_l.length, err_c];	// very big error
		}
		
		if (count.all_file != list.length) {
			err_l[2] = true;
			err_c ++;
			
			return [err_l.length, err_c];	// very big error
		}
		
		// check each count item
		var cou = info.count;
		
		if (cou.all_file != count.all_file) {
			err_l[1] = true;
			err_c ++;
			
			cou.all_file = count.all_file;
		}
		
		if (cou.done != count.done) {
			err_l[1] = true;
			err_c ++;
			
			cou.done = count.done;
		}
		
		if (cou.doing != count.doing) {
			err_l[1] = true;
			err_c ++;
			
			cou.doing = count.doing;
		}
		
		if (cou.wait != count.wait) {
			err_l[1] = true;
			err_c ++;
			
			cou.wait = count.wait;
		}
		
		if (cou.error != count.error) {
			err_l[1] = true;
			err_c ++;
			
			cou.error = count.error;
		}
		
		if (cou.all_byte != count.all_byte) {
			err_l[1] = true;
			err_c ++;
			
			cou.all_byte = count.all_byte;
		}
		
		if (cou.ed_byte != count.ed_byte) {
			err_l[1] = true;
			err_c ++;
			
			cou.ed_byte = count.ed_byte;
		}
		
		if (cou.all_time_s != count.all_time_s) {
			err_l[1] = true;
			err_c ++;
			
			cou.all_time_s = count.all_time_s;
		}
		
		// done
		return [err_l.length, err_c];
	}
	
	function oht_create(host_url, hd, quality, title, info) {	// give enough info, info : analyse xml get raw info object 
		// check select video
		var video = this._select_video(info, hd, quality, title);
		if (video.length != 1) {
			// error
			time_log('ERROR: task.js: no such video: ' + video.length + ' video exist ! ');
			return true;	// error true
		} else {
			video = video[0];
		}
		
		// create info object
		var info = this._make_info_obj();
		
		// set info obj
		info.host_url = host_url.toString();
		info.hd = hd.toString();
		info.quality = quality.toString();
		info.title = title.toString();
		
		// other info
		info.site = video.site;
		
		info.base_path = video.base_path;	// video object has been modified for this object
		
		// set file info
		var file_list = video.file;
		
		// add each part file
		for (var i = 0; i < file_list.length; i++) {
			var file = file_list[i];
			
			var fi = this._make_file_obj();	// null file info object
			
			// set fi
			fi.url = file.url;
			fi.path = file.path;	// file object is modifyed for this object too
			
			fi.all_byte = file.size;
			fi.time_s = file.time_s;
			fi.format = file.type;
			
			fi.status = 'wait';	// default status is wait
			
			// set file id
			fi.id = i.toString();	// just set a simple id
			
			// add fi
			info.list.push(fi);
		}
		
		// set info to this
		this._info = info;
		
		// just count it
		this._check_task_info();
		
		// done
		return false;	// error false
	}
	
	function oht_remove() {
		// just remove task info object
		var old_info = this._info;
		
		this._info = null;
		
		return old_info;
	}
	
	function oht_select_video(info, hd, quality, title) {
		// index by hd
		hd0 = hd.toString();
		
		var ihd = {};
		for (var i = 0; i < info.length; i++) {
			var v = info[i];	// video
			var hd1 = v.hd.toString();
			
			if (ihd[hd1]) {
				ihd[hd1].push(v);
			} else {
				ihd[hd1] = [v];
			}
		}
		
		// check if has hd
		if ((!ihd[hd0]) || (ihd[hd0].length < 1)) {
			// error, no such video
			return [];
		}
		
		// check if only one video
		if (ihd[hd0].length == 1) {
			// finished
			
			return [ihd[hd0][0]];
		}
		
		// more video
		var vs = ihd[hd0];
		
		// index by quality
		var q0 = quality.toString();
		
		var iq = {};
		for (var i = 0; i < vs.length; i++) {
			var v = vs[i];
			var q1 = v.quality.toString();
			
			if (iq[q1]) {
				iq[q1].push(v);
			} else {
				iq[q1] = [v];
			}
		}
		
		// check if has quality
		if ((!iq[q0]) || (iq[q0].length < 1)) {
			// no such video
			return [];
		}
		
		// check if only one video
		if (iq[q0].length == 1) {
			// ok finished
			return [iq[q0][0]];
		}
		
		// more video
		vs = iq[q0];
		
		// index by title
		var t0 = title.toString();
		
		var it = {};
		for (var i = 0; i < vs.length; i++) {
			var v = vs[i];
			var t1 = v.title.toString();
			
			if (it[t1]) {
				it[t1].push(v);
			} else {
				it[t1] = [v];
			}
		}
		
		// check if has title
		if ((!it[t0]) || (it[t0].length < 1)) {
			// error
			return [];	// no such video
		}
		
		// just return it
		return it[t0];
	}
	
	function oht_check_refresh_url(info) {
		var info = this._info;
		
		// select video
		var video = this._select_video(info, info.hd, info.quality, info.title);
		if (video.length != 1) {
			time_log('ERROR: task.js oht_check_refresh_url: no such video: ' + video.length + 'video exist ! ');
			return true;	// error true
		} else {
			video = video[0];
		}
		
		// check all info
		if (video.hd != info.hd) {
			return true;
		}
		
		if (video.quality != info.quality) {
			return true;
		}
		
		if (video.title != info.title) {
			return true;
		}
		
		if (video.site != info.site) {
			return true;
		}
		
		// recount this info
		this._check_task_info();
		
		// check file info
		
		// check file number
		var file_list = video.file;
		if (file_list.length != info.list.length) {
			return true;
		}
		
		// check each file
		for (var i = 0; i < info.list.length; i++) {
			var old = info.list[i];
			var nfi = file_list[i];	// new file
			
			// check if match
			if (old.all_byte != nfi.size) {
				return true;
			}
			
			if (old.time_s != nfi.time_s) {
				return true;
			}
			
			if (old.format != nfi.type) {
				return true;
			}
		}
		
		// check done, update each url
		for (var i = 0; i < info.list.length; i++) {
			var old = info.list[i];
			var nfi = file_list[i];
			
			old.url = nfi.url;
		}
		
		// done
		return false;
	}
	
	function oht_update_sub_status() {
		// get sub ids
		var ids = this.dl.get_id_list();
		
		// update each status
		for (var i = 0; i < ids.length; i++) {
			var id = parseInt(ids[i], 10);
			var file = this._info.list[id];
			
			var status = this.dl.get_status(ids[i]);
			
			// check it
			if (!file) {
				continue;
			}
			
			if (!status) {
				continue;
			}
			
			// update it
			file.ed_byte = status.ed_byte;
		}
	}
	
	function oht_check_sub_status() {
		// get sub id list
		var ids = this.dl.get_id_list();
		var flag_changed = false;
		
		// check each part file
		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			var nid = parseInt(id, 10);
			
			var file = this._info.list[nid];
			var status = this.dl.get_status(id);
			
			if (!status) {
				continue;
			}
			
			// check sub status
			switch (status.status) {
			case 'done':
				// check ed_byte
				var d_size = Math.abs(status.ed_byte - file.all_byte);
				var e_size = file.all_byte * etc.file_size_error_k;
				
				if (d_size > e_size) {
					if (status.ed_byte < (file.all_byte - 2 * e_size)) {	// set it to wait, ready to retry
						file.status = 'wait';
						
						file.ed_byte = status.ed_byte;
					} else {
						// error
						file.status = 'error';
					
						time_log('ERROR: file download size error !!!!!!!! \n\n\n');
					}
				} else {
					// set done
					file.status = 'done';
					
					file.ed_byte = file.all_byte;
				}
				
				flag_changed = true;
				
				// remove this task
				this.dl.rm_item(id);
				
				break;
			case 'doing':
				// check ed_byte
				if (status.ed_byte > file.all_byte) {
					// error
					file.status = 'error';
					
					// stop this
					this.dl.stop_item(id);
					
					// remove it
					this.dl.rm_item(id);
					
					flag_changed = true;
				}
				// just update this
				
				file.ed_byte = status.ed_byte;
				
				break;
			case 'error':
				file.status = 'error';
				
				// remove it
				this.dl.rm_item(id);
				
				flag_changed = true;
				
				break;
			case 'none':
				file.status = 'wait';
				
				// remove it
				this.dl.rm_item(id);
				
				flag_changed = true;
				
				break;
			default:
				file.status = 'error';
				
				// remove it
				this.dl.rm_item(id);
				
				flag_changed = true;
			}
		}
		
		// if changed
		if (flag_changed) {
			// update sub status
			this._update_sub_status();
			
			// re count
			this._check_task_info();
		}
		
		// done
	}
	
	function oht_get_status() {
		// check no task
		if (this._info === null) {
			return null;
		}
		
		// update sub status
		this._update_sub_status();
		
		// re count
		this._check_task_info();
		
		// return this info
		return this._info;	// read only object
	}
	
	function oht_set_status(id, status) {
		// check if it exist
		var list = this._info.list;
		
		id = parseInt(id, 10);
		if ((id < 0) || (id >= list.length)) {
			return true;
		}
		
		var file = list[id];
		
		// check status
		switch (status) {	// you can only set status with this is wait and done
		case 'wait':
			file.status = 'wait';
			
			break;
		case 'done':
			file.status = 'done';
			
			file.ed_byte = file.all_byte;
			
			break;
		default:	// error status
			return true;
		}
		
		// count this info again
		this._check_task_info();
		
		// done
		return false;
	}
	
	function oht_get_log() {	// just the same as .get_status
		return this.get_status();
	}
	
	function oht_set_log(olog) {	// olog, log object
		var old_info = this._info;
		
		// just set it
		this._info = olog;
		
		// check if it is right
		var err = this._check_task_info();
		
		// if wrong, switch back
		if (err[0] > 2) {	// high level error
			this._info = old_info;
			
			this._check_task_info();
			
			return true;	// error true
		}
		
		// scan part file item status, change all 'doing' to 'wait'
		var list = this._info.list;
		for (var i = 0; i < list.length; i++) {
			var file = list[i];
			
			if (file.status == 'doing') {
				file.status = 'wait';
			}
		}
		
		// done, ok
		return false;
	}
	
	function oht_pause() {
		// stop each download item
		var ids = this.dl.get_id_list();
		
		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			
			// stop it
			this.dl.stop_item(id);
		}
		
		// check sub status
		this._check_sub_status();
		
		// stop update
		this.stop_update();
	}
	
	function oht_check_add_item() {
		// first re check sub status
		this._check_sub_status();
		
		// check task now, thread
		var ids = this.dl.get_id_list();
		
		var now_thread = ids.length;
		
		var id_text = '';
		for (var i = 0; i < ids.length; i++) {
			id_text += ' ' + ids[i];
		}
		
		// check if to add item
		if (now_thread < etc.dl_thread) {
			// should add item
			var nid = this._add_item();
			
			// and update status
			this._check_sub_status();
			this._update_sub_status();
		}
		
		// done
	}
	
	function oht_add_item() {
		// found first wait task
		var list = this._info.list;
		
		for (var i = 0; i < list.length; i++) {
			var file = list[i];
			
			if (file.status == 'wait') {
				// add this
				var path = this._info.base_path + '/' + file.path;
				this.dl.add_item(file.id, file.url, path);
				
				// check to start item or continue item
				if (file.ed_byte > 0) {
					this.dl.continue_item(file.id);
				} else {
					this.dl.start_item(file.id);
				}
				
				// change this status
				file.status = 'doing';
				
				return file.id;	// add  ok
			}
		}
		
		return null;	// not found a item to add
	}
	
	function oht_update() {
		// every second, update
		this._check_sub_status();
		
		this._update_sub_status();
		
		this._check_add_item();
		
		// check send all finished event
		var info = this._info;
		if (info.count.done == info.count.all_file) {
			// should send dl_done event
			var ev = this._make_event_obj;
			
			ev.type = 'dl_done';
			
			// stop update
			this.stop_update();
			
			var b_callback = this.callback;
			// no send now, later
			setTimeout(function(){
				// send it
				b_callback(ev);
			}, 0);
		}
		
		// re set timeout, next timeout check 
		if (this._flag_stop) {
			return;
		}
		
		if (this._timeout_obj) {
			return;
		}
		
		// set timeout
		var b = this;
		
		this._timeout_obj = setTimeout(function(){
			// null this timeout object
			b._timeout_obj = null;
			
			b._update();
		}, this.update_timeout_ms);
	}
	
	function oht_start() {
		// set sub callback
		var b = this;
		
		this.dl.callback = function(id, err){
			b._on_sub_event(id, err);
		};
		
		this._flag_stop = false;
		
		// start update
		this._update();
	}
	
	function oht_on_sub_event(id, err) {
		// update sub
		this._update();
		
		// make event object
		var ev = this._make_event_obj();
		
		// check event
		if (!err) {
			// part file finished
			ev.type = 'part_done';
			ev.id = id;
		} else {	// error info
			ev.type = 'part_error';
			ev.id = id;
			
			ev.list.push(err);
		}
		
		// event callback
		this.callback(ev);
	}
/* end o_host_task object */


/* functions */

/* exports */

exports.etc = etc;

// objects
exports.o_host_task = o_host_task;

// functions

/* end task.js */


