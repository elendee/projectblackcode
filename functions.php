<?php
/**
 * pbc functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package pbc
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.5' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function pbc_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on pbc, use a find and replace
		* to change 'pbc' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'pbc', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'pbc' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'pbc_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'pbc_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function pbc_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'pbc_content_width', 640 );
}
add_action( 'after_setup_theme', 'pbc_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function pbc_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'pbc' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'pbc' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'pbc_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function pbc_scripts() {
	wp_enqueue_style( 'pbc-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_enqueue_style( 'pbc-style-wpcf7', get_template_directory_uri() . '/css/wpcf7.css', array(), _S_VERSION );
	wp_style_add_data( 'pbc-style', 'rtl', 'replace' );

	wp_enqueue_script( 'pbc-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	wp_enqueue_style( 'pbc-typer-style', get_template_directory_uri() . '/css/typer.css', array(), _S_VERSION );

	wp_enqueue_script( 'pbc-typer', get_template_directory_uri() . '/js/init_typer.js', array('jquery'), _S_VERSION, true );
	
	// if( is_page_template('template-typer.php')) {

	// 	wp_enqueue_script( 'pbc-typer', get_template_directory_uri() . '/js/init_typer.js', array('jquery'), _S_VERSION, true );

	// }

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'pbc_scripts' );




function filter_modules( $tag, $handle, $src ) {
	$defer_modules = ['pbc-typer'];
    if ( !in_array($handle, $defer_modules ) ){
        return $tag;		    	
    }
    $tag = '<script type="module" src="' . $src . '" defer="defer"></script>';
    return $tag;
}


add_filter('script_loader_tag', 'filter_modules' , 10, 3);



/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}




/*
	PBC custom functions below:
*/

$IS_LOCAL = file_exists( dirname( __FILE__ ) . '/.is_local' );

function pbc_LOG( $msg ){
	$logfile = dirname( __FILE__ ) . '/.pbc-log.txt';
	file_put_contents( $logfile, date('M:D:H:i') . ': ' . $msg . PHP_EOL, FILE_APPEND | LOCK_EX);
}

/*
	ajax handlers
*/
function home_page_products() {

	global $IS_LOCAL;

	if ( !wp_verify_nonce( $_POST['nonce'], 'pbc-nonce' ) ) {
        die ( 'invalid request');
    }

    // 'home page' category:
    if ( $IS_LOCAL ){
	    $terms = ['18']; // localhost
    }else{
	    $terms = ['19']; // projectblackcode.com
    }

    $args = array(
	    'post_type'             => 'product',
	    'post_status'           => 'publish',
	    // 'ignore_sticky_posts'   => 1,
	    'posts_per_page'        => '12',
	    'tax_query'             => array(
	        array(
	            'taxonomy'      => 'product_cat',
	            // 'field' => 'term_id', //This is optional, as it defaults to 'term_id'
	            'terms'         => $terms,
	            'operator'      => 'IN' // Possible values are 'IN', 'NOT IN', 'AND'.
	        ),
	        // array(
	        	// more conditions....
	        // )
	    )
	);
	$products = new WP_Query($args);

	// pbc_LOG('why no products...' . json_encode( $terms ) );

	foreach ($products->posts as $product) {
		$product->product_img = get_the_post_thumbnail( $product->ID );
	}

	echo json_encode( $products->posts );
	die();
}
add_action('wp_ajax_nopriv_home_page_products', 'home_page_products');
add_action('wp_ajax_home_page_products', 'home_page_products');



function home_page_posts() {

	global $IS_LOCAL;

	if ( !wp_verify_nonce( $_POST['nonce'], 'pbc-nonce' ) ) {
        die ( 'invalid request');
    }

    // 'home page' category:
    // if ( $IS_LOCAL ){
	   //  $terms = ['18']; // localhost
    // }else{
	   //  $terms = ['19']; // projectblackcode.com
    // }

    $args = array(
	    'post_type'             => 'post',
	    'post_status'           => 'publish',
	    // 'ignore_sticky_posts'   => 1,
	    'posts_per_page'        => '12',
	    // 'tax_query'             => array(
	    //     array(
	    //         // 'taxonomy'      => 'product_cat',
	    //         // 'field' => 'term_id', //This is optional, as it defaults to 'term_id'
	    //         // 'terms'         => $terms,
	    //         // 'operator'      => 'IN' // Possible values are 'IN', 'NOT IN', 'AND'.
	    //     ),
	    //     // array(
	    //     	// more conditions....
	    //     // )
	    // )
	);
	$results = new WP_Query($args);

	// pbc_LOG('why no results...' . json_encode( $terms ) );

	foreach ($results->posts as $post) {
		$post->post_img = get_the_post_thumbnail( $product->ID );
	}

	echo json_encode( $results->posts );
	die();
}
add_action('wp_ajax_nopriv_home_page_posts', 'home_page_posts');
add_action('wp_ajax_home_page_posts', 'home_page_posts');



/*
	allow ajax add to cart
	see commented code for allowing variations (needs adaptation)
*/
function pbc_add_to_cart() {
	if ( ! isset( $_POST['product_id'] ) ) {
		return;
	}

	$product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $_POST['product_id'] ) );
	$product           = wc_get_product( $product_id );
	$quantity          = empty( $_POST['quantity'] ) ? 1 : wc_stock_amount( wp_unslash( $_POST['quantity'] ) );
	$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
	$product_status    = get_post_status( $product_id );
	// $variation_id      = $_POST['variation_id'];
	// $variation         = $_POST['variation'];

	// if ( $product && 'variation' === $product->get_type() ) {
	// 	$variation_id = $product_id;
	// 	$product_id   = $product->get_parent_id();

	// 	if ( empty( $variation ) ) {
	// 		$variation = $product->get_variation_attributes();
	// 	}
	// }

	// if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) && 'publish' === $product_status ) {
	if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity ) && 'publish' === $product_status ) {
		do_action( 'woocommerce_ajax_added_to_cart', $product_id );

		// if ( 'yes' === get_option( 'woocommerce_cart_redirect_after_add' ) ) {
		// 	wc_add_to_cart_message( array( $product_id => $quantity ), true );
		// }

		WC_AJAX::get_refreshed_fragments();
	} else {
		$data = array(
			'error' => true,
			'msg' => 'error adding product',
			// 'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
		);

		wp_send_json( $data );
	}

	die();
}
add_action('wp_ajax_nopriv_pbc_add', 'pbc_add_to_cart');
add_action('wp_ajax_pbc_add', 'pbc_add_to_cart');


/*
	init ajax routes on client
*/
function global_scripts() {

	wp_enqueue_script( 
		'pbc-global-js', 
		get_template_directory_uri() . '/js/global.js?v=' . _S_VERSION,
		array()
	);

	wp_localize_script( 'pbc-global-js', 'PBC', array(
			'home_url' => home_url(),
			// 'ajaxurl' => get_template_directory_uri( 'pbc-ajax.php' ),
			'nonce' => wp_create_nonce( 'pbc-nonce' ),
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'is_user_logged' => is_user_logged_in(),
			'version' => _S_VERSION,
		)
	);
}
add_action('init', 'global_scripts', 100);










/*
	woocommerce support
*/
function pbc_wc_support(){
	add_theme_support( 'woocommerce' );
}
add_action( 'after_setup_theme', 'pbc_wc_support' );


