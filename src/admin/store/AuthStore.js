import {observable, action, computed, autorun, toJS} from "mobx";
import {webLogin} from "ADMIN_SERVICE/ZXX_CMSLogin";
import {getVCode} from 'ADMIN_SERVICE/VCodeManager';
import {message} from 'antd';
import basename from 'ADMIN_CONFIG/basename';
import AES from 'crypto-js/aes';
import crypto_enc_u8 from 'crypto-js/enc-utf8';
import MD5 from 'crypto-js/md5';
import {sessionStorage} from 'ADMIN_UTILS/Storage';
import {ResponseCode} from "web-react-base-utils";
import {setAuthInfo} from 'ADMIN_UTILS/httpRequest';

const sessionStorageKey = MD5('zxx-admin').toString();

export default class {
    @observable authInfo = {};
    @observable loginFormInfo = {};
    @observable loginLoading = false;
    @observable getVCodeLoading = false;

    constructor() {
        try {
            const UID5 = sessionStorage.getItem(sessionStorageKey);
            if (!UID5) throw new Error();
            const AesKey = MD5(UID5 + sessionStorageKey).toString();
            const authInfoTxt = sessionStorage.getItem(AesKey);
            if (authInfoTxt) {
                this.authInfo = JSON.parse(AES.decrypt(authInfoTxt, AesKey).toString(crypto_enc_u8));
            } else {
                throw new Error();
            }
        } catch (ignore) {
            this.authInfo = {};
            sessionStorage.build();
        }
    }

    @action
    handleFormFieldsChange = (changedFields) => {
        this.loginFormInfo = {...this.loginFormInfo, ...changedFields};
    };

    @action
    handleLogin = async (fieldsValue) => {
        let {phone, pwd} = fieldsValue;
        this.loginLoading = true;
        try {
            let res = await webLogin({Mobile: phone, VerifyCode: pwd});
            this.refreshAuthInfo(res.Data);
        } catch (error) {
            message.error(error.message);
        }
        this.loginLoading = false;
    };

    @action
    refreshAuthInfo = (param) => {
        try {
            const authInfo = toJS(this.authInfo);
            const Data = {...authInfo, ...param};
            if (!Data.UID) return;
            const UID5 = MD5(Data.UID).toString();
            sessionStorage.putItem(sessionStorageKey, UID5);
            const AesKey = MD5(UID5 + sessionStorageKey).toString();
            sessionStorage.putItem(AesKey, AES.encrypt(JSON.stringify(Data), AesKey).toString());
            this.authInfo = Data;
        } catch (e) {
            this.authInfo = {};
        }
    };

    @action
    getVCode = async () => {
        this.getVCodeLoading = true;
        let phone = this.loginFormInfo.phone.value;
        try {
            let res = await getVCode({SPhone: phone});
            this.getVCodeLoading = false;
            return res.Data;
        } catch (e) {
            this.getVCodeLoading = false;
            throw e;
        }
    };

    @action
    handleLogout = () => {
        this.authInfo = {};
        sessionStorage.build();
        window.location.href = basename + '/';
    };

    @computed
    get isLogin() {
        return !!(this.authInfo && this.authInfo.Token && this.authInfo.UID);
    }

    @computed
    get loginEnable() {
        let {phone = {}, pwd = {}} = this.loginFormInfo;
        return phone.value && !phone.errors && pwd.value && !pwd.errors;
    }

    @computed
    get sendCodeEnable() {
        let {phone = {}} = this.loginFormInfo;
        return phone.value && !phone.errors;
    }

    setStorage = autorun(() => {
        setAuthInfo(toJS(this.authInfo || {}));
        ResponseCode.CODE_EVENT[ResponseCode.CODE_TYPE.GO_TO_LOGIN] = (res) => {
            this.handleLogout();
        };
    });
}