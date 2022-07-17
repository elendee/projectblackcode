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

	<?php
	?>

<?php
// get_sidebar();
get_footer();
