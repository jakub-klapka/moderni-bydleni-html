/* global jQuery */
(function($){

	var Slider = {

		init: function(){
			this.fade_out_duration = 150; //have to corespond with css
			this.slider = $('.home .slider');
			this.slider_timeout = this.slider.data('timeout');
			this.images_window = this.slider.find('.images_window');
			this.image_anchors = this.images_window.find('a');
			this.title_field = this.slider.find('.title');
			this.cat_field = this.slider.find('.category');
			this.left_control = this.slider.find('.left');
			this.right_control = this.slider.find('.right');
			this.boxes = this.slider.find('.boxes button');
			this.image_width = 630;
			this.image_height = 263;
			this.current_image = 0;
			this.number_of_images = this.image_anchors.length - 1; //0-indexed
			this.title_timeout = false;

			this.lazyLoadImages();

			this.bindEvents();

			if( this.slider_timeout != 0 ) {
				this.setSliderTimeout();
			}

		},

		bindEvents: function() {
			this.left_control.on('click', $.proxy( this.previousImage, this ));
			this.right_control.on('click', $.proxy(this.nextImage, this));
			var self = this;
			this.boxes.on('click', function(){
				self.boxClick($(this));
			});
		},

		lazyLoadImages: function() {
			var self = this;
			this.image_anchors.filter(':not(:has(img))').each(function(){
				var anchor = $(this);
				var image = $('<img>')
					.attr('src', anchor.data('img'))
					.attr('alt', anchor.data('title'))
					.attr('width', self.image_width)
					.attr('height', self.image_height);
				anchor.append( image );
			});
		},

		nextImage: function() {
			if( this.current_image < this.number_of_images ) {
				this.moveToImage(this.current_image + 1);
			} else {
				this.moveToImage(0);
			}
		},

		previousImage: function() {
			if( this.current_image > 0 ) {
				this.moveToImage( this.current_image - 1 );
			} else {
				this.moveToImage( this.number_of_images );
			}
		},

		moveToImage: function( image_index ) {
			var final_margin = - ( image_index * this.image_width );
			this.images_window.css('margin-left', final_margin);
			this.setActiveBox( image_index );
			this.setNewTitle( image_index );
			this.current_image = image_index;
		},

		setActiveBox: function( box_index ) {
			this.boxes.removeClass('active');
			this.boxes.eq(box_index).addClass('active');
		},

		setNewTitle: function( anchor_index ) {
			var fields = this.title_field.add(this.cat_field);
			fields.addClass('fade_out');

			var self = this;
			clearTimeout( this.title_timeout ); //if fade out is running, clear it
			this.title_timeout = setTimeout( function(){
				//after fadeout
				var current_anchor = self.image_anchors.eq(anchor_index);
				self.title_field.text( current_anchor.data('title') );
				self.title_field.attr( 'href', current_anchor.attr('href') );
				self.cat_field.text( current_anchor.data('category') );
				self.cat_field.attr('href', current_anchor.data('category_url') );

				fields.removeClass('fade_out');
			}, this.fade_out_duration );
		},

		setSliderTimeout: function() {
			var self = this;
			setInterval(function() {
				if( !self.slider.is(':hover') ){
					self.nextImage();
				}
			}, this.slider_timeout);
		},

		boxClick: function( box ) {
			var box_index = this.boxes.index(box);
			this.moveToImage( box_index );
		}


	};

	$(document).ready(function(){
		Slider.init();
	});

})(jQuery);
