#!/bin/bash

pwd
du -sh *

yarn &&
yarn cross-env REGION='zh-cn' BASE_URL='/lts/zh-cn/' \
  SEARCH_HTTPS_HOST=ossrs.net SEARCH_HTTPS_PORT=443 \
  SEARCH_HTTP_HOST=ossrs.net SEARCH_HTTP_PORT=80 \
  SEARCH_APIKEY=$SEARCH_APIKEY \
  docusaurus build --locale zh-cn --out-dir build/zh-cn

(cd build && tar jcf zh-cn.tar.bz2 zh-cn)
du -sh build/*

