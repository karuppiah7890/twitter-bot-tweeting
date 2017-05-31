const express = require('express');
const app = express();
const amqplib = require('amqplib');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.render('public/index.html');
});

app.get('/getState', (req, res) => {
  res.send('To do!');
});

app.post('/doTask', (req,res) => {
  console.log("Request : ", req.body);
  const open = amqplib.connect(url);
  const q = 'tasks';
  // Task Producer
  open.then((conn) => {
    let ok = conn.createChannel();
    ok = ok.then((ch) => {
      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer(JSON.stringify(req.body,null,2)));
    });
    return ok;
  })
  .then((result) => {
    if(result)
      console.log(result);

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
