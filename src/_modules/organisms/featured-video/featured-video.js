'use strict';

import $ from 'jquery';

export default class FeaturedVideo {
  constructor() {
    let elementTop;
    let elementBottom;
    let viewportTop
    let viewportBottom;
    let featuredVid = $('.featured-video');
    let videoWrap = $('.video-wrap', featuredVid);

    let isScrolledIntoView = (elem) => {
      elementTop = $(elem).offset().top + 300;
      elementBottom = elementTop + $(elem).outerHeight();
      viewportTop = $(window).scrollTop();
      viewportBottom = viewportTop + $(window).height();
      return (elementBottom > viewportTop && elementTop < viewportBottom);
    }
    
    // if(videoWrap.length){
    //   let $count = 0;

    //   videoWrap.map((i,el) => {
    //     let $el = $(el);
    //     let $vid = $el.find('.video-player');

    //     $(window).on('scroll', () => {
    //       if(isScrolledIntoView($el) == true) {     
    //         // Run video 1 time
    //         if($count < 1) {
    //           $vid[0].play();
    //         }
    //       } else {
    //         $vid[0].pause();
    //       }
    //     });

    //     $vid.on('ended', () => {
    //       $count++;
    //     });
    //   });
    // }
  }
}
