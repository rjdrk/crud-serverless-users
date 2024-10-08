const aws = require("aws-sdk")

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'MockAccessKeyId',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'MockAccessKeyId' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams)


const getUsers = async (event, context) => {
    console.log("event -> ",JSON.stringify(event));

    let userId = event.pathParameters.id;

    const params = {
        ExpressionAttributeValues: {
          ":pk": userId
        },
        KeyConditionExpression: "pk = :pk",
        TableName: "usersTable",
    };
    
    return dynamodb.query(params).promise().then(res => {
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res.Items})
        }
    })
}

module.exports = {
    getUsers
}
