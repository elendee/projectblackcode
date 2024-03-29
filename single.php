<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package pbc
 */

get_header();
?>

	<main id="primary" class="site-main">

		<!-- header area for posts -->

		<?php

		$link = get_field('article_link');
		$img_url = get_field('article_img_url');
		// $title = get_field('article_title');

		if( $link ){

			// $title = $title ? $title : $link;
			$img_url = $img_url ? $img_url : 'shouldbeACFdefault.jpg';

			?>

			<div class='linked-article'>
				<img src="<?= $img_url ?>">
				<a target="_blank" href="<?= $link ?>"><?= $link ?></a>
			</div>

		<?php
		}

		while ( have_posts() ) :
			the_post();

			// if( !$link ){
				get_template_part( 'template-parts/content', get_post_type() );
			// }

			the_post_navigation(
				array(
					'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'pbc' ) . '</span> <span class="nav-title">%title</span>',
					'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'pbc' ) . '</span> <span class="nav-title">%title</span>',
				)
			);

			// If comments are open or we have at least one comment, load up the comment template.
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
