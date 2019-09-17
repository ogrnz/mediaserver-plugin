class Control {

	constructor(id, symbol, time, container){
		this.id = id
		this.symbol = symbol
		this.time = time
		this.container = container

		this.createEffect()
	}

	insert(referenceNode, newNode){
    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	createEffect(){
		// Create span elem in DOM for effect
		this.effect = document.createElement('span')
		this.effect.innerText = this.symbol
		this.effect.classList.add('controls')
		this.effect.id = this.id + '_effect'

		this.insert(this.container, this.effect)

		return this.effect
	}


	clickButton(){
		this.changeAudioTime()
			
		let _this = this
		_this.effect.classList.add('fade-in')
		setTimeout(function(){
			_this.effect.classList.remove('fade-in')
		}, 800)
	}

	changeAudioTime(){
		if(this.container){ 
			this.container.play()
		}
		this.container.currentTime += this.time
	}

}

const PLU_audio =  typeof document.getElementsByTagName('audio')[0] == 'undefined' ? document.getElementsByTagName('video')[0] : document.getElementsByTagName('audio')[0];
const PLU_parentNode = document.getElementsByClassName('video-js')[0] 

let buttons = []
let but_back_minus_10s = new Control('PLU_bck', '↺' , -10, PLU_audio)
let but_back_minus_5s = new Control('PLU_bck_5', '↶' , -5, PLU_audio)
let but_forward_5s = new Control('PLU_fwd_5', '↷' , 5, PLU_audio)
let but_forward_10s = new Control('PLU_fwd', '↻' , 10, PLU_audio)

buttons.push(but_back_minus_10s, but_back_minus_5s, but_forward_5s, but_forward_10s)

document.onkeydown = function(e){
	if (e.shiftKey && e.keyCode == 37){ //shift + left
		but_back_minus_10s.clickButton()
	}
	if (e.shiftKey && e.keyCode == 39){ //shift + right
		but_forward_10s.clickButton()
	}
	if (e.keyCode == '37' && !e.shiftKey) { //left
		but_back_minus_5s.clickButton()
	}
	if (e.keyCode == '39' && !e.shiftKey) { //right
		but_forward_5s.clickButton()
	}
}