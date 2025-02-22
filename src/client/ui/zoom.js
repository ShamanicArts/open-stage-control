var EventEmitter = require('../events/event-emitter')
var mod = (navigator.platform || '').match('Mac') ? 'metaKey' : 'ctrlKey'

class Zoom extends EventEmitter {

    constructor() {

        super()

        this.localZoom = 1

        document.addEventListener('wheel', (event)=>{
            if (event.ctrlKey) event.preventDefault()
            if (event[mod]) {

                event.preventDefault()

                if (event.deltaY === 0) return

                let d = - event.deltaY / (10 * Math.abs(event.deltaY))
                if (!isNaN(d)) this.setGlobalZoom(d + PXSCALE)
            }
            if (event.altKey) {
                event.preventDefault()
                let d = - event.deltaY / (10 * Math.abs(event.deltaY)) * 2
                if (!isNaN(d)) this.setLocalZoom(d + this.localZoom)
            }

        }, {passive: false})

        document.addEventListener('keydown', (event)=>{
            if (event[mod]) {

                if (event.key == 'DOM_VK_0' || event.key == 'Numpad0') {
                    this.setGlobalZoom(INITIALZOOM)
                    this.setLocalZoom(1)
                }
                else if (event.key == '+' || event.key == '-') {
                    this.setGlobalZoom((event.key == '+' ? 0.1 : -0.1) + PXSCALE)
                }

            }
        }, {passive: true})

    }

    setLocalZoom(zoom) {

        zoom = Math.max(Math.min(zoom, 4), 0.25)
        if (zoom !== this.localZoom) {
            requestAnimationFrame(()=>{
                this.localZoom = zoom
                document.documentElement.style.setProperty('--local-zoom', this.localZoom)
                document.body.classList.toggle('local-zoom-in', this.localZoom > 1)
                document.body.classList.toggle('local-zoom-out', this.localZoom < 1)
                this.trigger('local-zoom-changed')
            })
        }

    }

    setGlobalZoom(zoom) {

        if (zoom !== PXSCALE) {
            PXSCALE = zoom
            document.documentElement.style.setProperty('font-size', PXSCALE + 'px')
            DOM.dispatchEvent(window, 'resize')
            this.trigger('global-zoom-changed')
        }

    }

}

module.exports = new Zoom()
