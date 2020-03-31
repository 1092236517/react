import oss from 'ADMIN_CONFIG/ossConfig';

let uploadRule = {
    weekWageImp: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/weeklyWageManager/import/'
    },
    monthWageImp: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/monthlyWageManager/import/'
    },
    monthWageReissue: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/monthlyWageManager/monthWageReissue/'
    },
    // 劳务账户上传凭证
    labourCertificate: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/labourAccountManager/labourCertificate/'
    },
    resourceLogo: {
        bucket: oss.bucket_public,
        path: ' /zhouxinxin/web/resource/logo/'
    },
    // 身份证照片
    idCardPic: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
    },
    // 银行卡照片
    bankCardPic: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
    },
    // 工牌照片
    workCardPic: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
    },
    //  导入X
    settleMgrImportX: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/settleMgr/importX/'
    },
    //  筛选会员明细-上传文件
    memberImp: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/settleMgr/memberImp/'
    },
    // 工资单导入
    payrollImport: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/monthlyWageManager/payrollImport/'
    },
    //  文件管理
    fileMgr: {
        origin: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/fileMgr/origin/'
        },
        import: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/fileMgr/import/'
        }
    },
    //  盈利报表
    profit: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/profit/'
    },
    // 盈利报表修改调整金额
    profitJust: {
        AdjustY: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/profit/Adjusty/'
        },
        AdjustProfit: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/profit/adjustProfit/'
        }
    },
    // 盈利报表修改调整金额
    profitJustZX: {
        AdjustY: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/profitx/Adjusty/'
        },
        AdjustX: {
            bucket: oss.bucket_private,
            path: '/zhouxinxin/web/profitx/Adjustx/'
        }
    },
    profitX: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/profitX/'
    },
    // 利润留存报表
    profitKeep: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/profitKeep/'
    },
    // 到账出账
    entryImp: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/entryImp/'
    },
    // 公告推送上传文件
    pushMant: {
        bucket: oss.bucket_public,
        path: '/zxx/web/pushmant/'
    },
    // 返费劳务返费账单
    labourBill: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/labourBill/'
    },
    // 额外补贴
    perks: {
        bucket: oss.bucket_public,
        path: '/zhouxinxin/web/perks/'
    }

};
export default uploadRule;