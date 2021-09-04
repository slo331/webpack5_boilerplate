'use strict';

import $ from 'jquery';
import enquire from 'enquire.js';
import 'jquery-match-height';

export default class Listing {
  constructor(config) {
    this.config = config;
    let $list = $('.list');
    
    enquire.register(`screen and (min-width: ${this.config.breakpoints.tablet}px)`, {
			match: () => {
        $list.map((i,el) => {
          let $el = $(el);
          let $wrap = $('.list-wrap', $el);
          let $card = $('.card', $wrap);
          let $cardQuote = $('.card-quote', $card);
          let $cardHeader = $('.card-header', $card);
          let $cardContent = $('.card-content', $card);

          $cardHeader.matchHeight({ byRow: false });

          $cardQuote.matchHeight({ byRow: false });
          $cardContent.matchHeight({ byRow: false });
        });
			}
		});
  }
}
