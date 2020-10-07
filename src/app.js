class Control {

    constructor(id, time, container, title = null, symbol = null) {
        this.id = id
        this.title = title
        this.symbol = symbol
        this.time = time
        this.container = container

        this.cont_h = (this.container.offsetHeight != 0) 
                        ? this.container.offsetHeight 
                        : document.getElementById('video-131477').offsetHeight
        this.cont_w = (this.container.offsetWidth != 0)
                        ? this.container.offsetWidth
                        : document.getElementById('video-131477').offsetWidth
    }

    setupButton() {
        this.createButton()
        this.createEffect()
    }

    togglePause() {
        if (this.container.paused) {
            this.container.play()
        }
        else {
            this.container.pause()
        }
    }

    insert(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    positionButton() {
        this.button.style.bottom = '-' + this.cont_h + 'px'
    }

    createButton() {      
        // Create buttons link
        this.button = document.createElement('a')
        this.button.innerText = this.symbol
        this.button.id = this.id
        this.button.classList.add('PLU_button')
        this.button.href = '#'
        this.button.title = this.title

        this.positionButton()

        // insert in DOM
        this.insert(this.container, this.button)

        return this.button
    }

    createEffect() {
        // Create span elem in DOM for effect
        this.effect = document.createElement('span')
        this.effect.innerText = this.symbol
        this.effect.classList.add('PLU_controls')
        this.effect.id = this.id + '_effect'

        this.effect.style.top = (this.cont_h - 50) / 2 + 'px' 
        this.effect.style.right = (this.cont_w - 50) / 2 + 'px' 

        this.insert(this.container, this.effect)

        return this.effect
    }

    changeAudioTime() {
        if (this.container.paused) {
            this.container.play()
        }
        this.container.currentTime += this.time

        let _this = this
        _this.effect.classList.add('fade-in')
        setTimeout(function () {
            _this.effect.classList.remove('fade-in')
        }, 800)
    }
}

class Touch extends Control {

    constructor(id, time, container, title, symbol) {
        super(id, time, container, title, symbol)
        this.createTouch()
        super.createEffect()
    }

    createTouch() {
        this.pad = document.createElement('span')
        this.pad.classList.add('PLU_touch')
        this.pad.id = this.id
        super.insert(this.container, this.pad)

        this.resizePad()
    }

    resizePad() {
        this.pad.style.height = .8 * this.cont_h + 'px'
        this.pad.style.width = .6 * this.cont_w / 2 + 'px'
    }

    positionPadR() {
        this.pad.style.left = .6 * this.container.offsetWidth + 'px'
    }

    positionPadL() {
        this.pad.style.left = .1 * this.container.offsetWidth + 'px'
    }

    changeAudioTime() {
        super.changeAudioTime(this.time)
    }
}

const media_element = (typeof document.getElementsByTagName('audio')[0] == 'undefined') ? document.getElementsByTagName('video')[0] : document.getElementsByTagName('audio')[0]

console.log()
// We're on Zoom
if(window.location.hostname.includes('zoom')){
    document.getElementsByTagName('html')[0].classList.add('PLU_zoom')
}

let buttons = []
let but_back_10s = new Control('PLU_bck', -10, media_element, '-10s (shift + left)', '↺')
let but_back_5s = new Control('PLU_bck_5', -5, media_element, '-5s (left)', '↶')
let but_forward_5s = new Control('PLU_fwd_5', 5, media_element, '+5s (right)', '↷')
let but_forward_10s = new Control('PLU_fwd', 10, media_element, '+10s (shift + right)', '↻')
buttons.push(but_back_10s, but_back_5s, but_forward_5s, but_forward_10s)

//Detect click event on buttons
for (let i in buttons) {
    buttons[i].setupButton()
    buttons[i].button.onclick = function (e) {
        e = e || event
        e.preventDefault ? e.preventDefault() : e.returnValue = false
        buttons[i].changeAudioTime()
    }
}

let pads = []
let padL = new Touch('PLU_padL', -5, media_element, '-5s', '↶')
let padR = new Touch('PLU_padR', 5, media_element, '+5s', '↷')
pads.push(padL, padR)

//This reposition() is used in setTimeout further down, do not delete
function reposition() {
    padR.resizePad()
    padR.positionPadR()
    padL.resizePad()
    padL.positionPadL()
}
reposition()

// Onresize performance enhancer
let it
window.onresize = function () {
    clearTimeout(it)
    it = setTimeout(reposition, 400)
}

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
            pads[i].changeAudioTime(time)
        }
        else { 
            //one tap
            but_back_5s.togglePause()
        }
        lastTap = new Date().getTime()
    })

    pads[i].pad.addEventListener('click', function (e) {
        but_back_5s.togglePause()
    })
}

//Bug fix for spacebar shortcut if search input is :focused
searchEl = document.querySelector('#searchTop')

//Resolve controls not working in Fullscreen
let isFullscreen = false
document.onfullscreenchange = (e) => { 
    isFullscreen = !isFullscreen
    if(isFullscreen) {
        but_back_10s.container.focus()
    }
}

//Keyboard Shortcuts
document.onkeydown = (e) => {
    if (e.shiftKey && e.keyCode == 37) { //shift + left
        but_back_10s.changeAudioTime()
    }
    if (e.shiftKey && e.keyCode == 39) { //shift + right
        but_forward_10s.changeAudioTime()
    }
    if (e.keyCode == 37 && !e.shiftKey) { //left
        but_back_5s.changeAudioTime()
    }
    if (e.keyCode == 39 && !e.shiftKey) { //right
        but_forward_5s.changeAudioTime()
    }
    if (e.keyCode == 32 && document.activeElement != searchEl) { //spacebar
        e.preventDefault()
        but_back_5s.togglePause()
    }    
}