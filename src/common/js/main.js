$(function() {

    fixBrowser();

    $('.toggle_button').click(function(e) {
        e.preventDefault();
        var parent = $(this).closest('.menus');
        var header = $(this).closest('header');
        if (!parent.hasClass('active')) {
            parent.addClass('active');
            header.addClass('open');
            parent.find('ul').fadeIn();
        } else {
            parent.removeClass('active');
            header.removeClass('open');
            parent.find('ul').fadeOut(100);
        }
    });
    var owl = $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      items: 1,
      animateOut: 'fadeOut',
      animateIn: 'custom',
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: false,
      mouseDrag: false,
      touchDrag: false,
    });

})

function menuFixed() {
    if ($(window).scrollTop() > $('header').outerHeight()) {
        $('header').addClass('trans');

    } else {
        $('header').removeClass('trans');
    }
}
menuFixed();
$(window).on('scroll', function () {
  menuFixed();
});

function fixBrowser() {
    var ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i),
        browser;
    if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
        browser = "msie";
    } else {
        browser = ua[1].toLowerCase();
    }
    $('html').addClass(browser);
}
