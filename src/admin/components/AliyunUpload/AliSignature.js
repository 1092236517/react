import {getSercetKey} from 'ADMIN_SERVICE/AliyunService';
import oss from 'ADMIN_CONFIG/ossConfig';
import {message} from 'antd';
import moment from 'moment';

const CONFIG = {
    REGION: 'oss-cn-shanghai',
    BUCKET_PRIVATE: oss.bucket_private,
    BUCKET_PUBLIC: oss.bucket_public,
    END_POINT: 'aliyun-oss'
};

// 调整阿里云权限获取逻辑
// 1.判断存在未过期的key时，不在请求key直接使用
// 2.判断500ms内请求过权限时，不再重新请求
let AliyunKey;
let AliyunKeyPromise;
let AliyunKeyLastTmp;

export default class AliSignature {
    async clientWrapper(opts) {
        const OSS = await import('ali-oss');
        if (!AliyunKey || moment(AliyunKey.Expiration).diff(moment()) < 1000) {
            let nowTmp = new Date().getTime();
            if (!AliyunKeyPromise || nowTmp - AliyunKeyLastTmp > 500) {
                AliyunKeyPromise = getSercetKey();
                AliyunKeyLastTmp = nowTmp;
            }
            return new Promise(function (resolve, reject) {
                AliyunKeyPromise.then(function (resData) {
                    AliyunKey = resData.Data || {};
                    let client = new OSS.Wrapper({
                        accessKeyId: AliyunKey.AccessKeyId,
                        accessKeySecret: AliyunKey.AccessKeySecret,
                        bucket: opts.bucket || CONFIG.BUCKET_PUBLIC,
                        region: opts.region || CONFIG.REGION,
                        stsToken: AliyunKey.SecurityToken
                    });
                    resolve(client);
                }, function () {
                    message.error('连接阿里云服务器失败（get STS failed）');
                    reject('Get aliyun sercetKey error.');
                });
            });
        }
        return new Promise(function (resolve) {
            let client = new OSS.Wrapper({
                accessKeyId: AliyunKey.AccessKeyId,
                accessKeySecret: AliyunKey.AccessKeySecret,
                bucket: opts.bucket || CONFIG.BUCKET_PUBLIC,
                region: opts.region || CONFIG.REGION,
                stsToken: AliyunKey.SecurityToken
            });
            resolve(client);
        });
    }
}