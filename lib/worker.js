/* This worker takes JSON messages from webhooks and processes them into QBXML.
	The QBXML will be pushed to a new queue.
   The server will pop off new QBXML messages and push them down to Quickbooks. 
*/


var amqp = require('amqplib/callback_api');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;

var pubChannel = null;
var offlinePubQueue = [];

var builder = require('xmlbuilder');

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

function work(msg, cb) {

  //Pop a JSON message from the queue and turn it into a PurchaseOrder XML doc

  //console.log("Got msg", msg.content.toString());
  //authToken = items.authenticationToken;
  //appCompanyId = items.companyID;
  //budgetId = items.budgetID;
  //supName = items.supplierName;
  //currencyId = items.currencyID;
  //departmentId = items.departmentID;
  //defaultTaxRateID = items.defaultTaxRateID;


  //if ((authToken != "") && (appCompanyId != "")) {
  console.log("Got message, create PurchaseOrderModel: " + msg.content.toString());

  //po.setCommit("draft");
  //po.setCreatorID("1");
  //po.setSupplierName(supName);
  //po.setStatus("draft");
  //po.setCompanyId(appCompanyId);
  //po.setCurrencyId(currencyId);
  //po.setDepartmentId(departmentId);


  try {
    if (msg != null) {
      var json = JSON.parse(msg.content.toString());
    
      //console.log("Json: "  + json.event);
      //console.log("Json: "  + json.object);

      var payld = JSON.parse(json.payload);

/*
      console.log("Payload Id: " + payld.id);
      console.log("Company Id: " + payld.company_id);
      console.log("Department Id: " + payld.department_id);
      console.log("Department Name Id: " + payld.department_name);
      console.log("Supplier Id: " + payld.supplier_id);
      console.log("Supplier Name: " + payld.supplier_name);
      console.log("Supplier Id: " + payld.supplier_id);
      console.log("Supplier Email: " + payld.supplier_email);
      console.log("Supplier Address: " + payld.supplier_address);
      console.log("Status: " + payld.status);
      console.log("Creator Id " + payld.creator_id);
      console.log("Currency Id " + payld.currency_id);
      for (x=0; x < payld.purchase_order_items.length; x++) {
        console.log("ID " + payld.purchase_order_items[x].purchase_order_id);
        console.log("Description " + payld.purchase_order_items[x].description);
        console.log("Net Amount " + payld.purchase_order_items[x].total_net_amount);

      }
*/

      var xml = builder.create('<?qbxml version="13.0"?>');
      var qbxmlMsg = xml.ele('QBXMLMsgsRq');
      qbxmlMsg.att('onError', 'stopOnError');
      var poAddRq = qbxmlMsg.ele('PurchaseOrderAddRq');
      var poAdd = poAddRq.ele('PurchaseOrderAdd');
      var vendorRef = poAdd.ele('VendorRef');
      var vendorName = vendorRef.ele('FullName', payld.supplier_name);
      poAdd.ele('TxnDate', '2019-01-06');
      poAdd.ele('RefNumber', payld.approval_key);
      var poLineAdd = poAdd.ele('PurchaseOrderLineAdd');
      for (x=0; x < payld.purchase_order_items.length; x++) {
        poLineAdd.ele('ItemRef');
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
      console.log(xmlString);
      
    }
  } catch (err) {
      console.log("Error parsing JSON: " + err);
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


