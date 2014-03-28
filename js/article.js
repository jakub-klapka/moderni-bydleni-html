/* global jQuery */
(function($) {

	/*
	ARTICLE GALLERY
	 */
	var ArticleGallery = {

		init: function( gallery ) {
			this.gallery = gallery;
			this.image_area = gallery.find('.image_area');
			this.image_width = 630;
			this.image_height = 420;
			this.images = this.lazyLoadImages();
			this.prev_button = this.gallery.find('button.previous');
			this.next_button = this.gallery.find('button.next');
			this.thumbnails = this.gallery.find('.image_thumb');
			this.number_of_images = this.images.length - 1; //0based indexing
			this.active_image_index = 0;

			this.bindEvents();
		},

		lazyLoadImages: function() {
			var images_to_load = this.image_area.find('.image_placeholder');

			var self = this;
			images_to_load.each(function(){
				var placeholder = $(this),
					image = $('<img>')
						.attr('src', placeholder.data('src'))
						.attr('width', self.image_width)
						.attr('height', self.image_height)
				placeholder.after(image);
				placeholder.remove();
			});

			return this.image_area.find('img');
		},

		bindEvents: function() {

			var self = this;
			this.prev_button.on( 'click', $.proxy( this.prevImage, this ) );
			this.next_button.on( 'click', $.proxy( this.nextImage, this ) );
			this.thumbnails.on( 'click', function(e){
				e.preventDefault();
				self.thumbnailClicked( $(this) );
			} );
		},

		nextImage: function() {
			if( this.active_image_index < this.number_of_images ) {
				this.moveTo( this.active_image_index + 1 );
			}
		},

		prevImage: function() {
			if( this.active_image_index > 0 ) {
				this.moveTo( this.active_image_index - 1 );
			}
		},

		moveTo: function( image_index ) {
			this.images.removeClass('active');
			this.images.eq(image_index).addClass('active');
			this.thumbnails.removeClass('active');
			this.thumbnails.eq(image_index).addClass('active');
			this.checkInactiveButton( image_index );
			this.active_image_index = image_index;
		},

		checkInactiveButton: function( new_image_index ) {
			if( new_image_index === 0 ) {
				this.prev_button.addClass('inactive');
			} else {
				this.prev_button.removeClass('inactive');
			}

			if( new_image_index === this.number_of_images ) {
				this.next_button.addClass('inactive');
			} else {
				this.next_button.removeClass('inactive');
			}
		},

		thumbnailClicked: function( thumbnail ) {
			var thumbnail_index = this.thumbnails.index( thumbnail );
			this.moveTo( thumbnail_index );
		}

	};

	$(document).ready(function(){
		$('.article_gallery').each(function(){
			var gallery = Object.create( ArticleGallery );
			gallery.init($(this));
		});
	});

})(jQuery);