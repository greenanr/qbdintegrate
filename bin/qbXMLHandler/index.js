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

var amqpLib = null;
// Public
module.exports = {

    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */
    fetchRequests: function(callback) {
        buildRequests(callback);
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

function closeOnErr(err) {

    if (!err) return false;

    console.error("[AMQP XML Build] error", err);
    amqpLib.close();
    return true;
}

function buildRequests(callback) {
    var requests = new Array();
    var xml = '';
    amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
        
        if (err) {
          console.error("[AMQP XML Build 1] ", err.message);
        }


        conn.on("error", function(err) {
          if (err.message !== "Connection closing") {
            console.error("[AMQP XML Build 2] connection error", err.message);
          }
        });

        console.log("[AMQP XML Build] connected");
        amqpLib = conn;
        
        conn.createChannel(function(err, ch) {
            
            if (closeOnErr(err)) return;

            ch.on("error", function(err) {
              console.error("[AMQP XML Build 3] channel error", err.message);
            });
            ch.on("close", function() {
              console.log("[AMQP XML Build 4] channel closed");
            });
            //ch.prefetch(10);
            ch.assertQueue("xml-queue", { durable: true }, function(err, _ok) {
              if (closeOnErr(err)) return;
              //ch.consume("xml-queue", processMsg, { noAck: false });
              var gotMessage = ch.get("xml-queue", {noAck: false}, function (err, msgOrFalse) {
                    if (closeOnErr(err)) return;

                    if (msgOrFalse) {
                        console.log("Got Message from XML queue:" + msgOrFalse.content.toString());
                        requests.push(msgOrFalse.content.toString());
                        ch.ack(msgOrFalse);
                    } else {
                        requests.push('');
                    }
                    ch.close();
                    return callback(null, requests);
              });
            });
        });
    });
}