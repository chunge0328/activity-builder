import Enum from './enum';
const MOTIONS = {};

defineMotion(Enum.MOTION.OPEN_URL, {
    name: '跳转地址',
    params:[
        {
            type: String,
            $rule: {
                name: '地址'
            }
        }
    ],
    motion: function openUrl(url) {
        window.location.openUrl(url);
    }
});

function defineMotion(motion, opts) {
    MOTIONS[motion] = opts
}

function doMotion(opts) {
    let motion = MOTIONS[opts.motion];
    if(!motion) return;
    motion.apply(this, opts.params);
}

function defineState(state) {

}

function install(Vue) {
    Vue.prototype.$defineMotion = defineMotion;
    Vue.prototype.$defineState = defineState;
    Vue.prototype.$doMotion = doMotion;
    Vue.prototype.__MOTIONS__ = MOTIONS;
}

export default {
    install
};