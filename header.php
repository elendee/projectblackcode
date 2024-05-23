<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package pbc
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<?php 
		$social_img = 'https://antiracistai.com/wp-content/uploads/2024/05/cropped-Antiracistai_Rectangular_Banner_Logo.png'; 
		$description = get_bloginfo('description'); // Settings > Site Tagline
		$site_title = get_bloginfo('name'); // Settings > Site Title
		$twitter_handle = '@antiracistai';
	?>

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="<?php echo $site_title; ?>">
	<meta property="og:description" content="<?php echo $description; ?>">
	<meta property="og:url" content="<?php echo get_permalink(); ?>">
	<meta property="og:image" content="<?php echo $social_img; ?>">
	<meta property="og:type" content="website">

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary"> <!-- ( summary_large_image is one step up) -->
	<meta name="twitter:title" content="<?php echo $site_title; ?>">
	<meta name="twitter:description" content="<?php echo $description; ?>">
	<meta name="twitter:image" content="<?php echo $social_img; ?>">
	<meta name="twitter:site" content="<?php echo $twitter_handle; ?>">


	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'pbc' ); ?></a>

	<header id="masthead" class="site-header">
		<div class="site-branding">
			<?php
			the_custom_logo();
			if ( is_front_page() && is_home() ) :
				?>
				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<?php
			else :
				?>
				<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
				<?php
			endif;
			$pbc_description = get_bloginfo( 'description', 'display' );
			if ( $pbc_description || is_customize_preview() ) :
				?>
				<p class="site-description"><?php echo $pbc_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
			<?php endif; ?>
		</div><!-- .site-branding -->

		<nav id="site-navigation" class="main-navigation">
			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( '☰', 'pbc' ); ?></button>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'menu-1',
					'menu_id'        => 'primary-menu',
				)
			);
			?>

			<?php global $woocommerce; ?>
				<?php
					if( $woocommerce ){
				?>

					<a class="pbc-cart-count" href="<?php echo $woocommerce->cart->get_cart_url(); ?>"
					title="<?php _e('Cart View', 'woothemes'); ?>">
					<?php echo sprintf(_n('%d item', '%d items', $woocommerce->cart->cart_contents_count, 'woothemes'),
					 $woocommerce->cart->cart_contents_count);?> <!-- delimiter here -->
					<?php 
					// 	echo $woocommerce->cart->get_cart_total(); 
					?>
					</a>

				<?php
					}else{
						echo 'no wc'; // (error will be thrown in client js)
					}
				?>

		</nav><!-- #site-navigation -->
	</header><!-- #masthead -->
