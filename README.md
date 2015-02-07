:: README.md for evdh (version 0.1.4.0 test201502071105 (public zh-cn version) 

author sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
copyright 2015 sceext All rights reserved. 

# evdh : EisF 视频下载助手 
(evdh : EisF Video Download Helper) 

作者 sceext, 2015年02月 

evdh 被用来 方便 视频下载, 使用 flv.cn 的 URL解析服务. 

这是 evdh 的 *中文*版. (public zh-cn version) 

## evdh 的 uuid 标记

这个 evdh 程序的 uuid 标记是 
uuid mark for this program evdh is 

	uuid=1df11f80-183f-405f-b93c-4dff2ce08398 (public zh-cn version) 


# 安装

## node.js

这个程序在 **node.js** 环境中运行. 

你可以在 ArchLinux 上使用 *pacman* 安装 node.js 

	$ sudo pacman -S nodejs

或者 你可以在 Debian/Ubuntu 上使用 *apt-get* 或 在 Fedora/Redhat 上使用 *yum* 安装 node.js 

或者 你可以从 node.js 的官方网站上安装 node.js 
	<http://nodejs.org/download/>

## node.js npm 模块 : xmldom

这个程序的运行需要一些 node.js 的第三方模块. 

你可以使用 *npm* 安装 **xmldom** 

	$ npm install xmldom

## ffmpeg

这个程序使用 **ffmpeg** 来自动合并分段视频. 

你应该安装 *ffmpeg*, 否则 你将不能使用 evdh 的 自动合并分段视频 功能. 


# 配置

默认 配置文件 是 *etc/evdh.conf.xml* 

请根据你自己的需求修改配置文件. 

## 关于 token

这个程序使用 flv.cn 提供的 Web API, 更多信息请见 
[flv.cn] <http://flv.cn/> (<http://api.flvxz.com/>) 

你可以尝试从这个网址免费得到一个 token 

    <http://flv.cn/docs.php?doc=api> 

**注意**: 请注意 token 对你非常重要. 所以你不应该告诉别人你的 token. 
你应该像保存你的 密码 一样保存你的 token. 

token 被保存在一个单独的文件中, 而不是直接写入配置文件. 
这样做是为了帮助保护你的 token. 
你可以在配置文件中修改存储 token 的文件位置. 

默认的 token 文件位置是 *tmp/private/token* 
在使用这个程序下载视频之前, 你应该在 token 文件中写入你自己的 token. 


# 运行 evdh 

你应该使用 evdh 启动 shell 脚本 来启动并运行 evdh. 你可以使用这个命令: 

	$ ./evdh.sh

evdh 目前是交互式运行的. 在运行 evdh 时你需要回答一些问题. 


# This is FREE SOFTWARE; 这是 自由软件 

这是 自由软件, 在 GNU GPLv3+ 许可证之下发布. 
请 阅读 LICENSE 文件获取更多信息. 

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

## 其它分支

你可以 从 以下地址 获取 evdh : 
<https://github.com/sceext2/evdh> 
同时 获取 evdh 的 源代码. 

这是 evdh 的 *中文*版. (public zh-cn version) branch version-zh-cn 

<https://github.com/sceext2/evdh/tree/version-zh-cn>

### evdh 还有这些 版本

**English version** (public version) branch version 

<https://github.com/sceext2/evdh/tree/version>

*windows* **版** (public win version) branch version-win 

<https://github.com/sceext2/evdh/tree/version-win>

你也可以从以下地址 下载 evdh : 
<https://github.com/sceext2/evdh/releases>


# 版本

**当前版本** evdh version 0.1.2.0 test201502031707 (public zh-cn version) (中文版) 

## version 0.1.2.0 test201502031707 (public zh-cn version) (中文版)

对 evdh 进行汉化翻译. 

当初 写 evdh 时使用 英文 是因为感觉 汉字 输入不太方便. ;-) 

## version 0.1.1.0 test201502031447 (public version) 

首个 能够使用 的版本, 在 GNU GPLv3+ 许可证之下发布. 

这个版本现在基本能够工作, 并且能够做一些基本的工作. 


总的来说, 现在你可以向 evdh 输入一个 视频播放页面 的URL, 然后 evdh 就会做这些事情: 

evdh 现在可以自动解析URL, 使用 flv.cn 提供的 Web API 获取信息 (api.flvxz.com) 

然后 evdh 会自动下载所有的分段视频文件, 使用多线程下载, 以及使用下载内存缓冲区. 

全部分段视频文件下载完成之后, evdh 会自动合并分段视频, 使用 ffmpeg. 
最后你将得到一个完整的视频文件. 

所以 使用 evdh, 下载视频文件就会方便的多. 
(使用 flv.cn 提供的解析服务) 

这就是 evdh 为什么所写. 

### 更多信息: 

+ evdh 从 api.flvxz.com 获取解析 视频播放页面URL 的信息. 
并且 evdh 能够解析接收的 xml 获取所需信息. 

+ evdh 现在可以多线程下载分段视频文件. 每个文件一个线程. 
也就是说, 每个文件是单线程下载, 但是可以同时下载多个文件. 
默认线程数是 2, 你可以在配置文件中修改它. 

+ evdh 现在有默认 2MB 的下载内存缓冲区, 这是用来保护硬盘的, 避免频繁写入硬盘. 

+ evdh 有配置文件, 并且 token 存储在与配置文件分离的单独的文件中. 
这是帮助保护自己的私有 token 的. 

+ evdh 有日志文件, 并且支持断点续传. 所以你可以在退出 evdh 后继续未完成的下载任务. 
(下次启动 evdh 可以选择继续任务) 
**注意**: evdh 目前没有实现 重新解析, 所以开始任务后, 请尽快下载完成. 
因为视频网站的下载地址可能几个小时后就失效了. 
如果下载地址失效, evdh 将不能够继续任务, 只能从头重新开始下载. 

+ evdh 现在使用 ffmpeg 自动合并分段视频. 

但是 evdh 目前仍然有许多问题. 
evdh 工作不太稳定, 有时候会突然出错退出. 有时候需要手动修复错误. 
(有的时候需要手动 修复/修改 evdh 的日志文件, 才能避免重新从头开始) 
evdh 仍然存在未被发现的 BUG. 
evdh 目前只有基本的功能, 很多地方做的很粗糙. 


# 测试信息

这个程序现在 在 ArchLinux 上测试. (2015.02) 

**注意**: evdh 是写来 在 GNU/Linux 操作系统 上运行的, 使用 node.js 运行环境. 


# 关于 sceext 和 2009EisF2015

**sceext** 是我的 笔名. sceext 的 读法 是 s-c-e-e-x-t, 也就是说 sceext 没有 拼起来的读法. 

sceext 没有特别的含义, 但是 *sceext* 可以唯一表示我. (几乎没有冲突) 

**EisF** 是给我的程序加上的 专用标识. 

EisF 的意思是 **E**isF **is** Eis**F**. 
EisF 是 *分叉式* **递归**缩写. 
(就像 GNU = GNU's Not Unix 一样) 
EisF = EisF is EisF ([E]isF [is] Eis[F]) 

**2009EisF2015** 表示 *EisF* 这个标识 从 *2009*年 开始使用, 直到现在 (*2015*年). 


# 关键字 keywords

evdh EisF Video Download Helper EisF 视频下载助手 中文版 方便下载视频 flv.cn 解析服务 api.flvxz.com API 

:: end README.md


