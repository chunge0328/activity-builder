const path = nodeRequire('path');
const INTERNAL_SERVER_PORT = 8092;
const INTERNAL_SERVER_HOST = `http://127.0.0.1:${INTERNAL_SERVER_PORT}/`;
const ACTIVITY_BUILD_DIR = path.join(process.cwd(), "/src/app/build");
const DB_FILE = path.join(process.cwd(), '/src/data/data.db');
export default {
    INTERNAL_SERVER_PORT,
    INTERNAL_SERVER_HOST,
    ACTIVITY_BUILD_DIR,
    DB_FILE
}