#!/bin/sh
#
# evdh.sh evdh start shell script, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
# version 0.1.2.0 test201502141949 (public version) 
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
evdh : EisF Video Download Helper
       version 0.1.5.0 test201502141915
       
    author sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
 copyright 2015 sceext 

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
		echo "evdh: ERROR: command line error ! not give url. Please try \"$0 --help\". "
		
		return
	fi
	
	# start evdh with auto_url mode
	start_evdh "mode_auto_url" $1
	return $?
}

start_list_task(){
	# check $1, task_list file of url list
	if [ "x$1" = "x" ] ; then
		echo "evdh: ERROR: command line error ! not give list_file. Please try \"$0 --help\". "
		
		return
	fi
	
	if [ ! -f "$1" ] ; then	# list file not exist
		echo "evdh: ERROR: given list file \"$1\" does not exist ! "
		
		return
	fi
	
	# start list task, pass neccessary args
	# list_task marked list_task_log_file log_path main_log_file input_list_file
	${LIST_TASK_BIN} "marked" ${LTASK_LOG_FILE} ${LOG_PATH} ${MAIN_LOG_FILE} $1
}

print_help(){
cat<<EOF
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

EOF
}

print_about(){
cat<<EOF
        Sorry, this function has not been finished. 

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
		echo "evdh: ERROR: command line error ! Please try \"$0 --help\". "
		
		;;
	esac
	
	# wait child process to exit
	wait
	exit ${exit_code}
}

# start from main, do not forget to pass all command line args
	main $*

# end evdh.sh


