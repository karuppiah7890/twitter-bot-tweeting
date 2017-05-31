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
      success: onSuccessFunc,
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
      success: onSuccessFunc,
      error: onErrorFunc
    });
  });

  function onSuccessFunc(response) {
    console.log(response);
    alert('started script!');
  }

  function onErrorFunc(err) {
    console.log(err);
    alert('Some error in sending request to server')
  }
});
