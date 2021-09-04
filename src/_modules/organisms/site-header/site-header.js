'use strict';

import Headroom from "headroom.js";

export default class SiteHeader {
  constructor() {
    var myElement = document.querySelector('.site-header');
    var headroom  = new Headroom(myElement);
    headroom.init();

    let $header = $('.site-header');
    let $logoLink = $('.logo-link', $header);

    $logoLink.on('click', e => {
      e.preventDefault();
      $('html, body').animate({scrollTop: '0px'}, 1200);
    });
  }
}
