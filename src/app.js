class Control {

	/**
	 * TODO
	 * - add touch support
	 * - add back button controls
	 **/

    constructor(id, title, symbol, time, container) {
        this.id = id
        this.title = title
        this.symbol = symbol
        this.time = time
        this.container = container

        this.createButton()
        this.createEffect()
    }

    insert(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    createButton() {
        // Create buttons links
        this.button = document.createElement('a')
        this.button.innerText = this.symbol
        this.button.id = this.id
        this.button.classList.add('PLU_button')
        this.button.href = '#'
        this.button.title = this.title

        // insert in DOM
        this.insert(this.container, this.button)

        return this.button
    }

    createEffect() {
        // Create span elem in DOM for effect
        this.effect = document.createElement('span')
        this.effect.innerText = this.symbol
        this.effect.classList.add('controls')
        this.effect.id = this.id + '_effect'

        this.insert(this.container, this.effect)

        return this.effect
    }

    clickButton() {
        this.changeAudioTime(this.time)

        let _this = this
        _this.effect.classList.add('fade-in')
        setTimeout(function () {
            _this.effect.classList.remove('fade-in')
        }, 800)
    }

    changeAudioTime(time) {
        if (this.container.paused) {
            this.container.play()
        }
        this.container.currentTime += time
    }

}

class Touch {
    constructor(id, container) {
        this.id = id
        this.container = container

        this.createTouch()
    }

    insert(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    createTouch() {
        this.pad = document.createElement('span')
        this.pad.classList.add('touch')
        this.pad.id = this.id
        this.insert(this.container, this.pad)

        this.resizePads()
    }

    resizePads() {
        let h = this.container.offsetHeight
        let w = this.container.offsetWidth

        this.pad.style.height = .8 * h + 'px'
        this.pad.style.width = .6 * w / 2 + 'px'
    }

    positionPadR() {
        this.pad.style.left = .6 * this.container.offsetWidth + 'px'
    }

    positionPadL() {
        this.pad.style.left = .1 * this.container.offsetWidth + 'px'
    }
}


const PLU_audio = (typeof document.getElementsByTagName('audio')[0] == 'undefined') ? document.getElementsByTagName('video')[0] : document.getElementsByTagName('audio')[0];
const PLU_parentNode = document.getElementsByClassName('video-js')[0]

let pads = []
let padL = new Touch('padL', PLU_audio)
let padR = new Touch('padR', PLU_audio)
padR.positionPadR()
padL.positionPadL()
pads.push(padL, padR)


for (let i in pads) {
    //Detect doubletap
    let lastTap = 0
    let timeout

    pads[i].pad.addEventListener('touchend', function (e) {
        let now = new Date().getTime()
        let elapsed = now - lastTap

        clearTimeout(timeout)

        let time = (i == 0) ? -5 : 5
        if (elapsed < 500 && elapsed > 0) {
            // pads[i].changeAudioTime(time)
            console.log(pads[i].pad)
        }
        lastTap = new Date().getTime()
    })
}

let buttons = []
let but_back_10s = new Control('PLU_bck', '-10s', '↺', -10, PLU_audio)
let but_back_5s = new Control('PLU_bck_5', '-5s', '↶', -5, PLU_audio)
let but_forward_5s = new Control('PLU_fwd_5', '+5s', '↷', 5, PLU_audio)
let but_forward_10s = new Control('PLU_fwd', '+10s', '↻', 10, PLU_audio)
buttons.push(but_back_10s, but_back_5s, but_forward_5s, but_forward_10s)

//Detect click event on buttons
for (let i in buttons) {
    buttons[i].button.onclick = function (e) {
        e = e || event
        e.preventDefault ? e.preventDefault() : e.returnValue = false
        buttons[i].clickButton()
    }
}

//Keyboard Shortcuts
document.onkeydown = function (e) {
    if (e.shiftKey && e.keyCode == 37) { //shift + left
        but_back_10s.clickButton()
    }
    if (e.shiftKey && e.keyCode == 39) { //shift + right
        but_forward_10s.clickButton()
    }
    if (e.keyCode == '37' && !e.shiftKey) { //left
        but_back_5s.clickButton()
    }
    if (e.keyCode == '39' && !e.shiftKey) { //right
        but_forward_5s.clickButton()
    }
}