#! /bin/bash

for file in logs/*.txt; do
   tail -7 $file > logs/"$(basename "$file" .txt).json"
done