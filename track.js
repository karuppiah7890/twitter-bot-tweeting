const Twitter = require('twitter');

const T = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key : process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const publicStream = T.stream('statuses/filter', {track: 'javascript', language: 'en'});

publicStream.on('data', function(event) {

  //console.log(event);

  const is_retweeted = event.retweeted_status ? true : false;

  let screen_name, status_id, tweet_text, retweet_count, favorite_count;

  if(is_retweeted) {
    screen_name = event.retweeted_status.user.screen_name,
    status_id = event.retweeted_status.id_str,
    tweet_text = event.retweeted_status.text,
    { retweet_count, favorite_count } = event.retweeted_status;

  } else {
    screen_name = event.user.screen_name,
    status_id = event.id_str,
    tweet_text = event.text,
    { retweet_count, favorite_count } = event;
  }

  if(screen_name === 'karuppiahbot') {
    return;
  }

  console.log('Tweet URL', `https://twitter.com/${screen_name}/status/${status_id}`,
   '. Tweet : ', tweet_text,
   '. RT : ', retweet_count,
   '. Favorite : ', favorite_count);


  T.post('statuses/update', { status: `@${screen_name} JavaScript is cool!!! :D` , in_reply_to_status_id: status_id })
  .then((result) => {
    console.log("Tweeted!");
    //console.log(result.data);
  })
  .catch((err) => {
    console.error(err);
  });

});

publicStream.on('error', function(error) {
  throw error;
});
