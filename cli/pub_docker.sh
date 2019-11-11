name='ysfe'
cd $PROJECTS/vue/cst-ys

echo "building source..."
npm run site --name=yishui
if [[ $? -ne 0 ]] ; then
	exit 1
fi


# echo "updating latest dependecies..."
# [[ ! -z $(docker ps -aq --filter ancestor=devreg.azuratech.com/dysrv) ]] && docker rm $(docker stop $(docker ps -aq --filter ancestor=devreg.azuratech.com/dysrv))
# docker pull devreg.azuratech.com/dysrv

echo "stop and remove all $name..."
[[ ! -z $(docker ps -aq --filter ancestor=$name) ]] && docker rm $(docker stop $(docker ps -aq --filter ancestor=$name))

echo "building image..."
docker build -t $name . >> /dev/null
if [[ $? -ne 0 ]] ; then
	exit 1
fi
docker tag $name devreg.azuratech.com/$name

echo "cleaning cache..."
docker image prune -f

echo "pushing image to azura..."
docker push devreg.azuratech.com/$name >> /dev/null

echo "saving image..."
docker save -o ./$name.tar devreg.azuratech.com/$name


echo "done!"
cd - >> /dev/null
