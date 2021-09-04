// Main javascript entry point
// Should handle bootstrapping/starting application
'use strict';

import $ from 'jquery';
import 'jquery-match-height';

// Import Modules
import Accordion from '../_modules/atoms/accordion/accordion';
import Stickybar from '../_modules/molecules/stickybar/stickybar';
import SiteNav from '../_modules/molecules/site-nav/site-nav';
import Listing from '../_modules/molecules/listing/listing';
import Map from '../_modules/molecules/map/map';
import SiteHeader from '../_modules/organisms/site-header/site-header';
// import FeaturedVideo from '../_modules/organisms/featured-video/featured-video';

$(() => {
  let config = {
		breakpoints: {
			tablet: 768,
			desktop: 1024,
			lgDesktop: 1280
		}
  };

  let $header = $('header');
  let $nav = $('nav', $header);
  let $listing = $('.list');
  let $accordion = $('.accordion-list');
  let $stickyBar = $('.sticky-bar');
  let $map = $('.map-wrap');
  let $featuredVid = $('.featured-video');
  
  if($nav) {
    new SiteNav(config);
  }

  if($header) {
    new SiteHeader();
  }

  if($listing) {
    new Listing(config);
  }

  if($accordion) {
    new Accordion();
  }

  if($stickyBar) {
    new Stickybar(config);
  }

  if($map) {
    new Map(config);
  }

  // if($featuredVid) {
  //   new FeaturedVideo();
  // }

  let userAgent, ieReg, ie;
  userAgent = window.navigator.userAgent;
  ieReg = /msie|Trident.*rv[ :]*11\./gi;
  ie = ieReg.test(userAgent);

  if (ie) {
    $('.img-wrap').each(function () {
      let $container = $(this),
          imgUrl = $container.find('img').prop('src');
      if (imgUrl) {
        $container.css('backgroundImage', 'url(' + imgUrl + ')').addClass('compact-object-fit');
      }
    });
  }
});

