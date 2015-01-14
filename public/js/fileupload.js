$(document).ready(function() {
  $('#selectFile').on('click', function(e) {
    var $uploadInput = $('<input type="file" />').css('display', 'none');
    $uploadInput.appendTo($('#fileUploadFrom'));
    $uploadInput.trigger('click');
  });

  $('#fileUploadFrom').on('change', 'input:file', function(e) {
    $('#uploadFiles').append($('<li></li>').text(this.value.replace(/.*\\/g, '')));
    $('#upload').show();
  });

  $('#upload').on('click', function(e) {
    var formData = new FormData();
    var $files = $('#fileUploadFrom').find('input:file');
    for(var i = $files.length - 1; i >= 0; i--) {
      formData.append('file' + i, $files[i].files[0]);
    }
    $.ajax({
      url: "/files/upload",
      contentType: false, //(默认: "application/x-www-form-urlencoded") 发送信息至服务器时内容编码类型
      processData:false,  // 必须false才会避开jQuery对 formdata 的默认处理 
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
        $files.remove();
        $('#fileList').append($('#uploadFiles').find('li'));
        $('#uploadFiles').empty();
        $('#upload').hide();
        $('.upload-info').hide();
        $('progress').val(0);

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