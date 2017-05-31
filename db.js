const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// remove any slashes and particular databases in above line before committing to git

const connection = mongoose.connection;

connection.on('error', function(err) {
  console.error(err);
});

connection.once('open', function() {
  console.log('Connected to MongoDB!');
})

const tweetSchema = mongoose.Schema({
  screen_name: String,
  status_id: String,
  tweet_text: String,
  retweet_count: Number,
  favorite_count: Number
});

const Tweet = mongoose.model('Tweet', tweetSchema);

const ApiKeySchema = mongoose.Schema({
  screen_name: String,
  api_key: mongoose.Schema.Types.Mixed
})

const ApiKey = mongoose.model('ApiKey', ApiKeySchema);
