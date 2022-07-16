/*
	*(c) Copyright 2011 Simone Masiero. Some Rights Reserved.
	*This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License

	The original work has been modified for project-black-code, 2022
*/

import { Modal } from '../Modal.js'




const SOUNDS = {
	success: new Audio('./wp-content/themes/projectblackcode/js/hackertyper/sound/beep_sharp.mp3'),
	error: new Audio('./wp-content/themes/projectblackcode/js/hackertyper/sound/beep_error.mp3'),
}


const menu_items = document.querySelectorAll('#primary-menu li a')
for( const item of menu_items ){
	item.classList.add('glow-green')
}


document.addEventListener('keydown', e => {
	if( event.ctrlKey || event.keyCode === 123 ) return // dev tools
	Typer.addText( event ); //Capture the keydown event and call the addText, this is executed on page load	
})



setTimeout(() => {
	document.getElementById('console').classList.add('glow-green')
	Typer.init()
}, 100 )

















var Typer = window.Typer = {

	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be set
	accessCount:0, //times alt is pressed for Access Granted
	deniedCount:0, //times caps is pressed for Access Denied




	init: function( speed, file ){// initialize Hacker Typer

	    Typer.speed = speed || 3;
	    Typer.file = file || './wp-content/themes/projectblackcode/js/hackertyper/kernel.txt'

		this.accessCountimer = setInterval(() => {
			Typer.updLstChr();
		},500); // initialize timer for blinking cursor

		// $.get(Typer.file,function(data){// get the text file
		// 	Typer.text=data;// save the textfile in Typer.text
		// });

		fetch( Typer.file )
		.then( data => {
			data.text()
			.then( r => {
				// console.log( r )
				// Typer.text = data;// save the textfile in Typer.text
				Typer.text = r;// save the textfile in Typer.text
			})
			.catch( err => {
				console.log( err )
			})
		})
		.catch( err => {
			console.log( err )
		})
	},

	content:function(){

		return document.querySelector("#console").innerHTML

	},

	write:function(str){// append to console content
		console.log( str )
		document.querySelector("#console").append(str);
		return false;
	},

	makeAccess:function( sound ){//create Access Granted popUp
		Typer.hidepop(); // hide all popups
		Typer.accessCount=0; //reset count
		var ddiv = document.createElement('div')
		ddiv.id = 'gran'
		ddiv.classList.add("accessGranted"); // add class to the div
		ddiv.innerHTML = "<h1>ACCESS GRANTED</h1>"; // set content of div
		setTimeout(() => {
			document.body.prepend( ddiv ); // prepend div to body
		}, 200)
		if( sound ){
			SOUNDS.success.volume = .3
			SOUNDS.success.play()
			setTimeout(() => {
				SOUNDS.success.volume = .6
				SOUNDS.success.play()
			}, 350 )
		}
		return false;
	},

	makeDenied:function( sound ){//create Access Denied popUp
		Typer.hidepop(); // hide all popups
		Typer.deniedCount = 0; //reset count
		var ddiv = document.createElement('div')
		ddiv.id = 'deni'
		ddiv.classList.add("accessDenied");// add class to the div
		ddiv.innerHTML = "<h1>ACCESS DENIED</h1>";// set content of div
		document.body.prepend( ddiv );// prepend div to body
		if( sound ){
			SOUNDS.error.volume = .2
			SOUNDS.error.play()
		}
		return false;
	},

	hidepop:function(){// remove all existing popups
		const deny = document.querySelector("#deni")
		const allow = document.querySelector("#gran")
		if( deny ) deny.remove();
		if( allow ) allow.remove();
        Typer.accessCount = 0; //reset access granted count
        Typer.deniedCount = 0; //reset access denied count
	},

	flicker:function(){
		var typer_console = document.querySelector("#console")

		let color
		let r = Math.random()
		if( r > .7 ){
			color = 'purple'
		}else if( r > .3 ){
			color = 'blue'
		}else{
			color = 'orange'
		}
		const c = 'glow-' + color

		typer_console.classList.add( c )

		let flickering = setInterval(() => {
			typer_console.classList.remove( c )
			setTimeout(() => {
				typer_console.classList.add( c )
			}, 50)
		}, 100)
		setTimeout(() => {
			clearInterval( flickering )
			flickering = false
			setTimeout(() => {
				typer_console.classList.remove( c )
				typer_console.classList.add( 'glow-green' )
			}, 100 )
		}, 500 + Math.floor( Math.random() * 1000 ) )
	},

	addText:function( key ){//Main function to add the code

		// console.log('add text', key )

		var typer_console = document.querySelector("#console")

		if( Math.random() < .06 ){
			Typer.flicker()
		}

		if( key.key === 'Alt' ){// key 18 = alt key
			Typer.accessCount++; //increase counter
			if( Typer.accessCount >= 3 ) {// if it's pressed 3 times
				Typer.makeAccess(); // make access popup
			}
		}else if( key.key === 'CapsLock' ){// key 20 = caps lock

			Typer.deniedCount++; // increase counter
			if( Typer.deniedCount >= 3 ){ // if it's pressed 3 times
				Typer.makeDenied(); // make denied popup
			}

		}else if( key.key==='Esc' || key.key==='Escape'){ // key 27 = esc key

			Typer.hidepop(); // hide all popups

		}else if( Typer.text ){ // otherwise if text is loaded


			var cont = Typer.content()

			console.log('has text' , cont )
			// content(); // get the console content
			if( cont.substring( cont.length - 1, cont.length ) === "|" ) // if the last char is the blinking cursor
				typer_console.innerHTML = typer_console.innerHTML.substring( 0, cont.length - 1 ); // remove it before adding the text
			if( key.key !== 'Backspace' ){ // if key is not backspace
				Typer.index += Typer.speed;	// add to the index the speed
			}else{
				if( Typer.index > 0 ) // else if index is not less than 0
					Typer.index -= Typer.speed;//	remove speed for deleting text
			}
			// parse the text for stripping html entities
			var text = document.createElement('div')
			text.innerText = Typer.text.substr( 0, Typer.index )
			var rtn = new RegExp("\n", "g"); // newline regex
			var rts = new RegExp("\\s", "g"); // whitespace regex
			var rtt = new RegExp("\\t", "g"); // tab regex
	    	// replace newline chars with br, tabs with 4 space and blanks with an html blank
	    	typer_console.innerHTML = text.innerHTML.replace( rtn,"<br/>").replace( rtt, "&nbsp;&nbsp;&nbsp;&nbsp;" ).replace( rts,"&nbsp;");
			window.scrollBy( 0, 50 ); // scroll to make sure bottom is always visible

		}

		if ( key.preventDefault && key.key !== 'F11' ) { // prevent F11(fullscreen) from being blocked
			key.preventDefault()
		}

		if( key.key !== 'F11'){ // otherwise prevent keys default behavior
			key.returnValue = false;
		}

	},

	updLstChr:function(){ // blinking cursor
		var typer_console = document.querySelector("#console")
		var cont = this.content(); // get console
		if( cont.substring( cont.length - 1, cont.length ) === "|" ) // if last char is the cursor
			typer_console.innerHTML = typer_console.innerHTML.substring( 0, cont.length - 1 ); // remove it
		else
			this.write("|"); // else write it
	}
}











