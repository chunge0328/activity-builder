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

    _onElMouseDownHandler(event) {
        var oldPosX = ~~event.clientX;
        var oldPosY = ~~event.clientY;
        if(this.el.dataset['x'] === undefined && this.posData['transform']) {
            this.el.dataset['x'] = this.posData['transform'].match(/-?\d+/g)[0];
        }
        if(this.el.dataset['y'] === undefined && this.posData['transform']) {
            this.el.dataset['y'] = this.posData['transform'].match(/-?\d+/g)[1];
        }
        var oldDeltaX = this.el.dataset['x'] ? Number(this.el.dataset['x']) : 0;
        var oldDeltaY = this.el.dataset['y'] ? Number(this.el.dataset['y']) : 0;
        var offsetWidth = ~~this.el.offsetWidth;
        var offsetHeight = ~~this.el.offsetHeight;
        var self = this;
        this.stopStateChange = true;
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