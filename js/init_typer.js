import { Modal } from './Modal.js?v=120'
import hal from './hal.js?v=120'
// import spinner from './hal.js'
import typer from './hackertyper/typer.js?v=120'


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



// product page format amazon link
const add_cart = document.querySelector('form.cart button[type=submit]')
if( add_cart ){
	const amazon_link = document.querySelector('.pbc-amazon-link')
	if( amazon_link ){
		const btn = document.createElement('a')
		btn.classList.add('button', 'amazon-link')
		btn.style['text-decoration'] = 'none'
		btn.innerText = 'Buy this on Amazon'
		btn.href = amazon_link.innerText
		btn.target = '_blank'
		add_cart.parentElement.insertBefore( btn, add_cart )
		add_cart.remove()
		const quant = document.querySelector('.quantity input')
		if( quant ) quant.remove()
		amazon_link.remove()
	}
}

