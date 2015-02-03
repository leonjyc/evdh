/* dl.js, used in node.js, dl download part or evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
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
var http = require('http');
var fs = require('fs');

// evdh modules
var _b = require('./b.js');
var _log = require('./log.js');

// global config object
var etc = {};

etc.memory_buffer_size = 2048;	// unit KB
etc.user_agent = '';	// user agent to download

// import time_log for global use
var time_log = function(output){
	_log.time_log(output);
};

/* objects */


/* object o_http_requester start ohr */
	function o_http_requester() {
		// methods
		this.request = ohr_request;
		
		// private methods
		this._on_response = ohr_on_response;
		
		this._on_error = ohr_on_error;
		this._on_data = ohr_on_data;
		this._on_end = ohr_on_end;
		
		// attributes
		this.callback = null;	// finish callback(error);
		
		this.status_code = 0;	// http response status code
		this.header = null;	// http response header object
		this.data = null;	// http response data body, type is Buffer not string
		
		// private attributes
		this._data = [];	// array of data piece Buffer s
		this._response = null;	// node.js http module, response module
	}
	
	function ohr_request(option) {
		var b = this;
		
		// use http module to send a http request
		var request = http.request(option, function(response){
			b._response = response;
			
			b._on_response();
		});
		
		// end the request
		request.end();
	}
	
	function ohr_on_response() {
		var res = this._response;
		// save data
		this.status_code = res.statusCode;
		this.header = res.headers;
		
		var b = this;
		// to receive data
		res.on('data', function(data){
			b._on_data(data);
		});
		
		res.on('end', function(){
			b._on_end();
		});
		
		res.on('error', function(err){
			b._on_error(err);
		});
		
		// reset this data
		this._data = [];
	}
	
	function ohr_on_error(err) {
		this.callback(err);	// error callback
	}
	
	function ohr_on_data(data) {
		// save data
		this._data.push(data);
	}
	
	function ohr_on_end() {
		// concat data
		this.data = Buffer.concat(this._data);
		
		// done, ok
		this.callback(null);	// no error
	}
/* end o_http_requester object */


