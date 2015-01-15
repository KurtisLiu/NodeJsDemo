$(document).ready(function() {
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');
  bindEvents();

  function draw(type, isFill, rect, imageData) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(imageData) {
      ctx.putImageData(imageData, 0, 0);
    }
    if(type === 'line') {
      ctx.beginPath();
      ctx.moveTo(rect.sx, rect.sy);
      ctx.lineTo(rect.ex, rect.ey);
      ctx.stroke();
    } else if (type === 'rect') {
      if(isFill) {
        ctx.fillRect(Math.min(rect.sx, rect.ex), Math.min(rect.sy, rect.ey), 
          Math.abs(rect.sx - rect.ex), Math.abs(rect.sy - rect.ey));
      } else {
        ctx.strokeRect(Math.min(rect.sx, rect.ex), Math.min(rect.sy, rect.ey), 
          Math.abs(rect.sx - rect.ex), Math.abs(rect.sy - rect.ey));
      }
    } else if (type === 'circle') {
      var a = (rect.ex - rect.sx)/2;
      var b = (rect.ey - rect.sy)/2;
      drawEllipse(rect.sx + a, rect.sy + b, a, b);
      if(isFill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }

  /*
  x, y: 椭圆中心
  a, b: 椭圆长半轴和短半轴
  */
  function drawEllipse(x, y, a, b) {
    //max是等于1除以长轴值a和b中的较大者
    //i每次循环增加1/max，表示度数的增加
    //这样可以使得每次循环所绘制的路径（弧线）接近1像素
    var step = (a > b) ? 1 / a : 1 / b;
    ctx.beginPath();
    ctx.moveTo(x + a, y); //从椭圆的左端点开始绘制
    for (var i = 0; i < 2 * Math.PI; i += step) {
      //参数方程为x = a * cos(i), y = b * sin(i)，
      //参数为i，表示度数（弧度）
      ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
    }
    ctx.closePath();
  };

  function exportCanvas() {
    var imageData = canvas.toDataURL('image/png');
    imageData = imageData.replace(/^data:image\/png;base64,/, '');
    var data = {
      imageData: imageData
    };
    var $tempForm = $('<form method="POST"></form>').attr('action', '/files/export');
    for(var key in data) {
      $('<input type="hidden">').attr('name', key).val(data[key]).appendTo($tempForm);
    }
    $tempForm.submit();
  }

  function bindEvents() {
    bindColorChangeEvent();
    bindDrawEvent();
    bindExportEvent();
  }

  function bindColorChangeEvent() {
    $('#colorList').on('click', '.color', function(e) {
      var color = $(this).css('background-color');
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      $('#colorList').find('.active-color').removeClass('active-color')
      $(this).addClass('active-color');
    });
  }

  function bindDrawEvent() {
    var type = 'line',
        isFill = false,
        startX = 0,
        startY = 0,
        imageData = null;

    var mousemoveHandler = function(e) {
      var rect = canvas.getBoundingClientRect();
      var xPos = e.clientX - rect.left;
      var yPos = e.clientY - rect.top;
      var drawRect = {
        sx: startX,
        sy: startY,
        ex: xPos,
        ey: yPos
      };
      draw(type, isFill, drawRect, imageData);
    };
    var mouseupHandler = function(e) {
      mousemoveHandler(e);
      $('body').off('mousemove.draw');
      $('body').off('mouseup.draw');
    };

    $('.actions').on('click', '.draw', function(e) {
      var $target = $(this);
      $('.actions').find('.active-btn').removeClass('active-btn');
      $target.addClass('active-btn');
      if($target.hasClass('line')) {
        type = 'line';
      } else if ($target.hasClass('stroke-rect')) {
        type = 'rect';
        isFill = false;
      } else if ($target.hasClass('fill-rect')) {
        type = 'rect';
        isFill = true;
      } else if ($target.hasClass('stroke-circle')) {
        type = 'circle';
        isFill = false;
      } else if ($target.hasClass('fill-circle')) {
        type = 'circle';
        isFill = true;
      }
    });

    $(canvas).on('mousedown', function(e) {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      $('#position').text('(' + startX + ', ' + startY + ')');
      $('body').on('mousemove.draw', mousemoveHandler);
      $('body').on('mouseup.draw', mouseupHandler);
    });
  }

  function bindExportEvent() {
    $('#export').on('click', function(e) {
      exportCanvas();
    })
  }

});