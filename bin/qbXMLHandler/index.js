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
    handleResponse: function(response) {
        console.log(response);
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

    amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
        
        if (err) {
            console.error("[AMQP XML Build 1] ", err.message);
        }
        conn.on("error", function(err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP XML Build 2] connection error", err.message);
            }
        console.log("[AMQP XML Build] connected");
       
        });
        
        conn.createChannel(function(err, ch) {
                
            if (err) {
                conn.close();
                requests.push('');
                return callback(null, requests);
            }


            ch.on("error", function(err) {
              console.error("[AMQP XML Build 3] channel error", err.message);
            });

            ch.on("close", function() {
              console.log("[AMQP XML Build 4] channel closed");
            });
            
            
                  
            ch.get("xml-queue", {noAck: false}, function (err, msgOrFalse) {
                if (err) {
                    conn.close();
                    requests.push('');
                    return callback(null, requests);
                }

                if (msgOrFalse) {
                    console.log("[AMQP XML Build] Got Message from XML queue:" + msgOrFalse.content.toString());
                    ch.ack(msgOrFalse);
                    requests.push(msgOrFalse.content.toString());
                } else {
                    console.log("[AMQP XML Build] No message available");
                    requests.push('');
                }

                conn.close();
                console.log("[AMQP XML Build] Closed connection");
                return callback(null, requests);
            });
        });
    });
}