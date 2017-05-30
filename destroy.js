const Twitter = require('twitter');

const T = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key : process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// to destroy all tweets in a user's timeline

T.get('statuses/user_timeline', {screen_name: "karuppiahbot", count: 200})
.then((result) => {
  console.log(result.length);
  result.forEach((val) => {
    T.post('statuses/destroy', { id: val.id_str })
    .then((result) => {
      console.log("deleted", val.id_str);
    })
    .catch((err) => {
      console.error(err);
    })
  });
})
.catch((err) => {
  console.error(err);
})
