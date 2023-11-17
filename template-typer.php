<?php
/**
 * Template Name: Typer
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package pbc
 */

get_header();
?>

	<div id='console'></div>

	<div style='display:none' id='typer-blog-link'>
		<?php
			if( get_field('typer_blog_link')){
				echo get_field('typer_blog_link');
			}
		?>
	</div>

	<div id='typer-popups'>
		<!-- these are hidden, and pulled into modals via js -->
		<div data-type='contact'>
			<?php 
				if( get_field('contact_form_shortcode') ){
					echo do_shortcode( get_field('contact_form_shortcode') ); 
				}
			?>
		</div>
		<div data-type='shop'>
			<!-- not sure if needed yet... -->
		</div>
		<div data-type='blog'>
			<!-- not sure if needed yet... -->
		</div>
	</div>


	<pre id='text-source'>
		<?php 
			if( get_field('hackertyper_text_source') ){
				echo get_field('hackertyper_text_source');
			}
		?>
	</pre>
	<pre id='typer-mobile'>
		<?php 
			if( get_field('mobile_text_source') ){
				echo get_field('mobile_text_source');
			}
		?>
	</pre>
	<pre id='typer-file'>
		<?php 
			if( get_field('hacker_typer_source_file') ){
				echo get_field('hacker_typer_source_file');
			}
		?>
	</pre>


	<div id='typer-posts'>
		<?php echo do_shortcode('[display-posts include_content="true"]'); ?>
		<!-- image_size="thumbnail" -->
		<!-- include_excerpt="true" -->
	</div>

<?php
// get_sidebar();
get_footer();
