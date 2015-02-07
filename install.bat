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

title evdh : EisF 视频下载助手 安装脚本 (EisF Video Download Helper), version 0.1.3.1 (public win version), sceext ^<sceext@foxmail.com^> 

:: start install
echo evdh: 信息: 开始 安装 ... 

:: install xmldom, node.js module
echo evdh: 信息: 安装 node.js xmldom 模块 ... 
md "C:\Users\%username%\AppData\Roaming\npm"
cmd /c "npm install xmldom"

title evdh : EisF 视频下载助手 安装脚本 (EisF Video Download Helper), version 0.1.3.1 (public win version), sceext ^<sceext@foxmail.com^> 

:: make dir
echo evdh: 信息: 创建 目录结构 ... 

md tmp
md tmp\dl
md tmp\log
md tmp\private
md tmp\ffmpeg

echo ^<请在此处写入你自己的 token^> >> tmp\private\token.txt

:: install finished
echo evdh: [ OK ] 安装 完成. 
echo 请 根据你自己的需求 编辑 配置文件 "etc\evdh.conf.xml" 
echo 请 在 token 文件 "tmp\private\token.txt" 中 写入你自己的 token ! 
echo 请 将 自动合并分段视频 功能 用到的 ffmpeg.exe 复制到 tmp\ffmpeg

pause
:: end evdh.bat

