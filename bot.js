const amqplib = require('amqplib');
const q = 'tasks';

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const open = amqplib.connect(url);

// Task Consumer
open.then(function(conn) {
  let ok = conn.createChannel();
  ok = ok.then((ch) => {
    ch.assertQueue(q);
    ch.consume(q, (msg) => {
      if (msg !== null) {
        console.log('Content : ', msg.content.toString());
        ch.ack(msg);

        const taskData = JSON.parse(msg.content.toString());

        

      }
    });
  });
  return ok;
})
.then((result) => {
  console.warn(result);
})
.catch((err) => {
  console.error(err);
});
