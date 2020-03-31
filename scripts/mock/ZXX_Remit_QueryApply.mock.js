module.exports = [{
    // 发薪: 查询申请
    path: '/ZXX_Remit/ZXX_Remit_QueryApply',
    method: 'post',
    response: (req, res) =>({
        Data: {
            "RecordCount": 100,
            "RecordList|30": [
                {
                    "AgentAmt|+1000": 1000,
                    "ApplyID|+1": 1,
                    "AuditBy": "@cname()",
                    "AuditSts|1": [1, 2, 3],
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "EntID": 1001,
                    "TrgtSpID": 3002,
                    "SrceSpID": 2003,
                    "TotAmt": 86427,
                    "TotCnt": 4745,
                    "PlatformSrvcAmt": 57557,
                    "PlanTransferDt": '@datetime("yyyy-MM-dd")',
                    "CreatedTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "CreatedBy": "@cname()",
                    "BillSrce|1": [1, 2],
                    "BillBatchTyp|1": [1, 2],
                    "BillBatchID|+1": 20,
                    "SettleBeginDt": '@datetime("yyyy-MM-dd")',
                    "SettleEndDt": '@datetime("yyyy-MM-dd")'
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}

];
