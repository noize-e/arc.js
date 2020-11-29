ECHO OFF
:: build ArcJS distribution package
call grunt --force
:: Sync new distribution package with S3 bucket
aws s3 sync dist/lastest s3://arc-js/lastest
:: Give public access to the new package
aws s3api put-object-acl --bucket arc-js --acl public-read --key lastest/arc.proto.min.js
ECHO Ready
PAUSE
