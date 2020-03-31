import { RequestTransfer, toAsync } from "web-react-base-utils";

const transfer = new RequestTransfer();
transfer.config = {
    AppSetting: {
        AppVersion: '1.0.0',
        AppId: 'ZXX',
        AppKey: 'ZXXWeb',
        UidKey: 'UID',
        AppSecret: 'a323f9b6-1f04-420e-adb9-b06d142c5e63'
    }
};

export function setAuthInfo(authInfo) {
    transfer.config = { authInfo };
}

export default function request(url, param) {
    console.log("%c请求地址：", "color:red;", url);
    console.log("%c请求参数：", "color:red;", param);
    if (url.startsWith('http')) {
        return toAsync(fetch(url));
    } else {
        return toAsync(fetch('/api' + url, transfer.getRequestInit(param)));
    }
}
