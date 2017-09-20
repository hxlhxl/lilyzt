cwd=`pwd`
echo $cwd
tplPath="${cwd}/app/containers/"

target=$1
[[ $target == "jade" ]] && src="pug" && dest="jade"
[[ $target == "pug" ]] && src="jade" && dest="pug"


# 递归更改文件名
function mvSuffix() {
    local path=$1
    for f in `ls $path`;
    do
        local fp="$path/$f"
        if [ -d $fp ];
        then
            mvSuffix $fp
        else
            local nfp=${fp/%"${src}"/"${dest}"}
            mv $fp $nfp
        fi

    done
}

mvSuffix $tplPath



