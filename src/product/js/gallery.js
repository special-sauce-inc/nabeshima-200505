
$(function() {
  /* --------------------------------------------------
  		フェードアウトするスピードを指定
  -------------------------------------------------- */
  var options = {
    fade: 500 // フェードアウトするスピードを指定
  };

  /* --------------------------------------------------
  		高さ取得
  -------------------------------------------------- */
  var biggestHeight = "0";
  $(".main-photo").each(function() {
    if ($(this).height() > biggestHeight) {
      biggestHeight = $(this).height()
    }
  });
  $(".main-photo").height(biggestHeight);

  /* --------------------------------------------------
  		処理
  -------------------------------------------------- */
  $('.photo').each(function() {
    var thumbList = $('.thumbnail', this).find('a'),
      mainPhoto = $('.main-photo', this),
      img = $('<img />');
    img = img.attr({
      src: $(thumbList[0]).attr('href'),
      alt: $(thumbList[0]).find('img').attr('alt')
    });
    mainPhoto.append(img);
    $('.thumbnail li:first', this).addClass('current');
    for (var i = 0; i < thumbList.length; i++) {
      $('<img />').attr({
        src: $(thumbList[i]).attr('href'),
        alt: $(thumbList[i]).find('img').attr('alt')
      });
    }
    thumbList.on('click', function() {
      var photo = $('<img />').attr({
        src: $(this).attr('href'),
        alt: $(this).find('img').attr('alt')
      });
      mainPhoto.find('img').before(photo);
      mainPhoto.find('img:not(:first)').stop(true, true).fadeOut(options.fade, function() {
        $(this).remove();
      });
      $(this).parent().addClass('current').siblings().removeClass('current');
      return false;
    });

    /* --------------------------------------------------
        高さ && アニメーションセット
    -------------------------------------------------- */
    $(window).on('load resize scroll', function() {
      mainPhoto.height(mainPhoto.find('img').outerHeight());
      //alert('height');
    });
    $(window).one('load resize scroll', function() {
      AOS.init();
      //alert('AOS');
    });
  });
})
