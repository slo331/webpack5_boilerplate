'use strict';

import $ from 'jquery';

export default class Accordion {
  constructor() {
    let $accordion = $('.accordion-list');
    let $accordionWrap = $('.list-wrap', $accordion);
    let $accItem = $('.accordion-item', $accordionWrap)
    let $accLabel = $('.label-title', $accItem);

    $accLabel.map((i,el) => {
      let $el = $(el);
      
      $el.on('click', () => {
        let $parent = $el.parent('.accordion-parent');
        let $accContent = $el.siblings('.content-wrap');

        let $slideUp = () => {
          $accContent.slideUp('slow');
        }

        let $slideDown = () => {
          $accContent.slideDown('slow');
        }
      
        if ($parent.hasClass('is-open')) {
          $.when($slideUp())
          .done(() => {
            $parent.removeClass('is-open');
          });
        } else {
          $.when($slideDown())
          .done(() => {
            $parent.addClass('is-open');
          });
        }
      });
    });
  }
}
