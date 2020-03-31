module.exports = [{
    // 发薪: 查询授权申请
    path: '/ZXX_Remit/ZXX_Remit_QueryAudit',
    method: 'post',
    response: (req, res) =>({
        Data: {
            "RecordCount": 100,
            "RecordList|30": [
                {
                    "AgentAmt|+1000": 1000,
                    "ApplyID|+1": 1,
                    "AuditBy": "@cname()",
                    "DataSt|1": [1, 2],
                    "AuditSts|1": [1, 2],
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "EntName": "中华企业",
                    "TrgtSpName": "昆山中劳",
                    "SrceSpName": "小明中介",
                    "TotAmt": 86427,
                    "TotCnt": 4745,
                    "PlatformSrvcAmt": 57557,
                    "PlanTransferDt": '@datetime("yyyy-MM-dd")',
                    "CreatedTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                    "CreatedBy": "@cname()",
                    "BillSrce|1": [1, 2],
                    "BillBatchTyp|1": [1, 2],
                    "BillBatchID|+1": 20,
                    "SysAgentAmt": 123456,
                    "SysPlatformSrvcAmt": 84153,
                    "SysTotAmt": 4548,
                    "SysTotCnt": 46541
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}

];
