/* log.js, used in node.js, log js part for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
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
var _b = require('./b.js');
var _ui = require('./ui.js');

// global config object
var etc = {};

etc.log_path = '';	// path to put log files

// some mark for log file
etc.evdh_uuid_mark = 'uuid=1df11f80-183f-405f-b93c-4dff2ce08398';
etc.evdh_xml_file_version_mark = 'evdh_filetype_version_0.1.0.0_test201501310011';
etc.evdh_log_file_type = 'log_file';


/* objects */


/* object o_log start ol, global log host object */
	function o_log() {
		// methods
		this.refresh = ol_refresh;	// refresh write log to log file
		this.read = ol_read;	// read log file
		
		this.add_item = ol_add_item;	// add log item
		this.get_list = ol_get_list;	// get log item list
		this.clear_list = ol_clear_list;	// clear log item list
		
		// private methods
		this._init = ol_init;
			
			// used for refresh log file
		this._write_head = ol_write_head;	// write head of log file
		this._write_body = ol_write_body;	// write body of log file
		
		this._do_refresh = ol_do_refresh;	// actually write log file
		
			// used for read log file
		this._loaded = ol_loaded;	// read xml log file done, and analyse it
		
		this._check_head = ol_check_head;	// check readed log file head, if right
		this._get_log_info = ol_get_log_info;	// get info from readed log file
		
		this._write_item = ol_write_item;	// write a log item to log file
		this._read_item = ol_read_item;
		
		// attributes
		this.log_file = etc.log_path + '/evdh_main.log.xml';	// main log file, used for o_log, global log file, very important
		
		// private attributes
		this._callback = null;
		
		this._list = [];	// log item list
		
		this._info = {};	// log info object
		
		this._xml_doc = null;	// used to load log file
		this._xml_head = null;
		this._xml_body = null;
		this._xml_time_base = null;
		
		this._w_doc = null;	// used to write log file
		this._w_head = null;
		this._w_body = null;
		this._w_time_base = null;
		
			// sub objects
		this._o_fr = null;	// file reader
		this._o_xl = null;	// xml loader
		
		// init this
		this._init();
	}
	
	function ol_init() {
		// create sub objects
		this._o_fr = new _b.o_file_reader();
		this._o_xl = new _b.o_xml_loader();
	}
	
	function ol_refresh(callback) {	// finish callback(error);
		this._callback = callback;
		
		// make xml file
		this._write_head();
		this._write_body();
		
		// write file
		this._do_refresh();
	}
	
	function ol_read(callback) {	// finish callback(error);
		this._callback = callback;
		// use file reader to read file
		
		// set fr
		this._o_fr.file = this.log_file;
		
		var b = this;
		this._o_fr.callback = function(err) {
			if (err) {
				b._callback(err);
			} else {
				b._loaded();
			}
		};
		
		// readed it
		this._o_fr.load();
	}
	
	function ol_add_item(item_obj) {
		this._list.push(item_obj);
	}
	
	function ol_get_list() {
		return this._list;
	}
	
	function ol_clear_list() {
		this._list = [];	// reset this list
	}
	
	function ol_write_head() {
		// make init xml doc
		var init_xml_text = '<?xml version="1.0" encoding="utf-8" ?><evdh></evdh>';
		
		// get dom object
		this._w_doc = this._o_xl.to_dom(init_xml_text);
		
		// add head and body
		var doc = this._w_doc;
		var er = doc.documentElement;	// root element
		
		er.appendChild(doc.createElement('head'));
		er.appendChild(doc.createElement('body'));
		
		var head = er.getElementsByTagName('head')[0];
		var body = er.getElementsByTagName('body')[0];
		
		this._w_head = head;
		this._w_body = body;
		
		// write head
		var st = _b.xml_set_text;
		
		// write file mark
		st(doc, head, 'filetype', etc.evdh_uuid_mark);
		st(doc, head, 'filetype_version', etc.evdh_xml_file_version_mark);
		
		st(doc, head, 'type', etc.evdh_log_file_type);
		
		// set time base
		var now = new Date();
		var time_base = now.getTime();
		
		this._w_time_base = time_base;
		
		// write time base to head
		st(doc, head, 'time_base_iso', now.toISOString());
		
		// done
	}
	
	function ol_write_body() {
		var doc = this._w_doc;
		var body = this._w_body;
		
		// add each log item
		for (var i = 0; i < this._list.length; i++) {
			var item = this._list[i];
			
			this._write_item(doc, body, item);
		}
		// done
	}
	
	function ol_do_refresh() {
		// make xml doc to text
		var xml_text = this._o_xl.to_text(this._w_doc);
		
		// write file
		var data = new Buffer(xml_text, 'utf-8');
		
		var b = this;
		_b.write_file(this.log_file, data, function(err){
			if (err) {
				b._callback(err);
			} else {
				b._callback(null);
			}
		});
	}
	
	function ol_loaded() {
		// got xml file
		var xml_text = this._o_fr.data.toString('utf-8');
		
		this._xml_doc = this._o_xl.to_dom(xml_text);
		
		// check head
		var err;
		
		err = this._check_head();
		if (err) {
			this._callback(err);
			
			return;
		}
		
		// get log info
		this._get_log_info();
		
		// done
		this._callback(null);
	}
	
	function ol_check_head() {
		var doc = this._xml_doc;
		
		if (!doc) {
			return true;
		}
		
		// check root element
		var er = doc.documentElement;	// root element
		if (er.nodeName != 'evdh') {
			return new Error('evdh: log.js: xml log file: root element is not \'evdh\'');
		}
		
		// get head and body
		var head = er.getElementsByTagName('head');
		if (head.length != 1) {
			return new Error('evdh: log.js: xml log file: not 1 <head> element');
		}
		head = head[0];
		
		var body = er.getElementsByTagName('body');
		if (body.length != 1) {
			return new Error('evdh: log.js: xml log file: not 1 <body> element');
		}
		body = body[0];
		
		// check head mark for evdh
		var filetype = head.getElementsByTagName('filetype')[0];
		filetype = _b.xml_get_text(filetype);
		if (filetype != etc.evdh_uuid_mark) {
			return new Error('evdh: log.js: xml log file: <filetype> error');
		}
		
		var ftv = head.getElementsByTagName('filetype_version')[0];
		ftv = _b.xml_get_text(ftv);
		if (ftv != etc.evdh_xml_file_version_mark) {
			return new Error('evdh: log.js: xml log file: <filetype_version> error');
		}
		
		// check type, if log_file
		var type = head.getElementsByTagName('type')[0];
		type = _b.xml_get_text(type);
		if (type != etc.evdh_log_file_type) {
			return new Error('evdh: log.js: xml log file: <type> is not \'' + etc.evdh_log_file_type + '\' ! ');
		}
		
		// save head and body to this
		this._xml_head = head;
		this._xml_body = body;
		
		// done
		return null;
	}
	
	function ol_get_log_info() {
		var doc = this._xml_doc;
		var head = this._xml_head;
		var body = this._xml_body;
		
		// get head time base
		var time_base = head.getElementsByTagName('time_base_iso');
		time_base = _b.xml_get_text(time_base);
		
		this._xml_time_base = time_base;
		
		// get log items
		var logs = body.getElementsByTagName('log');
		
		// process each log item
		for (var i = 0; i < logs.length; i++) {
			var log = logs[i];
			
			// process it
			var item = this._read_item(log);
			if (item) {
				// add it to list
				this.add_item(item);
			}
		}
	}
	
	function ol_write_item(doc, e_host, item) {
		var e_log = doc.createElement('log');
		
		var st = _b.xml_set_text;
		
		// write log item type
		st(doc, e_log, 'type', item.type);
		
		// set time tag
		var time_base = this._w_time_base;
		
		var time_tag = ((new Date()).getTime() - time_base) / 1e3;
		
		st(doc, e_log, 'time_tag_s', time_tag);
		
		// write json text
		var json_text = JSON.stringify(item.json);
		
		st(doc, e_log, 'json', json_text);
		
		// append child
		e_host.appendChild(e_log);
		
		// done
	}
	
	function ol_read_item(e_item) {
		var item = {};
		var text;
		
		var gt = _b.xml_get_text;
		
		// get type
		text = gt(e_item.getElementsByTagName('type')[0]);
		if (typeof text != 'string') {	// error
			return null;
		}
		
		item.type = text;
		
		// get time_tag_s
		text = gt(e_item.getElementsByTagName('time_tag_s')[0]);
		if (typeof text != 'string') {	// error
			return null;
		}
		
		item.time_tag_s = parseFloat(text);
		
		// get json object
		text = gt(e_item.getElementsByTagName('json')[0]);
		if (typeof text != 'string') {	// error
			return null;
		}
		
		item.json = JSON.parse(text);
		
		// done
		return item;
	}
/* end o_log object */


/* functions */

	function time_log(output) {
		var sw = _b.sw[0];	// b.js _b global o_stopwatch 0
		var make_rest_num = _ui.make_rest_num;
		
		// make ms
		var ms = sw.get_ms();
		var ms_text = make_rest_num(ms / 1e3, 3, 4);
		
		// make text
		var before = '' + ms_text + ' :: evdh: ';
		
		var text = before + output;
		
		// print it
		console.log(text);
	}
	

/* exports */
exports.etc = etc;

// objects
exports.o_log = o_log;

// functions
exports.time_log = time_log;

/* end log.js */


