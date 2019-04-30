class Button {

	constructor(id, title, symbol, time){
		this.id = id
		this.title = title
		this.symbol = symbol
		this.time = time

		this.createButton()
		this.createEffect()
	}

	insert(referenceNode, newNode){
    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	createButton(){
		// Create buttons links
		this.button = document.createElement('a')
		this.button.innerText = this.symbol
		this.button.id = this.id
		this.button.classList.add('PLU_button')
		this.button.href = '#'
		this.button.title = this.title

		// insert in DOM
		this.insert(PLU_audio, this.button)
		
		return this.button
	}

	createEffect(){
		// Create span attached to button for effect
		this.span = document.createElement('span')
		this.span.innerText = this.symbol
		this.span.classList.add('controls')
		this.span.id = this.id + '_effect'

		// insert in DOM
		this.insert(PLU_audio, this.span)

		return this.span
	}


	clickButton(){
		this.changeAudioTime();
				
		let _this = this
		_this.span.classList.add('fade-in');
		setTimeout(function(){
			_this.span.classList.remove('fade-in')
		}, 800)
	}

	changeAudioTime(){
		if(PLU_audio.paused){ 
			PLU_audio.play()
		}

		PLU_audio.currentTime += this.time
	}

}

const PLU_audio =  typeof document.getElementsByTagName('audio')[0] == 'undefined' ? document.getElementsByTagName('video')[0] : document.getElementsByTagName('audio')[0];
const PLU_parentNode = document.getElementsByClassName('video-js')[0] 

let buttons = []
let but_back_minus_10s = new Button('PLU_bck', '-10s', '↺' , -10)
let but_back_minus_5s = new Button('PLU_bck_5', '-5s', '↶' , -5)
let but_forward_5s = new Button('PLU_fwd_5', '+5s', '↷' , 5)
let but_forward_10s = new Button('PLU_fwd', '+10s', '↻' , 10)

buttons.push(but_back_minus_10s, but_back_minus_5s, but_forward_5s, but_forward_10s)

for(let i in buttons){
	buttons[i].button.onclick = function(e) {
		e = e || event
	    e.preventDefault ? e.preventDefault() : e.returnValue = false
		buttons[i].clickButton()
	}
}

document.onkeydown = function(e){
	if (e.keyCode == '37') { //left
		but_back_minus_5s.clickButton()
	}
	if (e.keyCode == '39') { //right
		but_forward_5s.clickButton()
	}
}