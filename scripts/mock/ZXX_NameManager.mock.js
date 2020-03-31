module.exports = [{
    // 作废名单
    path: '/ZXX_NameManager/ZXX_DeleteNameByIdList',
    method: 'post',
    response: (req, res) =>({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 同步名单
    path: '/ZXX_NameManager/ZXX_SynchronousNameList',
    method: 'post',
    response: (req, res) =>({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 导出名单
    path: '/ZXX_NameManager/ZXX_ExportNameListToExcel',
    method: 'post',
    response: (req, res) =>({
        "Data": {
            FileUrl: 'baidu.com'
        },
        "Code": 0,
        "Desc": '成功'
    })
}, {
    // 绑定名单
    path: '/ZXX_NameManager/ZXX_BindOrder',
    method: 'post',
    response: (req, res) =>({
        "Code": 0,
        "Desc": '成功'
    })
}, {
    path: '/ZXX_NameManager/ZXX_GetNameList',
    method: 'post',
    response: (req, res) => {
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                "RecordList|30": [
                    {
                        "IntvDt": '@datetime("yyyy-MM-dd")',
                        "CreateTm": '@datetime("yyyy-MM-dd")',
                        "EntShortName": "@cname",
                        "EntId": "@cname",
                        "EntryDt": '@datetime("yyyy-MM-dd")',
                        "SrceSpId": "@cname",
                        "SrceSpName": "@cname",
                        "IdCardNum": "@cname",
                        "IntvSts|1": [2, 3, 4],
                        "IsBindOrder|1": [2, 1],
                        "IsValid|1": [2, 1],
                        "LeaveDt": '@datetime("yyyy-MM-dd")',
                        "WorkSts|1": [2, 1, 3],
                        "Mobile": /^1[385][1-9]\d{8}/,
                        "OrderDetail": "@cname",
                        "OrderStatus|1": [2, 1],
                        "Realname": "@cname",
                        "TrgtSpId": "@increment",
                        "TrgtSpName": "@cname",
                        "Uuid": "@increment"
                    }
                ],
                "RecordCount|1": [20, 30]
            }
        };
    }
}];
