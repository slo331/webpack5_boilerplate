'use strict';

import $ from 'jquery';
import enquire from 'enquire.js';

export default class SiteNav {
  constructor(config) {
    this.config = config;
    let $navWrap = $('.nav');
    let $navLinks = $('.nav-links', $navWrap);
    let $linksWrap = $('.links', $navLinks);
    let $linkItem = $('.links-item', $linksWrap);
    let $itemParent = $('.item-parent', $linkItem);
    let $anchor = $('a', $itemParent);
    let $navMobile = $('.nav-mobile', $navWrap);
    let $navMenu = $('.nav-menu', $navMobile);
    let $mobileMenu = $('.hamburger-menu', $navMenu);
    let $overlay = $('.menu-overlay');

    // Desktop Nav
    enquire.register(`screen and (min-width: ${this.config.breakpoints.desktop}px)`, {
			match: () => {
        $anchor.map((i,el) => {
          let $el = $(el);
          let $parent = $el.parent('.item-parent');
          let $section = $el.data('section');
          
          $el.on('click', (e) => {
            e.preventDefault();

            $('html, body').animate({ 
              scrollTop: $('#' + $section).offset().top - 220
            }, 1000, 'linear');
            
            // setTimeout(() => {
            //   $parent.addClass('active');
            // }, 500);
          });
        });
			}
		});

    // Mobile Nav
    enquire.register(`screen and (max-width: ${this.config.breakpoints.desktop - 1}px)`, {
			match: () => {
        $mobileMenu.on('click', () => {
          if(!$navLinks.hasClass('expanded')) {
            let $showMenu = () => {
              $mobileMenu.addClass('active');
              $navLinks.addClass('expanded');
              $overlay.fadeIn('slow');
              $navLinks.slideDown('slow');
            }
            
            $.when($showMenu())
            .done(() => {
              setTimeout(() => {
                $mobileMenu.addClass('rotate');
							  $navWrap.addClass('expanded');
              }, 500);
            })
            .done(() => {
              $('body').addClass('expanded');
            });
          } else {
            let $closeMenu = () => {
              $('body').removeClass('expanded');
              $mobileMenu.removeClass('rotate');
            }

            $.when($closeMenu())
            .done(() => {
              $navWrap.removeClass('expanded');
            })
            .done(() => {
              setTimeout(() => {
                $mobileMenu.removeClass('active');
                $navLinks.removeClass('expanded');
                $navLinks.slideUp('slow');
              }, 500);
            })
            .done(() => {
              $overlay.removeClass('active').fadeOut('slow');
            });
          }
        });

        $anchor.map((i,el) => {
          let $el = $(el);
          let $parent = $el.parent('.item-parent');
          let $section = $el.data('section');
          
          $el.on('click', (e) => {
            e.preventDefault();

            $mobileMenu.trigger('click');  

            setTimeout(() => {
              $('html,body').animate({ 
                scrollTop: $('#' + $section).offset().top - 160
              }, 2000);
            }, 1200);
          });
        }); 
			}
		});

    // Scrollspy
    $(window).on('scroll', () => {
      let $top = $(window).scrollTop();
      $('section').map((i,el) => {
        let $id = $(el).data('section');
        let $offset = $(el).offset().top - 450;
        let $height = $(el).height();
        if($top >= $offset && $top < $offset + $height) {
          $('.item-parent').removeClass('active');
          $('.item-parent[data-section="' + $id + '"]').addClass('active');
        }
      });
    });
  }
}
