/*
	*(c) Copyright 2011 Simone Masiero. Some Rights Reserved.
	*This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License

	The original work has been modified for project-black-code, 2022
*/
import fetch_wrap from '../fetch_wrap.js?v=2'
import hal from '../hal.js?v=2'
import { Modal } from '../Modal.js?v=2'
import Typer from './Typer.js'




const SOUNDS = {
	success: new Audio( PBC.home_url + '/wp-content/themes/projectblackcode/js/hackertyper/sound/beep_sharp.mp3'),
	error: new Audio(PBC.home_url + '/wp-content/themes/projectblackcode/js/hackertyper/sound/beep_error.mp3'),
}
const menu_items = document.querySelectorAll('#primary-menu li a')
const popups = document.getElementById('typer-popups')

let IS_TYPER = document.body.classList.contains('page-template-template-typer')

// track open modal
window.MODAL = false


const toggle = document.querySelector('button.menu-toggle')
toggle.addEventListener('click', () => {
	play_sound('success', .2 )
})


















// callbacks

let pauses = []
const add_btn_pause = ( ele, time ) => {
	ele.addEventListener('click', e => {
		if( pauses.includes( ele )){
			pauses.splice( pauses.indexOf( ele ), 1 )
		}else{
			pauses.push( ele )
			e.preventDefault()
			setTimeout(() => {
				ele.click()
			}, time)					
		}

	})
}

const add_beep = ele => {
	ele.addEventListener('click', () => {
		play_sound('success', .1 )
	})
}

const add_fade = ( container ) => { // , element
	const img = document.createElement('img')
	img.src = PBC.home_url + '/wp-content/themes/projectblackcode/js/hackertyper/static1.gif'
	img.classList.add('pbc-fader')
	container.append( img )
	img.style.transition = '1.5s'
	const fade = {
		img: img,
		fade_out: () => {
			setTimeout(() => {
				fade.img.style.opacity = 0
			}, 50 )
			setTimeout(() => {
				fade.img.remove()
			}, 1500)
		}
	}
	return fade
}

const build_button = ( text, sound ) => {
	const btn = document.createElement('div')
	btn.classList.add('button')
	btn.innerText = text
	if( sound ){
		const { 
			type, volume, count, stagger, step_vol
		} = sound
		let vol = volume || 1
		btn.addEventListener('click', () => {
			const lim = count || 1
			for( let i = 0; i < lim; i++ ){
				setTimeout(() => {
					if( step_vol ) vol += step_vol
					play_sound( type, vol )
				}, i * stagger )
			}
		})
	}
	return btn
}

