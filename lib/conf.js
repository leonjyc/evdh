/* conf.js, conf: config file support part for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 * version 0.1.3.0 test201502142024 (public version) 
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
 */

/* require import modules */

// evdh modules
var _b = require('./b.js');
var _log = require('./log.js');
var _dl = require('./dl.js');
var _aurl = require('./aurl.js');
var _task = require('./task.js');

// global config object
var etc = {};

// some mark for evdh files
etc.evdh_uuid_mark = 'uuid=1df11f80-183f-405f-b93c-4dff2ce08398';
etc.evdh_xml_file_version_mark = 'evdh_filetype_version_0.1.0.0_test201501310011';
etc.evdh_config_file_type = 'config_file';

/* objects */


/* object o_config start oc, used for evdh to process config */
	function o_config() {
		// methods
		this.load = oc_load;
		
		// private methods
		this._init = oc_init;
		
		this._load_next = oc_load_next;
		
		this._check_head = oc_check_head;
		
		this._get_config_info = oc_get_config_info;
		
		// attributes
		this.callback = null;	// finish callback(error); 
		
		this.config_file = '';	// load this config file
		
		this.config_info = {};	// object to store config info
		
		// private attributes
		this._xml_text = '';	// loaded config file xml text
		this._doc = null;	// config xml file document
		
		this._o_fr = null;	// file reader
		this._o_xl = null;	// xml loader
		
		// xml elements
		this._e_root = null;	// documentElement, root element
		this._e_head = null;	// head element
		this._e_body = null;	// body element
		
		// init this
		this._init();
	}
	
	function oc_init() {
		// create o_file_reader
		this._o_fr = new _b.o_file_reader();
		
		// create o_xml_loader
		this._o_xl = new _b.o_xml_loader();
	}
	
	function oc_load() {
		// set o_file_reader
		this._o_fr.file = this.config_file;
		
		var b = this;
		this._o_fr.callback = function(error){
			if (error) {
				b.callback(error);
			} else {
				b._load_next();
			}
		};
		
		// load config file
		this._o_fr.load();
	}
	
	function oc_load_next() {
		// get file data
		this._xml_text = this._o_fr.data.toString('utf-8');
		
		// use xml loader to parse xml text
		this._doc = this._o_xl.to_dom(this._xml_text);
		
		var err;
		
		// check head
		err = this._check_head();
		if (err) {
			this.callback(err);
			
			return;
		}
		
		// get config info
		err = this._get_config_info();
		if (err) {
			this.callback(err);
			
			return;
		}
		
		// ok, done, callback
		this.callback(null);
	}
	
	function oc_check_head() {	// use to check config file
		var doc = this._doc;
		
		// get root element
		var e_root = doc.documentElement;
		
		// check root element
		if (e_root.nodeName != 'evdh') {
			return new Error('evdh: o_config: ERROR: config file: root element of config file is not \'<evdh>\' ! ');
		}
		
		// get head element
		var e_head = e_root.getElementsByTagName('head');
		if (e_head.length < 1) {
			return new Error('evdh: o_config: ERROR: config file: no \'<head>\' element in config file ! ');
		} else if (e_head.length > 1) {
			return new Error('evdh: o_config: ERROR: config file: more than 1 \'<head>\' elements in config file ! ');
		} else {
			e_head = e_head[0];
		}
		
		// get body element
		var e_body = e_root.getElementsByTagName('body');
		if (e_body.length < 1) {
			return new Error('evdh: o_config: ERROR: config file: no \'<body>\' element in config file ! ');
		} else if (e_head.length > 1) {
			return new Error('evdh: o_config: ERROR: config file: more than 1 \'<body>\' elements in config file ! ');
		} else {
			e_body = e_body[0];
		}
		
		// check head
		var ok_filetype = etc.evdh_uuid_mark;
		var ok_filetype_version = etc.evdh_xml_file_version_mark;
		var ok_type = etc.evdh_config_file_type;
		
		var filetype = _b.xml_get_text(e_head.getElementsByTagName('filetype')[0]);
		if (typeof filetype != 'string') {
			return new Error('evdh: o_config: ERROR: config file: not set \'<filetype>\' in config file head ! ');
		} else if (filetype != ok_filetype) {
			return new Error('evdh: o_config: ERROR: config file: <filetype> error; it must be \'' + ok_filetype + '\' ! ');
		}
		
		var filetype_version = _b.xml_get_text(e_head.getElementsByTagName('filetype_version')[0]);
		if (typeof filetype_version != 'string') {
			return new Error('evdh: o_config: ERROR: config file: not set \'<filetype_version>\' in config file head ! ');
		} else if (filetype_version != ok_filetype_version) {
			return new Error('evdh: o_config: ERROR: config file: <filetype_version> error; it must be \'' + ok_filetype_version + '\' ! ');
		}
		
		var type = _b.xml_get_text(e_head.getElementsByTagName('type')[0]);
		if (typeof type != 'string') {
			return new Error('evdh: o_config: ERROR: config file: not set \'<type>\' in config file head ! ');
		} else if (type != ok_type) {
			return new Error('evdh: o_config: ERROR: config file: <type> error; it must be \'' + ok_type + '\' ! ');
		}
		
		// save element before return
		this._e_root = e_root;
		this._e_head = e_head;
		this._e_body = e_body;
		
		return null;	// no error
	}
	
	function oc_get_config_info() {
		// get config
		var cf = this._e_body.getElementsByTagName('config');
		if (cf.length < 1) {
			return new Error('evdh: o_config: ERROR: config file: not found \'<config>\' in config file body ! ');
		} else {
			cf = cf[0];
		}
		
		var ci = this.config_info;
		
		// set default values, not set some values, must given by config file
		ci.analyse_request_wait_ms = 1100;
		ci.analyse_request_website = 'api.flvxz.com';
		
		ci.download_thread = 2;
		ci.download_buffer_size = 2048;	// 2048 KB, 2 MB
		
		ci.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0';
		
		// get values
		var key_list = [
			'token_file', 
			'tmp_path', 
			'log_path', 
			'download_path', 
			'analyse_request_wait_ms', 
			'analyse_request_website', 
			'download_thread', 
			'download_thread_max', 
			'download_buffer_size', 
			'video_quality', 
			'user_agent', 
			'old_log_file_max_size', 
			'merge_tool', 
			'auto_quality_keywords', 
		];
		
		for (var i = 0; i < key_list.length; i++) {
			var text = _b.xml_get_text(cf.getElementsByTagName(key_list[i])[0]);
			if (typeof text == 'string') {
				// update value
				ci[key_list[i]] = text;
			}
		}
		
		// process values, parseInt
		key_list = [
			'analyse_request_wait_ms', 
			'download_thread', 
			'download_thread_max', 
			'download_buffer_size', 
			'old_log_file_max_size', 
		];
		
		for (var i = 0; i < key_list.length; i++) {
			ci[key_list[i]] = parseInt(ci[key_list[i]], 10);
		}
		
		// process auto_quality_keywords
		ci.auto_qk = ci.auto_quality_keywords.split(' ');
		
		// done
		return null;	// no error
	}
/* end o_config object */


/* functions */
	function set_config(ci) {
		// set module _log
		_log.etc.log_path = ci.log_path;
		
		// set module _dl
		_dl.etc.memory_buffer_size = ci.download_buffer_size;
		_dl.etc.user_agent = ci.user_agent;
		
		// set module _aurl
		_aurl.etc.log_path = ci.log_path;
		_aurl.etc.analyse_request_website = ci.analyse_request_website;
		_aurl.etc.user_agent = ci.user_agent;
		
		// set task
		_task.etc.dl_thread = ci.download_thread;
		
		// done
	}

/* exports */
exports.etc = etc;

// objects
exports.o_config = o_config;

// functions
exports.set_config = set_config;

/* end conf.js */