/* object o_http_file_dl start ohf 
 * download file with single thread and single file, support continue download after break 
 */
	function o_http_file_dl() {
		// methods
		this.start = ohf_start;	// start download file
		this.stop = ohf_stop;	// pause download
		this.continue_ = ohf_continue;	// continue to download;
		
		this.get_status = ohf_get_status;	// get download status
			// status object
			//	ed_byte : downloaded byte
			//	status : download status, [done, doing, error, none]
			// 	error : error info
			//
			// extra attributes
			//	start_time : download start, or continue time, Date() object
			//	end_time : finshed or stop time, Date() object
			//	old_byte : continue, old_byte
		
		// private methods
		this._init = ohf_init;
		
		this._fg_cb = ohf_fg_cb;	// o_http_file_get callback
		this._fr_cb = ohf_fr_cb;	// o_file_writer callback
		
		this._back_error = ohf_back_error;	// error callback
		
		this._continue_next = ohf_continue_next;
		
		// attributes
		this.url = '';	// URL of file to download
		this.file = '';	// path of file to save from http download
		
		this.callback = null;	// event callback(error); finished, error
		
		// private attributes
		this._status = 'none';
		this._ed_byte = 0;
		this._error = null;
		
		this._start_time = null;
		this._end_time = null;
		this._old_byte = 0;
		
		// sub objects
		this._hfg = null;	// object http file get
		this._ofr = null;	// object file writer
		
		// init this
		this._init();
	}
	
	function ohf_init() {
		// create file writer
		this._ofr = new o_file_writer();
		
		// create http file get
		this._hfg = new o_http_file_get();
		
		// set callback
		var b = this;
		
		this._ofr.callback = function(err){
			b._fr_cb(err);
		};
		
		this._hfg.callback = function(err, end, data){
			b._fg_cb(err, end, data);
		};
		
		// reset this status
		this._status = 'none';
	}
	
	function ohf_get_status() {
		var s = {};	// status object
		
		s.ed_byte = this._ed_byte;
		s.status = this._status;
		s.error = this._error;
		
		s.start_time = this._start_time;
		s.end_time = this._end_time;
		s.old_byte = this._old_byte;
		
		return s;
	}
	
	function ohf_start() {
		// start create write file
		this._ofr.write_file(this.file);
		
		// set buffer size
		this._ofr.o_mb.set_buffer_size(etc.memory_buffer_size * 1024);
		
		// start http request
		this._hfg.request(this.url);
		
		// set this status
		this._status = 'doing';
		
		this._start_time = new Date();
		this._end_time = null;
		
		// reset ed byte
		this._ed_byte = 0;
	}
	
	function ohf_stop() {
		// stop http file get
		this._hfg.stop();
		
		// set this flag
		this._status = 'none';
		
		this._start_time = null;
		this._end_time = new Date();
	}
	
	function ohf_continue() {	// NOTE this function has not been finished now
		 var _host = {};
		 
		 var b = this;
		 var _next = function(step, host){
		 	b._continue_next(step, host);
		 };
		 
		 // set this status to doing just now
		 this._status = 'doing';
		 
		 // set start time now
		 this._start_time = new Date();
		 
		 _next(1, _host);
	}
	
	function ohf_continue_next(_step, _host) {
		var b = this;
		var _next = function(step, host){
			b._continue_next(step, host);
		};
		switch (_step) {
		case 1:	// first step
			
			// check file exist
			fs.exists(this.file, function(exist){
				_host.exist = exist;
				
				_next(_step + 1, _host);
			});
			
			break;
		case 2:	// got file exist status
			
			if (_host.exist) {
				// check file size
				_b.get_file_size(this.file, function(err, size){
					if (err) {
						this._error = err;
						
						this._back_error();
					} else {
						_host.file_size = size;
						
						_next(_step + 1, _host);
					}
				});
			} else {	// file not exist, should use start instead
				this.start();
			}
			
			break;
		case 3:	// got file size
			
			// start request
			
			// append file
			this._ofr.append_file(this.file);
			
			// set buffer size
			this._ofr.o_mb.set_buffer_size(etc.memory_buffer_size * 1024);
			
			// set http request
			this._hfg.done_byte = _host.file_size;
			
			// start http request
			this._hfg.request(this.url);
			
			// set this status
			this._status = 'doing';
			
			this._start_time = new Date();
			this._end_time = null;
			
			this._old_byte = _host.file_size;
			
			// set this ed byte
			this._ed_byte = _host.file_size;
			
			break;
		case 0:	// ok finish step
			
			break;
		case -1:	// error step
			
			break;
		default:	// step error
			time_log('ERROR: dl.js ohf_continue_next: step error ! ');
		}
	}
	
	function ohf_fg_cb(err, end, data) {	// http file get callback
		// check err
		if (err) {
			// process with 302 Found
			if (err.status_code == 302) {
				var location = err.location;
				var old_url = this.url;
				
				// re request
				this.url = location;
				
				this._hfg.request(this.url);
				
				// reset this status
				this._status = 'doing';
				this._error = null;
				
				// console log
				time_log('INFO: 302 Found location [[' + location + ']] ');
				
				// done
				return;
			}
			
			// other error
			this._error = err;
			
			this._back_error();
			
			return;
		}
		
		// check end
		if (end) {
			// call file writer end
			this._ofr.end();
		}
		
		// check data
		if (data) {
			// get data size
			var new_data_size = data.length;
			
			// push data
			this._ofr.push(data);
			
			// count data size
			this._ed_byte += new_data_size;
		}
	}
	
	function ohf_fr_cb(err) {	// file writer callback
		if (err) {
			// error callback
			this._error = err;
			
			this._back_error();
		} else {
			// set finish flag
			this._status = 'done';
			
			this._end_time = new Date();
			
			// finish callback
			this.callback(null);
		}
	}
	
	function ohf_back_error() {
		if (!this._error) {
			this._error = true;
		}
		
		// set this status
		this._status = 'error';
		
		this.callback(this._error);
	}
