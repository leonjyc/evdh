:: install.bat evdh install script for win version, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
:: version 0.0.7.0 test201502071227 (public win version) 
:: author sceext <sceext@foxmail.com> 2015.02
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

title evdh : EisF ��Ƶ�������� ��װ�ű� (EisF Video Download Helper), version 0.1.3.1 (public win version), sceext ^<sceext@foxmail.com^> 

:: start install
echo evdh: ��Ϣ: ��ʼ ��װ ... 

:: install xmldom, node.js module
echo evdh: ��Ϣ: ��װ node.js xmldom ģ�� ... 
md "C:\Users\%username%\AppData\Roaming\npm"
cmd /c "npm install xmldom"

title evdh : EisF ��Ƶ�������� ��װ�ű� (EisF Video Download Helper), version 0.1.3.1 (public win version), sceext ^<sceext@foxmail.com^> 

:: make dir
echo evdh: ��Ϣ: ���� Ŀ¼�ṹ ... 

md tmp
md tmp\dl
md tmp\log
md tmp\private
md tmp\ffmpeg

echo ^<���ڴ˴�д�����Լ��� token^> >> tmp\private\token.txt

:: install finished
echo evdh: [ OK ] ��װ ���. 
echo �� �������Լ������� �༭ �����ļ� "etc\evdh.conf.xml" 
echo �� �� token �ļ� "tmp\private\token.txt" �� д�����Լ��� token ! 
echo �� �� �Զ��ϲ��ֶ���Ƶ ���� �õ��� ffmpeg.exe ���Ƶ� tmp\ffmpeg

pause
:: end evdh.bat

