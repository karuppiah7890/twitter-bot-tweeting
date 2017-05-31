const Twit = require('twit');

module.exports = function(api_key, screen_names_list, text, status_id) {

  const T = new Twit(api_key);

  function referAll(screen_names_list) {
    var allUsers = '';

    screen_names_list.forEach((val) => {
      allUsers += `@${val} `;
    });

    return allUsers;
  }

  return new Promise(function(resolve, reject) {
    T.post('statuses/update', { status: `${referAll(screen_names_list)} ${text}` , in_reply_to_status_id: status_id })
    .then((result) => {
      if(result.data.errors) {
        reject(`Error : ${JSON.stringify(result.data.errors, null, 2)}
        while tweeting ${text} to https://twitter.com/${screen_name}/status/${status_id}`);
        return;
      }
      //console.log("Tweeted!");
      resolve(result.data);

    })
    .catch((err) => {
      reject(`Error : ${JSON.stringify(err, null, 2)}
      while tweeting ${text} to https://twitter.com/${screen_name}/status/${status_id}`);
    });
  });

}
