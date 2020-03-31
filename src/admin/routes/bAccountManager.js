import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

// B端账户管理
export default [{
    // 劳务账户
    path: '/bAccountManager/labourAccount',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/labourAccount'),
        loading: lazyLoad
    })
}, {
    path: '/bAccountManager/labourAccount/LabourAccountDetail',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/labourAccount/accountDetail'),
        loading: lazyLoad
    })
}, {
    path: '/bAccountManager/labourAccount/spAccountBillDetail',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/labourAccount/applyAndAuthorization'),
        loading: lazyLoad
    })
}, {
    // 中介账户
    path: '/bAccountManager/agencyAccount',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/agencyAccount'),
        loading: lazyLoad
    })
}, {
    path: '/bAccountManager/agencyAccount/AgencyAccountDetail',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/agencyAccount/accountDetail'),
        loading: lazyLoad
    })
}, {
    // 出入金管理
    path: '/bAccountManager/entryAndExit',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/entryAndExit'),
        loading: lazyLoad
    })
}, {
    // 出入金管理
    path: '/bAccountManager/entryAndExitDetail',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/entryAndExitDetail'),
        loading: lazyLoad
    })
}, {
    path: '/bAccountManager/entryAndExit/allIn',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/entryAndExit/allIn'),
        loading: lazyLoad
    })
}, {
    // 平台盈利
    path: '/bAccountManager/platformProfit',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/platformProfit'),
        loading: lazyLoad
    })
}, {
    // 催款列表
    path: '/bAccountManager/dunningList',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/dunningList'),
        loading: lazyLoad
    })
}, {
    // 盈利报表
    path: '/bAccountManager/profit',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/profit'),
        loading: lazyLoad
    })
}, {
    // 1.0盈利报表
    path: '/bAccountManager/profitForX',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/profitForX'),
        loading: lazyLoad
    })
}, {
    // 盈利报表老的
    path: '/bAccountManager/profitOld',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/profitOld'),
        loading: lazyLoad
    })
}, {
    // 1.0盈利报表老的
    path: '/bAccountManager/profitForXOld',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/profitForXOld'),
        loading: lazyLoad
    })
}, {
    // 利润留存报表
    path: '/bAccountManager/profitKeep',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/profitKeep'),
        loading: lazyLoad
    })
}, {
    // 劳务押金
    path: '/bAccountManager/laborDepo',
    component: Loadable({
        loader: () => import('../pages/bAccountManager/laborDepo'),
        loading: lazyLoad
    })
}];