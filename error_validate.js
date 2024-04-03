import { errorCodes } from './constants';

const {
    CODE,
    INVALID_TOKEN,
    INVALID_USER,
    INVALID_SESSION,
    INVALID_USER_TOKEN,
    INVALID_LOGGED_IN_USER,
    USER_VALIDATION_FAILED
} = errorCodes;


const validateUserData = (sessionUser, userData) => {
    if (userData === undefined || userData.length === 0) {
        console.log('no user found > ', userData);
        return { code: CODE, type: INVALID_TOKEN, message: INVALID_USER_TOKEN };
    }

    if (sessionUser === undefined || !sessionUser) {
        console.log('No session user found > ');
        return { code: CODE, type: INVALID_USER, message: INVALID_LOGGED_IN_USER };
    }

    if (sessionUser.user_id !== userData[0]._id.toString()) {
        console.log('invalid session user found > ', userData);
        return { code: CODE, type: INVALID_SESSION, message: INVALID_LOGGED_IN_USER };
    }

    return undefined;
};

const initValidation = (accessToken, sessionUser) => {
    if (accessToken === undefined || !accessToken) {
        console.log('accessToken not found > ');
        return { code: CODE, type: INVALID_TOKEN, message: USER_VALIDATION_FAILED };
    }

    if (sessionUser === undefined || !sessionUser) {
        console.log('sessionUser not found > ');
        return { code: CODE, type: INVALID_SESSION, message: INVALID_LOGGED_IN_USER };
    }

    return null;
};

const fpInitValidation = accessToken => {
    if (accessToken === undefined || !accessToken) {
        console.log('accessToken not found > ');
        return { code: CODE, type: INVALID_TOKEN, message: USER_VALIDATION_FAILED };
    }

    return null;
};

const validateAdminUser = (decodedToken, userData) => {
    if (userData === undefined || userData === null || userData.length === 0) {
        console.log('no user found > ', userData);
        return { code: CODE, type: INVALID_TOKEN, message: INVALID_USER_TOKEN };
    }

    if (decodedToken.email !== userData.email) {
        console.log('invalid token user found > ', userData);
        return { code: CODE, type: INVALID_SESSION, message: INVALID_LOGGED_IN_USER };
    }

    return undefined;
};

export default {
    initValidation,
    validateUserData,
    fpInitValidation,
    validateAdminUser
};
