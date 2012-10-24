// Instagram app

$(function() {

 $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: "https://api.instagram.com/v1/users/15547411/media/recent/?access_token=15547411.d223fd6.5e9660085554452aa55db2b42d0d1312",
    success: function(data) {
      var classes = '';
      for (var i = 0; i < 10; i++) {
        classes = (i==0)?'active item':'item';
        $(".instagrams").append("<div class='" + classes + "'><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url +"'></img></a></div>");
      }
    }
  });
 $('.carousel').carousel()
});