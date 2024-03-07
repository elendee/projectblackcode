
const SOUNDS = {
	success: new Audio( PBC.home_url + '/wp-content/themes/projectblackcode/js/hackertyper/sound/beep_sharp.mp3'),
	error: new Audio(PBC.home_url + '/wp-content/themes/projectblackcode/js/hackertyper/sound/beep_error.mp3'),
}


var Typer = window.Typer = {

	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file: '',
	accessCount:0, //times alt is pressed for Access Granted
	deniedCount:0, //times caps is pressed for Access Denied
	console: document.getElementById('console'),




	init: function( speed, file ){// initialize Hacker Typer

	    Typer.speed = speed || 3;
	    Typer.file = file
	    // './wp-content/themes/projectblackcode/js/hackertyper/kernel.txt'

		this.accessCountimer = setInterval(() => {
			Typer.updLstChr();
		},500); // initialize timer for blinking cursor

		// $.get(Typer.file,function(data){// get the text file
		// 	Typer.text=data;// save the textfile in Typer.text
		// });

		if( window.innerWidth < 800 ){

			Typer.load_mobile_field()

		}else{

			if( Typer.file ){

				if( !Typer.file.match(/^http/i) ){
					// might be absolute URL to file
					Typer.file = PBC.home_url + Typer.file				
				}

				fetch( Typer.file )
				.then( data => {

					if( data?.status === 404 ){

						console.error('no text found; loading fields')
						Typer.load_fields()

					}else{

						console.log( data.status )

						data.text()
						.then( r => {
							// console.log( r )
							// Typer.text = data;// save the textfile in Typer.text
							Typer.text = r;// save the textfile in Typer.text
						})
						.catch( err => {
							Typer.load_fields()
							console.error( 'loading fields (a)', err )
						})
					}
				})
				.catch( err => {
					Typer.load_fields()
					console.error( 'loading fields (b),', err )
				})

			}else{

				Typer.load_fields()

			}

		}

		console.log('attempting load: ', Typer.file )

	},

	load_mobile_field: function(){

		const mobile_text = document.getElementById('typer-mobile')
		if( mobile_text.innerText ){
			Typer.text = mobile_text.innerText
		}else{
			Typer.text = PBC.site_title || 'lorem ipsum'
			console.error('no init field found')
		}
	},

	load_fields: function(){

		const embedded_text = document.getElementById('text-source')

		if( embedded_text.innerText ){
			Typer.text = embedded_text.innerText
		}else{
			Typer.text = PBC.site_title || 'lorem ipsum'
			console.error('no init field found')
		}

	},

	content:function(){

		return Typer.console.innerHTML

	},

	write:function(str){// append to console content
		// console.log( str )
		Typer.console.append(str);
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
			this.play_sound( 'success', .3 )
			setTimeout(() => {
				this.play_sound( 'success', .4 )
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
			this.play_sound( 'error', .2 )
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

		Typer.console.classList.add( c )

		let flickering = setInterval(() => {
			Typer.console.classList.remove( c )
			setTimeout(() => {
				Typer.console.classList.add( c )
			}, 50)
		}, 100)
		setTimeout(() => {
			clearInterval( flickering )
			flickering = false
			setTimeout(() => {
				Typer.console.classList.remove( c )
				Typer.console.classList.add( 'glow-green' )
			}, 100 )
		}, 500 + Math.floor( Math.random() * 1000 ) )
	},

	addText:function( key ){//Main function to add the code

		// console.log('add text', key )

		if( Math.random() < .06 ){
			Typer.flicker()
		}

		if( key.key === 'Alt' ){// key 18 = alt key
			Typer.accessCount++; //increase counter
			if( Typer.accessCount >= 3 ) {// if it's pressed 3 times
				Typer.makeAccess( true ); // make access popup
			}
		}else if( key.key === 'CapsLock' ){// key 20 = caps lock

			Typer.deniedCount++; // increase counter
			if( Typer.deniedCount >= 3 ){ // if it's pressed 3 times
				Typer.makeDenied( true ); // make denied popup
			}

		}else if( key.key==='Esc' || key.key==='Escape'){ // key 27 = esc key

			Typer.hidepop(); // hide all popups

		}else if( Typer.text ){ // otherwise if text is loaded

			// if( this.alreadyShimmed >= 3 ){
			// 	Typer.showFullText()
			// 	return console.log('done');
			// }

			var cont = Typer.content()

			// console.log('has text' , cont )
			// content(); // get the console content
			if( cont.substring( cont.length - 1, cont.length ) === "|" ) // if the last char is the blinking cursor
				Typer.console.innerHTML = Typer.console.innerHTML.substring( 0, cont.length - 1 ); // remove it before adding the text
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
	    	Typer.console.innerHTML = text.innerHTML
	    		// .replace( rtn,"<br/>")
	    		// .replace( rtt, "&nbsp;&nbsp;&nbsp;&nbsp;" )
	    		.replace( rtt, "" )
	    		// .replace( rts,"&nbsp;");
	    		
	    	// Typer.console.innerHTML = text.innerHTML
			window.scrollBy( 0, 50 ); // scroll to make sure bottom is always visible

			Typer.shimAddFullText()

		}

		if ( key.preventDefault && key.key !== 'F11' ) { // prevent F11(fullscreen) from being blocked
			key.preventDefault()
		}

		if( key.key !== 'F11'){ // otherwise prevent keys default behavior
			key.returnValue = false;
		}

	},

	showFullText: function(){
		const regex = new RegExp( /^\t{0,2}/g )
		if( Typer.text ){

			let full_text = Typer.text.replace( regex, '')

			const len = full_text.length

			const splits = []

			let stop = 0

			while( full_text.length >= 0 && stop < 1000 ){
				stop++
				const jump = 10 + Math.round( Math.random() * 10 )
				splits.push( full_text.substr( 0, jump ) )
				full_text = full_text.substr( jump )
			}

			Typer.console.innerHTML = ''
			for( let i = 0; i < splits.length; i++ ){
				setTimeout(() => {
					Typer.console.innerText += splits[i]
				}, i * 75 )
			}

		}

	},

	shimAddFullText: function(){
		return console.log('skipping shim full text...')
		// nonce
		if( !this.alreadyShimmed ){
			this.alreadyShimmed = 1
		}else if( this.alreadyShimmed >= 3 ){
			Typer.showFullText()
			return;
		}else{
			// Typer.console.innerHTML = Typer.text
			this.alreadyShimmed++
		}
	},

	updLstChr:function(){ // blinking cursor
		// var Typer.console = document.querySelector("#console")
		var cont = this.content(); // get console
		if( cont.substring( cont.length - 1, cont.length ) === "|" ) // if last char is the cursor
			Typer.console.innerHTML = Typer.console.innerHTML.substring( 0, cont.length - 1 ); // remove it
		else
			this.write("|"); // else write it
	},

	play_sound: function( key, volume ){
		// sound
		if( !SOUNDS[ key ]) return console.log('no sound: ', key )
		if( typeof volume !== 'number' ) volume = 1
		volume = Math.min( 1, Math.max( 0, volume ) )
		SOUNDS[ key ].volume = volume	
		SOUNDS[ key ].play()
	}




}

// const typer = Typer()

export default Typer

