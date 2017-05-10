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

export function defineMotion(name, opts) {
    MOTIONS[name] = opts
}

export default MOTIONS;