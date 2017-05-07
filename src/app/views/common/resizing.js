import { inDoc } from '../../support/util';
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

    constructor(node, config) {
        this._node = node;
        this.el = node.el;
        this.state = -1;
        if(config && config.staticStyle) {
            this.posData = {
                width: config.staticStyle.width,
                height: config.staticStyle.height,
                transform: config.staticStyle.transform
            };
        } else {
            this.posData = {};
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
            this._canvas.width = width;
            this._canvas.height = height; 
            this._canvas.id = CANVAS_ID;
            this.el.ownerDocument.body.appendChild(this._canvas);
        }
        let ctx = this._canvas.getContext('2d');
    
        ctx.save();
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.beginPath();

        let {left, top, right, bottom, width, height} = this.el.getBoundingClientRect();
        ctx.fillStyle = ctx.strokeStyle = '#FFA500';
        ctx.font = '12px serif';
        ctx.lineWidth = 1;

        ctx.strokeRect(left - 1,top - 1, width + 2, height + 2);
        ctx.fillText(`(${width}, ${height})`, right - ctx.measureText(`(${width}, ${height})`).width, top - 4);

        ctx.save();
        ctx.moveTo(left + width / 2, 0);
        ctx.lineTo(left + width / 2, top);
        ctx.stroke();
        ctx.fillText(top, left + width / 2 + 2, top / 2);
        ctx.restore();

        ctx.save();
        ctx.moveTo(0, top + height / 2);
        ctx.lineTo(left, top + height / 2);
        ctx.stroke();
        ctx.fillText(left, left / 2 - ctx.measureText(left).width / 2, top + height / 2 - 2);
        ctx.restore();

        ctx.save();
        ctx.moveTo(right, top + height / 2);
        ctx.lineTo(this._canvas.width, top + height / 2);
        ctx.stroke();
        let rDistance = this._canvas.width - right;
        ctx.fillText(rDistance, right + rDistance / 2 - ctx.measureText(rDistance).width / 2, top + height / 2 - 2);
        ctx.restore();

        ctx.save();
        ctx.moveTo(left + width / 2, bottom);
        ctx.lineTo(left + width / 2, this._canvas.height);
        ctx.stroke();
        let bDistance = this._canvas.height - bottom;
        ctx.fillText(bDistance, left + width / 2 + 2,  bottom + bDistance / 2);
        ctx.restore();

        ctx.restore();
    }

   _onElMouseDownHandler(event) {
        let oldPosX = ~~event.clientX;
        let oldPosY = ~~event.clientY;
        if(this.el.dataset['x'] === undefined && this.posData['transform']) {
            this.el.dataset['x'] = this.posData['transform'].match(/-?\d+/g)[0];
        }
        if(this.el.dataset['y'] === undefined && this.posData['transform']) {
            this.el.dataset['y'] = this.posData['transform'].match(/-?\d+/g)[1];
        }
        let oldDeltaX = this.el.dataset['x'] ? Number(this.el.dataset['x']) : 0;
        let oldDeltaY = this.el.dataset['y'] ? Number(this.el.dataset['y']) : 0;
        let offsetWidth = ~~this.el.offsetWidth;
        let offsetHeight = ~~this.el.offsetHeight;
        let self = this;
        this.stopStateChange = true;
        this._drawCanvas();
        this.el.ownerDocument.onmouseup = function(event) {
            self.el.ownerDocument.onmouseup = null;
            self.el.ownerDocument.onmousemove = null;
            self._applyCursor(self.el, DEFAULT);
            self.stopStateChange = false;
        };
        event.target.ownerDocument.onmousemove = function(event) {
            switch(self.state) {
                case CENTER:
                    var deltaX = ~~event.clientX - oldPosX + oldDeltaX;
                    var deltaY = ~~event.clientY - oldPosY + oldDeltaY;
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + deltaX + 'px,' + deltaY + 'px)';
                    self.el.dataset['x'] = deltaX;
                    self.el.dataset['y'] = deltaY;
                    break;
                case LEFT_TOP:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = offsetWidth - deltaX + 'px';
                    self.el.style.height = self.posData['height'] = offsetHeight - deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX + deltaX) + 'px,' + (oldDeltaY + deltaY) + 'px)';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case LEFT:
                    var deltaX = ~~event.clientX - oldPosX;
                    self.el.style.width = self.posData['width'] = offsetWidth - deltaX + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] =  'translate(' + (oldDeltaX + deltaX) + 'px,' + (oldDeltaY) + 'px)';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    break;
                case LEFT_BOTTOM:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = offsetWidth - deltaX + 'px';
                    self.el.style.height = self.posData['height'] = offsetHeight + deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX + deltaX) + 'px,' + (oldDeltaY) + 'px)';
                    self.el.dataset['x'] = oldDeltaX + deltaX;
                    self.el.dataset['y'] = oldDeltaY;
                    break;
                case TOP:
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.height = self.posData['height'] = offsetHeight - deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX) + 'px,' + (oldDeltaY + deltaY) + 'px)';
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case RIGHT_TOP:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = offsetWidth + deltaX + 'px';
                    self.el.style.height = self.posData['height'] = offsetHeight - deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX) + 'px,' + (oldDeltaY + deltaY) + 'px)';
                    self.el.dataset['y'] = oldDeltaY + deltaY;
                    break;
                case RIGHT:
                    var deltaX = ~~event.clientX - oldPosX;
                    self.el.style.width = self.posData['width'] = offsetWidth + deltaX + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX) + 'px,' + (oldDeltaY) + 'px)';
                    break;
                case RIGHT_BOTTOM:
                    var deltaX = ~~event.clientX - oldPosX;
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.width = self.posData['width'] = offsetWidth + deltaX + 'px';
                    self.el.style.height = self.posData['height'] = offsetHeight + deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX) + 'px,' + (oldDeltaY) + 'px)';
                    break;
                case BOTTOM:
                    var deltaY = ~~event.clientY - oldPosY;
                    self.el.style.height = self.posData['height'] = offsetHeight + deltaY + 'px';
                    self.el.style.webkitTransform = self.posData['transform'] = self.posData['webkitTransform'] = 'translate(' + (oldDeltaX) + 'px,' + (oldDeltaY) + 'px)';
                    break;
            }
            self._drawCanvas();
        }
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
        } else if(offsetX < BOUNDARY && offsetY < BOUNDARY) { //left top
            this.state = LEFT_TOP;              
        } else if(offsetX < BOUNDARY && offsetY >= BOUNDARY && offsetY <= boundaryHeight) { //left
            this.state = LEFT;
        } else if(offsetX < BOUNDARY && offsetY > boundaryHeight) { //left bottom
            this.state = LEFT_BOTTOM;
        } else if(offsetX >= BOUNDARY && offsetX <= boundaryWidth && offsetY < BOUNDARY) { //top
            this.state = TOP;
        } else if(offsetX > boundaryWidth && offsetY < BOUNDARY) { //right top
            this.state = RIGHT_TOP;
        } else if(offsetX > boundaryWidth && offsetY >= BOUNDARY && offsetY <= boundaryHeight) { //right
            this.state = RIGHT;
        } else if(offsetX > boundaryWidth && offsetY > boundaryHeight) { //right bottom
            this.state = RIGHT_BOTTOM;
        } else if(offsetX >= BOUNDARY && offsetX <= boundaryWidth && offsetY > boundaryHeight) { //bottom
            this.state = BOTTOM;
        }
        this._applyCursor(event.target, this.state);
    }

    _onElMouseLeaveHandler(event) {
        if(this.stopStateChange) return;
        this.state = DEFAULT;
        this._applyCursor(event.target, this.state);
    }

    _dispose() {
        
    }

    setup() {
        let _onElMouseDownHandler = this._onElMouseDownHandler.bind(this);
        let _onElMouseLeaveHandler = this._onElMouseLeaveHandler.bind(this);
        let _onElMouseMoveHandler = this._onElMouseMoveHandler.bind(this);
        this.el.addEventListener('mousedown', _onElMouseDownHandler);
        this.el.addEventListener('mousemove', _onElMouseMoveHandler);
        this.el.addEventListener('mouseleave', _onElMouseLeaveHandler);
        this._dispose = function() {
            this.el.removeEventListener('mousedown', _onElMouseDownHandler);
            this.el.removeEventListener('mousemove', _onElMouseMoveHandler);
            this.el.removeEventListener('mouseleave', _onElMouseMoveHandler);
            if(this._canvas) {
                this._canvas.parentNode.removeChild(this._canvas);
            }
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