:: install.bat evdh install script for win version, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 

:: version 0.0.4.0 test201502042025 (public win version) 

:: author sceext <sceext@foxmail.com> 2015.01

:: copyright 2015 sceext 

::

:: This is FREE SOFTWARE, released under GNU GPLv3+ 

:: please see README.md and LICENSE for more information. 

::

::    evdh : EisF Video Download Helper, auto download videos with analyse service provided by flv.cn (api.flvxz.com) 

::    Copyright (C) 2015 sceext <sceext@foxmail.com> 

::

::    This program is free software: you can redistribute it and/or modify

::    it under the terms of the GNU General Public License as published by

::    the Free Software Foundation, either version 3 of the License, or

::    (at your option) any later version.

::

::    This program is distributed in the hope that it will be useful,

::    but WITHOUT ANY WARRANTY; without even the implied warranty of

::    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the

::    GNU General Public License for more details.

::

::    You should have received a copy of the GNU General Public License

::    along with this program.  If not, see <http://www.gnu.org/licenses/>.

::

::

@echo off

title evdh : EisF Video Download Helper, version 0.1.2.0 (public win version), sceext ^<sceext@foxmail.com^> 

:: start install
echo evdh: INFO: starting install ... 

:: install xmldom, node.js module
echo evdh: INFO: install xmldom ... 
md "C:\Users\%username%\AppData\Roaming\npm"
cmd /c "npm install xmldom"

title evdh : EisF Video Download Helper, version 0.1.2.0 (public win version), sceext ^<sceext@foxmail.com^> 

:: make dir
echo evdh: INFO: creating directories ... 

md tmp
md tmp\dl
md tmp\log
md tmp\private

echo ^<Please write your token here^> >> tmp\private\token.txt

:: install finished
echo evdh: [ OK ] install done. 
echo Please edit config file "etc\evdh.conf.xml" to your own needs. 
echo Please write your own token in token file "tmp\private\token.txt"

pause
:: end evdh.bat

