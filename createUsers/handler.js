const aws = require('aws-sdk');
const { randomUUID } = require('crypto');

let DynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    DynamoDBClientParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'MockAccessKeyId',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'MockSecretAccessKey' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(DynamoDBClientParams)

const createUsers = async (event, context) => {
    console.log("event -> ",JSON.stringify(event));

    const id = randomUUID();

    let userBody = JSON.parse(event.body);

    userBody.pk = id;

    const params = {
        TableName: "usersTable",
        Item: userBody
    };

    console.log(params.Item);
    
    return dynamodb.put(params).promise().then(res => {
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': params.Item})
        }
    })
}

module.exports = {
    createUsers
}
