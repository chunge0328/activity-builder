import Enum from '../common/enum';
const MOTIONS = {};
const TYPES = {};
const AWARDS = [];

function doMotion(opts) {
    let motion = MOTIONS[opts.motion];
    if(!motion) return;
    motion.do.apply(this, opts.params);
}

// function defineState(state) {

// }

function install(Vue) {
    Vue.prototype.$defineMotion = defineMotion;
    //Vue.prototype.$defineState = defineState;
    Vue.prototype.$doMotion = doMotion;
    Vue.prototype.__MOTIONS__ = MOTIONS;
    Vue.prototype.AWARDS = AWARDS;
}

export function defineMotion(motion, opts) {
    if(!motion) return;
    MOTIONS[motion] = opts
}

export default {
    install
};