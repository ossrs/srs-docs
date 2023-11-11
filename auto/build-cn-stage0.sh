#!/bin/bash

pwd
du -sh *

yarn &&
yarn cross-env REGION='zh-cn' BASE_URL='/lts/zh-cn/' SRS_OS_LOCALE='zh-cn' \
  docusaurus build --locale zh-cn --out-dir build/zh-cn &&

(cd build && tar cf zh-cn.tar zh-cn) &&
du -sh build/*

if [[ $? -ne 0 ]]; then echo "Build fail"; exit 1; fi
