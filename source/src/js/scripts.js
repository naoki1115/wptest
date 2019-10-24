"use strict";

var $ = jQuery.noConflict();
$(function () {
  // global
  var PC = 1040;
  var BP = 768;
  var $window = $(window);
  var $header = $('#siteHeader');
  var openCls = 'open',
      showCls = 'show',
      nvaOpenCls = 'nav-open',
      modalCls = 'modal-open'; // common

  $window.on('load resize', getHeaderHeight);
  $('a[href^="#"]').on('click', smoothScroll);
  $window.on('scroll', goTopShow);
  $window.on('scroll resize', function () {
    goTopFixedSide();
    goTopFixedLength();
  });
  $('#spNavList li a').on('click', navClickClose);
  $window.on('load resize', homeMvHeightFit);
  $window.on('load resize', pageLinkAnchorPos);
  $window.on('resize', navReset); // index

  $('.movie-modal-trigger').on('click', movieModalToggle);
  $('.caution-trigger').on('click', cautionToggle);
  $('.show-more-btn').on('click', hideContentToggle);
  $(document).on('click', '#modalClose', movieModalClose);
  $('#spNavToggle').on('click', spNavToggle);
  $window.on('load resize', function () {
    if ($window.width() > BP) {
      $('#planList li dd').matchHeight(); // $('#planExample li .info-container').matchHeight()
    }
  }); // faq

  $('dt.faq-row').on('click', faqShowToggle);
  var mvSwiper = new Swiper('#mvSwiper', {
    autoplay: {
      disableOnInteraction: false
    },
    paginationClickable: true,
    effect: 'fade',
    speed: 2000,
    loop: true
  });
  var stillList = ['同志社高校', '阪南大学', '洛南小学校', '洛南中高', '姫路獨協大学', 'パナソニックソーラー', 'KPS工業', '住江織物', 'ハマヤ', 'SUBARU', '市民しんぶん', '岡本病院', '妙心寺', '明石海峡大橋'];
  var stillSwiper = new Swiper('#worksStill', {
    autoplay: {
      disableOnInteraction: false
    },
    loop: true,
    onSlideChangeEnd: function onSlideChangeEnd(s) {
      s.fixLoop();
    },
    spaceBetween: 20,
    slidesPerView: 2,
    // 総数の半分以上の値を設定しなければいけない
    loopedSlides: 14,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
    resizeReInit: true,
    on: {
      slideChange: function slideChange() {
        var $elem = $('.still-item-name span');

        for (var i = 0; i < stillList.length; i++) {
          if (i === this.realIndex) {
            $elem.text(stillList[i]);
          }
        }
      }
    },
    breakpoints: {
      1039: {
        slidesPerView: 1.5,
        onSlideChangeEnd: function onSlideChangeEnd(s) {
          s.fixLoop();
        }
      },
      768: {
        slidesPerView: 1
      }
    }
  });
  /**
   * common
   * get header height
   *
   * @return {number}
   */

  function getHeaderHeight() {
    return $('#siteHeader').height();
  }
  /**
   * common
   * smoothscroll
   */


  function smoothScroll() {
    var height = getHeaderHeight();
    var speed = 800,
        href = $(this).attr('href'),
        target = $(href === '#' || href === '' ? 'html' : href),
        position = target.offset().top - height + 20;
    $('html, body').animate({
      scrollTop: position
    }, speed, 'swing');
    console.log(height);
    return false;
  }
  /**
   * common
   * page - ancholink
   */


  function pageLinkAnchorPos() {
    if (location.hash !== '') {
      var targetOffset = $(location.hash).offset().top;
      $window.scrollTop(targetOffset - getHeaderHeight());
    }
  }
  /**
   * common
   * sp nav - toggle
   */


  var pos = 0;
  var spNavOpen = false;

  function spNavToggle() {
    if (spNavOpen) {
      $('body').removeClass(openCls);
      $('html').removeAttr('style').removeClass(nvaOpenCls);
      $('html, body').scrollTop(pos);
      spNavOpen = false;
    } else {
      pos = $window.scrollTop();
      $('html').css({
        position: 'fixed',
        top: -pos
      });
      $('body').addClass(openCls);
      $('html').addClass(nvaOpenCls);
      spNavOpen = true;
    }
  }
  /**
   * common
   * sp nav - click and close
   */


  function navClickClose() {
    if ($('html').hasClass(nvaOpenCls)) {
      $('html').removeClass(nvaOpenCls).removeAttr('style');
      $('body').removeClass(openCls);
      $('html, body').scrollTop(scroll);
    }
  }
  /**
   * common
   * sp nav - reset in pc size
   */


  function navReset() {
    var w = $window.width();

    if (w >= PC && $('html').hasClass(nvaOpenCls)) {
      $('html').removeAttr('style');
      $('html, body').scrollTop(pos);
      $('html').removeClass(nvaOpenCls);
      $('body').removeClass(openCls);
    }
  }
  /**
   * common
   * go top - show and hide
   */


  var $topBtn = $('#goTopBtn');
  $topBtn.hide();

  function goTopShow() {
    $window.scrollTop() > 300 ? $topBtn.fadeIn() : $topBtn.fadeOut();
  }
  /**
   * common
   * go top - side fix
   */


  function goTopFixedSide() {
    var maxWidth = 1600;
    var windowWidth = $window.width();

    if (windowWidth >= maxWidth) {
      var contentWidth = windowWidth - maxWidth;
      var btnPositionSide = contentWidth / 2;
      $topBtn.css({
        right: "".concat(btnPositionSide, "px")
      });
    } else {
      $topBtn.css({
        right: 15
      });
    }
  }
  /**
   * common
   * go top - fox length
   */


  function goTopFixedLength() {
    var windowWidth = $window.width();
    var scrollY = $(document).height();
    var scrollP = $window.height() + $(window).scrollTop();
    var footerH = $('.site-footer').innerHeight();

    if (scrollY - scrollP <= footerH) {
      if ($window.width() > BP) {
        $topBtn.css({
          position: 'absolute',
          bottom: footerH - 30
        });
      } else {
        $topBtn.css({
          position: 'absolute',
          bottom: footerH - 27
        });
      }
    } else if (scrollY - scrollP > footerH) {
      $topBtn.css({
        position: 'fixed',
        bottom: 15
      });
    }
  }
  /**
   * index
   * mv height 100% fit
   */


  function homeMvHeightFit() {
    var h = $window.height();
    var hh = $header.height();
    var mvH = h - hh;

    if ($('#mvSwiper').length) {
      $('#mvSwiper').css('height', mvH);
    }
  }
  /**
   * index
   * movie modal
   */


  var scroll = 0,
      modalOpen = false;

  function movieModalToggle() {
    var index = $(this).index();

    if (modalOpen) {
      $('html').removeClass(modalCls).removeAttr('style');
      $('html, body').scrollTop(scroll);
    } else {
      scroll = $window.scrollTop();
      $('html').css({
        position: 'fixed',
        top: -scroll
      });
      $('html').addClass(modalCls);
      $('#movieModalList .modal-container').eq(index).fadeIn();
    }
  }
  /**
   * index
   * movie modal close
   */


  function movieModalClose() {
    $('html').removeClass(modalCls).removeAttr('style');
    $('html, body').scrollTop(scroll);

    if ($('#movieModalList .modal-container').css('display', 'block')) {
      $('#movieModalList .modal-container').hide();
    }
  }
  /**
   * index
   * caution-toggle
   */


  function cautionToggle() {
    $(this).parent('li').toggleClass(openCls);
  }
  /**
   * index
   * hidecontent-toggle
   */


  function hideContentToggle() {
    $(this).closest('.c-btn-container').toggleClass(openCls).siblings('.hide-content').toggle();
  }
  /**
   * faq
   * answer show
   */


  function faqShowToggle() {
    $(this).closest('li').toggleClass('show');
  }
  /**
   * contact
   * custom-validate
   */


  $('#contactForm').validate({
    rules: {
      name: {
        required: true
      },
      company: {
        required: true
      },
      tel: {
        required: true,
        number: true
      },
      email: {
        required: true,
        email: true
      },
      date: {
        required: true
      },
      location: {
        required: true
      },
      checkPrivacy: {
        required: true
      }
    },
    messages: {
      name: {
        required: '必須項目をご入力してください。'
      },
      company: {
        required: '必須項目をご入力してください。'
      },
      tel: {
        required: '必須項目をご入力してください。',
        number: '電話番号の入力に間違いがあります。'
      },
      email: {
        required: '必須項目をご入力してください。',
        email: 'メールアドレスの入力に間違いがあります。'
      },
      date: {
        required: '必須項目をご入力してください。'
      },
      location: {
        required: '必須項目をご入力してください。'
      },
      checkPrivacy: {
        required: '個人情報の取扱をご確認ください。'
      }
    },
    errorPlacement: function errorPlacement(error, element) {
      if (element.attr('name') == 'name') {
        error.insertAfter('#name').siblings('.validate-message');
      } else if (element.attr('name') == 'email') {
        error.insertAfter('#email').siblings('.validate-message');
      } else if (element.attr('name') == 'company') {
        error.insertAfter('#company').siblings('.validate-message');
      } else if (element.attr('name') == 'tel') {
        error.insertAfter('#tel').siblings('.validate-message');
      } else if (element.attr('name') == 'email') {
        error.insertAfter('#email').siblings('.validate-message');
      } else if (element.attr('name') == 'date') {
        error.insertAfter('#date').siblings('.validate-message');
      } else if (element.attr('name') == 'location') {
        error.insertAfter('#location').siblings('.validate-message');
      } else if (element.attr('name') == 'checkPrivacy') {
        error.insertAfter('#checkPrivacy');
      } else {
        error.insertAfter('element').siblings('.validate-message');
      }
    }
  });
});