import errorValidate from './error_validate';
import authenticate from './authenticate';
import util from '../middleware/util';
import { requestTypes } from './constants';

const {
    FORGOT_PASSWORD_AUTH,
    STANDARD_AUTH
    } = requestTypes;

/**
 * common method to capture header data and validation
 * @param req
 * @param res
 * @param next
 * @param type
 * @returns {*}
 */
const bottomLine = (req, res, next, type) => {
    const accessToken = req.headers['handler-token'];
    const sessionUser = type === STANDARD_AUTH ? util.getCurrentSession(req) : null;

    const reqValid = type === STANDARD_AUTH ?
        errorValidate.initValidation(accessToken, sessionUser)
        : errorValidate.fpInitValidation(accessToken);
    if (reqValid) {
        authenticate.errorResponse(res, reqValid);
        return { isError: true };
    }
    return { isError: false, accessToken, sessionUser };
};


/**
 * Authentication method will handle customer log in and maintain session
 * @param req
 * @param res
 * @param next
 * @constructor
 */
const Authentication = (...accessRoles) => {
    const roles = accessRoles[0] ? accessRoles[0] : [];

    return (req, res, next) => {
        const acquired = bottomLine(req, res, next, STANDARD_AUTH);
        if (acquired.isError) {
            return;
        }
        const { accessToken, sessionUser } = acquired;
        authenticate.tokenBasedAuth(res, next, accessToken, sessionUser, roles);
    }
};

/**
 * AdminAuthentication method will handle admin log in and maintain session
 * @param req
 * @param res
 * @param next
 * @constructor
 */
const AdminAuthentication = (...accessRoles) => {
    const roles = accessRoles[0] ? accessRoles[0] : [];

    return (req, res, next) => {
        const acquired = bottomLine(req, res, next, STANDARD_AUTH);
        if (acquired.isError) {
            return;
        }
        const { accessToken, sessionUser } = acquired;

        authenticate.tokenBasedAuth(res, next, accessToken, sessionUser, roles);
    }
};

/**
 * fpwAuthentication method will handle forgot password token authentication
 * @param req
 * @param res
 * @param next
 */
const fpwAuthentication = (req, res, next) => {
    const acquired = bottomLine(req, res, next, FORGOT_PASSWORD_AUTH);
    if (acquired.isError) {
        return;
    }
    const { accessToken } = acquired;
    authenticate.forgotPwTokenBasedAuth(res, next, accessToken);
};

export default {
    Authentication,
    AdminAuthentication,
    fpwAuthentication
};
