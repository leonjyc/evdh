:: README.md for evdh (version 0.1.11.0 test201502071224 (public win version) 

author sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
copyright 2015 sceext All rights reserved. 

# evdh : EisF 视频下载助手 
(evdh : EisF Video Download Helper) 

作者 sceext, 2015年02月 

**evdh 被用来 方便 视频下载, 使用 flv.cn 的 URL解析服务.** 

这是 evdh 的 *windows* 版. (public win version) 

## evdh 的 uuid 标记

这个 evdh 程序的 uuid 标记是 
uuid mark for this program evdh is 

	uuid=1df11f80-183f-405f-b93c-4dff2ce08398 (public win version) 


# 安装

## node.js

这个程序在 **node.js** 环境中运行. 

请从 node.js 的官方网站上下载并安装 *node.js* 
	<http://nodejs.org/download/>

## install.bat

evdh 的 *win* 版提供了安装脚本 *install.bat*, 双击运行它即可. 
*install.bat* 会自动完成 *剩余的*安装过程[1]. 
([1] **注**: ffmpeg 仍然需要手动安装配置, *install.bat* 不会完成这项工作) 

(**注意**: *windows* 可能会隐藏文件的扩展名, 所以 *install.bat* 可能看起来是 *install*) 

如果安装过程遇到错误或问题, 可以联系作者: 

	sceext <sceext@foxmail.com>; QQ: 963593614 sceext 

## ffmpeg

需要使用 **自动合并分段视频** 功能的用户还应该 安装 *ffmpeg*. 
详见 下方 *配置 > 自动合并分段视频功能* 

## 一定要配置 ! 

evdh 安装之后不能立刻使用, 必须进行合适的配置. 
最重要的是 在 token 文件中写入 正确的 token ! 

**否则 evdh 将不能正常启动 !**


# 配置

默认 配置文件 是 *etc\evdh.conf.xml* 

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

默认的 token 文件位置是 *tmp\private\token.txt* 
在使用这个程序下载视频之前, 你应该在 token 文件中写入你自己的 token. 

## 自动合并分段视频 功能

evdh 使用 *ffmpeg* 来自动合并分段视频文件. 
在合并分段视频时没有重新编码, 所以 速度很快, 且 不会 损伤 视频质量. 

evdh 的 *win* 版用户需手动安装 *ffmpeg*. 

可以 从 ffmpeg 的 官方网站 上 下载并安装 *ffmpeg*. <http://ffmpeg.org/download.html> 

或者 直接从以下地址下载 ffmpeg 的 *windows* 版本. <http://ffmpeg.zeranoe.com/builds/> 

建议下载 "static" 版本. 下载之后 解压 *.7z* 压缩文件, 找出其中的 *ffmpeg.exe* 文件. 

将 *ffmpeg.exe* 文件复制到 evdh 文件夹下的 *tmp\ffmpeg* 文件夹中. 
(将来 evdh 会 调用 此程序: *tmp\ffmpeg\ffmpeg.exe*) 

或者 修改 配置文件 中 *ffmpeg.exe* 文件的位置. 
配置文件 此处: 

	<merge_tool>tmp\ffmpeg\ffmpeg.exe</merge_tool>

将其中的 *tmp\ffmpeg\ffmpeg.exe* 替换成 *ffmpeg.exe* 的位置即可. 


# 运行 evdh 

evdh 的 *win* 版已经准备好了 启动脚本 *evdh.bat*, 双击运行它即可. 
注意 在运行 evdh 之前, **一定要正确的配置** ! 

evdh 目前是交互式运行的. 在运行 evdh 时需要回答一些问题. 


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

这是 evdh 的 *windows*版. (public win version) branch version-win 

<https://github.com/sceext2/evdh/tree/version-win>

### evdh 还有这些 版本

**中文版** (public zh-cn version) branch version-zh-cn 

<https://github.com/sceext2/evdh/tree/version-zh-cn>

**English version** (public version) branch version 

<https://github.com/sceext2/evdh/tree/version>

你也可以从以下地址 下载 evdh : 
<https://github.com/sceext2/evdh/releases>


# 版本

**当前版本** version 0.1.3.1 test201502071222 (public win version) *(windows 版)* 

## version 0.1.3.1 test201502071222 (public win version) 

+ 修复 UI bug: 选择视频 2, 显示选择了视频 1. 

+ UI 优化: 针对 *windows* 用户的使用习惯, 对大小写不敏感, 输入确认时, 输入 'Y' 或者 'y' 均可. 

## version 0.1.3.0 test201502051748 (public win version) (windows 版)

+ **自动合并分段视频** 功能 回归. 
目前 evdh 仍然使用 **ffmpeg** 合并分段视频文件. 
*win* 版 用户需自行下载准备 *ffmpeg.exe* 工具文件. 
在此 *ffmpeg* 合并视频文件时仅仅是复制视频编码流, 没有进行重新编码. 
所以 **速度很快**, 并且 视频质量 **不会有任何损失**. 

+ 程序界面改成 中文. 

+ 修改 一些 *windows* 本地化 的细节. 

## version 0.1.2.0 test201502042104 (public win version) (windows 版)

这是 evdh 的 首个 *windows* 版本. 

+ 针对 *windows* 环境, 进行一些本地化修改. 
比如: *windows* 只会根据文件扩展名识别文件类型, 所以 token 文件 默认名称从 token 改为 token.txt

+ 考虑到大多数 *windows* 用户的实际水平, 提供一些 *.bat* 脚本, 比如 安装脚本 *install.bat*, 
使得 evdh 的安装和使用更简单. 

+ 程序启动时 增加输出 此程序是 自由软件 的提示信息. 
因为 对于 *windows* 用户, 更应该让他们知道 本程序 是 自由软件. 

+ 暂时移除 **自动合并分段视频** 的功能. 
实在是因为相比 **GNU/Linux** 操作系统, *windows* 的 shell 脚本 **太坑了** ! 

+ 目前程序界面使用英文. 
暂时不使用中文 是因为 在 *windows* 下使用 utf-8 编码不太方便. 

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

## evdh public win version 测试信息

evdh public *win* version 的 最新版本 在 *windows 7 sp1 旗舰版 64位* 下测试. 

没有发现 evdh 的严重问题. (2015.02) 

## evdh public version 测试信息

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

evdh EisF Video Download Helper EisF 视频下载助手 windows版 方便下载视频 flv.cn 解析服务 api.flvxz.com API 

:: end README.md


