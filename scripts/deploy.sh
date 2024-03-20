#!/bin/bash

PEM_PATH=scripts/mappilogue-ec2-key.pem
if [ ! -f $PEM_PATH ]; then
    echo "DEPLOY_FAIL: not file exist \"$PEM_PATH\""
    exit 1;
fi

# 나중에 env 사용할때 주석해제
ENV=.env
if [ ! -f $ENV ]; then
    echo "DEPLOY_FAIL: not file exist \"$ENV\""
    exit 1;
fi

# 프로젝트 빌드
npm run build

BUILD=$?
if [ $BUILD -eq 1 ]; then
    echo -e '\n======================================\n'
    echo 'BUILD FAILED : deploying is cancel'
    echo -e '\n======================================\n'
    exit 1;
fi

USER=ubuntu
HOST=52.78.203.84
DEPLOY_PATH=mappilogue-temp

SERVER=$USER@$HOST
REMOTE_PATH=$SERVER:$DEPLOY_PATH

# 원격 서버에서 기존의 배포 디렉토리 삭제 및 생성
ssh -i $PEM_PATH $SERVER "sudo rm -rf $DEPLOY_PATH/dist"
ssh -i $PEM_PATH $SERVER "sudo mkdir -p -m 777 $DEPLOY_PATH/dist"

# 로컬 머신의 파일들을 원격 서버로 전송
rsync -avz --progress -e "sudo ssh -i $PEM_PATH" dist/ $REMOTE_PATH/dist
rsync -avz --progress -e "sudo ssh -i $PEM_PATH" package* $REMOTE_PATH
rsync -avz --progress -e "sudo ssh -i $PEM_PATH" ecosystem.config.js $REMOTE_PATH
rsync -avz --progress -e "sudo ssh -i $PEM_PATH" .env $REMOTE_PATH
rsync -avz --progress -e "sudo ssh -i $PEM_PATH" apple-social-login-key.p8 $REMOTE_PATH

# 필요한 파일 업로드 완료 메시지 출력
echo -e '\n======================================\n'
echo 'FILE UPLOAD DONE.'
echo -e '\n======================================\n'

# 원격 서버에서 프로젝트 의존성 설치
ssh -i $PEM_PATH $SERVER "npm --prefix $DEPLOY_PATH install"

# PM2를 사용하여 애플리케이션 실행 또는 재시작
ssh -i $PEM_PATH $SERVER "pm2 startOrReload $DEPLOY_PATH/ecosystem.config.js"

# 배포 완료 메시지 출력
echo -e '\n======================================\n'
echo 'DEPLOY SUCCESS AND DONE.'
echo -e '\n======================================\n'