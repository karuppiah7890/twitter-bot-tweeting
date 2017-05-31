const Twit = require('twit');
//const db = require('./db'); //Have to get details from database later and require database
const randomApiKeys = require('./randomApiKeys');

const master_api_key = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token : process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const T = new Twit(master_api_key);

let publicStream;
let state = null;

const post = require('./post');

module.exports = {

  startNewTracking: function(track_word, inputLines) {
    state = 'running';

    console.log("Starting new tracking");

    publicStream = T.stream('statuses/filter', {track: track_word, language: 'en'});

    publicStream.on('tweet', function(event) {
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
        return;
      }

      if(screen_name === 'karuppiahbot') {
        return;
      }

      const text_to_tweet = inputLines[0];

      post(master_api_key, screen_name, text_to_tweet, status_id)
      .then((result) => {
        //console.log(result);
        const next_text_to_tweet = inputLines[1];
        return post(master_api_key, screen_name, next_text_to_tweet, result.id_str);
      })
      .then((result) => {
        //console.log(result);
        console.log(`Tweeted to https://twitter.com/${screen_name}/status/${status_id}.
          Tweet : ${tweet_text}. Retweet count : ${retweet_count}. Favorite : ${favorite_count}.`);

      })
      .catch((err) => {
        console.error(err);
      })

    });

    publicStream.on('error', function(error) {
      throw error;
    });

  },
  stopTracking: function() {
    publicStream.stop();
    state = 'stopped';
  },
  resumeTracking: function() {
    publicStream.start();
    state = 'running';
  },
  getState: function() {
    return state;
  }
};
