
var fs = require('fs');

const PORT = process.env.PORT || 3000;

var app = require('http').createServer(handler);

var statusCode = 200;

function handler (req, res) {
  var data = '';

  if (req.method == "POST") {
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function() {
      console.log('Received body data:');
      console.log(data.toString());
    });
  }

  res.writeHead(statusCode, {'Content-Type': 'text/plain'});
  res.end();
}

app.listen(PORT);
