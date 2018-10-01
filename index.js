'use strict';
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var table = process.env.TABLE_NAME;

exports.handler = function(event, context, callback) {
    var call = JSON.parse(event.body);
    console.log(call);
    var check_params = {
        Key: {
            "hash": {
                S: call.hash
            }
        },
        TableName: table,
        AttributesToGet: ['hash']
    };
    dynamodb.getItem(check_params, function(err, data) {
        if (err) console.log(err, err.stack);
        if (Object.keys(data).length === 0) {
            if (typeof call.is_send === "undefined") {
                call['is_send'] = 'false';
            }
            if (typeof call.block.previous === "undefined") {
                call['block']['previous'] = 'undefined';
            }
            var block_params = {
                Item: {
                    "hash": {
                        S: call.hash
                    },
                    "account": {
                        S: call.account
                    },
                    "amount": {
                        S: call.amount
                    },
                    "type": {
                        S: call.block.type
                    },
                    "previous": {
                        S: call.block.previous
                    },
                    "representative": {
                        S: call.block.representative
                    },
                    "balance": {
                        S: call.block.balance
                    },
                    "link": {
                        S: call.block.link
                    },
                    "link_as_account": {
                        S: call.block.link_as_account
                    },
                    "signature": {
                        S: call.block.signature
                    },
                    "work": {
                        S: call.block.work
                    },
                    "is_send": {
                        S: call.is_send
                    }
                },
                TableName: table
            };
            dynamodb.putItem(block_params, function(err, data) {
                if (err) console.log(err, err.stack);
                else {
                    var response = {
                        statusCode: 200,
                        body: 'added'
                    };
                    callback(null, response);
                }
            });
        }
        else{
            var response = {
                statusCode: 200,
                body: 'exists'
            };
            callback(null, response);
        }
    });
};
