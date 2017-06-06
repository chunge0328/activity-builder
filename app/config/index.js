import util from '../views/common/util';
import remote from '../remote';


const path = nodeRequire('path');
const os = nodeRequire('os');
const fs = nodeRequire('fs');
const META_FILE = path.join(process.cwd(), 'meta.json');
const meta = util.loadMetaData(META_FILE);
const DATA_DIR = meta.activityDataDir || path.join(os.homedir(), 'activity-builder');
const INTERNAL_SERVER_PORT = meta.internalServerPort || 8092;
const ips = util.getLocalIps();
const IP = ips.length ? ips[0] : '127.0.0.1';
const INTERNAL_SERVER_HOST = `http://${IP}:${INTERNAL_SERVER_PORT}`;
const BASE_DIR = remote.getBaseDir();
const TMEPLATE_DIR = path.join(BASE_DIR, 'app/activity');
const ACTIVITY_BUILD_DIR = path.join(DATA_DIR, 'activity/build');
const ACTIVITY_OUTPUT_DIR = meta.activityOutputDir || path.join(DATA_DIR, 'activity/output');
const ACTIVITY_BASE_DIR = path.join(DATA_DIR, 'activity');
const DB_FILE = path.join(DATA_DIR, 'data/data.db');
const NODE_MODULES = path.join(BASE_DIR, 'node_modules');
const COMPONENTS_DIR = path.join(BASE_DIR, 'app/components');

export default {
    INTERNAL_SERVER_PORT, //内部服务器端口
    INTERNAL_SERVER_HOST, //内部服务器HOST
    ACTIVITY_BUILD_DIR, //活动临时构建目录
    ACTIVITY_BASE_DIR, //activity-builder/activity目录
    ACTIVITY_OUTPUT_DIR, //活动导出目录
    META_FILE, //构建工具元数据配置文件
    DB_FILE, //数据库文件
    BASE_DIR, //Electron Base目录
    DATA_DIR, //activity-builder目录
    NODE_MODULES, 
    TMEPLATE_DIR, //模板目录
    COMPONENTS_DIR
}