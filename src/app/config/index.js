import util from '../views/common/util';
const path = nodeRequire('path');
const INTERNAL_SERVER_PORT = 8092;
const ips = util.getLocalIps();
const IP = ips.length ? ips[0] : '127.0.0.1';
const INTERNAL_SERVER_HOST = `http://${IP}:${INTERNAL_SERVER_PORT}/`;
const ACTIVITY_BUILD_DIR = path.join(process.cwd(), '/src/app/activity/build');
const ACTIVITY_BASE_DIR = path.join(process.cwd(), '/src/app/activity');
const DB_FILE = path.join(process.cwd(), '/src/data/data.db');
export default {
    INTERNAL_SERVER_PORT,
    INTERNAL_SERVER_HOST,
    ACTIVITY_BUILD_DIR,
    ACTIVITY_BASE_DIR,
    DB_FILE
}