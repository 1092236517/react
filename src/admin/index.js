if (!window.fetch) {
    import('whatwg-fetch');
}
import {BrowserMatch} from 'web-react-base-utils';

const browserV = BrowserMatch.getBrowserV();
const needBrowserV = {
    chrome: 50,
    opera: 54,
    firefox: 50,
    safari: 10,
    IE: 11
};

function checkBrowser() {
    const nv = needBrowserV[browserV.browser];
    if (nv && browserV.versionCode >= nv) {
        import('./app');
    } else {
        document.write("<div style='position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100; width: 100%; height: 100%; padding-top: 200px;  background-color: #fff'>" +
            "<p style='font-size: 40px; text-align: center'>浏览器版本太低，部分功能将无法使用！" +
            "<br><span style='font-size: 28px; text-align: center; color: #666666'>" +
            `当前浏览器内核版本: ${browserV.browser} ${browserV.version}` +
            "</span><br>" +
            "<span style='font-size: 28px;'>建议您使用最新版本360极速浏览器。<a style='text-decoration: underline' href='https://browser.360.cn/ee/' target='_blank'>前往下载>></a></span>" +
            "</p>" +
            "</div>");
    }
}

checkBrowser();