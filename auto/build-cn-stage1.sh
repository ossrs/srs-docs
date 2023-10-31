#!/bin/bash

pwd
du -sh *

yarn &&
yarn cross-env REGION='zh-cn' BASE_URL='/lts/en-us/' \
  SEARCH_HTTPS_HOST=ossrs.net SEARCH_HTTPS_PORT=443 \
  SEARCH_HTTP_HOST=ossrs.net SEARCH_HTTP_PORT=80 \
  SEARCH_APIKEY=$SEARCH_APIKEY \
  docusaurus build --locale en-us --out-dir build/en-us &&

(cd build && tar cf en-us.tar en-us) &&
du -sh build/*

if [[ $? -ne 0 ]]; then echo "Build fail"; exit 1; fi
