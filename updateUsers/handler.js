const aws = require('aws-sdk')

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

const updateUsers = async (event, context) => {
    console.log("event -> ",JSON.stringify(event));

    let userId = event.pathParameters.id;

    const body = JSON.parse(event.body);

    const params = {
        TableName: "usersTable",
        Key: {
            pk : userId
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: {
            '#name' : 'name'
        },
        ExpressionAttributeValues: {
          ':name' : body.name
        },
        ReturnValues: 'ALL_NEW'        
    };
    
    return dynamodb.update(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res.Attributes})
        }
    })
}

module.exports = {
    updateUsers
}
