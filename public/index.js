$(document).ready(function(){

  $('#start').click(function(e){
    e.preventDefault();
    console.log('start');
    const track_word = $('#hashtag').val();
    const inputLines = [];
    inputLines.push($('#tweet1').val());
    inputLines.push($('#tweet2').val());

    console.log(track_word, inputLines);
    const taskData = {
      task: 'start',
      track_word: track_word,
      inputLines: inputLines
    };
    console.log(taskData);
    $.ajax('http://localhost:3000/doTask',{
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(taskData),
      dataType: 'json',
      success: onSuccessStartFunc,
      error: onErrorFunc
    });
  });

  $('#stop').click(function(e){
    e.preventDefault();
    const taskData = {
      task: 'stop'
    };
    console.log(taskData);
    console.log('stop');
    $.ajax('http://localhost:3000/doTask',{
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(taskData),
      dataType: 'json',
      success: onSuccessStopFunc,
      error: onErrorFunc
    });
  });

  function onSuccessStartFunc(response) {
    console.log(response);
    alert('started script!');
  }

  function onSuccessStopFunc(response) {
    console.log(response);
    alert('stopped script!');
  }

  function onErrorFunc(err) {
    console.log(err);
    alert('Some error in sending request to server')
  }

  setTimeout(getTweet, 1000);

  const max_access_err_count = 30;
  const max_database_err_count = 30;
  let access_err_count = 0, database_err_count;

  function getTweet() {
    $.ajax('http://localhost:3000/getTweet',{
      method: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success: onGetTweetSuccessFunc,
      error: onGetTweetErrorFunc
    });
  }

  function onGetTweetSuccessFunc(response) {
    if(response.status === 'success') {

      setTimeout(getTweet, 2000);

      if(!response.doc)
      return;

      const tweet = formTweetSpan(response);

      $('.tweets').prepend(tweet);

    } else if(response.status === 'error') {

      if(database_err_count < max_database_err_count) {
        database_err_count++;
        console.error(response.err);
        setTimeout(getTweet, 2000);
      } else {
        console.error('Maximum database/server errors reached!');
      }

    } else {
      console.error('Invalid response message', response);
    }

  }

  function onGetTweetErrorFunc(err) {
    if(access_err_count < max_access_err_count){
      access_err_count++
      console.error(err);
      setTimeout(getTweet, 2000);
    } else {
      console.error('Maximum access errors reached!');
    }
  }

  function formTweetSpan(response) {
    const {
      screen_name,
      status_id,
      tweet_text,
      retweet_count,
      favorite_count
    } = response.doc;

    return `<span> Tweeted to <a href="https://twitter.com/${screen_name}/status/${status_id}">link</a>.
      Tweet : ${tweet_text}. Retweet count : ${retweet_count}. Favorite : ${favorite_count}. </span> <br> <br>`;
  }
});
