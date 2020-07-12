// For chance to instead use on CDN with `integrity`, filed
//   https://github.com/gdsmith/jquery.easing/issues/37
// For transparent versioning, filed https://github.com/gdsmith/jquery.easing/issues/38
// ESM support also suggested (which could avoid need for rollup
//  commonjs plugin dependency): https://github.com/gdsmith/jquery.easing/issues/30#issuecomment-657170572
/* globals $ */
// import 'jquery.easing';
import '../../node_modules/jquery.easing/jquery.easing.js';

export default function jqueryEasing () {
  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, 'easeInOutExpo');
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

  return $;
}
