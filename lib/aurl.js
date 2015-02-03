/* aurl.js, used in node.js, aurl analyse url part for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
 * version 0.1.2.0 test201502031631 (public zh-cn version) 
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

// nodejs modules

// evdh modules
var _b = require('./b.js');
var _log = require('./log.js');
var _dl = require('./dl.js');

// this module global config object
var etc = {};

etc.log_path = '.';

etc.result_file = 'result.xml';
etc.header_file = 'header.log';

etc.token = '';	// token used to analyse url
etc.analyse_request_website = '';
etc.user_agent = '';

// import time_log for global use
var time_log = function(output){
	_log.time_log(output);
};

/* objects */


/* object o_analyse_xml_raw start, axr, get raw info from response xml of video analyse request */
	function o_analyse_xml_raw() {
		// methods
		this.load = axr_load;
		
		// private methods
		this._init = axr_init;
		this._loaded = axr_loaded;
		
		this._info_video = axr_info_video;
		this._info_file = axr_info_file;
		
		this._get_text = axr_get_text;
		
		// attributes
		this.callback = null;	// finish callback(error);
		
		this.info = {};	// response analyse video info object
		
		// private attributes
		this._o_xf = null;	// sub object, xml parser
		
		this._doc = null;	// xml dom document object
		
		// init this
		this._init();
	}
	
	function axr_init() {
		// create sub object
		this._o_xf = new _b.o_xml_loader();
	}
	
	function axr_load(xml_text) {
		// use o_xml_loader to parse xml text
		this._doc = this._o_xf.to_dom(xml_text);
		
		// do not call loaded now
		var b = this;
		setTimeout(function(){
			// loaded
			b._loaded();
		}, 0);
	}
	
	function axr_loaded() {
		var doc = this._doc;
		
		// get root element
		var e_root = doc.documentElement;
		
		// get videos
		var videos = e_root.getElementsByTagName('video');
		
		this.info.video = [];
		
		// get each video info
		for (var i = 0; i < videos.length; i++) {
			var video_info = this._info_video(videos[i]);
			
			this.info.video.push(video_info);
		}
		
		// done, callback
		this.callback(null);
	}
	
	function axr_info_video(node) {
		var info = {};	// video info object
		
		// get keys
		var key_list = [
			'title', 
			'site', 
			'quality', 
			'hd', 
		];
		
		for (var i = 0; i < key_list.length; i++) {
			var key = key_list[i];
			var text = this._get_text(node.getElementsByTagName(key)[0]);
			
			// set key
			info[key] = text;
		}
		
		// process key
		if (typeof info.hd == 'string') {
			info.hd = parseInt(info.hd, 10);
		}
		
		info.file = [];
		
		// get files info
		var files = node.getElementsByTagName('files')[0];
		if (typeof files == 'object') {
			files = files.getElementsByTagName('file');
			
			// get each file info
			for (var i = 0; i < files.length; i++) {
				var file_info = this._info_file(files[i]);
				
				// add file_info
				info.file.push(file_info);
			}
		}
		
		// done
		return info;
	}
	
	function axr_info_file(node) {
		var info = {};
		
		// get keys
		var key_list = {
			'url' : 'furl', 
			'type' : 'ftype', 
			'size' : 'size', 
			'time_s' : 'seconds', 
		};
		
		for (var i in key_list) {
			var key = key_list[i];
			var text = this._get_text(node.getElementsByTagName(key)[0]);
			
			// set key
			info[i] = text;
		}
		
		// process key
		key_list = [
			'size', 
			'time_s', 
		];
		
		for (var i = 0; i < key_list.length; i++) {
			var key = key_list[i];
			if (typeof info[key] == 'string') {
				info[key] = parseInt(info[key], 10);
			}
		}
		
		// done
		return info;
	}
	
	function axr_get_text(node) {
		if (typeof node != 'object') {
			return null;
		}
		
		if (typeof node.firstChild == 'object') {
			text = node.firstChild.nodeValue;
			
			text = text.toString();
			
			// remove '<![CDATA[' or 'CDATA[' before string
			var rm_b = [	// remove before
				'<![CDATA[', 
				'[CDATA[', 
			];
			
			var rm_ed = -1;
			
			for (var i = 0; i < rm_b.length; i++) {
				var rm = rm_b[i];
				
				if (text.indexOf(rm) == 0) {
					text = text.slice(rm.length, text.length);
					
					rm_ed = i;
					
					break;
				}
			}
			
			// remove ']]>'  or ']' after string
			if (rm_ed != -1) {
				var rm_a = [
					']]>', 
					']]', 
				];
				
				if (text.slice(text.length - rm_a[rm_ed].length, text.length) == rm_a[rm_ed]) {	// remove it
					text = text.slice(0, text.length - rm_a[rm_ed].length);
				}
			}
			
			return text;
		} else {
			return null;
		}
	}
