#! /bin/bash

for file in logs/*.txt; do
  #ilename=$(echo "${file##*/}")
  #echo "$file"

  # cp "$file" "$(basename "$file" .txt).json"
   tail -7 $file > logs/"$(basename "$file" .txt).json"
  # if [[ $filename == *"result"* ]]; then
  # 	echo "It's there!"
  	
  #fi

done