/* end o_http_file_dl object */


/* object o_http_file_get start ohg */
	function o_http_file_get() {
		// methods
		this.request = ohg_request;
		
		this.stop = ohg_stop;	// NOTE stop function does not work very well
		
		// private methods
		this._on_res = ohg_on_res;	// http response
		this._on_data = ohg_on_data;	// http response read stream, on data
		this._on_end = ohg_on_end;
		this._on_error = ohg_on_error;
		
		// attributes
		this.callback = null;	// event finish callback(error, end, data);
		
		this.ok_code = 200;	// http ok code, default 200
		
		this.done_byte = 0;	// used for Range, and 206 ok_code
		
		// private attributes
		this._res = null;	// http response object
		
		this._error = null;	// error info object
	}
	
	function ohg_request(request_url) {
		// get url info
		var info = _b.get_url_info(request_url);
		
		// make request option
		var opt = {};
		
		opt.hostname = info.hostname;
		opt.port = info.port;
		
		opt.path = info.path;
		
		opt.method = 'GET';
		
		// headers
		opt.headers = {};
		
		opt.headers['User-Agent'] = etc.user_agent;
		
		// check done byte
		if (this.done_byte > 0) {
			// use range
			var range = 'bytes=' + this.done_byte + '-';
			
			// set header
			opt.headers['Range'] = range;
			
			// set ok_code
			this.ok_code = 206;
		} else {
			this.ok_code = 200;
		}
		
		// start http request
		var b = this;
		var request = http.request(opt, function(response){
			b._res = response;
			
			b._on_res();
		});
		
		// end and send request
		request.end();
		
		// reset this error
		this._error = null;
	}
	
	function ohg_on_res() {
		var res = this._res;
		
		// check status code
		var code_found = 302;	// process with 302
		var status_code = res.statusCode;
		if (status_code == code_found) {
			// re request
			var err = {};
			
			err.type = '302 Found';
			err.status_code = status_code;
			
			err.location = res.headers['location'];
			
			// on error
			this._error = err;
			this._on_error();
			
			return;
		}
		
		if (status_code != this.ok_code) {	// error
			// make error object
			var err = {};
			
			err.status_code = status_code;
			err.header = res.headers;
			
			err.res = res;
			
			err.type = 'http status code not ' + this.ok_code;
			
			// on error
			this._error = err;
			this._on_error();
			
			return;
		}
		
		// ready to receive data
		
		// set res read stream event listerers
		var b = this;
		res.on('data', function(data){
			b._on_data(data);
		});
		
		res.on('end', function(){
			b._on_end();
		});
		
		res.on('close', function(){
			b._on_end();
		});
		
		res.on('error', function(err){
			b._error = err;
			
			b._on_error();
		});
	}
	
	function ohg_on_data(data) {
		// callback data
		this.callback(null, null, data);
	}
	
	function ohg_on_end() {
		// callback end
		if (this._error) {
			this.callback(this._error, true, null);
		} else {
			this.callback(null, true, null);
		}
	}
	
	function ohg_on_error() {
		
		if (!this._error) {
			this._error = true;
		}
		
		// error callback
		this.callback(this._error, null, null);
	}
	
	function ohg_stop() {
		// try to close read stream
		try {
			fs.close(this._res.fd, function(){});
		} catch (e) {
		}
		
		// NOTE some bug there, reserved
		
		// force end
		this._on_end();
	}
/* end o_http_file_get object */


