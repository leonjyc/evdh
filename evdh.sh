#!/bin/sh
#
# evdh.sh evdh start shell script, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
# version 0.1.5.0 test201502150138 (public zh-cn version) 
# author sceext <sceext@foxmail.com> 2015.02
# copyright 2015 sceext 
#
# This is FREE SOFTWARE, released under GNU GPLv3+ 
# please see README.md and LICENSE for more information. 
#
#    evdh : EisF Video Download Helper, auto download videos with analyse service provided by flv.cn (api.flvxz.com) 
#    Copyright (C) 2015 sceext <sceext@foxmail.com> 
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#

# static config
LOG_PATH="tmp/log"
LIST_TASK_LOG_FILE="list_task.log"

# program config
NODE_JS="node"
EVDH_BIN="./bin/evdh.js"
LIST_TASK_BIN="./bin/list_task.sh"

EVDH_MAIN_LOG_FILE="evdh_main.log.xml"

# process config
MAIN_LOG_FILE="${LOG_PATH}/${EVDH_MAIN_LOG_FILE}"
LTASK_LOG_FILE="${LOG_PATH}/${LIST_TASK_LOG_FILE}"

# functions
print_version(){
cat<<EOF
evdh : EisF 视频下载助手 (EisF Video Download Helper)
       version 0.1.6.1 test201502150137 (public zh-cn version) (中文版) 
       
      作者 sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 copyright 2015 sceext 

 这是 自由软件, 在 GNU GPLv3+ 许可证之下发布. 
 请阅读 README.md 和 LICENSE 获取更多信息. 

 This is FREE SOFTWARE, released under GNU GPLv3+ 
 please see README.md and LICENSE for more information. 

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

EOF
}

start_evdh(){
	# start evdh with given command line args
	${NODE_JS} ${EVDH_BIN} $*
	return $?
}

start_normal(){
	# start evdh, in normal mode
	start_evdh "mode_normal"
	return $?
}

start_auto_continue(){
	# start evdh, in auto_continue mode
	start_evdh "mode_auto_continue"
	return $?
}

start_auto_url(){
	# easy simple check $1, given url
	if [ "x$1" = "x" ] ; then	# url null, error
		echo "evdh: ERROR: 命令行格式错误! 没有指定 URL. 请尝试 \"$0 --help\". "
		
		return
	fi
	
	# start evdh with auto_url mode
	start_evdh "mode_auto_url" $1
	return $?
}

start_list_task(){
	# check $1, task_list file of url list
	if [ "x$1" = "x" ] ; then
		echo "evdh: ERROR: 命令行格式错误! 没有指定 列表文件. 请尝试 \"$0 --help\". "
		
		return
	fi
	
	if [ ! -f "$1" ] ; then	# list file not exist
		echo "evdh: ERROR: 指定的 列表文件 \"$1\" 不存在! "
		
		return
	fi
	
	# start list task, pass neccessary args
	# list_task marked list_task_log_file log_path main_log_file input_list_file
	${LIST_TASK_BIN} "marked" ${LTASK_LOG_FILE} ${LOG_PATH} ${MAIN_LOG_FILE} $1
}

print_help(){
cat<<EOF
evdh : EisF 视频下载助手 (public zh-cn version) (中文版) 
      (EisF Video Download Helper)
用法: evdh
      evdh [选项] ... 
选项: 
   无           只使用 "evdh" 而不带任何命令行参数将会以 "normal" 模式 
                (普通模式) 启动 evdh. 该模式以交互式运行. 
   
   --url <url>  以 "auto_url" 模式 (自动 URL 模式) 启动 evdh. 
                在该模式中, evdh 会自动下载文件, 并且不会询问用户确认. 
   --continue   以 "auto_continue" 模式 (自动继续模式) 启动 evdh. 
                在该模式中, evdh 会自动继续未完成的任务, 不会询问用户确认. 
   --list-file <file>
                在这个 "task_list" 模式 (任务列表模式) 中你可以让 evdh 
                自动下载很多 URL. URL 写在 <file> 所指定的文件中, 一行一个. 
   
   --help       显示本帮助信息. 
   --version    显示 evdh 的版本信息. 
注:
     evdh 可以用来下载网站上的视频. 输入的 URL 是 视频播放页面 的 URL. 
 evdh 会自动通过 "api.flvxz.com" 解析 URL 获取 分段视频文件的下载地址. 
 并且自动把它们全部下载, 然后自动使用 ffmpeg 将它们合并成一个完整的
 视频文件. 
     evdh 使用 flv.cn <http://flv.cn> 提供的解析 API. 

EOF
}

# main function
main(){
	local exit_code
	exit_code=0
	
	# check command line args
	case "x$1" in
	"x--url")	# auto_url mode
		start_auto_url $2
		exit_code=$?
		
		;;
	"x--continue")
		start_auto_continue
		exit_code=$?
		;;
	"x--list-file")	# task_list file
		start_list_task $2
		
		;;
	"x--help")	# show help info
		print_help
		
		;;
	"x--version")	# show version info
		print_version
		
		;;
	"x")	# normal mode, just start it
		start_normal
		
		;;
	*)	# command line error
		echo "evdh: ERROR: 命令行格式错误! 请尝试 \"$0 --help\". "
		
		;;
	esac
	
	# wait child process to exit
	wait
	exit ${exit_code}
}

# start from main, do not forget to pass all command line args
	main $*

# end evdh.sh


