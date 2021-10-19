#!/bin/bash

awslocal \
    --endpoint-url=http://localhost:4566 \
    s3 mb s3://$S3_BUCKET_NAME

awslocal \
    --endpoint-url=http://localhost:4566 \
    s3api put-bucket-acl \
    --bucket $S3_BUCKET_NAME \
    --acl public-read
