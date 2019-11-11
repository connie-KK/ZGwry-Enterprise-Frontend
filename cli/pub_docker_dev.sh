name="ysfe"
cd $PROJECTS/cst-ys

echo "building source..."
npm run site --name=dev
if [[ $? -ne 0 ]] ; then
	exit 1
fi

echo "building image..."
docker build -t $name:dev -f ./cli/Dockerfile_Dev . >> /dev/null
if [[ $? -ne 0 ]] ; then
	exit 1
fi

docker image prune -f

echo "stop and remove all $name..."
if [ -z $(docker ps -aq --filter ancestor=$name) ]
then
	:
else
	docker rm $(docker stop $(docker ps -aq --filter ancestor=$name)) >> /dev/null
fi


echo "pushing image to azura..."
docker tag $name devreg.azuratech.com/$name
docker push devreg.azuratech.com/$name >> /dev/null

echo "done!"
cd - >> /dev/null