const build_product = product => {

	// product row
	const wrapper = document.createElement('div')
	wrapper.classList.add('pbc-product')

	// append title 
	const title = document.createElement('h4')
	title.innerText = product.post_title || 'untitled'
	wrapper.append( title )

	// build row with columns
	const row = document.createElement('div')
	row.classList.add('row')
	const left = document.createElement('div')
	left.classList.add('column', 'column-2')
	const right = document.createElement('div')
	right.classList.add('column', 'column-2')
	row.append( left )
	row.append( right )
	wrapper.append( row )

	if( product.post_excerpt ){
		const excerpt = document.createElement('div')
		excerpt.innerText = product.post_excerpt
		right.append( excerpt )
	}

	if( product.product_img ){
		const img_wrapper = document.createElement('div')
		img_wrapper.classList.add('pbc-product-img')
		img_wrapper.innerHTML = product.product_img
		left.append( img_wrapper )
		const fade = add_fade( img_wrapper ) // , img_wrapper.querySelector('img')
		img_wrapper.querySelector('img').onload = e => {
			setTimeout(() => {
				fade.fade_out()
			}, 200 )
		}

	}

	const add_to_cart = build_button( 'add to cart', {
		type: 'success',
		volume: .1,
		count: 2,
		stagger: 400,
		step_vol: .2,
	})
	add_to_cart.addEventListener('click', () => {
		jQuery.ajax({
			url: PBC.ajaxurl,
			method: 'POST',
			data: {
				action: 'pbc_add',
				product_id: product.ID,
				quantity: 1,
			}
		})
		.then( res => {

			console.log( res )

			// print cart quantity
			if( res?.fragments ){
				let quantity
				for( const key in res.fragments ){
					const s = res.fragments[ key ]
					const q = s.match(/quantity">[0-9].*/)
					if( q ){
						quantity = s.substr( q.index  + 10, 50 ).split(' ')[0]
						const n = Number( quantity )
						if( typeof n === 'number' ){
							hal('success', quantity + ` item${ n > 1 ? 's' : '' } now in cart<br><a href="${ PBC.home_url }/cart">view cart</a>`, 15 * 1000 )
							count.innerText =  n + ( ( n > 1 || n === 0 ) ? ' items' : ' item' )
						}
					}
				}
			}

		})
		.catch( err => {
			console.log( err )
		})
	})
	right.append( document.createElement('br') )
	right.append( add_to_cart )

	return wrapper

}

// render menu
const pop_menu_modal = e => {

	// validate modal
	const parents = [
		e.target,
		e.target.parentElement,
	]

	let clicked_li
	for( const ele of parents ){
		if( ele.classList.contains('page_item')){
			clicked_li = ele
			break
		}
	}
	if( !clicked_li ) return console.log('invalid popup', e.target )

	// done validating; proceed
	document.removeEventListener('keydown', hacker_listen )

	// clear existing modal
	if( window.MODAL ) MODAL.hide()
	// ^^ this should handle both programattic and DOM, but
	// just in case, cleanup here:
	let modal = document.querySelector('.modal')
	if( modal ){
		console.log('modal still existing in DOM somehow, closing...')
		modal.remove() 
	}

	// and set
	play_sound('success', .1 )
	// get type
	const type = clicked_li.getAttribute('data-type')
	modal = new Modal({
		type: 'menu-modal',
	})
	modal.ele.classList.add('menu-modal-' + type)
	// header
	const header = document.createElement('h4')
	header.innerText = type
	modal.content.append( header )

	switch( type ){

		case 'shop':

			modal.content.innerText = 'loading.....'

			jQuery.ajax({
				url: PBC.ajaxurl,
				method: 'POST',
				data: {
					action: 'home_page_products',
					nonce: PBC.nonce,
					is_user_logged_in: PBC.is_user_logged_in,					
				}
			}) 
			.then( res => {

				modal.content.innerText = ''
				// const header = document.createElement('h4')
				// header.innerText = 'shop'
				modal.content.append( header )

				const parsed = JSON.parse( res )
				console.log('product decoded: ', parsed )

				if( parsed?.length ){
					for( const product of parsed ){
						const p = build_product( product )
						modal.content.append( p )
					}
				}else{
					modal.content.innerHTML += `<div>(no products currently available)</div>`
				}

				// modal.content.innerText = JSON.stringify( parsed, false, 2 )

			})
			.catch( err => {
				console.log('err products: ', err )
			})
			modal.close_callback = () => {
				document.addEventListener('keydown', hacker_listen )
				play_sound('success', .1)
			}
			break;

		case 'blog':

			modal.content.innerText = 'loading.....'

			const html = document.getElementById('typer-posts').innerHTML

			modal.content.innerHTML = html

			modal.content.prepend( header )

			const imgs = modal.content.querySelectorAll('img')
			for( const img of imgs ){
				if( img.parentElement.classList.contains('image') ){
					const fade = add_fade( img.parentElement )
					img.onload = e => {
						fade.fade_out()
					}
				}
			}

			modal.close_callback = () => {
				document.addEventListener('keydown', hacker_listen )
				play_sound('success', .1)
			}
			break;

		case 'contact':
			const contact = popups.querySelector('div[data-type="contact"]')
			// console.log('c: ', contact )
			modal.content.append( contact )
			modal.close_callback = () => {
				popups.append( contact )
				document.addEventListener('keydown', hacker_listen )
				play_sound('success', .1)
			}
			break;

		default:
			document.addEventListener('keydown', hacker_listen )
			console.log('unknown modal type', type )
			break;

	}

	modal.show()

}



// the main window key-down handler - needs to be unbound for modals
const hacker_listen = e => {
	if( !IS_TYPER ) return
	if( event.ctrlKey || event.keyCode === 123 ) return // dev tools
	Typer.addText( event ); //Capture the key-down event and call the addText, this is executed on page load		
}



// dev buttons
const build_btn = ( text, is_dev ) => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('button')
	wrapper.innerText = text
	if( is_dev ){
		dev.appendChild( wrapper )
	}
	return wrapper
}


