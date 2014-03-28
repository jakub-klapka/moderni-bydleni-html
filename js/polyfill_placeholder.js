/* global jQuery */
(function($){

	var Placeholder = {

		init: function( el ) {
			this.el = el;
			this.placeholder = this.el.attr('placeholder');

			this.onLoad();

			this.bindEvents();

		},

		onLoad: function() {
			this.el.val(this.placeholder);
		},

		bindEvents:function() {

			var self = this;
			this.el.on('focus', $.proxy( self.focus, self ) );
			this.el.on('blur', $.proxy( self.blur, self ) );

		},

		focus: function() {
			if( this.el.val() === this.placeholder ) {
				this.el.val('');
			}
		},

		blur: function() {
			if( this.el.val() === '' ) {
				this.el.val( this.placeholder );
			}
		}

	};

	$(document).ready(function(){
		$('input[placeholder]').each(function(){
			var placeholder = Object.create( Placeholder );
			placeholder.init($(this));
		});
	});

})(jQuery);