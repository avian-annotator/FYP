#!/bin/bash
BUCKET_NAME="avian-annotator-local"
ENDPOINT="http://localstack-main:4566"

# Check if bucket exists
if aws --endpoint-url="$ENDPOINT" s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Bucket $BUCKET_NAME already exists."
else
    echo "Creating bucket $BUCKET_NAME..."

    # Only add LocationConstraint if not using us-east-1
    aws --endpoint-url="$ENDPOINT" s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region ap-southeast-2 \
        --create-bucket-configuration LocationConstraint=ap-southeast-2

    if [ $? -eq 0 ]; then
        echo "Bucket $BUCKET_NAME created."
    else
        echo "Bucket creation skipped or failed (may already exist)."
    fi
fi
