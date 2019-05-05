'use strict';

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient(); 

async function getVideos(event) {
    const params = {
		TableName : 'videos'
	};
	const { Items: items } = await documentClient.scan(params).promise()
	const { topic } = event.queryStringParameters || {}

	if (topic && items && items.length) {
	    return items.reduce((accu, item) => {
	        if (item.topics && item.topics.includes(topic)) {
	            accu.push(item)
	        }
	        return accu
	    }, [])
	}
	
	return items
}
	
exports.handler = async (event) => {
    const videos = await getVideos(event)

    const response = {
        statusCode: 200,
        body: JSON.stringify(videos)
    };
    return response;
};
