'use strict';

import enquire from 'enquire.js';
import Headroom from "headroom.js";

export default class Stickybar {
  constructor(config) {
    this.config = config;
    var myElement = document.querySelector('.sticky-bar');
    var headroom  = new Headroom(myElement);

    enquire.register(`screen and (max-width: ${this.config.breakpoints.desktop - 1}px)`, {
			match: () => {
        headroom.init();
			}
		});
  }
}
