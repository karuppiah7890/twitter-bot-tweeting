const Twit = require('twit');
const db = require('./db');
const mongoose = require('mongoose');
const Tweet = mongoose.model('Tweet');

const master_api_key = {
  consumer_key: process.env.ADAM_CONSUMER_KEY,
  consumer_secret: process.env.ADAM_CONSUMER_SECRET,
  access_token : process.env.ADAM_ACCESS_TOKEN,
  access_token_secret: process.env.ADAM_ACCESS_TOKEN_SECRET
};

const beck_api_key = {
  consumer_key: process.env.BECK_CONSUMER_KEY,
  consumer_secret: process.env.BECK_CONSUMER_SECRET,
  access_token : process.env.BECK_ACCESS_TOKEN,
  access_token_secret: process.env.BECK_ACCESS_TOKEN_SECRET
};

const cathy_api_key = {
  consumer_key: process.env.CATHY_CONSUMER_KEY,
  consumer_secret: process.env.CATHY_CONSUMER_SECRET,
  access_token : process.env.CATHY_ACCESS_TOKEN,
  access_token_secret: process.env.CATHY_ACCESS_TOKEN_SECRET
};

const T = new Twit(master_api_key);

let publicStream;
let state = null;

const post = require('./post');

module.exports = {

  startNewTracking: function(track_word, inputLines) {
    state = 'running';

    console.log("\n\n\n\nStarting new tracking");

    publicStream = T.stream('statuses/filter', {track: track_word, language: 'en'});

    publicStream.on('tweet', function(event) {
      //console.log(event);

      const is_retweeted = event.retweeted_status ? true : false;

      let screen_name, status_id, tweet_text, retweet_count, favorite_count, full_detail;

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

      // don't reply to bot's old replies
      if(screen_name === 'cathyiscool' || screen_name === 'beckbiscool') {
        return;
      }

      const text_to_tweet = inputLines[0];

      let screen_names_list = [];
      screen_names_list.push(screen_name);

      post(beck_api_key, screen_names_list, text_to_tweet, status_id)
      .then((result) => {
        console.log(result);
        const next_text_to_tweet = inputLines[1];
        screen_names_list = [];
        screen_names_list.push(screen_name);
        screen_names_list.push(result.user.screen_name);
        return post(cathy_api_key, screen_names_list, next_text_to_tweet, result.id_str);
      })
      .then((result) => {
        console.log(result);
        console.log(`\n\n\nTweeted to https://twitter.com/${screen_name}/status/${status_id}.
          Tweet : ${tweet_text}. Retweet count : ${retweet_count}. Favorite : ${favorite_count}.`);

        Tweet.create({
          screen_name: screen_name,
          status_id: status_id,
          tweet_text: tweet_text,
          retweet_count: retweet_count,
          favorite_count: favorite_count
        }).then((result) => {
          //console.log(result);
        }).catch((err) => {
          console.error(err);
        });

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
    console.log("\n\n\n\nStopping tracking");

    publicStream.stop();
    state = 'stopped';
  },
  resumeTracking: function() {
    console.log("\n\n\n\nResuming tracking");

    publicStream.start();
    state = 'running';
  },
  getState: function() {
    return state;
  }
};
