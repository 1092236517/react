import informationQuery from './informationQuery'; // 用户信息查询
import basicData from './basicData'; // 基础数据
import systemManager from './systemManager';
import weeklyWageManager from './weeklyWageManager';
import withdrawManager from './withdrawManager';
import monthlyWageManager from './monthlyWageManager';
import payOffManager from './payOffManager';
import bAccountManager from './bAccountManager';
import orderlist from './orderlist'; // 名单订单管理
import clockInManager from './clockInManager'; // 打卡记录管理
import settleMgr from './settleMgr';
import fileMgr from './fileMgr';
import returnFee from './returnFee';
import dataBoard from './dataBoard';
import weekReturnFee from './weekReturnFee';
import riskFund from './riskFund';
import approvedBillVoided from "./approvedBillVoided";
import chatAnalysis from './chatAnalysis';
import carManager from './carManager';
export default function () {
    return {
        path: '/',
        indexPage: { // 首页，
            path: ''
        },
        children: [
            ...basicData,
            ...orderlist,
            ...clockInManager,
			...informationQuery,
            ...systemManager,
            ...weeklyWageManager,
            ...withdrawManager,
            ...monthlyWageManager,
            ...payOffManager,
            ...bAccountManager,
            ...settleMgr,
            ...fileMgr,
            ...returnFee,
            ...dataBoard,
            ...weekReturnFee,
            ...riskFund,
            ...approvedBillVoided,
            ...chatAnalysis,
            ...carManager
        ],
        onLastClose: { // 有些特殊页面，当最后一个关闭，需要跳转到指定页面
            '/basicData/company/edit': '/basicData/company',
            '/bAccountManager/agencyAccount/AgencyAccountDetail': '/bAccountManager/agencyAccount',
            '/bAccountManager/entryAndExit/allIn': '/bAccountManager/entryAndExit'
        }
    };
};
