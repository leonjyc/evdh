#!/bin/sh
#
# merge_video.sh, used auto merge parts video for evdh: EisF Video Download Helper, sceext <sceext@foxmail.com> 2009EisF2015, 2015.01 
# version 0.1.2.0 test201502031421 (public version) 
# author sceext <sceext@foxmail.com> 2015.01 
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
# merge videos use ffmpeg
#
# command line format
#	merge_video.sh tmp_path output_file list_of_videos_to_merge ... 
# eg:
#	merge_video.sh tmp all.mp4 part1.mp4 part2.mp4 part3.mp4 part4.mp4
#

# exit when error happen
set -e

# global vars
TMP_PATH=""

LIST_FILE="merge_video.list"
MERGE_TOOL="ffmpeg"

OUTPUT_FILE=""
FILES_TO_MERGE=""

# functions

get_args(){	# get args from command line
	# get tmp_path arg 1
	TMP_PATH=$1
	shift
	
	# get output_file arg 2
	OUTPUT_FILE=$1
	shift
	
	# get list of video to merge args
	FILES_TO_MERGE=$*
	
	# make list file location
	LIST_FILE="${TMP_PATH}/${LIST_FILE}"
	
	# done
}

make_list_file(){	# make list file, used for ffmpeg
	# make first line in list file
	echo "file '$1'" > ${LIST_FILE}
	shift
	
	# make rest line in list file
	for file in $* ; do
		echo "file '${file}'" >> ${LIST_FILE}
	done
	
	# finished
}

do_merge(){	# actually call ffmpeg to merge video
	${MERGE_TOOL} -f concat -i ${LIST_FILE} -c copy ${OUTPUT_FILE}
}

merge_video(){
	get_args $*
	
	make_list_file ${FILES_TO_MERGE}
	
	do_merge
}

# main function
main(){
	
	# merge video, pass all args
	merge_video $*
	
	# done
	wait	# wait child process to exit
	
	exit 0
}

# start from main
	
	# NOTE fix bug here, DO NOT forget to pass all args
	main $*

# end merge_video.sh


