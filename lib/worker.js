/* This worker takes JSON messages from webhooks and processes them into QBXML.
	The QBXML will be pushed to a new queue.
   The server will pop off new QBXML messages and push them down to Quickbooks. 
*/


var amqp = require('amqplib/callback_api');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;

var pubChannel = null;
var offlinePubQueue = [];

function startMQ() {
  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
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
    pubChannel.publish(exchange, routingKey, content, { persistent: true, contentType: "application/json" },
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

function work(msg, cb) {

  //console.log("Got msg", msg.content.toString());
  //authToken = items.authenticationToken;
  //appCompanyId = items.companyID;
  //budgetId = items.budgetID;
  //supName = items.supplierName;
  //currencyId = items.currencyID;
  //departmentId = items.departmentID;
  //defaultTaxRateID = items.defaultTaxRateID;


  //if ((authToken != "") && (appCompanyId != "")) {
  console.log("Got message, create PurchaseOrderModel");

  //po.setCommit("draft");
  //po.setCreatorID("1");
  //po.setSupplierName(supName);
  //po.setStatus("draft");
  //po.setCompanyId(appCompanyId);
  //po.setCurrencyId(currencyId);
  //po.setDepartmentId(departmentId);


  try {
    
    var json = JSON.parse(msg);
  

    console.log('Json Length: ' + json.length);

    if ((json.length != 0) && (json[0] != null)) {

      console.log("Notes: " + json[0].notes);

      for (x=0;x<json.length;x++) {
        console.log("Description: " + json[x].description);
        console.log("VAT RATE: " + json[x].VatRate);
        console.log("GrossAmount: " + json[x].GrossAmount);
        console.log("Quantity: " + json[x].Quantity);
        console.log("UnitPrice: " + json[x].UnitPrice);
        console.log("ASIN: " + json[x].ASIN);
        console.log("Tax Rate ID: " + defaultTaxRateID);
      }
    }
  } catch (err) {
    console.log("Error parsing JSON: " + err);
    cb(false);
  }
  //createPurchaseOrder(authToken, appCompanyId, po);

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


