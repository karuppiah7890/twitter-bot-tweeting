const express = require('express');
const app = express();
const amqplib = require('amqplib');

const PORT = process.env.PORT || 3000;
const q = 'tasks';

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const open = amqplib.connect(url);

app.get('/', (req,res) => {
  // Task Producer
  open.then((conn) => {
    let ok = conn.createChannel();
    ok = ok.then((ch) => {
      ch.assertQueue(q);
      const obj = {
        text: "hey"
      };
      ch.sendToQueue(q, new Buffer(JSON.stringify(obj,null,2)));
    });
    return ok;
  })
  .then((result) => {
    console.warn(result);
    const response = {
      status: "success"
    };
    res.json(response);
  })
  .catch((err) => {
    console.error('got error : ', err);
    const response = {
      status: "error",
      error: err
    }
    res.json(response);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}. Go to http://localhost:${PORT}`);
})
