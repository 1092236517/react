import { message } from 'antd';

const OSS_CONFIG = {
    production: {
        bucket_private: 'woda-app-private',
        bucket_public: 'woda-app-public'
    },
    dev: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    }
};
let oss = OSS_CONFIG[__ALIYUN_ENV__];
if (!oss) oss = OSS_CONFIG.dev;
oss.getImgPath = function (isPrivate = false) {
    if (!isPrivate && __ALIYUN_ENV__ == 'production') {
        return 'http://ima001.wodedagong.com/';
    }
    return "http://" + (isPrivate ? this.bucket_private : this.bucket_public) + ".oss-cn-shanghai.aliyuncs.com/";
};
oss.checkImage = function (file) {
    if (!file) return false;
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
        message.error('只允许上传jpg/png格式的图片');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('上传图片大小不能超过2M');
        return false;
    }
    return true;
};
window.oss = oss;
export default oss;