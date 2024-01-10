import { isNumber, isString } from "./validator.js";

export default {
    success(data, config) {
        return {
            success: true,
            code: config && 'code' in config && isNumber(config.code) ? config.code : 0,
            message: config && 'message' in config && isString(config.message) ? config.message : '성공하였습니다',
            data: data,
        };
    },
    fail(error, config) {
        return {
            success: false,
            code: config && 'code' in config && isNumber(config.code) ? config.code : -1,
            message: error.message,
            data: null,
        };
    }
};