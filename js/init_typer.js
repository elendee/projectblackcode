import { Modal } from './Modal.js?v=117'
import hal from './hal.js?v=117'
// import spinner from './hal.js'
import typer from './hackertyper/typer.js?v=117'


console.log('typer' ) // Modal, hal, spinner

// hacky woocommerce plugin check
let has_wc = false
for( const link of document.querySelectorAll('link')){
	if( link.id.match(/woocommerce/) ){
		has_wc = true
	}
}
if( !has_wc ){
	console.error('woocommerce must be enabled for proper site function')
}