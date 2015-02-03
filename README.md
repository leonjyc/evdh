# README.md for evdh : EisF Video Download Helper 

	version 0.1.2.0 test201502031751 (public version) 

author sceext <sceext@foxmail.com> 2009EisF2015, 2015.01
copyright 2015 sceext All rights reserved. 

evdh is used to download videos with the analyse service provided by flv.cn, more easily 

## uuid mark for evdh

uuid mark for this program evdh is 

	uuid=1df11f80-183f-405f-b93c-4dff2ce08398 (public version) 


# install

## node.js

This program runs in **node.js**

You can install node.js with *pacman* on ArchLinux

	$ sudo pacman -S nodejs

or you can use *apt-get* on Debian/Ubuntu or use *yum* on Fedora/RedHat to install node.js 

or you can install nodejs from its website
	<http://nodejs.org/download/>

## node.js npm modules : xmldom

This program needs some modules to run

You can install **xmldom** with *npm*

	$ npm install xmldom

## ffmpeg

This program uses **ffmpeg** to auto merge videos. 

You should install *ffmpeg*, or you can not auto merge video part files in a whole one. 


# configure

The default config file is *etc/evdh.conf.xml*

Please edit it to your own needs. 

## about token

This program use Web API from [flv.cn] <http://flv.cn/> (<http://api.flvxz.com/>) 

You can try to get a token for free at <http://flv.cn/docs.php?doc=api> 

NOTE: Please notice that the token is very important for you. So do not let others know your token. 
You should save your token like your password. 

The token is stored in a separate file to protect your token. 
You can change the location of the token file in config file. 

Default token file is *etc/private.token* 
You should write your own token in such file before use this program to download videos. 


# run evdh program

You should use evdh start shell script to start run evdh. You can use this command: 

	$ ./evdh.sh

evdh now runs interactively, you should answer some questions when run evdh. 


# This is FREE SOFTWARE

This is FREE SOFTWARE, released under GNU GPLv3+ 
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


# version

current version 0.1.1.0 test201502031447 (public version) 

## version 0.1.1.0 test201502031447 (public version) 

first useable version, released to public under GNU GPLv3+

This version now can work basically. 

You can give evdh a URL of a video playing page, and evdh will do these things. 

evdh now can auto analyse the url, and get info by Web API of api.flvxz.com (provided by flv.cn) 

then evdh will auto download all video part files, with mutile thread and download memory buffer

after all files download done, evdh will auto merge video part files with ffmpeg

So with evdh, it is much easy to download videos with analyse service provided by flv.cn
Which is for what and why evdh is writen. 

### More information: 

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


# tested

This program is now tested on ArchLinux (2015.01)

NOTE: evdh is writen to run on GNU/Linux OS, with node.js

# end README.md


