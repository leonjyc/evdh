/* merge_video.js, used in node.js, merge vidoe part file only for evdh win version, evdh : EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 * version 0.0.1.0 test201502051544 (public win version) 
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

// node.js modules
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');

// main config object
var etc = {};

etc.tmp_path = '';

etc.list_file = 'merge_video.list';
etc.merge_tool = 'ffmpeg.exe';

etc.output_file = '';
etc.files_to_merge = [];

/* functions */

function get_args() {
	var args = process.argv;
	
	etc.merge_tool = args[2];
	etc.tmp_path = args[3];
	etc.output_file = args[4];
	
	for (var i = 5; i < args.length; i++) {
		etc.files_to_merge.push(args[i]);
	}
}

function make_config() {
	etc.list_file = path.join(etc.tmp_path, etc.list_file);
}

function make_list_file(callback) {
	// create list file
	var ws = fs.createWriteStream(etc.list_file);
	
	// write file list in list file
	for (var i = 0; i < etc.files_to_merge.length; i++) {
		var file = etc.files_to_merge[i];
		
		var text = 'file \'' + file + '\'\n';
		
		ws.write(new Buffer(text, 'utf-8'));
	}
	
	// done
	ws.on('drain', function(){
		ws.end();	// end write file
		
		callback();
	});
}

function do_merge() {
	var args = ['-f', 'concat', '-i', etc.list_file, '-c', 'copy', etc.output_file];
	
	// create child process
	var cs = child_process.spawn(etc.merge_tool, args);
	
	// set output
	cs.stdout.on('data', function(data){
		process.stdout.write(data);
	});
	
	cs.stderr.on('data', function(data){
		process.stderr.write(data);
	});
	
	cs.on('close', function(code){
		process.exit(code);
	});
}

function merge_video() {
	get_args();
	make_config();
	
	make_list_file(function(){
		do_merge();
	});
}

/* exports */
exports.etc = etc;

exports.merge_video = merge_video;

/* start merge video */
	merge_video();

/* end merge_video.js */


