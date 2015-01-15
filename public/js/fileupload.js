$(document).ready(function() {
  $('#selectFile').on('click', function(e) {
    var $uploadInput = $('<input type="file" />');
    $uploadInput
        .css('display', 'none')
        .attr('id', (new Date()).getTime())
        .appendTo($('#fileUploadFrom'));
    $uploadInput.trigger('click');
  });

  $('#fileUploadFrom').on('change', 'input:file', function(e) {
    var $fileItem = $('<li></li>').addClass('file-item').attr('data-proxy', this.id);
    $('<span></span>')
        .text(this.value.replace(/.*\\/g, ''))
        .addClass('file-item-name')
        .appendTo($fileItem);
    $('<span></span>')
        .text('X')
        .addClass('file-item-cancel')
        .appendTo($fileItem);
    $('#uploadFiles').append($fileItem);
    $('#upload').show();
  });

  $('#uploadFiles').on('click', '.file-item-cancel', function(e) {
    var $fileItem = $(this).closest('.file-item');
    var id = $fileItem.attr('data-proxy');
    $fileItem.remove();
    $('#' + id).remove();
    if($('#uploadFiles').find('li').length <= 0) {
      $('#upload').hide();
    }
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
          // For handling the progress of the upload
          myXhr.upload.addEventListener('progress', progressHandlingFunction, false); 
        }
        return myXhr;
      },
      beforeSend: function() {
        $('.upload-info').show();
        $('progress').val(0);
      },
      success: function(xhr) {
        $files.remove();
        var $fileList = $('#fileList');
        $fileList.find('.no-files').remove();
        $('#uploadFiles').find('li').each(function(index, item) {
          var filename = $(item).find('.file-item-name').text();
          $fileList.append($('<li><a href="/files/download?filename=' + filename + '">' + filename + '<a></li>'));
        });
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