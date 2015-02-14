:: README.md for evdh (version 0.1.4.0 test201502142205 (public version)

# evdh : EisF Video Download Helper

author sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
copyright 2015 sceext All rights reserved. 

**evdh is used to download videos much easy with the analyse service provided by [flv.cn](http://flv.cn)**

This is evdh *English* version (public version) branch version

#### uuid mark for evdh

uuid mark for this program evdh is 

	uuid=1df11f80-183f-405f-b93c-4dff2ce08398 (public version) 


## install

### node.js

This program runs in **node.js**

You can install node.js with *pacman* on ArchLinux

	$ sudo pacman -S nodejs

or you can use *apt-get* on Debian/Ubuntu or use *yum* on Fedora/RedHat to install node.js 

or you can install nodejs from its website
<http://nodejs.org/download/>

### node.js npm modules : xmldom

This program needs some modules to run

You can install **xmldom** with *npm*

	$ npm install xmldom

### ffmpeg

This program uses **ffmpeg** to auto merge videos. 

You should install *ffmpeg*, or you can not auto merge video part files in a whole one. 


## configure

The default config file is *etc/evdh.conf.xml*

Please edit it to your own needs. 

### about token

This program use Web API from [flv.cn] <http://flv.cn/> (<http://api.flvxz.com/>) 

You can try to get a token for free at <http://flv.cn/docs.php?doc=api> 

**NOTE**: Please notice that the token is very important for you. 
So do not let others know your token. 
You should save your token like your password. 

The token is stored in a separate file to protect your token. 
You can change the location of the token file in config file. 

Default token file is *etc/private/token* 
You should write your own token in such file before use this program to download videos. 


## run evdh

You should use evdh start shell script to start run evdh. 
You can use this command: 

	$ ./evdh.sh

This will start evdh interactively. 

You can use `$ ./evdh.sh --version` to show version info of evdh. <br />
Or you can use this to get help: 

	$ ./evdh.sh --help
	
	evdh : EisF Video Download Helper 
	Usage: evdh
	       evdh [OPTIONS] ... 
	Options: 
	   none         just use "evdh" without any command line arguments 
		        will start evdh in "normal" mode, which runs interactively 
	   
	   --url <url>  start evdh in "auto_url" mode
		        in this mode, evdh will auto download files, and
		        do not ask user to confirm 
	   --continue   start evdh in "auto_continue" mode
		        in this mode, evdh will auto continue unfinished task, 
		        do not ask user to confirm 
	   --list-file <file>
		        You can let evdh auto download many URLs in this "task_list" 
		        mode. URLs is writen in <file>, one in a line 
	   
	   --help       Show this help information 
	   --version    Show evdh version information 
	NOTE:
	     evdh is used to help download videos on website. 
	  The URL inputed in evdh is the url of the video playing web page. 
	  evdh will auto analyse the url by "api.flvxz.com", and get URLs of video 
	  part files, and auto download them all, and auto merge part videos in 
	  a whole one with "ffmpeg". 
	

...


## This is FREE SOFTWARE

This is FREE SOFTWARE, released under GNU GPLv3+ <br />
please see LICENSE for more information. 

    evdh : EisF Video Download Helper, auto download videos with analyse service provided by flv.cn (api.flvxz.com) 
    Copyright (C) 2015 sceext <sceext@foxmail.com> 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

### other branches

You can get *evdh* from there <https://github.com/sceext2/evdh> 
And get the source code of *evdh* at the same time. 

This is evdh *English* version (public version) branch version <br />
<https://github.com/sceext2/evdh/tree/version>

#### evdh also has these versions

+ **中文版** (public zh-cn version) branch version-zh-cn <br />
  <https://github.com/sceext2/evdh/tree/version-zh-cn>

+ *win* **version** (public win version) branch version-win <br />
  <https://github.com/sceext2/evdh/tree/version-win>

Or you can download evdh releases from <br />
<https://github.com/sceext2/evdh/releases>


## version

**current version** 0.1.5.0 test201502141915 (public version) 

### version 0.1.5.0 test201502141915 (public version)

+ add "task_list" mode. Now evdh can auto download many urls. 
  You can write many urls of video play pages in a file, for example a `url.list` file. 
  Each url in one line. Then you can use `$ ./evdh.sh --list-file url.list` 
  to auto download all urls in the list file. 

+ add command line arguments support. Previously, evdh can only run interactively. 
  But now evdh has command line mode. 
  You can use `$ ./evdh.sh --version` to show version info. 
  Or use `$ ./evdh.sh --help` to show help info. 

+ auto select video by keywords. 
  Previously, evdh can only select video by quality hd number. 
  If there is more than one video, evdh has to ask user to select one. 
  But now evdh can auto select one by keywords given by user in config file. 

+ auto retry after download failed. In "task_list" mode, if download failed, 
  evdh will auto retry to download. Default retry times is 4. 

+ UI improve. Now new evdh ui looks better. 

NOTE: in "task_list" mode, you can not break evdh or continue task after exit. 
This may be improved in further versions. 

### version 0.1.1.0 test201502031447 (public version)

first useable version, released to public under GNU GPLv3+

This version now can work basically. 

You can give evdh a URL of a video playing page, and evdh will do these things. 

evdh now can auto analyse the url, and get info by Web API of api.flvxz.com (provided by flv.cn) 

then evdh will auto download all video part files, with mutile thread and download memory buffer

after all files download done, evdh will auto merge video part files with ffmpeg

So with evdh, it is much easy to download videos with analyse service provided by flv.cn
Which is for what and why evdh is writen. 

#### More information: 

+ evdh get analysed info of video play page url from api.flvxz.com, 
and evdh can analyse recevied xml to get info. 

+ evdh now can download video part files with mutile threads, 
one file a thread, that's to say, evdh can download servel files at the same time. 
default thread is 2, you can change it in config file. 

+ evdh now has default 2MB download memory buffer, which is used to protect your hard disk. 

+ evdh has config file, and sperate token file, which can help to protect your token. 

+ evdh has log files. So you can continue unfinished task after exit evdh. 

+ evdh now can use ffmpeg to auto merge video part files. 

But evdh now still has many problems. 
evdh is not stable. 
evdh still has some unfound bugs. 
evdh now only has basic functions. 


## tested

### test info of evdh English version (public version) branch version

This program is now tested on *ArchLinux* (2015.02)

**NOTE**: evdh is writen to run on **GNU/Linux** OS, with node.js


## About sceext and 2009EisF2015

**sceext** is my pen name. 
*sceext* reads as s-c-e-e-x-t. 

sceext has no meaning, but only I use it on the Internet. 
(There is hardly no conflicts.) 

**EisF** is the mark that I add to my programs. 

EisF means **E**isF **is** Eis**F**. 
EisF is a *forked* **recursive acronym**. 
(Just like GNU = GNU's Not Unix) 
EisF = EisF is EisF ([E]isF [is] Eis[F])

**2009EisF2015** means that 
the mark *EisF* has been used from *year 2009* to now (*year 2015*). 


## keywords

evdh EisF Video Download Helper English version public version branch version 
makes video download more easy with analyse service provided by flv.cn api.flvxz.com 

:: end README.md


