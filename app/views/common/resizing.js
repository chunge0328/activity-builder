import { inDoc } from '../../support/util';
import util from './util';
const activateObjs = [];
const BOUNDARY = 5;
const DEFAULT = -1;
const LEFT_TOP = 0;
const TOP = 1;
const RIGHT_TOP = 2;
const RIGHT = 3;
const RIGHT_BOTTOM = 4;
const BOTTOM = 5;
const LEFT_BOTTOM = 6;
const LEFT = 7;
const CENTER = 8;
const POS = 'POS';
const DIMENSION = 'DIMENSION';
const CANVAS_ID = 'resizing-canvas';
class Resizing {

    constructor(instance, config, changeCallback) {
        this.instance = instance;
        this.el = this.instance.el;
        this.state = -1;
        this.disposed = false;
        this.changeCallback = changeCallback || function() {};
        let values = util.parseTrasfromValue(window.getComputedStyle(this.el).transform);
        if(config && config.staticStyle) {
            //if(!usePos) {
                this.posData = {
                    width: config.staticStyle.width,
                    height: config.staticStyle.height,
                    transform: `translate(${~~values[4]/360*10}rem, ${~~values[5]/360*10}rem)`
                };
            // } else  {
            //    this.posData = {
            //        position: 'absolute',
            //        width: config.staticStyle.width,
            //        height: config.staticStyle.height,
            //        top: config.staticStyle.top || 0,
            //        left: config.staticStyle.left || 0
            //    } 
            // }
            
        } else {
            //if(!usePos) {
                
                this.posData = {
                    transform: `translate(${~~values[4]/360*10}rem,${~~values[5]/360*10}rem)`
                };
            // } else {
            //     this.posData = {
            //         position: 'absolute',
            //         top: usePos.top || 0,
            //         left: usePos.left || 0 
            //     };
            // }
        }
        this.stopStateChange = false;
        this._canvas = null;
    }

    _applyCursor(target, state) {
        switch(state) {
            case CENTER:
                target.ownerDocument.documentElement.style.cursor = 'move';
                target.style.cursor = 'move';
                break;
            case LEFT_TOP:
                target.ownerDocument.documentElement.style.cursor = 'nw-resize';
                target.style.cursor = 'nw-resize';
                break;
            case LEFT:
                target.ownerDocument.documentElement.style.cursor = 'e-resize';
                target.style.cursor = 'e-resize';
                break;
            case LEFT_BOTTOM:
                target.ownerDocument.documentElement.style.cursor = 'ne-resize';
                target.style.cursor = 'ne-resize';
                break;
            case TOP:
                target.ownerDocument.documentElement.style.cursor = 'n-resize';
                target.style.cursor = 'n-resize';
                break;
            case RIGHT_TOP:
                target.ownerDocument.documentElement.style.cursor = 'ne-resize';
                target.style.cursor = 'ne-resize';
                break;
            case RIGHT:
                target.ownerDocument.documentElement.style.cursor = 'w-resize';
                target.style.cursor = 'w-resize';
                break;
            case RIGHT_BOTTOM:
                target.ownerDocument.documentElement.style.cursor = 'nw-resize';
                target.style.cursor = 'nw-resize';
                break;
            case BOTTOM:
                target.ownerDocument.documentElement.style.cursor = 's-resize';
                target.style.cursor = 's-resize';
                break;
            case DEFAULT:
                target.ownerDocument.documentElement.style.cursor = 'auto';
                target.style.cursor = 'auto';
                break;
        }
    }

