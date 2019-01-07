/* This worker takes JSON messages from webhooks and processes them into QBXML.
	The QBXML will be pushed to a new queue.
   The server will pop off new QBXML messages and push them down to Quickbooks. 
*/


var amqp = require('amqplib/callback_api');

var db = require('./database.js');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;

var pubChannel = null;
var offlinePubQueue = [];

var builder = require('xmlbuilder');

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
      return setTimeout(startMQ, 1000);
    });

    console.log("[AMQP] connected");
    amqpConn = conn;

    whenConnected();
  });
}

function whenConnected() {
  //startPublisher();
  startWorker();
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
                           console.error("[AMQP] publish 1 ", err);
                           offlinePubQueue.push([exchange, routingKey, content]);
                           pubChannel.connection.close();
                         }
                       });
  } catch (e) {
    console.error("[AMQP] publish 2 ", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}

//A worker that acks messages only if processed succesfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;

    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });
    ch.prefetch(10);
    ch.assertQueue("json-queue", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("json-queue", processMsg, { noAck: false });
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
}

 //Pop a JSON message from the queue and turn it into a PurchaseOrder XML doc
function work(msg, cb) {
  try {
    if (msg != null) {
      var json = JSON.parse(msg.content.toString());
      var payld = JSON.parse(json.payload);
      var xml = builder.create('QBXML');
      var qbxmlMsg = xml.ele('QBXMLMsgsRq');
      qbxmlMsg.att('onError', 'stopOnError');
      var poAddRq = qbxmlMsg.ele('PurchaseOrderAddRq');
      var poAdd = poAddRq.ele('PurchaseOrderAdd');
      var vendorRef = poAdd.ele('VendorRef');
      var vendorName = vendorRef.ele('FullName', payld.supplier_name);
      poAdd.ele('TxnDate', '2019-01-06');
      poAdd.ele('RefNumber', payld.id);
      
      for (x=0; x < payld.purchase_order_items.length; x++) {
        
        // Get the Item Custom Field - This is needed
        // Item name is hard coded currently and needs to be in the DB
        var qbdItemName = '';
        for (y=0; y < payld.custom_field_values.length; y++) {
          if (payld.custom_field_values[y].name == "QBDItemName") {
            qbdItemName = payld.custom_field_values[y].value;
          }
        }
        
        var poLineAdd = poAdd.ele('PurchaseOrderLineAdd');
        var itemRef = poLineAdd.ele('ItemRef');
        itemRef.ele('FullName', '01 Plans and Permits');
        poLineAdd.ele('Desc', payld.purchase_order_items[x].description);
        poLineAdd.ele('Quantity', parseInt(payld.purchase_order_items[x].quantity));
        poLineAdd.ele('Rate', parseFloat(payld.purchase_order_items[x].net_amount));
      }

      var xmlString = xml.end({ 
        pretty: true,
        indent: '  ',
        newline: '\n',
        allowEmpty: false,
        spacebeforeslash: ''
      });

      var initialHeaderString = "<?xml version=\"1.0\"?>";
      var headerString = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<?qbxml version=\"13.0\"?>";

      xmlString = xmlString.replace(initialHeaderString, headerString);
      console.log(xmlString);

      //TODO: change userid check for errors
      db.xmlPush('1', xmlString, function(err, result){});


    }
  } catch (err) {
      console.log("Error generating XML: " + err);
  }
  cb(true);
 
} 

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

console.log("Queue Process Worker starting...");
startMQ();


