/* b.js, used in node.js, base js for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
 * version 0.1.1.0 test201502031433 (public version) 
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
var fs = require('fs');
var url = require('url');

// npm nodejs modules
var xmldom = require('xmldom');

// evdh modules

/* base lib */

/* objects */


/* object o_xml_loader start oxl, used to load a xml file and xml dom 
 * use node.js module, jsdom to load xml file
 */
	function o_xml_loader() {
		// methods
		this.to_dom = oxl_to_dom;
		this.to_text = oxl_to_text;
		
		// private methods
		this._init = oxl_init;
		
		// attributes
		
		// private attributes
		this._xmldom = null;	// sub objects
		this._dp = null;	// xml DOMParser
		this._xs = null;	// xml XMLSerializer
		
		// init this
		this._init();
	}
	
	function oxl_init() {
		// init xml _dp _xs object
		this._xmldom = xmldom;
		
		this._dp = new this._xmldom.DOMParser();
		this._xs = new this._xmldom.XMLSerializer();
	}
	
	function oxl_to_dom(xml_text) {
		try {
			return this._dp.parseFromString(xml_text);
		} catch (e) {
			return null;
		}
	}
	
	function oxl_to_text(xml_dom_obj) {
		return this._xs.serializeToString(xml_dom_obj);
	}
/* end o_xml_loader object */


/* object o_file_reader start ofr */
	function o_file_reader() {
		// methods
		this.load = ofr_load;
		
		// private methods
		this._on_error = ofr_on_error;
		this._on_end = ofr_on_end;
		this._on_data = ofr_on_data;
		
		// attributes
		this.file = '';	// file to load
		this.data = null;	// data of the file loaded
		
		this.callback = null;	// finish callback(error);
		
		// private attributes
		this._data = [];	// array of Buffer s
	}
	
	function ofr_load() {
		// create readStream
		var rs = fs.createReadStream(this.file);
		
		var b = this;
		
		rs.on('data', function(data){
			b._on_data(data);
		});
		
		rs.on('end', function(){
			b._on_end();
		});
		
		rs.on('error', function(error){
			b._on_error(error);
		});
		
		// init this._data
		this._data = [];
	}
	
	function ofr_on_error(error) {
		this.callback(error);
	}
	
	function ofr_on_end() {
		this.data = Buffer.concat(this._data);
		
		this.callback(null);
	}
	
	function ofr_on_data(new_data) {
		this._data.push(new_data);
	}
/* end o_file_reader object */


/* object o_stopwatch start osw, sceext <sceext@foxmail.com> 
 * version 0.2.0.0 test201401091145
 * copyright 2014 sceext All rights reserved. 
 */
	function o_stopwatch() {
		// methods
		this.start = osw_start;
		this.pause = osw_pause;
		this.reset = osw_reset;
		
		this.get_ms = osw_get_ms;
		
		// private attributes
		this._b_run = false;	// false, not running; true, running
		this._ed_ms = 0;
		this._old_ms = 0;
	}
	
	function osw_start() {
		var time = new Date();	// create now time object first
		
		if (this._b_run) {
			// already started
			
			return true;	// error, true
		}
		
		// start it
		this._old_ms = time.getTime();
		
		// set ._b_run
		this._b_run = true;
		
		return false;	// error, false
	}
	
	function osw_pause() {
		var time = new Date();	// create now time object first
		
		if (!this._b_run) {
			// already paused
			
			return true;	// error, true
		}
		
		// set _ed_ms
		var now_ms = time.getTime();
		var ed_ms = now_ms - this._old_ms;
		
		this._ed_ms += ed_ms;
		
		// set pause flag
		this._b_run = false;
		
		return false;
	}
	
	function osw_reset() {
		var time = new Date();	// create now time object first
		
		// reset _ed_ms
		this._ed_ms = 0;
		
		if (this._b_run) {
			// running, reset _old_ms
			
			this._old_ms = time.getTime();
		}
		
		// done
		return false;	// error, false
	}
	
	function osw_get_ms() {
		var time = new Date();	// create now time object first
		
		var passed_ms = 0;
		
		passed_ms += this._ed_ms;
		
		if (this._b_run) {
			// add old_ms to now_ms
			var now_ms = time.getTime();
			
			var ed_ms = now_ms - this._old_ms;
			
			passed_ms += ed_ms;
		}
		
		// done
		return passed_ms;
	}
