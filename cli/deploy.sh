addr="58.57.54.252"
user="ysfe"
port="51000"

name="ysfe"
webport="8890"


cd $PROJECTS/vue/cst-ys

echo "creating remote dirs..."
ssh -p $port $user@$addr <<- EOF
	[[ ! -d ~/$name ]] && mkdir ~/$name
	[[ ! -d ~/$name/cache ]] && mkdir ~/$name/cache
EOF

echo "scp image to remote..."
scp -P $port $name.tar $user@$addr:~/$name

echo "removing existed container and image..."
ssh -p $port $user@$addr <<- EOF
	[[ ! -z \$(docker ps -aq --filter ancestor="devreg.azuratech.com/$name") ]] && docker rm -f \$(docker ps -aq --filter ancestor="devreg.azuratech.com/$name")
EOF

echo "loading image..."
ssh -p $port $user@$addr "docker load < ~/$name/$name.tar"

echo "starting new container..."
ssh -p $port $user@$addr <<- EOF
docker run --restart always -d -p $webport:$webport \
	devreg.azuratech.com/$name
EOF

echo "cleaning cache..."
ssh -p $port $user@$addr "docker image prune -f"

echo "done!"