// init dev area
const init_dev_area = () => {
	const dev = document.createElement('div')
	dev.id = 'dev'
	dev.innerHTML = 'dev actions:<br>'
	document.body.appendChild( dev )

	const access = build_btn('access', true)
	const deny = build_btn('deny', true)
	const flicker = build_btn('flicker', true)
	flicker.addEventListener('click', () => {
		Typer.flicker()
	})
	access.addEventListener('click', () => {
		Typer.makeAccess( true )
	})
	deny.addEventListener('click', () => {
		Typer.makeDenied( true )
	})
}

// sound
const play_sound = ( key, volume ) => {
	if( !SOUNDS[ key ]) return console.log('no sound: ', key )
	if( typeof volume !== 'number' ) volume = 1
	volume = Math.min( 1, Math.max( 0, volume ) )
	SOUNDS[ key ].volume = volume	
	SOUNDS[ key ].play()
}





























// init

// menu style
for( const item of menu_items ){
	item.classList.add('glow-green')
}

// render home page custom menu
if( !localStorage.getItem('pbc-skip-menu') && IS_TYPER ){

	// goal is to have a normal menu still available, but remove it on this page only
	const primary = document.getElementById('primary-menu')
	// remove:
	const links = primary.querySelectorAll('li')
	for( const link of links ){
		if( link.innerText.match(/cart/i)){
			setTimeout(() => {
				link.parentElement.append( link )
			}, 300 )
			continue
		}
		link.remove()
	}
	// add:
	const typer_links = ['shop', 'blog', 'contact'] 
	// const back_page_links = ['']
	for( const link of typer_links ){

		const newlink = document.createElement('li')
		newlink.classList.add('page_item')
		newlink.setAttribute('data-type', link )
		newlink.addEventListener('click', pop_menu_modal )
		const a = document.createElement('a')

		a.classList.add('glow-green')
		a.style.cursor = 'pointer'
		a.innerText = link
		newlink.append( a )

		primary.append( newlink )

		// console.log('appended', newlink )

	}

}


// cart count
const count = document.querySelector('a.pbc-cart-count')
let cart_btn
for( const btn of document.getElementById('primary-menu').querySelectorAll('li')){
	const text = btn.innerText
	if( text.match(/cart/i)){
		cart_btn = btn
	}
	if( text.match(/cart/i) || text.match(/checkout/i) || text.match(/home/i) ){
		const link = btn.querySelector('a')
		add_btn_pause( link, 300 )
		add_beep( link )
	}
}
if( count ){
	const n = Number( count.innerText.split('item')[0].trim() )
	if( n > 0 ){
		count.style.display = 'inline-block'
		cart_btn.append( count )
	}
}




// bind typer functionality
if( IS_TYPER ){
	// typer init
	setTimeout(() => {
		document.getElementById('console').classList.add('glow-green')
		Typer.init()
	}, 100 )
	init_dev_area()
	document.addEventListener('keydown', hacker_listen )
}


// keybind modal closes
document.addEventListener('keyup', e => {
	if( e.keyCode === 27 ){
		const modal = document.querySelector('.modal')
		if( modal ) modal.remove()
	}
})


// hacky way to skip re-writing WC templates
if( document.body.classList.contains('woocommerce-cart')){
	let redirect = setInterval(() => { // because it only appears post-mod
		const shop = document.querySelector('p.return-to-shop a')
		if( shop ){
			shop.innerText = 'Return to home'
			shop.href = PBC.home_url
		}
	}, 500)
}



export default {}