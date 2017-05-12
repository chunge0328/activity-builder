import { defineMotion } from '../base/Assit';
import Enum from './enum';
import DialogBuilder from '../base/DialogBuilder';

defineMotion(Enum.MOTION.OPEN_URL, {
    name: '跳转地址',
    params: [
        {
            type: String,
            $rule: {
                name: '链接地址',
            }
        }
    ],
    do: function openUrl(url) {
        window.open(url);
    }
});

defineMotion(Enum.MOTION.SHOW_DIALOG, {
    name: '弹出对话框',
    params: [
        {
            type: String,
            $rule: {
                name: '标题'
            }
        },
        {
            type: String,
            $rule: {
                name: '内容'
            }
        }
    ],
    do: function showDialog(title, content) {
        DialogBuilder.of(this).alert(title, content);
    }
});