    _drawCanvas() {
        this._canvas = this.el.ownerDocument.getElementById(CANVAS_ID);
        if(!this._canvas) {
            this._canvas = this.el.ownerDocument.createElement('canvas');
            this._canvas.style = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999;pointer-events:none;';
            let {width, height} = this.el.ownerDocument.documentElement.getBoundingClientRect();
            //documentElment.getBoundingClientRect() 获取的宽度是不包含滚动条的
            //window.innerWidth 是包含的
            this._canvas.width = width;
            this._canvas.height = this.el.ownerDocument.defaultView.innerHeight; 
            this._canvas.id = CANVAS_ID;
            this.el.ownerDocument.body.appendChild(this._canvas);
        }
        let ctx = this._canvas.getContext('2d');
    
        ctx.save();
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.beginPath();
        
        let {left, top, right, bottom, width, height} = this.el.getBoundingClientRect();
        left = ~~left;
        top = ~~top;
        right = ~~right;
        bottom = ~~bottom;
        width = ~~width;
        height = ~~height;
        ctx.fillStyle = ctx.strokeStyle = '#FFA500';
        ctx.font = '12px serif';
        ctx.lineWidth = 1;

        ctx.strokeRect(left - 1,top - 1, width + 2, height + 2);
        ctx.fillText(`(${width}, ${height})`, right - ctx.measureText(`(${width}, ${height})`).width, top - 4);

        ctx.save();
        ctx.moveTo(left + width / 2, 0);
        ctx.lineTo(left + width / 2, top);
        ctx.stroke();
        ctx.fillText(top, left + width / 2 + 2, ~~(top / 2));
        ctx.restore();

        ctx.save();
        ctx.moveTo(0, top + height / 2);
        ctx.lineTo(left, top + height / 2);
        ctx.stroke();
        ctx.fillText(left, left / 2 - ctx.measureText(left).width / 2, ~~(top + height / 2 - 2));
        ctx.restore();

        ctx.save();
        ctx.moveTo(right, top + height / 2);
        ctx.lineTo(this._canvas.width, top + height / 2);
        ctx.stroke();
        let rDistance = this._canvas.width - right;
        ctx.fillText(rDistance, right + rDistance / 2 - ctx.measureText(rDistance).width / 2, ~~(top + height / 2 - 2));
        ctx.restore();

        ctx.save();
        ctx.moveTo(left + width / 2, bottom);
        ctx.lineTo(left + width / 2, this._canvas.height);
        ctx.stroke();
        let bDistance = this._canvas.height - bottom;
        ctx.fillText(bDistance, left + width / 2 + 2,  ~~(bottom + bDistance / 2));
        ctx.restore();

        ctx.restore();
        window.requestAnimationFrame(()=> {
            if(this.disposed) return;
            this._drawCanvas()
        });
    }

