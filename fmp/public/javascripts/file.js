$(document).ready(function() {

  $('#showUpload').on('click', function(e) {
    $('.upload-box').show(300);
  });

  $('#upload').on('click', function(e) {
    var formData = new FormData();
    formData.append('file', $('#file').prop('files')[0]);
    formData.append('owner', $('#owner').val());
    $.ajax({
      url: "/files/upload",
      cache: false, //设置为 false 将不会从浏览器缓存中加载请求信息
      contentType: false, //(默认: "application/x-www-form-urlencoded") 发送信息至服务器时内容编码类型
      processData: false, //默认情况下，发送的数据将被转换为对象(技术上讲并非字符串) 以配合默认内容类型 "application/x-www-form-urlencoded"。如果要发送 DOM 树信息或其它不希望转换的信息，请设置为 false。
      data: formData,
      type: 'post',
      xhr: function() {
        var myXhr = $.ajaxSettings.xhr();
        if(myXhr.upload){ // Check if upload property exists
        myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
        }
        return myXhr;
      },
      beforeSend: function() {
        $('.upload-info').show();
        $('progress').val(0);
      },
      success: function(xhr) {
        console.log(xhr);
      },
      error: function(err) {
        console.log('error');
      }
    })
  });

  $('#goFileList').on('click', function(e) {
    window.location.href = '/files/list';
  });

  

  var $progressValue = $('.progress-value');
  var $progressBar = $('progress');
  function progressHandlingFunction(e) {
    if(e.lengthComputable){
      console.log('value = ' + e.loaded + ', total = ' + e.total);
      var value = Math.floor(e.loaded/e.total * 100);
      $progressBar.val(value)
      $progressValue.text(value + '%');
    }
  };

});