const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const signedS3URL = async (event, context) => {
    console.log("event -> ",JSON.stringify(event));

    const fileName = event.queryStringParameters.fileName;
    const signedURL = await s3.getSignedUrlPromise("putObject", {
        Key: `upload/${fileName}`,
        Bucket: process.env.BUCKET,
        Expires: 300
    });

    return {
        "statusCode": 200,
        "body": JSON.stringify({ signedURL})
    }
}

module.exports = {
    signedS3URL
}