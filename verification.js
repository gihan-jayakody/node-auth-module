import jwt from 'jsonwebtoken';
import config from 'config';
import { requestTypes } from './constants';

const TOKEN_SECRET  = config.encryption.token_secret;
const FORGOT_PW_SECRET = config.encryption.forgot_pw_secret;
const {
    STANDARD_AUTH
    } = requestTypes;

exports.tokenVerification = (decryptedToken, type) => new Promise((resolve, reject) => {
    const secret = type === STANDARD_AUTH ? TOKEN_SECRET : FORGOT_PW_SECRET;
        jwt.verify(decryptedToken, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
