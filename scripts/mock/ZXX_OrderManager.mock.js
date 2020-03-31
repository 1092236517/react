module.exports = [{
    // 作废订单
    path: '/ZXX_OrderManager/ZXX_DeleteOrderByIdList',
    method: 'post',
    response: (req, res) =>({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 导出订单
    path: '/ZXX_OrderManager/ZXX_ExportOrderListToExcel',
    method: 'post',
    response: (req, res) =>({
        "Data": {
            FileUrl: 'baidu.com'
        },
        "Code": 0,
        "Desc": '成功'
    })
}, {
    // 新建订单
    path: '/ZXX_OrderManager/ZXX_CreateNewOrder',
    method: 'post',
    response: (req, res) =>({
        "Code": 0,
        "Desc": '成功'
    })
}, {
    // 获取订单列表
    path: '/ZXX_OrderManager/ZXX_GetOrderList',
    method: 'post',
    response: (req, res) => {
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                "RecordList|30": [
                    {
                        "CreateBy": '@increment',
                        "CreateName": '@cname',
                        "CreateTm": "@datetime(\"yyyy-MM-dd\")",
                        "EntId": "@increment",
                        "EntName": '@cname',
                        "IsValid|1": [1, 2],
                        "OrderDetail": "@cname",
                        "RcrtOrderId": "@increment",
                        "SrceSpId": "@increment",
                        "SrceSpName": "@cname",
                        "TrgtSpId": "@increment",
                        "TrgtSpName": "@cname"
                    }
                ],
                "RecordCount|1": [20, 30]
            }
        };
    }
}, {
    path: '/ZXX_OrderManager/ZXX_GetWaitToBindOrderList',
    method: 'post',
    response: (req, res) => {
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                "RecordList|30": [
                    {
                        "CreateTm": '@datetime("yyyy-MM-dd")',
                        "EntShortName": "@cname",
                        "EntId": "@cname",
                        "SrceSpId": "@cname",
                        "SrceSpName": "@cname",
                        "OrderDetail": "@cname",
                        "TrgtSpName": "@cname",
                        "RcrtOrderId": "@increment",
                        "TrgtSpId": "@increment"
                    }
                ],
                "RecordCount|1": [20, 30]
            }
        };
    }
}];
