import { isNumber, isString } from "./validator";

export default {
    success(data, { code, message }) {
        return {
            success: true,
            code: isNumber(code) ? code : 0,
            message: isString(message) ? message : '성공하였습니다',
            data: data,
        };
    },
    fail(error, { code }) {
        return {
            success: false,
            code: isNumber(code) ? code : -1,
            message: error.message,
            data: null,
        };
    }
};