import decryption from './decryption';
import verification from './verification';
import validation from './validation';
import errorValidate from './error_validate';
import { errorCodes, requestTypes } from './constants';
import { USER_TYPE } from '../models/constants';

const {
    CODE,
    INVALID_TOKEN
} = errorCodes;

const {
    FORGOT_PASSWORD_AUTH,
    STANDARD_AUTH
    } = requestTypes;

const errorResponse = (res, obj) => {
    res.status(CODE).json({ message: obj.message, type: obj.type });
};

const tokenBasedAuth = (res, next, accessToken, sessionUser, roles) => {
    decryption.tokenDecryption(accessToken)
        .then(
            decryptedToken => verification.tokenVerification(decryptedToken, STANDARD_AUTH),
            error => { throw error; }
        )
        .then(
            decodedToken => {
                if (!decodedToken) { throw new Error('Token validation failed'); }
                const userType = decodedToken.user_type;

                if (roles && roles.indexOf(userType) !== -1) {
                    return validation.tokenValidation(decodedToken);
                } else {
                    throw new Error('Unauthorized Access');
                }
            },
            error => { throw error; }
        )
        .then(
            userData => {
                const validateData = errorValidate.validateUserData(sessionUser, userData.result);
                if (validateData) {
                    errorResponse(res, ...validateData);
                    return;
                }
                next();
            },
            error => { throw error; }
        )
        .catch(err => {
            console.log('auth error ', err);
            errorResponse(res, { code: CODE, type: INVALID_TOKEN, message: err.message });
        });
};


const forgotPwTokenBasedAuth = (res, next, accessToken) => {
    let _decoded;
    verification.tokenVerification(accessToken, FORGOT_PASSWORD_AUTH)
        .then(
            decodedToken => {
                if (!decodedToken) { throw new Error('Token validation failed'); }
                _decoded = decodedToken;
                return validation.forgotPwTokenValidation(decodedToken, accessToken);
            },
            error => { throw error; }
        )
        .then(
            admin => {
                const validateData = errorValidate.validateAdminUser(_decoded, admin.result);
                if (validateData) {
                    errorResponse(res, validateData);
                    return;
                }
                next();
            },
            error => { throw error; }
        )
        .catch(err => {
            console.log('auth error ', err);
            errorResponse(res, { code: CODE, type: INVALID_TOKEN, message: err.message });
        });
};

export default {
    errorResponse,
    tokenBasedAuth,
    forgotPwTokenBasedAuth
};
