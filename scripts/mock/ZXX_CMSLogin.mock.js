let IsNeedCreate = 0;

module.exports = [{
    path: '/ZXX_CMSLogin/ZXX_LOGIN_CMSLogin',
    method: 'post',
    response: (req, res) => {
        IsNeedCreate = Math.abs(IsNeedCreate - 1);
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                Roles: {
                    "RID": 1000,
                    "RoleName": "财务"
                },
                "CnName": "CnName",
                "EnName": "EnName",
                "Token": "n2BKxfm96Z4YbmHqo0HUmXHFc5DefEjD3c4x0PJIFdQ=",
                "ExpireTime": 1529305036,
                "UID": 100009,
                "Mobile": "18397109457",
                "NickName": "平平"
            }
        };
    }
}];