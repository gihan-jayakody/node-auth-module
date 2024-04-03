import config from 'config';

const CryptoJS = require('crypto-js');

exports.tokenDecryption = accessToken => new Promise((resolve, reject) => {
        try {
            const CRYPTO_SECRET = config.encryption.crypto_secret;
            const decryptedData = CryptoJS.AES.decrypt(accessToken, CRYPTO_SECRET);
            const decryptedDataStr = decryptedData.toString(CryptoJS.enc.Utf8);
            const decryptedToken = JSON.parse(JSON.stringify(decryptedDataStr));
            resolve(decryptedToken);
        } catch (err) {
            reject(err);
        }
    });
