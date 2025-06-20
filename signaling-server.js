const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const app = express();
expressWs(app);

let viewer = null;
let mobile = null;

app.use(express.static(path.join(__dirname, 'public')));

app.ws('/ws', function(ws) {
  ws.on('message', function(msg) {
    const data = JSON.parse(msg);
    if (data.type === 'offer') {
      viewer = ws;
      if (mobile && mobile !== ws) mobile.send(JSON.stringify(data));
    } else if (data.type === 'answer') {
      if (viewer && viewer !== ws) viewer.send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    if (ws === viewer) viewer = null;
    if (ws === mobile) mobile = null;
  });

  if (!viewer) viewer = ws;
  else if (!mobile) mobile = ws;
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));