module.exports = [{
    // 发薪: 查询重发授权申请
    path: '/ZXX_FundAduj/ZXX_FundAduj_GetList',
    method: 'post',
    response: (req, res) =>({
        Data: {
            "RecordCount": 30,
            "RecordList|30": [
                {
                    "Amount": 46541,
                    "ApplyUserID|+1": 1,
                    "RecordID|+1": 46,
                    "AuditStatus|1": [1, 2, 3],
                    "CreateTime": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "AuditTime": '@datetime("yyyy-MM-dd")',
                    "SPContactName": "@cname()",
                    "TradeType|1": [1, 2, 3, 4],
                    "AuditUserID|+1": 20,
                    "AuditRemark": "审核备注~~~~",
                    "Remark": "备注",
                    "SPContactMobile": '13587496545',
                    "ApplyUserName": "@cname()",
                    "AuditUserName": "@cname()",
                    "SPID": 22121,
                    "SPType": 2,
                    "SPShortName": "昆山中劳",
                    "SPFullName": "江苏昆山中劳"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}

];
