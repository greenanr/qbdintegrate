/*
 * This file is part of quickbooks-js
 * https://github.com/RappidDevelopment/quickbooks-js
 *
 * Based on qbws: https://github.com/johnballantyne/qbws
 *
 * (c) 2015 johnballantyne
 * (c) 2016 Rappid Development LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var amqp = require('amqplib/callback_api');

var db = require('../database.js');

var builder = require('xmlbuilder');

var xml

// Public
module.exports = {

    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */
    fetchRequests: function(connection, callback) {
        buildRequests(connection, callback);
    },

    /**
     * Called when a qbXML response
     * is returned from QBWC.
     *
     * @param response - qbXML response
     */
    handleResponse: function(args, response) {
        
        console.log('[Handle Response] ' + args);

        //var xml = builder.create(response);
        //console.log(xml.toString());
       
    },

    /**
     * Called when there is an error
     * returned processing qbXML from QBWC.
     *
     * @param error - qbXML error response
     */
    didReceiveError: function(error) {
        console.log(error);
    }
};


function buildRequests(callback) {
    var requests = new Array();
   
    //UserID or UUID
    db.xmlPop(1, function(err, res){
        //console.log(res);
        if (res) {
            //console.log("[AMQP XML Build] Found message for UserID: " + res['userid'] + '\nXML: \n' + res['xml']);
            // Push the XML on to the request for QBD
            requests.push(res['xml']);
            //Delete the request from the queue and stick it into our log with a timestamp.. Do this in the response next time.
            db.xmlSwitch(res['id'], function(err, res){
                console.log('[XML Build] Switch');
            });
        } else {
            console.log("[AMQP XML Build] No messages to send");
            requests.push('');
        }
    
    console.log("[AMQP XML Build] Sending request over");
    return callback(null, requests);

    });
}