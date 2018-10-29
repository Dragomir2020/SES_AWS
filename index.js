var AWS = require('aws-sdk')
var fs = require('fs-extra')
var ses = new AWS.SES()
 
var SENDER = 'dragdi15@gmail.com'
var html;
 
exports.handler = function (event, context) {
    console.log('Received event:', event)
    loadHTML(event);
}
 
function sendMeEmail (event, done) {
    var params = {
        Destination: {
            ToAddresses: [
                SENDER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'Name: ' + event.name + '\nEmail: ' + event.email + '\nTime Horizon: ' + event.time + '\nDesc: ' + event.desc,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: 'Website Referral Form: ' + event.name,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    }
    ses.sendEmail(params, done)
}


function sendClientEmail (event, done) {
    var params = {
        Destination: {
            ToAddresses: [
                event.email
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8", 
                    Data: html
                }
            },
            Subject: {
                Data: 'Website Referral Form: ' + event.name,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    }
    ses.sendEmail(params, done);
}

function loadHTML(event)
{
	fs.readFile( 'email-template.html', function (err, data) {
  		if (err) {
    		throw err; 
  		}
		html = data.toString();
		
		sendMeEmail(event, function (err, data) {
        context.done(err, null)
    	});
		
		sendClientEmail(event, function (err, data) {
        context.done(err, null)
    	});
	});
}
