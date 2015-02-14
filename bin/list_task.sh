#!/bin/sh
#
# list_task.sh, dl many urls auto part for evdh : EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.02 
# version 0.1.1.0 test201502141952 (public version) 
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

# static config
RETRY_TIMES=4
	# task failed (exit_code is not 0) retry times limit 

# program config
START_EVDH_BIN="./evdh.sh"

# functions
get_args(){	# get command line args
	LIST_TASK_LOG_FILE="$1"
	LOG_PATH="$2"
	MAIN_LOG_FILE="$3"
	URL_LIST_FILE="$4"
}

start_evdh(){	# $1 url
	# log info
	print_log "starting download URL \"$1\""
	
	# start it
	${START_EVDH_BIN} --url "$1"
	return $?
}

start_retry(){
	# just retry
	${START_EVDH_BIN} --continue
	return $?
}

backup_log_file(){	# back up evdh main task log file, num n $1
	local back_file
	
	# check $1
	if [ "x$1" = "x" ] ; then
		cp -b ${MAIN_LOG_FILE} "${MAIN_LOG_FILE}~"
	fi
	
	back_file="${MAIN_LOG_FILE}~$1"
	
	# check $2
	if [ "x$2" != "x" ] ; then
		# backup retry log file
		back_file="${back_file}.$2"
	fi
	
	# copy file to back
	cp ${MAIN_LOG_FILE} ${back_file}
	
	# print log
	print_log "INFO: backup evdh main log file to \"${back_file}\""
}

task_loop(){	# start task loop, download each url
	# back up log file
	cp -b ${LIST_TASK_LOG_FILE} "${LIST_TASK_LOG_FILE}~"
	
	# make a refresh log file
	echo "" > ${LIST_TASK_LOG_FILE}
	
	# log msg start task loop
	print_log ""
	print_log "start task_loop ... "
	
	local urls
	# read urls
	urls=$(cat ${URL_LIST_FILE})
	
	# count urls
	local count
	count=0
	
	for url in ${urls} ; do
		let "count=count+1"
	done
	
	# log count
	print_log "found ${count} urls from list file \"${URL_LIST_FILE}\" "
	
	# check count
	if [ "${count}" -lt 1 ] ; then
		print_log "ERROR: not found url ! "
		
		return
	fi
	
	# back log file
	backup_log_file
	
	local exit_code
	
	print_log "INFO: starting main loop ... "
	# start main loop
	count=0
	
	for url in ${urls} ; do
		let "count=count+1"
		
		# log info
		print_log "INFO: start task ${count} ... "
		
		# do start it
		start_evdh "${url}"
		exit_code=$?
		
		# print task done info, check exit_code
		if [ ${exit_code} = 0 ] ; then
			print_log "[ OK ] task ${count} done. exit code ${exit_code}"
		else
			echo ""
			print_log "ERROR: task ${count} failed ! exit_code ${exit_code} "\n
		fi
		
		# back up log file
		backup_log_file ${count}
		
		# check task success, exit_code
		if [ ${exit_code} != 0 ] ; then
			# start retry
			local retry_rest
			retry_rest=${RETRY_TIMES}
			local retry_count
			retry_count=1
			
			while [ ${exit_code} != 0 ] ; do
				# check retry rest times
				if [ ${retry_rest} -lt 1 ]; then
					# stop retry
					break
				fi
				
				# print log
				print_log "INFO: retry ${retry_count} time, task ${count} url \"${url}\" "
				
				# do retry
				start_retry
				exit_code=$?
				
				# backup evdh main_log file
				backup_log_file ${count} ${retry_count}
				
				# print info
				if [ ${exit_code} = 0 ] ; then
					print_log "[ OK ] retry task ${count} at ${retry_count} times finished. exit_code ${exit_code} "
				else
					echo ""
					print_log "ERROR: retry task ${count} at ${retry_count} times failed ! exit_code ${exit_code} "\n
				fi
				
				# sub retry times, count retry
				let "retry_rest=retry_rest-1"
				let "retry_count=retry_count+1"
			done
		fi
	done
	
	# print info
	print_log "[ OK ] all tasks done. "
}

print_log(){	# print log to screen and log file
	local logf
	local logmsg
	
	logf="${LIST_TASK_LOG_FILE}"
	logmsg="evdh: list_task.sh: $1"
	
	# log to screen
	echo "${logmsg}"
	# log to file
	echo "${logmsg}" >> ${logf}
}

# main function
main(){
	# check first command line arg
	if [ "x$1" != "xmarked" ] ; then
		# command line error
		echo "evdh: ERROR: list_task.sh: command line error ! "
		
		return
	fi
	
	# get args
	shift
	get_args $*
	
	# start download urls
	task_loop
}

# start from main
	main $*

# end list_task.sh


