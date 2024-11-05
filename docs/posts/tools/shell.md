
echo ll > file_list.txt
write ll to file_list.txt directly

echo $(ll) > file_list.txt
exec ll and then write the output of ll to file_list.txt


ifconfig en0 | awk

awk
pattern matching
first split all line by separator space
or specified by you


given the data below in the file data.txt

| $1    | $2  | $3 |
|-------|-----|----|
| Yuzu  | os  | 6  |
| Mikan | alg | 3  |

> cat data.txt | awk '/Mikan/ {print $1,$3}'

we get the output as below

> Mikan 3

sed
replacement

cat data.txt 
| awk '/Mikan/ {print $1,$3}' 
| sed 's/ /|/g'

> Mikan|3


xargs
turn input stream into a list of arg

dep_files
dep1
dep2
dep3

we exec below
cat dep_files | xargs rm -rf

above is equals to below
rm -rf dep1 dep2 dep3



