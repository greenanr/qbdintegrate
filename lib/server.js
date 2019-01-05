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

/*
 * Server.js
 *
 * This class will star the SOAP service
 * and start listening for requests from
 * a Quickbooks Web Connector
 */

//////////////////
//
// Private
//
//////////////////

/**
 * Node.js' HTTP Library
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/http.html
 */
var http = require('http');

/**
 * Node.js' File System API
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
 */
var fs = require('fs');

var path = require('path');

/**
 * A SOAP client and server
 * for Node.js
 *
 * https://github.com/vpulim/node-soap
 */
var soap = require('soap');


var amqp = require('amqplib/callback_api');

var ejs = require('ejs');

var db = require('./database.js');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;

const PORT = process.env.PORT || 8000;

function startMQ() {
  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(startMQ, 1000);
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });

    console.log("[AMQP] connected");
    amqpConn = conn;

    whenConnected();
  });
}

function whenConnected() {
  startPublisher();
  //startWorker();
}


function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    pubChannel = ch;
    while (true) {
      var m = offlinePubQueue.shift();
      if (!m) break;
      publish(m[0], m[1], m[2]);
    }
  });
}

// method to publish a message, will queue messages internally if the connection is down and resend later
function publish(exchange, routingKey, content) {
  try {
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
                       function(err, ok) {
                         if (err) {
                           console.error("[AMQP] publish", err);
                           offlinePubQueue.push([exchange, routingKey, content]);
                           pubChannel.connection.close();
                         }
                       });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}

// A worker that acks messages only if processed succesfully
/* function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });
    ch.prefetch(10);
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });

    function processMsg(msg) {
      work(msg, function(ok) {
        try {
          if (ok)
            ch.ack(msg);
          else
            ch.reject(msg, true);
        } catch (e) {
          closeOnErr(e);
        }
      });
    }
  });
} */

/* function work(msg, cb) {
  console.log("Got msg", msg.content.toString());
  cb(true);
} */

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

//setInterval(function() {
//  publish("", "jobs", new Buffer("work work work"));
//}, 1000);

var pubChannel = null;
var offlinePubQueue = [];
/**
 * An HTTP server that will be used
 * to listen for SOAP requests.
 */
var server = http.createServer(function(req, res) {
    var data = '';

    console.log("Listen to http");
    console.log("Request URL: " + req.url);

    if (req.method == "POST" && req.url == "/webhook") {
        console.log("Got the JSON from PEX");
        req.on('data', function(chunk) {
            console.log("chunking");
            data += chunk.toString();
        });
        
        req.on('end', function() {
            
            console.log('Received body data:');
            
            console.log(data.toString());
            
            // Publish the data to our message queue
            publish("", "json-queue", new Buffer(data));

            //Send a success response
            res.end('200: OK' + req.url); 
        });
           
    } else if (req.method == 'GET') {

       console.log('request ', req.url);

        var filePath = '.' + req.url;
        if (filePath == './admin') {
            filePath = './views/pages/admin.ejs';
        }

        var extname = String(path.extname(filePath)).toLowerCase();
        var mimeTypes = {
            '.html': 'text/html',
            '.ejs': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        var contentType = mimeTypes[extname] || 'application/octet-stream';

        var htmlContent = fs.readFileSync(filePath, 'utf8');//function(error, content) {
            /*if (error) {
                if(error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        res.writeHead(404, { 'Content-Type': contentType });
                        res.end(content, 'utf-8');
                    });
                }
                else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    res.end();
                }
            }
            else { */
        console.log("EJS Rendering");
        var qbdusers = [];
        db.getUsers(function(err, users){
            if (users == null) {
                console.log("No users found");
            } else {
                qbdusers = users
            }
            var htmlRenderized = ejs.render(htmlContent, {filename: filePath, qbdUsers: qbdusers});
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(htmlRenderized);
        });
            //}
        //});

    } else {
        res.end('404: Not Found: ' + req.url);
    }
});


/**
 * A constant for the WSDL filename.
 * @type {string}
 */
var WSDL_FILENAME = '/qbws.wsdl';

/**
 * Fetches the WSDL file for the
 * SOAP service.
 *
 * @returns {string} contents of WSDL file
 */
function buildWsdl() {
    var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');

    return wsdl;
}

//////////////////
//
// Public
//
//////////////////

module.exports = Server;

function Server() {
    this.wsdl = buildWsdl();
    this.webService = require('./web-service');
}

Server.prototype.run = function() {
    var soapServer;
    server.listen(PORT);
    startMQ();
    soapServer = soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
    console.log('Quickbooks SOAP Server listening on port ' + PORT);
};

Server.prototype.setQBXMLHandler = function(qbXMLHandler) {
    this.webService.setQBXMLHandler(qbXMLHandler);
};





