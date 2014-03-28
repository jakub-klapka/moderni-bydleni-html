/* global jQuery, Modernizr */
(function($){

	var ArticleGallery = {

		init: function() {
			this.gallery = $('.article_gallery_content');
			this.image_area = this.gallery.find('.image_area');
			this.left_button = this.image_area.find('.left');
			this.right_button = this.image_area.find('.right');
			this.current_image_index = 0;
			this.images_and_placeholders = false;
			this.setImagesAndPlaceholders();
			this.number_of_images = this.images_and_placeholders.length - 1; //to 0index it
			this.thumbs_window = this.gallery.find('.thumbs_window');
			this.thumb_wrap = this.thumbs_window.find('.thumbs_wrap');
			this.thumb_width = 100;
			this.thumb_height = 100;
			this.thumb_left = this.gallery.find( '.controls .left' );
			this.thumb_right = this.gallery.find( '.controls .right' );

			this.lazyLoadThumbnails();

			this.thumbnails = this.thumb_wrap.find('a');
			this.thumb_page = 1;
			this.thumbs_on_page = 7;
			this.thumb_page_width = 7 * 100 + 7 * 16;
			this.num_of_pages = Math.ceil( ( this.number_of_images + 1 ) / this.thumbs_on_page );

			this.bindEvents();

		},

		setImagesAndPlaceholders: function() {
			this.images_and_placeholders = this.image_area.find('img, .image_placeholder');
		},

		bindEvents: function() {

			//buttons on image
			this.left_button.on( 'click', $.proxy( this.moveOneToLeft, this ) );
			this.right_button.on( 'click', $.proxy( this.moveOneToRight, this ) );

			//click on thumbnails
			var self = this;
			this.thumbnails.on( 'click', function(e) {
				e.preventDefault();
				var thumb_index = self.thumbnails.index( this );
				self.moveToIndex( thumb_index );
			} );

			//buttons on thumbnail control
			this.thumb_left.on( 'click', $.proxy( this.thumbPageLeft, this ) );
			this.thumb_right.on( 'click', $.proxy( this.thumbPageRight, this ) );

			//key press
			$(document).on('keyup', function(e) {
				if( Modernizr.mq( 'only all and ( min-width: 960px )' ) ){//keys on smaller screens are used to move on page
					e.preventDefault();
					if( e.which === 37 ) {
						self.moveOneToLeft();
					}
					if( e.which === 39 ) {
						self.moveOneToRight();
					}

				}
			});

		},

		lazyLoadThumbnails: function() {
			var self = this;
			this.thumb_wrap.find('.thumb_placeholder').each(function(){
				var placeholder = $(this);
				var thumb = $('<img />')
					.attr( 'src', placeholder.data( 'src' ) )
					.attr( 'alt', placeholder.data( 'alt' ) )
					.attr( 'width', self.thumb_width )
					.attr( 'height', self.thumb_height );
				var a = $('<a/>').attr('href', placeholder.data('full_image_href'));
				a.append( thumb );
				placeholder.after( a );
				placeholder.remove();
			});
		},

		moveToIndex: function( image_index ) {

			//first check if image is placeholder and those next to it too
			this.checkPlaceholder( image_index );

			//change image
			this.images_and_placeholders.removeClass( 'active' );
			this.images_and_placeholders.eq( image_index ).addClass('active');

			//change active thumb
			this.changeActiveThumb( image_index );

			//check buttons
			if( image_index === 0 ) {
				this.left_button.addClass('inactive');
			} else {
				this.left_button.removeClass('inactive');
			}
			if( image_index === this.number_of_images ) {
				this.right_button.addClass('inactive');
			} else {
				this.right_button.removeClass('inactive');
			}



			this.current_image_index = image_index;

		},

		moveOneToRight: function() {

			if( this.current_image_index < this.number_of_images ) {
				this.moveToIndex( this.current_image_index + 1 );
			}

		},

		moveOneToLeft: function() {

			if( this.current_image_index > 0 ) {
				this.moveToIndex( this.current_image_index - 1 );
			}

		},

		checkPlaceholder: function( image_index ) {
			var current_element = this.images_and_placeholders.eq( image_index ),
				previous_element = ( image_index > 1 ) ? this.images_and_placeholders.eq( image_index - 1) : $(), //false if there is no previous
				next_element = this.images_and_placeholders.eq( image_index + 1 );

			//first set current image
			if( current_element.is('.image_placeholder') ) {
				this.setPlaceholder( current_element );
			}

			//than the same for sides
			if( previous_element.is('.image_placeholder') ){
				this.setPlaceholder( previous_element );
			}
			if( next_element.is('.image_placeholder') ){
				this.setPlaceholder( next_element );
			}

			//renew images and placeholders
			this.setImagesAndPlaceholders();

		},

		setPlaceholder: function( placeholder ) {
			var img = $('<img/>')
					.attr( 'src', placeholder.data('src') )
					.attr( 'width', placeholder.data('width') )
					.attr( 'height', placeholder.data('height') )
					.attr( 'alt', placeholder.data('alt') );
			placeholder.after( img );
			placeholder.remove();
		},

		changeActiveThumb: function( image_index ) {

			//check thumb page
			var thumb_page = Math.ceil( ( image_index + 1 ) / this.thumbs_on_page );
			if( this.thumb_page !== thumb_page ){
				this.setThumbPage( thumb_page );
			}

			//change active
			this.thumbnails.removeClass('active');
			this.thumbnails.eq( image_index).addClass('active');

		},

		setThumbPage: function( thumb_page ) {
			var margin = - ( ( thumb_page - 1 ) * this.thumb_page_width );
			this.thumb_wrap.css( 'margin-left', margin );

			//check buttons
			if( thumb_page === 1 ) {
				this.thumb_left.addClass('inactive');
			} else {
				this.thumb_left.removeClass('inactive');
			}
			if( thumb_page === this.num_of_pages ) {
				this.thumb_right.addClass('inactive');
			} else {
				this.thumb_right.removeClass('inactive');
			}


			this.thumb_page = thumb_page;
		},

		thumbPageLeft: function() {

			if( this.thumb_page === 1 ) {
				return;
			}

			this.setThumbPage( this.thumb_page - 1 );

		},

		thumbPageRight: function() {

			if( this.thumb_page === this.num_of_pages ) {
				return;
			}

			this.setThumbPage( this.thumb_page + 1 );

		}



	};

	$(document).ready(function(){
		ArticleGallery.init();
	});

})(jQuery);