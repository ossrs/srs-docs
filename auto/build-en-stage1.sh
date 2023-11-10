#!/bin/bash

pwd
du -sh *

yarn &&
yarn cross-env REGION='zh-cn' BASE_URL='/lts/en-us/' \
  docusaurus build --locale en-us --out-dir build/en-us &&

(cd build && tar cf en-us.tar en-us) &&
du -sh build/*

if [[ $? -ne 0 ]]; then echo "Build fail"; exit 1; fi