   _onElMouseDownHandler(event) {
        let oldPosX = ~~event.clientX;
        let oldPosY = ~~event.clientY;
        if(this.el.dataset['x'] === undefined && this.posData['transform']) {
            this.el.dataset['x'] = 
                Number(this.posData['transform'].match(/-?[0-9\.]+/g)[0]) * 360 / 10;
            //this.el.dataset['x'] = values[4];
        }
        if(this.el.dataset['y'] === undefined && this.posData['transform']) {
            this.el.dataset['y'] = 
                Number(this.posData['transform'].match(/-?[0-9\.]+/g)[1]) * 360 / 10;
            //this.el.dataset['y'] = values[5];
        }
        let oldDeltaX = this.el.dataset['x'] ? Number(this.el.dataset['x']) : 0;
        let oldDeltaY = this.el.dataset['y'] ? Number(this.el.dataset['y']) : 0;
        let offsetWidth = ~~this.el.offsetWidth;
        let offsetHeight = ~~this.el.offsetHeight;
        let self = this;
        let ownerDocument = event.target.ownerDocument;
        this.stopStateChange = true;
        this._drawCanvas();
        function onDocumentElMouseUp(event) {
            ownerDocument.removeEventListener('mousemove', onDocumentElMouseMove, true);
            ownerDocument.removeEventListener('mouseup', onDocumentElMouseUp, true);
            self._applyCursor(self.el, DEFAULT);
            self.stopStateChange = false;
        };
        function onDocumentElMouseMove(event) {
            switch(self.state) {
                case CENTER:
                    var deltaX = ~~event.clientX - oldPosX + oldDeltaX;
                    var deltaY = ~~event.clientY - oldPosY + oldDeltaY;
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(deltaX) + ',' + self.pxTorem(deltaY) + ')';
                    self.el.dataset['x'] = deltaX;
                    self.el.dataset['y'] = deltaY;
                    break;
                case LEFT_TOP:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth - deltaX);
                    self.el.style.height = self.posData['height'] = self.pxTorem(offsetHeight - deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX + deltaX) + ',' + self.pxTorem(oldDeltaY + deltaY) + ')';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case LEFT:
                    var deltaX = ~~event.clientX - oldPosX;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth - deltaX);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        =  'translate(' + self.pxTorem(oldDeltaX + deltaX) + ',' + self.pxTorem(oldDeltaY) + ')';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    break;
                case LEFT_BOTTOM:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth - deltaX);
                    self.el.style.height = self.posData['height'] = self.pxTorem(offsetHeight + deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX + deltaX) + ',' + self.pxTorem(oldDeltaY) + ')';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    self.el.dataset['y'] = oldDeltaY;
                    break;
                case TOP:
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.height = self.posData['height'] = self.pxTorem(offsetHeight - deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX) + ',' + self.pxTorem(oldDeltaY + deltaY) + ')';
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case RIGHT_TOP:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth + deltaX);
                    self.el.style.height = self.posData['height'] = self.remTorem(offsetHeight - deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX) + ',' + self.pxTorem(oldDeltaY + deltaY) + ')';
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case RIGHT:
                    var deltaX = ~~event.clientX - oldPosX;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth + deltaX);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX) + ',' + self.pxTorem(oldDeltaY) + ')';
                    break;
                case RIGHT_BOTTOM:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = self.pxTorem(offsetWidth + deltaX);
                    self.el.style.height = self.posData['height'] = self.pxTorem(offsetHeight + deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX) + ',' + self.pxTorem(oldDeltaY) + ')';
                    break;
                case BOTTOM:
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.height = self.posData['height'] = self.pxTorem(offsetHeight + deltaY);
                    self.el.style.webkitTransform 
                        = self.posData['transform'] 
                        = self.posData['webkitTransform'] 
                        = 'translate(' + self.pxTorem(oldDeltaX) + ',' + self.pxTorem(oldDeltaY) + ')';
                    break;
            }
            //self._drawCanvas();
        }
        ownerDocument.addEventListener('mousemove', onDocumentElMouseMove, true);
        ownerDocument.addEventListener('mouseup', onDocumentElMouseUp, true);
        self.changeCallback();
        event.stopPropagation();
    }

    _onElMouseMoveHandler(event) {
        if(this.stopStateChange) return;
        let offsetX = ~~event.offsetX;
        let offsetY = ~~event.offsetY;
        let offsetWidth = ~~this.el.offsetWidth;
        let offsetHeight = ~~this.el.offsetHeight;
        let boundaryHeight = offsetHeight - BOUNDARY;
        let boundaryWidth = offsetWidth - BOUNDARY;
        if(offsetX >= BOUNDARY && offsetX <= boundaryWidth && offsetY >= BOUNDARY && offsetY <= boundaryHeight) {
            this.state = CENTER;
        } else if (offsetX < BOUNDARY && offsetY < BOUNDARY) { //left top
            this.state = LEFT_TOP;              
        } else if (offsetX < BOUNDARY && offsetY >= BOUNDARY && offsetY <= boundaryHeight) { //left
            this.state = LEFT;
        } else if (offsetX < BOUNDARY && offsetY > boundaryHeight) { //left bottom
            this.state = LEFT_BOTTOM;
        } else if (offsetX >= BOUNDARY && offsetX <= boundaryWidth && offsetY < BOUNDARY) { //top
            this.state = TOP;
        } else if (offsetX > boundaryWidth && offsetY < BOUNDARY) { //right top
            this.state = RIGHT_TOP;
        } else if (offsetX > boundaryWidth && offsetY >= BOUNDARY && offsetY <= boundaryHeight) { //right
            this.state = RIGHT;
        } else if (offsetX > boundaryWidth && offsetY > boundaryHeight) { //right bottom
            this.state = RIGHT_BOTTOM;
        } else if (offsetX >= BOUNDARY && offsetX <= boundaryWidth && offsetY > boundaryHeight) { //bottom
            this.state = BOTTOM;
        }
        this._applyCursor(event.target, this.state);
        event.stopPropagation();
    }

    _onElMouseLeaveHandler(event) {
        if(this.stopStateChange) return;
        this.state = DEFAULT;
        this._applyCursor(event.target, this.state);
        event.stopPropagation();
    }

    _onDocumentClickHandler(event) {
        event.stopPropagation();
    }

    _dispose() {
        
    }

    setup() {
        let _onElMouseDownHandler = this._onElMouseDownHandler.bind(this);
        let _onElMouseLeaveHandler = this._onElMouseLeaveHandler.bind(this);
        let _onElMouseMoveHandler = this._onElMouseMoveHandler.bind(this);
        let _onDocumentClickHandler = this._onDocumentClickHandler.bind(this);
        this.el.addEventListener('mousedown', _onElMouseDownHandler, true);
        this.el.addEventListener('mousemove', _onElMouseMoveHandler, true);
        this.el.addEventListener('mouseleave', _onElMouseLeaveHandler, true);
        this.el.ownerDocument.addEventListener('click', _onDocumentClickHandler, true);
        let oldDispose = this._dispose.bind(this);
        this._dispose = function() {
            this.el.removeEventListener('mousedown', _onElMouseDownHandler, true);
            this.el.removeEventListener('mousemove', _onElMouseMoveHandler, true);
            this.el.removeEventListener('mouseleave', _onElMouseMoveHandler, true);
            this.el.ownerDocument.removeEventListener('click', _onDocumentClickHandler, true);
            if(this._canvas) {
                this._canvas.parentNode.removeChild(this._canvas);
            }
            this.disposed = true;
            oldDispose();
        }   
    }

    activate() {
        if(inDoc(this.el) && activateObjs.indexOf(this) < 0) {
            activateObjs.push(this);
            this.setup();
        }
    }

    deactivate() {
        let idx = activateObjs.indexOf(this);
        if(idx >= 0) {
            activateObjs.splice(idx,1);
            this._dispose();
        }
    }
    pxTorem(px) {
      return (px/360*10).toFixed(6)+'rem';
    }
    static deactivateAll() {
        activateObjs.forEach(function(obj) {
            obj._dispose();
        });
        activateObjs.splice(0, activateObjs.length);
    }

    static getTop() {
        return activateObjs[activateObjs.length - 1];
    }
}


export default Resizing;