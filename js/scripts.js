$(function() {
  $('.slider').slick({
    lazyLoad: 'ondemand',
    centerMode: true,
    slidesToShow: 1,
    centerPadding: '300px',
    slidesToScroll: 1,
    appendArrows: $('.arrows-container'),
    // autoplay: true,
    // autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1520,
        settings: {
          centerPadding: '200px',
        }
      },
      {
        breakpoint: 1340,
        settings: {
          centerPadding: '150px',
        }
      },
      {
        breakpoint: 1220,
        settings: {
          centerPadding: '100px',
        }
      },
      {
        breakpoint: 1100,
        settings: {
          centerMode: false,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  $('.slider-dots').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false
  });

  $('.tabgroup > div').hide();
  $('.tabgroup > div:first-of-type').show();
  $('.tabs a').click(function(e){
    e.preventDefault();
      var $this = $(this),
          tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
          others = $this.closest('li').siblings().children('a'),
          target = $this.attr('href');
      others.removeClass('tab-active');
      $this.addClass('tab-active');
      $(tabgroup).children('div').hide();
      $(target).show();
  });
});
