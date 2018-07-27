/*!
 *	Template Functions
*/

(function($){

	"use strict";

	/* ---------------------------------------------- /*
	 * Preloader
	/* ---------------------------------------------- */

	$(window).on('load', function() {

		$('.page-loader').delay(350).fadeOut('slow');

		/* ---------------------------------------------- /*
		 * WOW Animation on page load
		/* ---------------------------------------------- */

		var wow = new WOW({
			mobile: false
		});

		wow.init();

	});

	$(document).ready(function() {

		/* ---------------------------------------------- /*
		 * Mobile detect
		/* ---------------------------------------------- */

		var mobileTest;

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			mobileTest = true;
		} else {
			mobileTest = false;
		}

		/* ---------------------------------------------- /*
		 * Header animation
		/* ---------------------------------------------- */

		var header = $('.header');

		$(window).scroll(function() {
			var scroll = $(window).scrollTop();
			if (scroll >= 5) {
				header.addClass('header-small');
				header.addClass('header-shadow');
			} else {
				header.removeClass('header-small');
				header.removeClass('header-shadow');
			}
			if ( ( $('.module-header').length <= 0 ) && ( $('.module-slides').length <= 0 ) ) {
				header.addClass('header-small');
			};
		}).scroll();

		/* ---------------------------------------------- /*
		 * Light/dark header
		/* ---------------------------------------------- */

		var module_header = $('.module-header');

		if ( module_header.length >= 0 ) {
			if ( module_header.hasClass('bg-dark') ) {
				header.addClass('header-light');
			} else {
				header.removeClass('header-light');
			}
		}

		/* ---------------------------------------------- /*
		 * Sticky footer
		/* ---------------------------------------------- */

		function footerAlign() {
			var footerHeight = $('.footer').outerHeight();
			$('.wrapper').css('padding-bottom', footerHeight);
			$('.footer').css('height', footerHeight);
		}

		$(document).ready(function() {
			footerAlign();
		});

		$( window ).resize(function() {
			footerAlign();
		});

		/* ---------------------------------------------- /*
		 * Collapse navbar on click
		/* ---------------------------------------------- */

		$(document).on('click', '.inner-navigation.show', function(e) {
			if ( $(e.target).is('span')  && !$(e.target).parent().parent().hasClass('menu-item-has-children') ) {
				$(this).collapse('hide');
			}
		});

		/* ---------------------------------------------- /*
		 * One Page Nav
		/* ---------------------------------------------- */

		$('.onepage-nav a').filter(function() {
			if ($(this).is(':not([href^="#"])')) {
				$(this).addClass('external');
			}
		});

		$('.onepage-nav').singlePageNav({
			filter: ':not(.external)',
			currentClass: 'active',
			offset: '58',
		});

		/* ---------------------------------------------- /*
		 * Intro slider setup
		/* ---------------------------------------------- */

		$('.module-slides').superslides({
			play: 10000,
			animation: 'fade',
			animation_speed: 800,
			pagination: true,
		});

		$(document).on('animated.slides', function() {
			var currentSlide = $('.module-slides').superslides('current');
			var $this = $('.slides-container li').eq(currentSlide);
			$('.slides-container li').removeClass('active-slide');
			$this.addClass('active-slide');
			if ( $('.slides-container li.bg-dark').hasClass('active-slide') ) {
				header.addClass('header-light');
				$('.module-slides').removeClass('dark-nav')
			} else {
				header.removeClass('header-light');
				$('.module-slides').addClass('dark-nav')
			}
		});

		/* ---------------------------------------------- /*
		 * Rotate & Typed
		/* ---------------------------------------------- */

		$(".rotate").textrotator({
			animation: "dissolve",
			separator: "|",
			speed: 3000
		});

		if ( $("#typed-strings").length > 0 ) {
			var typed = new Typed('#typed', {
				stringsElement: '#typed-strings',
				typeSpeed: 50,
				backSpeed: 50,
				loop: true
			});
		}

		/* ---------------------------------------------- /*
		 * Setting background of modules
		/* ---------------------------------------------- */

		$('[data-background]').each(function() {
			$(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
		});

		$('[data-background-color]').each(function() {
			$(this).css('background-color', $(this).attr('data-background-color') );
		});

		$('[data-color]').each(function() {
			$(this).css('color', $(this).attr('data-color') );
		});

		/* ---------------------------------------------- /*
		 * Parallax
		/* ---------------------------------------------- */

		$('.parallax').jarallax({
			speed: 0.6
		});

		/* ---------------------------------------------- /*
		 * Portfolio masonry
		/* ---------------------------------------------- */

		var filters   = $('#filters'),
			worksgrid = $('.row-portfolio');

		$('a', filters).on('click', function() {
			var selector = $(this).attr('data-filter');
			$('.current', filters).removeClass('current');
			$(this).addClass('current');
			setTimeout(function() {
				worksgrid.isotope({
					filter: selector
				});
			}, 300);
			$('.portfolio-item', worksgrid).css({
					"will-change": "",
					"transform": "",
					"opacity": "",
				});
			return false;
		});

		const tilt = $('.js-tilt').tilt();

		tilt.tilt({
			maxTilt: 2
		});

		$('.js-tilt.large').tilt({
			maxTilt: 1.4
		});

		$(window).on('resize', function() {
			setTimeout(function() {
				worksgrid.imagesLoaded(function() {
					worksgrid.isotope({
						layoutMode: 'masonry',
						itemSelector: '.portfolio-item',
						transitionDuration: '0.2s',
						masonry: {
							columnWidth: '.grid-sizer',
						},
					});
				});
			}, 300);
			$('.portfolio-item', worksgrid).css({
				"will-change": "",
				"transform": "",
				"opacity": "",
			});
		}).resize();

		/* ---------------------------------------------- /*
		 * Blog masonry
		/* ---------------------------------------------- */

		$(window).on('resize', function() {
			setTimeout(function() {
				$('.blog-masonry').isotope({
					layoutMode: 'masonry',
					transitionDuration: '0.8s',
				});
			}, 1000);
		}).resize();

		/* ---------------------------------------------- /*
		 * Slides
		/* ---------------------------------------------- */

		$('.clients-carousel').each(function () {
			$(this).owlCarousel($.extend({
				nav:      false,
				dots:     false,
				autoplay: 3000,
				loop:     true,
				items:    2,
				responsive: {
					768: {
						items: 4
					}
				},
				navText: [
					'<span class="ion-android-arrow-back"></span>',
					'<span class="ion-android-arrow-forward"></span>'
				],
			}, $(this).data('carousel-options')));
		});

		$('.tms-carousel').each(function () {
			$(this).owlCarousel($.extend({
				nav:        false,
				pagination: true,
				autoplay:   3000,
				items:      3,
				center:     true,
				loop:       true,
				margin:     0,
				responsive: {
					768: {
						items: 3
					}
				},
				navText: [
					'<span class="ion-android-arrow-back"></span>',
					'<span class="ion-android-arrow-forward"></span>'
				],
			}, $(this).data('carousel-options')));
		});

		$('.tms-slides').each(function () {
			$(this).owlCarousel($.extend({
				autoplay:        5000,
				items:      1,
				navText: [
					'<span class="ion-android-arrow-back"></span>',
					'<span class="ion-android-arrow-forward"></span>'
				],
			}, $(this).data('carousel-options')));
		});

		$('.image-slider').each(function () {
			$(this).owlCarousel($.extend({
				dots:     true,
				nav:      true,
				center:   true,
				items:    1,
				loop:     true,
				autoHeight:true,
				margin:   0,
				navText: [
					'<span class="ti-angle-left"></span>',
					'<span class="ti-angle-right"></span>'
				],
			}, $(this).data('carousel-options')));
		});

		/* ---------------------------------------------- /*
		 * Progress bars, counters, pie charts animations
		/* ---------------------------------------------- */

		$('.progress-bar').each(function() {
			$(this).appear(function() {
				var percent = $(this).attr('aria-valuenow');
				$(this).animate({'width' : percent + '%'});
				$(this).find('.pb-number-box').animate({'opacity' : 1}, 1000);
				$(this).find('.pb-number').countTo({
					from: 0,
					to: percent,
					speed: 900,
					refreshInterval: 30
				});
			});
		});

		$('.counter-timer').each(function() {
			$(this).appear(function() {
				var number = $(this).attr('data-to');
				$(this).countTo({
					from: 0,
					to: number,
					speed: 1500,
					refreshInterval: 10,
					formatter: function (number, options) {
						number = number.toFixed(options.decimals);
						number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						return number;
					}
				});
			});
		});

		$('.chart').each(function() {
			$(this).appear(function() {
				$(this).easyPieChart($.extend({
					barColor:   '#313131',
					trackColor: '#eee',
					scaleColor: false,
					lineCap:    'round',
					lineWidth:  3,
					size:       150,
				}, $(this).data('chart-options')));
			});
		});

		/* ---------------------------------------------- /*
		 * Twitter
		/* ---------------------------------------------- */

		$('.twitter-feed').each(function (index) {
			$(this).attr('id', 'twitter-' + index);
			var twitterID      = $(this).data('twitter');
			var twitterMax     = $(this).data('number');
			var twitter_config = {
				'id':             twitterID,
				'domId':          'twitter-' + index,
				'maxTweets':      twitterMax,
				'enableLinks':    true,
				'showPermalinks': false
			};
			twitterFetcher.fetch(twitter_config);
		});

		/* ---------------------------------------------- /*
		 * Lightbox, Gallery
		/* ---------------------------------------------- */

		$('.gallery [rel=gallery]').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1]
			},
			image: {
				titleSrc: 'title',
				tError: 'The image could not be loaded.',
			},
			callbacks: {

				open: function() {
					//$('body').addClass('noscroll');
					$('html').css('margin-right', '0');
				},

				close: function() {
					//$('body').removeClass('noscroll');
					$('html').css('margin-right', 0);
				}
			}
		});

		$('.portfolio-item .photo').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1]
			},
			image: {
				titleSrc: 'title',
				tError: 'The image could not be loaded.',
			},
			callbacks: {
				open: function() {
					$('html').css('overflow-y', 'hidden');
					$('html').addClass('modal-w');
				},
				close: function() {
					$('html').css('overflow-y', '');
					$('html').removeClass('modal-w');
				}
			}
		});

		/* ---------------------------------------------- /*
		 * Tooltips
		/* ---------------------------------------------- */

		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		});

		/* ---------------------------------------------- /*
		 * A jQuery plugin for fluid width video embeds
		/* ---------------------------------------------- */

		$('body').fitVids();

		/* ---------------------------------------------- /*
		 * Google Map
		/* ---------------------------------------------- */

		$('.map').each(function() {

			var reg_exp = /\[[^(\]\[)]*\]/g;

			var map_div        = $(this);
			var is_draggable   = Math.max($(window).width(), window.innerWidth) > 736 ? true : false;
			var is_street_view = ( map_div.data('street-view') ) ? true : false;

			if (map_div.length > 0) {

				var markers_addresses = map_div[0].getAttribute('data-addresses').match(reg_exp),
					markers_info      = map_div[0].getAttribute('data-info').match(reg_exp),
					markers_icon      = map_div.data('icon'),
					map_zoom          = map_div.data('zoom');

				var	markers_values = [], map_center;

				markers_addresses.forEach( function(marker_address, index) {
					var marker_value = '{'
					marker_value    += '"latLng":' + marker_address;
					if (index == 0) {
						map_center = JSON.parse(marker_address);
					};
					if (markers_info[index]) {
						var marker_data = markers_info[index].replace(/\[|\]/g, '');
						marker_value   += ', "data":"' + marker_data + '"';
					};
					marker_value += '}';
					markers_values.push(JSON.parse(marker_value));
				});

				var map_options = {
					scrollwheel: false,
					styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
				};

				map_options.center    = map_center;
				map_options.zoom      = map_zoom;
				map_options.draggable = is_draggable;

				var markers_options = {
					icon: markers_icon,
				};

				var map_config = {
					map: {
						options: map_options,
					},
					streetviewpanorama: {
						options: {
							container: $(this),
							opts: {
								visible:  is_street_view,
								position: map_center,
								enableCloseButton: true,
								scrollwheel: false,
							}
						}
					},
					marker: {
						values:  markers_values,
						options: markers_options,
						events: {
							click: function(marker, event, context) {
								if (context.data) {
									var map        = $(this).gmap3("get"),
										infowindow = $(this).gmap3({get:{name:"infowindow"}});
									if (infowindow) {
										infowindow.open(map, marker);
										infowindow.setContent(context.data);
									} else {
										$(this).gmap3({
											infowindow:{
												anchor:marker,
												options:{content: context.data}
											}
										});
									}
								}
							}
						}
					}
				};

				map_div.gmap3(map_config);
			};
		});

		/* ---------------------------------------------- /*
		 * Scroll Animation
		/* ---------------------------------------------- */

		$('.smoothscroll').on('click', function(e) {
			var target  = this.hash;
			var $target = $(target);
			$('html, body').stop().animate({
				'scrollTop': $target.offset().top - 58
			}, 600, 'swing');
			e.preventDefault();
		});

		/* ---------------------------------------------- /*
		 * Scroll top
		/* ---------------------------------------------- */

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-top').addClass('scroll-top-visible');
			} else {
				$('.scroll-top').removeClass('scroll-top-visible');
			}
		});

		$('a[href="#top"]').on('click', function() {
			$('html, body').animate({ scrollTop: 0 }, 'slow');
			return false;
		});

		/* ---------------------------------------------- /*
		 * Disable hover on scroll
		/* ---------------------------------------------- */

		var body = document.body,
			timer;
		window.addEventListener('scroll', function() {
			clearTimeout(timer);
			if (!body.classList.contains('disable-hover')) {
				body.classList.add('disable-hover')
			}
			timer = setTimeout(function() {
				body.classList.remove('disable-hover')
			}, 100);
		}, false);

	});

})(jQuery);
