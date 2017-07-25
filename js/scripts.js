$(function() {
  var iframe = document.getElementById('welcomeVideo');
  var player = $f(iframe);
  $('.playFilm').on("click", function(ev) {
    $('#videoModal').addClass('db');
    $('#welcomeVideo')[0].src += "&autoplay=1";
    ev.preventDefault();
  })
  $('.close-modal').on("click", function() {
    $('#videoModal').removeClass('db');
    player.api("pause");
  })
});
