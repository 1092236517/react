module.exports = [{
    // 补打卡
    path: '/ZXX_SystemCfg/BankList',
    method: 'post',
    response: (req, res) =>({
        "Code": 0,
        "Desc": '成功',
        Data: {
            "RecordList|10": [
                {
                    BankName: "@cname",
                    CfgBankId: "@id"
                }
            ]
        }
    })
}];
