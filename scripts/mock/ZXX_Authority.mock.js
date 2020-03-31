module.exports = [{
    path: '/ZXX_Authority/ZXX_AUTH_LoadResources',
    method: 'post',
    response: (req, res) => ({
        Data: {
            Resources: [
                {
                    ResID: 9999,
                    NavUrl: "/",
                    Name: '周薪薪后台',
                    Remark: "测试内容51b5",
                    Type: 0,
                    SubResources: [
                        {
                            ResID: 1,
                            NavUrl: "/informationQuery",
                            Name: '用户信息查询',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 11,
                                    Name: '身份证信息查询',
                                    NavUrl: "/informationQuery/idCard",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 12,
                                    Name: '银行卡信息查询',
                                    NavUrl: "/informationQuery/bankCard",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 13,
                                    Name: '工牌信息查询',
                                    NavUrl: "/informationQuery/workCard",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 2,
                            NavUrl: "/basicData",
                            Name: '基础数据',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 21,
                                    Name: '企业基础数据',
                                    NavUrl: "/basicData/company",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 22,
                                    Name: '劳务基础数据',
                                    NavUrl: "/basicData/labar",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 23,
                                    Name: '中介基础数据',
                                    NavUrl: "/basicData/intermediaryAgent",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 24,
                                    Name: '银行付款账号管理',
                                    NavUrl: "/basicData/bankPayAccount",
                                    Remark: "测试内容1",
                                    SubResources: [{
                                        "Name": "停用",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-bankPayAccount-disableAccountX",
                                        "ResID": 124,
                                        "Remark": "",
                                        "IconUrl": ""
                                    },
                                    {
                                        "Name": "启用",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-bankPayAccount-enableAccountX",
                                        "ResID": 125,
                                        "Remark": "",
                                        "IconUrl": ""
                                    },
                                    {
                                        "Name": "新增",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-bankPayAccount-addAccountX",
                                        "ResID": 126,
                                        "Remark": "",
                                        "IconUrl": ""
                                    },
                                    {
                                        "Name": "修改",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-bankPayAccount-editAccountX",
                                        "ResID": 127,
                                        "Remark": "",
                                        "IconUrl": ""
                                    }],
                                    Type: 1
                                },
                                {
                                    ResID: 25,
                                    Name: '会员打款虚拟子账户',
                                    NavUrl: "/basicData/memberPayAccount",
                                    Remark: "测试内容1",
                                    SubResources: [{
                                        "Name": "新增",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-memberPayAccount-addAccountX",
                                        "ResID": 128,
                                        "Remark": "",
                                        "IconUrl": ""
                                    },
                                    {
                                        "Name": "修改",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-memberPayAccount-editAccountX",
                                        "ResID": 129,
                                        "Remark": "",
                                        "IconUrl": ""
                                    }],
                                    Type: 1
                                },
                                {
                                    ResID: 26,
                                    Name: '中介打款虚拟子账户',
                                    NavUrl: "/basicData/agentPayAccount",
                                    Remark: "测试内容1",
                                    SubResources: [{
                                        "Name": "新增",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-agentPayAccount-addAccountX",
                                        "ResID": 130,
                                        "Remark": "",
                                        "IconUrl": ""
                                    },
                                    {
                                        "Name": "修改",
                                        "SubResources": [],
                                        "Type": 2,
                                        "NavUrl": "",
                                        "BtnUid": "basicData-agentPayAccount-editAccountX",
                                        "ResID": 131,
                                        "Remark": "",
                                        "IconUrl": ""
                                    }],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            "ResID": 3,
                            "Name": '名单订单',
                            "NavUrl": "/orderlist",
                            "Remark": "测试内容1",
                            SubResources: [
                                {
                                    "ResID": 31,
                                    "Name": '名单管理',
                                    "NavUrl": "/orderlist/listManager",
                                    "Remark": "测试内容1",
                                    SubResources: [],
                                    "Type": 1
                                },
                                {
                                    "ResID": 32,
                                    "Name": '订单管理',
                                    "NavUrl": "/orderlist/orderManager",
                                    "Remark": "测试内容1",
                                    SubResources: [],
                                    "Type": 1
                                }
                            ],
                            "Type": 1
                        },
                        {
                            "ResID": 4,
                            "Name": '打卡记录管理',
                            "NavUrl": "/clickin",
                            "Remark": "测试内容1",
                            "Type": 1
                        },
                        {
                            ResID: 5,
                            NavUrl: "/weeklyWageManager",
                            Name: '周薪管理',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 51,
                                    Name: '导入周薪',
                                    NavUrl: "/weeklyWageManager/import",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 52,
                                    Name: '导入周薪记录',
                                    NavUrl: "/weeklyWageManager/importRecord",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 53,
                                    Name: '周薪查询',
                                    NavUrl: "/weeklyWageManager/list",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 54,
                                    Name: '周薪账单',
                                    NavUrl: "/weeklyWageManager/bill",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 55,
                                    Name: '补发周薪',
                                    NavUrl: "/weeklyWageManager/reissue",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 6,
                            NavUrl: "/monthlyWageManager",
                            Name: '月薪管理',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 61,
                                    Name: '导入月薪',
                                    NavUrl: "/monthlyWageManager/import",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 62,
                                    Name: '导入月薪记录',
                                    NavUrl: "/monthlyWageManager/importRecord",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 63,
                                    Name: '月薪查询',
                                    NavUrl: "/monthlyWageManager/list",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 64,
                                    Name: '月薪账单',
                                    NavUrl: "/monthlyWageManager/bill",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 65,
                                    Name: '补发月薪',
                                    NavUrl: "/monthlyWageManager/reissue",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 7,
                            NavUrl: "/payOffManager",
                            Name: '发薪授权',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 71,
                                    Name: '发薪申请',
                                    NavUrl: "/payOffManager/Apply",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 72,
                                    Name: '授权',
                                    NavUrl: "/payOffManager/Authorization",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 73,
                                    Name: '重发授权',
                                    NavUrl: "/payOffManager/ReAuthorization",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 8,
                            NavUrl: "/withdrawManager",
                            Name: '打款管理',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 81,
                                    Name: '发薪',
                                    NavUrl: "/withdrawManager/pay",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }, {
                                    ResID: 82,
                                    Name: '退回列表',
                                    NavUrl: "/withdrawManager/back",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 9,
                            NavUrl: "/bAccountManager",
                            Name: 'B端账户管理',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 91,
                                    Name: '出入金审核',
                                    NavUrl: "/bAccountManager/entryAndExit",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 92,
                                    Name: '劳务账单',
                                    NavUrl: "/bAccountManager/labourAccount",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                },
                                {
                                    ResID: 93,
                                    Name: '中介账户',
                                    NavUrl: "/bAccountManager/agencyAccount",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        },
                        {
                            ResID: 10,
                            NavUrl: "/system",
                            Name: '系统管理',
                            Remark: "测试内容51b5",
                            Type: 0,
                            SubResources: [
                                {
                                    ResID: 103,
                                    Name: '平台菜单管理',
                                    NavUrl: "/system/menu/pt",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }, {
                                    ResID: 104,
                                    Name: '平台角色管理',
                                    NavUrl: "/system/role/pt",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }, {
                                    ResID: 105,
                                    Name: '平台用户管理',
                                    NavUrl: "/system/user",
                                    Remark: "测试内容1",
                                    SubResources: [],
                                    Type: 1
                                }
                            ]
                        }
                    ]
                }

            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_Authority/ZXX_AUTH_LoadSysResources',
    method: 'post',
    response: (req, res) => ({
        "Code": 0,
        "Desc": "成功",
        "Data": {
            "Resources": [{
                ResID: 9999,
                NavUrl: "/",
                Name: '周薪薪后台',
                Remark: "测试内容51b5",
                Type: 0,
                SubResources: [
                    {
                        ResID: 1,
                        NavUrl: "/informationQuery",
                        Name: '用户信息查询',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 11,
                                Name: '身份证信息查询',
                                NavUrl: "/informationQuery/idCard",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 12,
                                Name: '银行卡信息查询',
                                NavUrl: "/informationQuery/bankCard",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 13,
                                Name: '工牌信息查询',
                                NavUrl: "/informationQuery/workCard",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 2,
                        NavUrl: "/basicData",
                        Name: '基础数据',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 21,
                                Name: '企业基础数据',
                                NavUrl: "/basicData/company",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 22,
                                Name: '劳务基础数据',
                                NavUrl: "/basicData/labar",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 23,
                                Name: '中介基础数据',
                                NavUrl: "/basicData/intermediaryAgent",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 24,
                                Name: '银行付款账号管理',
                                NavUrl: "/basicData/bankPayAccount",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 25,
                                Name: '会员打款虚拟子账户',
                                NavUrl: "/basicData/memberPayAccount",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 26,
                                Name: '中介打款虚拟子账户',
                                NavUrl: "/basicData/agentPayAccount",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        "ResID": 3,
                        "Name": '名单订单',
                        "NavUrl": "/orderlist",
                        "Remark": "测试内容1",
                        SubResources: [
                            {
                                "ResID": 31,
                                "Name": '名单管理',
                                "NavUrl": "/orderlist/listManager",
                                "Remark": "测试内容1",
                                SubResources: [],
                                "Type": 1
                            },
                            {
                                "ResID": 32,
                                "Name": '订单管理',
                                "NavUrl": "/orderlist/orderManager",
                                "Remark": "测试内容1",
                                SubResources: [],
                                "Type": 1
                            }
                        ],
                        "Type": 1
                    },
                    {
                        "ResID": 4,
                        "Name": '打卡记录管理',
                        "NavUrl": "/clickin",
                        "Remark": "测试内容1",
                        "Type": 1
                    },
                    {
                        ResID: 5,
                        NavUrl: "/weeklyWageManager",
                        Name: '周薪管理',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 51,
                                Name: '导入周薪',
                                NavUrl: "/weeklyWageManager/import",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 52,
                                Name: '导入周薪记录',
                                NavUrl: "/weeklyWageManager/importRecord",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 53,
                                Name: '周薪查询',
                                NavUrl: "/weeklyWageManager/list",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 54,
                                Name: '周薪账单',
                                NavUrl: "/weeklyWageManager/bill",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 55,
                                Name: '补发周薪',
                                NavUrl: "/weeklyWageManager/reissue",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 6,
                        NavUrl: "/monthlyWageManager",
                        Name: '月薪管理',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 61,
                                Name: '导入月薪',
                                NavUrl: "/monthlyWageManager/import",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 62,
                                Name: '导入月薪记录',
                                NavUrl: "/monthlyWageManager/importRecord",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 63,
                                Name: '月薪查询',
                                NavUrl: "/monthlyWageManager/list",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 64,
                                Name: '月薪账单',
                                NavUrl: "/monthlyWageManager/bill",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 65,
                                Name: '补发月薪',
                                NavUrl: "/monthlyWageManager/reissue",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 7,
                        NavUrl: "/payOffManager",
                        Name: '发薪授权',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 71,
                                Name: '发薪申请',
                                NavUrl: "/payOffManager/Apply",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 72,
                                Name: '授权',
                                NavUrl: "/payOffManager/Authorization",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 73,
                                Name: '重发授权',
                                NavUrl: "/payOffManager/ReAuthorization",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 8,
                        NavUrl: "/withdrawManager",
                        Name: '打款管理',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 81,
                                Name: '发薪',
                                NavUrl: "/withdrawManager/pay",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }, {
                                ResID: 82,
                                Name: '退回列表',
                                NavUrl: "/withdrawManager/back",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 9,
                        NavUrl: "/bAccountManager",
                        Name: 'B端账户管理',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 91,
                                Name: '出入金审核',
                                NavUrl: "/bAccountManager/entryAndExit",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 92,
                                Name: '劳务账单',
                                NavUrl: "/bAccountManager/labourAccount",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            },
                            {
                                ResID: 93,
                                Name: '中介账户',
                                NavUrl: "/bAccountManager/agencyAccount",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    },
                    {
                        ResID: 10,
                        NavUrl: "/system",
                        Name: '系统管理',
                        Remark: "测试内容51b5",
                        Type: 0,
                        SubResources: [
                            {
                                ResID: 103,
                                Name: '平台菜单管理',
                                NavUrl: "/system/menu/pt",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }, {
                                ResID: 104,
                                Name: '平台角色管理',
                                NavUrl: "/system/role/pt",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }, {
                                ResID: 105,
                                Name: '平台用户管理',
                                NavUrl: "/system/user",
                                Remark: "测试内容1",
                                SubResources: [],
                                Type: 1
                            }
                        ]
                    }
                ]
            }]
        }
    })
}, {
    path: '/ZXX_Authority/ZXX_AUTH_LoadRoleList',
    method: 'post',
    response: (req, res) => ({
        "Code": 0,
        "Desc": "成功",
        "Data": {
            "RoleList": [{
                "RID": 1001,
                "Department": 1,
                "Name": "1te",
                "Remark": "1000",
                "ResourceIDs": [1000, 1001, 1002, 1008, 1009, 1007, 1003, 1004, 1022, 1023, 1024, 1019, 1021, 1027, 1028, 1030, 1036, 1037, 1038, 1041, 1042, 1046, 1045, 1011, 1010, 1048, 1049, 1050, 1047, 1054, 1057, 1055, 1051, 1053, 1056, 1052]
            }, { "RID": 1010, "Department": 0, "Name": "测试", "Remark": "", "ResourceIDs": [] }, {
                "RID": 1007,
                "Department": 0,
                "Name": "517权限测试角色",
                "Remark": "517权限测试角色",
                "ResourceIDs": []
            }, { "RID": 1004, "Department": 0, "Name": "测试角色1", "Remark": "", "ResourceIDs": [] }, {
                "RID": 1002,
                "Department": 0,
                "Name": "测试角色",
                "Remark": "",
                "ResourceIDs": []
            }, {
                "RID": 1000,
                "Department": 1,
                "Name": "管理员",
                "Remark": "",
                "ResourceIDs": [1007, 1000, 1003, 1004, 1008, 1010, 1012, 1013, 1014, 1009, 1018, 1019, 1022, 1023, 1021, 1024, 1011, 1026, 1028, 1027, 1030, 1031, 1032, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1001, 1002, 1025, 1046, 1045, 1057, 1056, 1054, 1048, 1052, 1049, 1055, 1050, 1051, 1053, 1047]
            }]
        }
    })
}, {
    path: '/ZXX_Authority/ZXX_AUTH_QueryUser',
    method: 'post',
    response: (req, res) => ({
        "Code": 0,
        "Desc": "成功",
        "Data": {
            "Users": [{
                "CnName": "黑色星期五",
                "Department": 0,
                "Mobile": "18702513870",
                "EnName": "abcde",
                "UID": 1015,
                "Nickname": "yinwen字幕",
                "IsValide": 1,
                "CreateTime": "2018-07-03 15:42:04",
                "Roles": [{ "RID": 1007, "RoleName": "517权限测试角色" }]
            }, {
                "CnName": "臧小娜",
                "Department": 0,
                "Mobile": "13913214345",
                "EnName": "nana",
                "UID": 1014,
                "Nickname": "nana",
                "IsValide": 1,
                "CreateTime": "2018-07-02 10:32:34",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1002, "RoleName": "测试角色" }, {
                    "RID": 1004,
                    "RoleName": "测试角色1"
                }, { "RID": 1007, "RoleName": "517权限测试角色" }]
            }, {
                "CnName": "李明玉",
                "Department": 0,
                "Mobile": "18397109457",
                "EnName": "",
                "UID": 1013,
                "Nickname": "",
                "IsValide": 1,
                "CreateTime": "2018-06-30 18:09:10",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1001, "RoleName": "1te" }, {
                    "RID": 1002,
                    "RoleName": "测试角色"
                }, { "RID": 1004, "RoleName": "测试角色1" }]
            }, {
                "CnName": "刘自成",
                "Department": 1,
                "Mobile": "15850383369",
                "EnName": "kingchuang",
                "UID": 1012,
                "Nickname": "闯王",
                "IsValide": 1,
                "CreateTime": "2018-06-30 15:11:37",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1001, "RoleName": "1te" }, {
                    "RID": 1002,
                    "RoleName": "测试角色"
                }, { "RID": 1004, "RoleName": "测试角色1" }]
            }, {
                "CnName": "黑色星期五",
                "Department": 1,
                "Mobile": "18702513822",
                "EnName": "anihjhi",
                "UID": 1011,
                "Nickname": "哈哈哈kkk",
                "IsValide": 1,
                "CreateTime": "2018-06-29 19:25:10",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1001, "RoleName": "1te" }, {
                    "RID": 1002,
                    "RoleName": "测试角色"
                }, { "RID": 1004, "RoleName": "测试角色1" }, { "RID": 1007, "RoleName": "517权限测试角色" }]
            }, {
                "CnName": "你猜啊测试",
                "Department": 0,
                "Mobile": "18702513098",
                "EnName": "anihjhi te",
                "UID": 1010,
                "Nickname": "ewe",
                "IsValide": 1,
                "CreateTime": "2018-06-29 19:20:59",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1004, "RoleName": "测试角色1" }, {
                    "RID": 1007,
                    "RoleName": "517权限测试角色"
                }]
            }, {
                "CnName": "李倩",
                "Department": 0,
                "Mobile": "18702513871",
                "EnName": "ggggs",
                "UID": 1009,
                "Nickname": "李倩",
                "IsValide": 1,
                "CreateTime": "2018-06-29 17:28:18",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1004, "RoleName": "测试角色1" }]
            }, {
                "CnName": "高歌",
                "Department": 0,
                "Mobile": "15711659597",
                "EnName": "gegao",
                "UID": 1008,
                "Nickname": "高歌",
                "IsValide": 1,
                "CreateTime": "2018-06-29 15:43:34",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }]
            }, {
                "CnName": "你猜啊测试",
                "Department": 0,
                "Mobile": "18702513876",
                "EnName": "anihjhi",
                "UID": 1007,
                "Nickname": "哈哈哈kkk",
                "IsValide": 1,
                "CreateTime": "2018-06-29 14:40:53",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }]
            }, {
                "CnName": "王彬",
                "Department": 0,
                "Mobile": "15951935038",
                "EnName": "Demons",
                "UID": 1006,
                "Nickname": "饭米粒",
                "IsValide": 1,
                "CreateTime": "2018-06-29 14:36:17",
                "Roles": [{ "RID": 1000, "RoleName": "管理员" }, { "RID": 1001, "RoleName": "1te" }, {
                    "RID": 1002,
                    "RoleName": "测试角色"
                }, { "RID": 1004, "RoleName": "测试角色1" }, { "RID": 1007, "RoleName": "517权限测试角色" }]
            }], "Count": 16
        }
    })
}];
