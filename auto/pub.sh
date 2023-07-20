#!/bin/bash

# Execute by: bash xxx.sh or bash zzz/yyy/xxx.sh or ./xxx.sh or ./zzz/yyy/xxx.sh source xxx.sh
REALPATH=$(realpath ${BASH_SOURCE[0]})
SCRIPT_DIR=$(cd $(dirname ${REALPATH}) && pwd)
WORK_DIR=$(cd $(dirname ${REALPATH})/.. && pwd)
echo "BASH_SOURCE=${BASH_SOURCE}, REALPATH=${REALPATH}, SCRIPT_DIR=${SCRIPT_DIR}, WORK_DIR=${WORK_DIR}"
cd ${WORK_DIR}

git st |grep -q 'nothing to commit'
if [[ $? -ne 0 ]]; then
  echo "Failed: Please commit before release";
  exit 1
fi

RELEASE=$(git describe --tags --abbrev=0 --exclude release-*)
REVISION=$(echo $RELEASE|awk -F . '{print $3}')
let NEXT=$REVISION+1
echo "Last release is $RELEASE, revision is $REVISION, next is $NEXT"

TAG="v1.0.$NEXT"
echo "publish $TAG"

git push
git tag -d $TAG 2>/dev/null && git push origin :$TAG
git tag $TAG
git push origin $TAG
echo "publish $TAG ok"
echo "    https://github.com/ossrs/srs-docs/actions"
