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

  $('#spNavTrigger').on('click', spNavToggle);
  $window.on('load resize', getHeaderHeight);
  $('a[href^="#"]').on('click', smoothScroll);
  $window.on('scroll resize', function () {
    goTopFixedSide();
    goTopFixedLength();
  });
  $window.on('load resize', homeMvHeightFit);
  $window.on('load resize', pageLinkAnchorPos);
  $window.on('resize', navReset);
  $('#spNavToggle').on('click', spNavToggle);
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
   * go top - fix length
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
});