import { CustomerModel, AdministratorModel } from '../models';
import { USER_TYPE } from '../models/constants';

const tokenValidation = decodedToken => (
        decodedToken.user_type === USER_TYPE.CUSTOMER ?
            CustomerModel.getCustomerById(decodedToken.user_id)
            :
            AdministratorModel.getAdministratorById(decodedToken.user_id)
);

const forgotPwTokenValidation = (decodedToken, accessToken) => (
    decodedToken && decodedToken.email ?
        AdministratorModel.verifyAdminAgent(decodedToken.email, accessToken)
        :
        null
);

export default {
    tokenValidation,
    forgotPwTokenValidation
};
