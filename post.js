const Twit = require('twit');

module.exports = function(api_key, screen_name, text, status_id) {

  const T = new Twit(api_key);

  return new Promise(function(resolve, reject) {
    T.post('statuses/update', { status: `@${screen_name} ${text}` , in_reply_to_status_id: status_id })
    .then((result) => {
      if(result.data.errors) {
        reject(result.data.errors);
        return;
      }
      //console.log("Tweeted!");
      resolve(result.data);

    })
    .catch((err) => {
      reject(err);
    });
  });

}
