(function($){
	//fancybox - uprav selectory na hlavni content
	$(document).ready(function() {

		var main_content_jq = '.main_content',
			i = 1;
		$( main_content_jq + ' .gallery').each(function(){
			$('a', this).attr('data-fancybox-group', i).addClass( 'fancybox' );
		});

		$( main_content_jq + ' a:has([class*="wp-image"])').each(function() {
			var $this = $(this), //anchor
				url_href = $this.attr('href'),
				image = $this.find('img'),
				image_src = image.attr('src');

			if( url_href === image_src ) {
				$this.addClass('fancybox'); //point to itself
				return; //dont check regexp - useless
			}

			//if there is thumbnail
			var matches = image_src.match( /-\d+x\d+\.\w+$/ig );
			if( matches !== null ) {
				var src_wo_postfix = image_src.replace( matches[0], '' );
				if( url_href.indexOf( src_wo_postfix ) !== -1 ) {
					$this.addClass('fancybox');
				}
			}

		});

		$('.fancybox').fancybox({
			'padding': 0,
			'openEffect': 'elastic',
			'closeEffect': 'elastic'
		});

	});
})(jQuery);