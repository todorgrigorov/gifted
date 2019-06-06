import envConfig from "../config/env-config";

export default {
    log(text) {
        if (envConfig.isDevelopment() && console.info) {
            console.info(text);
        }
    },
    logObject(obj) {
        if (envConfig.isDevelopment() && console.dir) {
            console.dir(obj);
        }
    }
}