/* end o_analyse_xml_raw object */


/* functions */


// analyse url

function aurl(url, callback) {	// finish callback(error, info);
	var _host = {};
	
	// static config
	_host.result_file = etc.log_path + '/' + etc.result_file;
	_host.header_file = etc.log_path + '/' + etc.header_file;
	
	_host.callback = callback;
	_host.url = url;
	
	_host.info = null;	// info object to callback return
	_host.error = null;	// error callback info
	
	// start
	var _next = aurl_next;
	_next(1, _host);
}

function aurl_next(_step, _host) {
	var _next = aurl_next;
	switch (_step) {
	case 1:	// first step
		
		// make url in base64, for debug
		// _host.base64 = _b.encode_url(_host.url);
		
		// create request object
		_host.hr = new _dl.o_http_requester();
		
		// set callback
		_host.hr.callback = function(err){
			if (err) {
				time_log('错误: HTTP 请求失败 ! ');
				
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		};
		
		time_log('信息: 使用 token, 长度为 ' + etc.token.length);
		
		// make url
		var request_url = _b.make_request_url(etc.token, _host.url);
		
		var request_option = _b.make_request_option(etc.analyse_request_website, request_url, etc.user_agent);
		
		// do request
		_host.hr.request(request_option);
		
		// print info
		time_log('信息: 正在 从 \"' + etc.analyse_request_website + '\" 获取信息 ... ');
		
		break;
	case 2:	// got result
		
		// write log file
		var header = JSON.stringify(_host.hr.header);
		
		var log_text = 'http ' + _host.hr.status_code + ' ; response headers: ' + header;
		
		_b.write_file(_host.header_file, new Buffer(log_text, 'utf-8'), function(err){
			if (err) {
				time_log('ERROR: can not wirte http header log file \"' + _host.header_file + '\" ! ');
			}
		});
		
		// save data to result file
		_b.write_file(_host.result_file, _host.hr.data, function(err){
			if (err) {
				time_log('ERROR: can not write result file \"' + _host.result_file + '\" ! ');
			}
		});
		
		// analyse xml_text
		var xml_text = _host.hr.data.toString('utf-8');
		
		// create analyse object
		_host.ao = new o_analyse_xml_raw();
		
		// set ao
		_host.ao.callback = function(err){
			if (err) {
				time_log('错误: 解析 接收到的 xml 文本失败 ! ');
				
				_host.error = err;
				
				_next(-1, _host);
			} else {
				_next(_step + 1, _host);
			}
		};
		
		// do analyse
		_host.ao.load(xml_text);
		
		time_log('信息: 正在解析 接收到的 xml 文本 ... ');
		
		break;
	case 3:	// finish analyse
		
		_host.info = _host.ao.info;
		
		_next(0, _host);
		
		break;
	case 0:	// finish step
		
		// ok callback
		_host.callback(null, _host.info);
		
		break;
	case -1:	// error step
		
		// error callback
		_host.callback(_host.error, null);
		
		break;
	default:	// step error
		time_log('ERROR: main.js aurl_next: step error ! ');
	}
}


/* exports */
exports.etc = etc;

// objects
exports.o_analyse_xml_raw = o_analyse_xml_raw;

// functions
exports.aurl = aurl;

/* end aurl.js */


