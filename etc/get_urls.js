/* get_urls.js, get video playing page urls, from web page, should run in browser, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 * version 0.0.6.0 test201502142019 (public version) 
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

/* main function */
var get_urls = function(site){
	/* sub functions */
	
	// show titles
	function show_titles(ts) {
		console.log('get_urls.js: INFO: found ' + ts.length + ' videos. ');
		
		for (var i = 0; i < ts.length; i++) {
			console.log((i + 1) + ' : ' + ts[i]);
		}
	}
	
	// from tv.sohu.com/item/*.html
	function get_from_sohu() {
		// version 0.1.1.0 test201502022105
		var titles = [];
		var ut = '';
		
		var g = document.getElementsByClassName('general')[0];
		var ul = g.getElementsByTagName('ul')[0];
		
		var lis = ul.getElementsByTagName('li');
		
		for (var i = 0; i < lis.length; i++) {
			var li = lis[i];
			
			var d = li.children[0];
			var a = d.getElementsByTagName('a')[0];
			
			titles.push(a.title);
			
			ut += a.href + '\n';
		}
		
		// output urls
		console.log(ut);
		
		// output titles
		show_titles(titles);
	}
	
	// from www.youku.com/show_page/id_*.html
	function get_from_youku() {
		// version 0.1.0.0 test201502022216
		var titles = [];
		var ut = '';
		
		var g = document.getElementById('episode');
		var d = g.getElementsByTagName('div')[0];
		
		var uls = d.getElementsByTagName('ul');
		
		for (var i = 0; i < uls.length; i++) {
			var ul = uls[i];
			var li = ul.getElementsByTagName('li')[0];
			
			var a = li.getElementsByTagName('a')[0];
			
			titles.push(a.title);
			
			ut += a.href + '\n';
		}
		
		// console out urls
		console.log(ut);
		
		// output titles
		show_titles(titles);
	}
	
	/* get site */
	switch (site) {
	case 'sohu':
		get_from_sohu();
		break;
	case 'youku':
		get_from_youku();
		break;
	default:
		console.log('get_urls.js: ERROR: sorry, you may input error; or this script does not support this site now. ');
	}
};

/* end get_urls.js */


