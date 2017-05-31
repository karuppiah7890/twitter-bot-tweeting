const bot = require('./bot');
const amqplib = require('amqplib');

const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const open = amqplib.connect(url);


open.then((conn) => {

  // Task Consumer
  let ok = conn.createChannel();
  ok = ok.then((ch) => {
    const q = 'tasks';

    ch.assertQueue(q);
    ch.consume(q, (msg) => {
      if (msg !== null) {
        const msg_content = msg.content.toString();

        console.log('Content : ', msg_content);
        ch.ack(msg);

        const taskData = JSON.parse(msg_content);

        if(taskData.task === 'start') {
          if(bot.getState() === 'running') {
            bot.stopTracking();
          }
          bot.startNewTracking(taskData.track_word, taskData.inputLines);
        } else if(taskData.task === 'resume') {
          if(bot.getState() === 'stopped') {
            bot.resumeTracking();
          }
        } else if(taskData.task === 'stop') {
          if(bot.getState() !== 'stopped') {
            bot.stopTracking();
          }
        }

      }
    });
  });
  return ok;
})
.then((result) => {
  console.log(result);
})
.catch((err) => {
  console.error(err);
});