/* object o_file_writer start ofw, write use o_mbuffer */
	function o_file_writer() {
		// methods
		this.write_file = ofw_write_file;
		this.append_file = ofw_append_file;
		
		this.push = ofw_push;	// push data
		this.end = ofw_end;
		
		// private methods
		this._open_file = ofw_open_file;
		
		this._get_data = ofw_get_data;
		this._got_data = ofw_got_data;
		
		this._on_error = ofw_on_error;
		this._clean_up = ofw_clean_up;
		
		// attributes
		this.callback = null;	// finish callback(error); on end
		
		// sub objects
		this.o_mb = null;	// memory buffer, o_mbuffer
		
		// private attributes
		this._ws = null;	// node.js write stream
		
		this._error = null;	// error info
	}
	
	function ofw_write_file(path) {
		this._open_file(path, 'w');	// w normal flag
	}
	
	function ofw_append_file(path) {
		this._open_file(path, 'a');	// a append flag
	}
	
	function ofw_open_file(path, open_flag) {
		// create memory buffer
		this.o_mb = new o_mbuffer();
		
		// create write stream, use given flag
		this._ws = fs.createWriteStream(path, {
			flags: open_flag, 
		});
		
		// set event listeners
		var b = this;
		var ws = this._ws;
		
		ws.on('drain', function(){
			b._get_data();	// to get data to write
		});
		
		ws.on('error', function(err){
			this._error = err;
			
			b._on_error();
		});
		
		// should first try to get data
		this._get_data();
	}
	
	function ofw_on_error() {
		// clean up
		this._clean_up();
		
		// error callback
		if (!this._error) {
			this._error = true;
		}
		
		this.callback(this._error);
	}
	
	function ofw_clean_up() {
		// end memory buffer
		try {
			this.o_mb.end();
		} catch (e) {
		}
		
		// close write steam
		try {
			fs.close(this._ws.fd);
			
			this._ws = null;
		} catch (e) {
		}
	}
	
	function ofw_push(data) {
		// put data in memory buffer
		this.o_mb.push(data);
	}
	
	function ofw_end() {
		// call end to memory buffer
		this.o_mb.end();
	}
	
	function ofw_get_data() {
		// try to get data from memory buffer
		var b = this;
		this.o_mb.get_data(function(err, end, data){
			b._got_data(err, end, data);
		});
	}
	
	function ofw_got_data(err, end, data) {
		// memory buffer callback
		
		// check error
		if (err) {
			this._error = err;
			
			this._on_error();
			
			return;
		}
		
		// check end
		if (end) {
			// finish callback
			this.callback(null);
		}
		
		// write data
		if (data) {
			this._ws.write(data);
		}
	}
/* end o_file_writer object */


