/* ui.js, used in node.js, ui js UI part for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
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
var readline = require('readline');

// evdh modules

// main config object
var etc = {};

etc.main_prompt = ': ';

/* objects */

/* functions */

	function input_line(callback, question) {	// callback(err, data);
		// use global rl readline interface
		rl.setPrompt(etc.main_prompt);
		
		var ques;
		if (question) {
			ques = question;
		} else {
			ques = '';
		}
		
		// use question
		rl.question(ques, function(text){
			callback(null, text);
		});
	}
	
	function ask_line(question, callback) {	// callback(text);
		// use global rl readline interface
		rl.setPrompt(etc.main_prompt);
		
		var ques;
		if (question) {
			ques = question;
		} else {
			ques = '';
		}
		
		// use question
		rl.question(ques, function(text){
			callback(text.toString());
		});
	}
	
	function make_rest_num(num, p_num, int_width) {	// make nubmer to string, make rest number after '.' number to p_num
		var num_s = num.toString();	// number string
		
		var int = '', rest = '';
		
		// find '.' in num_s
		var p_i = num_s.indexOf('.');
		if (p_i == -1) {	// not found '.'
			int = num_s;
		} else {
			int = num_s.slice(0, p_i);
			rest = num_s.slice(p_i + 1, num_s.length);
		}
		
		// make rest to p_num length
		if (rest.length > p_num) {
			rest = rest.slice(0, p_num);
		}
		
		while (rest.length < p_num) {
			rest += '0';
		}
		
		// make int_width, optional
		if (typeof int_width == 'number') {
			while (int.length < int_width) {
				int = ' ' + int;
			}
		}
		
		// done
		return (int + '.' + rest);
	}
	
	function get_show_file_size(size) {
		if (size < 1024) {	// small than 1 KB
			return (size  + ' Byte');
		}
		
		// use bigger unit
		var unit, k;
		
		var list = [	// unit list
			'K', 
			'M', 
			'G', 
			'T', 
		];
		
		var k0 = 1024;
		
		// use unit list
		k = k0;
		
		for (var i = 0; i < list.length; i++) {
			unit = list[i];
			
			if (size < k * k0) {	// use this unit
				break;
			}
			
			k *= k0;
		}
		
		var new_size = size / k;
		
		// make number, to like 2.23
		var num = make_rest_num(new_size, 2);
		
		// make string, looks like '2.05 MB (2650 Byte)'
		var text = num + ' ' + unit + 'B (' + size + ' Byte)';
		
		// done
		return text;
	}
	
	function get_show_dl_speed(bytes_per_s) {
		var speed = bytes_per_s;
		
		if (speed < 1024) {	// slow than 1 KB/s
			return (speed  + ' Byte/s');
		}
		
		// use bigger unit
		var unit, k;
		
		var list = [	// unit list
			'K', 
			'M', 
			'G', 
			'T', 
		];
		
		var k0 = 1024;
		
		// use unit list
		k = k0;
		
		for (var i = 0; i < list.length; i++) {
			unit = list[i];
			
			if (speed < k * k0) {	// use this unit
				break;
			}
			
			k *= k0;
		}
		
		var new_speed = speed / k;
		
		// make number, to like 2.23
		var num = make_rest_num(new_speed, 2);
		
		// make string, looks like '2.05 MB/s (2650 Byte/s)'
		var text = num + ' ' + unit + 'B/s (' + speed + ' Byte/s)';
		
		// done
		return text;
	}
	
	function get_show_time(time_s) {
		var second = 0, minute = 0, hour = 0;
		
		// get hour, second, minute
		if (time_s >= 60) {
			minute = Math.floor(time_s / 60);
			second = time_s - minute * 60;
		} else {
			second = time_s;
		}
		
		if (minute >= 60) {
			hour = Math.floor(minute / 60);
			minute -= hour * 60;
		}
		
		// make string
		var s_s = second.toString();
		
		while (s_s.length < 2) {
			s_s = '0' + s_s;
		}
		
		var m_s = minute.toString();
		
		while (m_s.length < 2) {
			m_s = '0' + m_s;
		}
		
		var text = m_s + ':' + s_s;
		
		// add hour
		if (hour > 0) {
			var h_s = hour.toString();
			
			while (h_s.length < 2) {
				h_s = '0' + h_s;
			}
			
			text = h_s + ':' + text;
		}
		
		// add seconds
		text += ' (' + time_s + ' seconds)';
		
		// done
		return text;
	}
	
	function force_width(text, width, right) {
		var t = text.toString();
		if (right) {
			while (t.length < width) {
				t = ' ' + t;
			}
		} else {
			while (t.length < width) {
				t += ' ';
			}
		}
		
		return t;
	}
	
	function close() {	// close ui interface
		rl.close();
	}
	
	function move_by(dx, dy) {	// move console cursor by given
		readline.moveCursor(process.stdout, dx, dy);
	}
	

/* module init */

// create global readline interface object
var rl = readline.createInterface({
	input: process.stdin, 
	output: process.stdout, 
});

/* exports */

// functions
exports.rl = rl;
exports.close = close;

exports.etc = etc;

exports.input_line = input_line;
exports.ask_line = ask_line;

exports.move_by = move_by;

exports.make_rest_num = make_rest_num;
exports.get_show_file_size = get_show_file_size;
exports.get_show_dl_speed = get_show_dl_speed;
exports.get_show_time = get_show_time;
exports.force_width = force_width;

/* end ui.js */


