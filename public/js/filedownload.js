$(document).ready(function() {
  $('.download').on('click', function(e) {
    var id = this.dataset.id;
    location.href = '/files/' + id;
  });
});