/* object o_mbuffer start omb
 * memory buffer object, NOTE there is not a reset function, one buffer can be only used once
 */
	function o_mbuffer() {
		// methods
		this.set_buffer_size = omb_set_buffer_size;
		this.set_timeout_ms = omb_set_timeout_ms;
		
		this.push = omb_push;	// put new data into buffer
		this.end = omb_end;	// end put data, clear buffer
		
		this.get_data = omb_get_data;	// read data from buffer, async, 
			// only when buffer is full or end, it will callback
		
		// private methods
		this._flush = omb_flush;	// flush buffer, get_data callback and clear buffer
		this._check_flush = omb_check_flush;	// check if need flush
		this._check_flush2 = omb_check_flush2;	// check callback function
		
		this._reset_timer = omb_reset_timer;	// reset flush timer
		this._clear_timer = omb_clear_timer;
		this._on_time = omb_on_time;	// flush timer, on time
		
		// attributes
		
		// private attributes
		this._flush_timeout_ms = 20000;	// flush timeout 20s
		
		this._buffer_size = 4096;	// buffer size in byte
		this._content_size = 0;	// size of data in buffer
		
		this._datas = [];	// buffer Buffer data block list
		
		this._callback = null;	// callback function
		
		this._id_timeout = null;	// timeout id, used to cancel timeout
		this._end = false;	// end flag
		this._timeout = false;	// timeout flag
		this._flag_no_more_timer = false;
		
		// init this
		
		// reset timer
		this._reset_timer();
	}
	
	function omb_set_timeout_ms(time_ms) {
		this._flush_timeout_ms = time_ms;
		
		this._reset_timer();
	}
	
	function omb_set_buffer_size(buffer_size_byte) {
		var bsb = buffer_size_byte;
		
		// check new buffer size
		if (bsb < 4096) {	// min buffer size, 4KB
			this._buffer_size = 4096;
		} else {
			this._buffer_size = bsb;
		}
		
		// check if need flush
		this._check_flush();
		
		return this._buffer_size;
	}
	
	function omb_push(new_data) {
		// add new data to this data list
		this._datas.push(new_data);
		
		// add content size byte
		this._content_size += new_data.length;
		
		// check flush
		this._check_flush();
	}
	
	function omb_end() {
		// set end flag
		this._end = true;
		
		// set no more timer flag
		this._flag_no_more_timer = true;
		// clear timer, timer no longer needed
		this._clear_timer();
		
		// check flush
		this._check_flush();
	}
	
	function omb_get_data(callback) {	// event callback(error, end, data); error end or data
		// set callback
		this._callback = callback;
		
		// check flush
		this._check_flush();
	}
	
	function omb_flush() {
		// check end flag
		if (this._end) {
			// check no data
			if ((this._content_size < 1) || (this._datas.length < 1)) {
				var callback = this._callback;
				
				// callback, end but no data
				callback(null, true, null);
				
				// done
				return;
			}
		}
		
		// make data
		var data = Buffer.concat(this._datas);
		
		// clear this data
		this._datas = [];
		// reset content size
		this._content_size = 0;
		
		// reset timer
		this._reset_timer();
		
		var callback = this._callback;
		// clear callback function
		this._callback = null;
		
		// flush callback
		callback(null, null, data);	// with data, no end
		
		// reset timer again
		this._reset_timer();
		
		// done
	}
	
	function omb_check_flush() {
		// check end flag
		if (this._end) {
			// should flush
			this._check_flush2();
			
			return;
		}
		
		// check timeout flag
		if (this._timeout) {
			// clear timeout flag
			this._timeout = false;
			
			// should flush
			this._check_flush2();
			
			return;
		}
		
		// check full
		if (this._content_size >= this._buffer_size) {
			// should flush
			this._check_flush2();
			
			return;
		}
	}
	
	function omb_check_flush2() {
		var do_flush = false;
		
		// check end flag
		if (this._end) {
			// should flush, no matter if have data
			do_flush = true;
		} else {
			// check if have data
			if (this._content_size < 1) {
				// no data, not flush
				return;
			}
		
			if (this._datas.length < 1) {
				// no data, not flush
				return;
			}
		}
		
		// not callback now, later
		var b = this;
		setTimeout(function(){
			// check callback
			if (typeof b._callback == 'function') {	// should flush
				b._flush();
			}
		}, 0);
	}
	
	function omb_clear_timer() {
		// check if there is a timer
		if (this._id_timeout !== null) {	// cancel it
			clearTimeout(this._id_timeout);
			
			this._id_timeout = null;
		}
	}
	
	function omb_reset_timer() {
		// clear old timer
		this._clear_timer();
		
		if (this._flag_no_more_timer) {
			return;	// do not set timer any more
		}
		
		// set a new timer
		var b = this;
		this._id_timeout = setTimeout(function(){
			b._on_time();
		}, this._flush_timeout_ms);
	}
	
	function omb_on_time() {
		// set timeout flag
		this._timeout = true;
		
		// reset timer
		this._reset_timer();
		
		// flush
		this._check_flush();
	}
/* end o_mbuffer object */


