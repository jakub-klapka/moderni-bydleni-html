/* global jQuery, Modernizr */
(function($){

	/*
	LOAD POLYFILLS
	 */
	if( Modernizr.placeholder === false ) {
		$.getScript( window.template_url + 'js/polyfill_placeholder.min.js' );
	}

	/*
	SUBMENU HANDLING
	 */
	var last_z_index = 100; //on each hover, will add higher z-index to UL, because of hover on UL after hover on another parent li inbetween animations (sorry :) )
	var Submenu = {

		init: function( parent_li ) {

			this.parent_li = parent_li;
			this.transition_duration = 300; //have to corespond with css value
			this.ul = this.parent_li.children( 'ul' );
			this.is_hovered = false;

			this.bindEvents();
		},

		bindEvents: function() {

			var self = this;
			//on parent li hover
			this.parent_li.hover( $.proxy( self.hoverIn, self ), $.proxy( self.hoverOut, self ) );

			//on load, center submenu items below parents
			$(window).load( function(){
				setTimeout( function() {
					self.handleSubmenuCentering();
				}, 100 ); //thanks IE11 for this whatsoever
			} );

		},

		hoverIn: function() {
			this.is_hovered = true;
			this.ul.removeClass('closing').addClass('open').addClass('opening');
			this.ul.css('z-index', ++last_z_index);
			this.ul.attr('aria-hidden', 'false');
		},

		hoverOut: function() {
			this.is_hovered = false;
			this.ul.removeClass('opening').addClass('closing');
			var self = this;
			setTimeout( function() {

				//will be executed after transition out animation is complete
				if( self.is_hovered === false ) { //we are checking, if we are no longer hovering, and also if we didnt hover other LI in meantime
					self.ul.removeClass( 'open' );
				}

			}, this.transition_duration );
			this.ul.attr('aria-hidden', 'true');
		},

		handleSubmenuCentering: function() {

			//make submenu visible first
			this.ul.css({
				'visibility': 'hidden',
				'display': 'block'
			});

			//apply padding
			var padding_to_apply = this.submenuCenteringCalculations();
			if( padding_to_apply !== false ) {
				//finally apply padding
				this.ul.css('padding-left', padding_to_apply);
			}

			//hide it again
			this.ul.css({
				'visibility': '',
				'display': ''
			});

		},

		submenuCenteringCalculations: function() {

			//variables setup
			var ul_width = this.ul.width(),
				elements = this.ul.children('li'),
				elements_width = 0;
			elements.each(function(){
				elements_width += $(this).outerWidth(true);
			});
			var parent_li_outer_width = this.parent_li.outerWidth(true),
				parent_li_center_from_left = ( this.parent_li.position().left + ( parent_li_outer_width / 2 ) );

			//what id shloud be padded from left
			var padding_from_left = parent_li_center_from_left - ( elements_width / 2 );

			if( padding_from_left < 0 ) {
				return false; //on negative -> let the elements be on left side
			}

			var max_allowable_padding = ( ul_width - elements_width - 1 ); //-1 for subpixel problems

			if( padding_from_left > max_allowable_padding ) {
				padding_from_left = max_allowable_padding; //for elements on far right
			}

			return padding_from_left;

		}

	};

	$(document).ready(function(){
		$('.main_nav > ul > li:has(ul)').each(function(){ //each li which have submenu
			var submenu = Object.create( Submenu );
			submenu.init($(this));
		});
	});

	/*
	IMAGES IN CONTENT
	 */
	$(document).ready(function(){
		$('.main_content a:has([class*="wp-image"])').each(function(){
			var a = $(this),
				img = a.find('img');
			a.addClass('has_image'); //WP can't do that itself
			var alignleft = ( img.hasClass( 'alignleft' ) ) ? 'alignleft' : false;
			var alignright = ( img.hasClass( 'alignright' ) ) ? 'alignright' : false;
			var aligncenter = ( img.hasClass( 'aligncenter' ) ) ? 'aligncenter' : false;
			var alignnone = ( img.hasClass( 'alignnone' ) ) ? 'alignnone' : false;
			img.removeClass('alignleft alignright aligncenter alignnone');
			a.addClass( alignleft ).addClass( alignright ).addClass( aligncenter ).addClass( alignnone );
			if( aligncenter !== false ) {
				a.wrap( '<div class="a_wrap"></div>' );
			}
		});
	});

})(jQuery);