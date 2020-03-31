module.exports = [{
    // 发薪: 查询重发授权申请
    path: '/ZXX_Remit/ZXX_Remit_QueryReAudit',
    method: 'post',
    response: (req, res) =>({
        Data: {
            "RecordCount": 100,
            "RecordList|30": [
                {
                    "ReApplyID|+1": 1,
                    "AuditBy": "@cname()",
                    "AuditSts|1": [1, 2],
                    "AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "TransferTm": '@datetime("yyyy-MM-dd")',
                    "CreatedTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "CreatedBy": "@cname()",
                    "BillSrce|1": [1, 2],
                    "TradeTyp|1": [1, 2, 3],
                    "BillBatchID|+1": 20,
                    "DealAmt": 46541,
                    "TransferRemark": "打款说明~~~~",
                    "BankCardNum": '74684157646874646',
                    "BankName": "@cname()",
                    "RealName": "@cname()",
                    "IDCardNum": '6168412487453715121'
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}

];