/* object o_host_file_dl start ohd */
	function o_host_file_dl() {
		// methods
		this.add_item = ohd_add_item;	// add download item
		this.rm_item = ohd_rm_item;	// remove download item
		
		this.get_log = ohd_get_log;	// export log object
		this.set_log = ohd_set_log;	// add log items, import log object
		
		this.start_item = ohd_start_item;	// start download item
		this.continue_item = ohd_continue_item;	// continue download item
		
		this.stop_item = ohd_stop_item;	// pause download item
		
		this.get_status = ohd_get_status;	// get download item status
		
		this.get_id_list = ohd_get_id_list;
		
		// private methods
		this._on_event = ohd_on_event;	// sub object event callback 
		
		// attributes
		this.callback = null;	// event callback(id, err); sub object event callback
		
		// private attributes
		this._log = null;	// log info object
		
		this._item_num = 0;	// number of download items
		this._index = {};	// index of id of download item
	}
	
	function ohd_add_item(id, url, file) {	// add item, or reset exist item, marked by id
		var item;
		
		// check if it exist
		if (this._index[id]) {
			item = this._index[id];
		} else {	// create new object
			var item2 = {};
			
			// create download sub object
			item2.od = new o_http_file_dl();
			
			// add it to index
			this._index[id] = item2;
			this._item_num ++;	// add one item
			
			item = this._index[id];
		}
		
		// set item
		item.url = url;
		item.file = file;
		
		// done
		return false;	// error false
	}
	
	function ohd_rm_item(id) {	// NOTE only remove, no other action like auto stop will happen 
		var item;
		// check if it exist
		if (!this._index[id]) {	// not exist
			return true;	// not found item
		}
		
		// remove it
		this._index[id] = null;
		this._item_num --;	// sub item num
		
		// done
		return false;
	}
	
	function ohd_get_log() {	// export part log object, array of items 
		var olog = [];	// log object, array of item
		
		for (var i in this._index) {
			var item2 = this._index[i];
			if (item2 === null) {
				continue;
			}
			
			var item = {};
			
			item.id = i;
			item.url = item2.url;
			item.file = item2.file;
			
			olog.push(item);
		}
		
		// done
		return olog;
	}
	
	function ohd_set_log(log_obj) {	// add log, download items, log_obj is a array of items
		var olog = log_obj;
		
		// add each item
		for (var i = 0; i < olog.length; i++) {
			var item = olog[i];
			
			// add it
			this.add_item(item.id, item.url, item.file);
		}
		
		// done
		return false;
	}
	
	function ohd_start_item(id) {
		// check item exist
		if (!this._index[id]) {
			return true;
		}
		
		// get item
		var item = this._index[id];
		var item_id = id;
		
		// set sub object
		item.od.url = item.url;
		item.od.file = item.file;
		
		var b = this;
		item.od.callback = function(err){
			b._on_event(item_id, err);
		};
		
		// start it
		item.od.start();
		
		// done
		return false;
	}
	
	function ohd_continue_item(id) {
		// check item exist
		if (!this._index[id]) {
			return true;
		}
		
		// get item
		var item = this._index[id];
		var item_id = id;
		
		// set sub object
		item.od.url = item.url;
		item.od.file = item.file;
		
		var b = this;
		item.od.callback = function(err){
			b._on_event(item_id, err);
		};
		
		// continue it
		item.od.continue_();
		
		// done
		return false;
	}
	
	function ohd_stop_item(id) {
		// check item exist
		if (!this._index[id]) {
			return true;
		}
		
		// stop it
		var item = this._index[id];
		
		item.od.stop();
		
		// done
		return false;
	}
	
	function ohd_on_event(id, err) {
		// just callback
		this.callback(id, err);
	}
	
	function ohd_get_status(id) {
		// check item exist
		if (!this._index[id]) {
			return null;
		}
		
		// get its status
		var item = this._index[id];
		
		var status = item.od.get_status();
		
		// done
		return status;
	}
	
	function ohd_get_id_list() {
		var list = [];
		
		for (var i in this._index) {
			if (this._index[i] != null) {
				list.push(i);
			}
		}
		
		// done
		return list;
	}
/* end o_host_file_dl object */

/* exports */
exports.etc = etc;

// objects
exports.o_http_requester = o_http_requester;	// ohr
exports.o_http_file_dl = o_http_file_dl;	// ohf

exports.o_http_file_get = o_http_file_get;	// ohg
exports.o_file_writer = o_file_writer;	// ofw

exports.o_mbuffer = o_mbuffer;	// omb

exports.o_host_file_dl = o_host_file_dl;	// ohd

/* end dl.js */


