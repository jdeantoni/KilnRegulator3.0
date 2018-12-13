#!/bin/sh

mkdir network/jsclient

cd ../doc

cp swagger.yaml /tmp

docker run --rm -v /tmp:/local swaggerapi/swagger-codegen-cli generate -i /local/swagger.yaml -l javascript -o /local/out/

cp -r /tmp/out/src/* ../mobile/network/jsclient

cd -

patch -p0 < fs.patch