// render menu
const pop_menu_modal = e => {
	const type = e.target.getAttribute('data-type')
	const modal = new Modal({
		type: 'menu-modal',
	})
	modal.ele.classList.add('menu-modal-' + type)
	const header = document.createElement('h4')
	header.innerText = type
	modal.content.append( header )
	switch( type ){
		case 'shop':
			// fetch_wrap('/admin-ajax.php', 'post' {

			// })
			break;
		case 'blog':
			break;

		case 'contact':
			break;

		default:
			break;

	}

	modal.show()

}

if( !localStorage.getItem('pbc-skip-menu') ){

	// goal is to have a normal menu still available, but remove it on this page only
	const primary = document.getElementById('primary-menu')
	// remove:
	const links = primary.querySelectorAll('li')
	for( const link of links ){
		link.remove()
	}
	// add:
	const typer_links = ['shop', 'blog', 'contact']
	for( const link of typer_links ){

		const newlink = document.createElement('li')
		newlink.classList.add('menu-item')
		newlink.setAttribute('data-type', link )
		newlink.addEventListener('click', pop_menu_modal )

		const a = document.createElement('a')
		a.innerText = link
		newlink.append( a )

		primary.append( newlink )

	}

}















// dev visualizing

const build_btn = ( text, is_dev ) => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('button')
	wrapper.innerText = text
	if( is_dev ){
		dev.appendChild( wrapper )
	}
	return wrapper
}


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



export default {}