/* end o_stopwatch object */


/* functions */

	function xml_get_text(element) {
		if (typeof element != 'object') {
			return new Error('b_js: xml_get_text: ERROR: element is not a object ! ');
		}
		
		if (element.firstChild) {
			return element.firstChild.nodeValue;
		} else {
			return new Error('b_js: xml_get_text: ERROR: no firstChild of element ! ');
		}
	}
	
	function xml_set_text(doc, host, element, text) {
		var node = doc.createElement(element);
		var text = doc.createTextNode(text);
		
		node.appendChild(text);
		host.appendChild(node);
	}
	
	function get_file_size(path, callback) {	// callback(error, size);
		fs.stat(path, function(err, stats){
			if (err) {
				callback(err, 0);
			} else {
				callback(null, stats.size);
			}
		});
	}
	
	function pure_string(text) {	// remove any space, tab or \n before or after string
		// before string
		while ((text.charAt(0) == ' ') || (text.charAt(0) == '	') || (text.charAt(0) == '\n')) {
			text = text.slice(1, text.length);
		}
		
		// after string
		while ((text.charAt(text.length - 1) == ' ') || (text.charAt(text.length - 1) == '	') || (text.charAt(text.length - 1) == '\n')) {
			text = text.slice(0, text.length - 1);
		}
		
		return text;
	}
	
	function check_char16(text) {	// check if each char in text is between 0 to 9 or a to f or A to F 
		for (var i = 0; i < text.length; i++) {
			var c = text.charAt(i);
			if (!(((c >= '0') && (c <= '9')) || ((c >= 'a') && (c <= 'f')) || ((c >= 'A') && (c <= 'F')))) {
				// error
				return true;
			}
		}
		
		return false;	// no problem
	}
	
	function encode_url(text) {
		// replace '://' to ':##' in url
		var ir = text.indexOf('://');
		if (ir != -1) {
			var new_text = text.slice(0, ir) + ':##' + text.slice(ir + 3, text.length);
			
			text = new_text;
		}
		
		// encode new text with base64
		var base64 = (new Buffer(text, 'utf-8')).toString('base64');
		
		// done
		return base64;
	}
	
	function make_request_url(token, video_url) {	// this function will encode base64 for you
		var base64_url = encode_url(video_url);
		
		var url = '/token/' + token + '/url/' + base64_url;
		
		// done
		return url;
	}
	
	function make_request_option(hostname, url, user_agent) {
		var opt = {};	// option object
		
		// set opt
		opt.hostname = hostname;
		opt.port = 80;	// default port 80
		
		opt.path = url;
		opt.method = 'GET';	// default request method GET
		
		// set headers
		opt.headers = {};
		
		opt.headers['User-Agent'] = user_agent;
		
		// done
		return opt;
	}
	
	function write_file(path, data_buffer, callback) {	// finish callback(error);
		fs.writeFile(path, data_buffer, function(err){
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
	}
	
	function get_url_info(full_url) {
		// parse url with url module
		var info = url.parse(full_url);
		
		var ret = {};	// return info object
		
		ret.hostname = info.hostname;
		ret.port = info.port;
		ret.path = info.path;
		
		// check port
		if (ret.port === null) {
			// use default http port 80
			ret.port = '80';
		}
		
		// done
		return ret;
	}
	

/* exports */

// exports objects	// object create new methods

exports.o_xml_loader = o_xml_loader;
exports.o_file_reader = o_file_reader;

exports.o_stopwatch = o_stopwatch;

/* exports functions */
exports.xml_get_text = xml_get_text;	// dom functions
exports.xml_set_text = xml_set_text;

exports.pure_string = pure_string;	// text process functions
exports.check_char16 = check_char16;

exports.encode_url = encode_url;

exports.make_request_url = make_request_url;
exports.make_request_option = make_request_option;

exports.get_url_info = get_url_info;

exports.get_file_size = get_file_size;	// file functions
exports.write_file = write_file;

// init global time ms stop watch for program
	var sw = [];
	sw[0] = new o_stopwatch();
	
	sw[0].pause();
	sw[0].reset();
	sw[0].start();

// export sw object for global use
exports.sw = sw;

/* end b.js */


