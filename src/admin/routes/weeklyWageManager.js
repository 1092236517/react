import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/weeklyWageManager/import',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/import'),
        loading: lazyLoad
    })
},
{
    path: '/weeklyWageManager/perks',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/perks'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/importRecord',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/importRecord'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/departurePredict',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/departurePredict'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/list',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/list'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/reissue',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/reissue'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/bill',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/bill'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/bill/:batchID',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/billDetail'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/bill/:batchID/:from',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/billDetail'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/leak',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/leak'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/noWeekBillLeakOut',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/noWeekBillLeakOut'),
        loading: lazyLoad
    })
}, {
    path: '/weeklyWageManager/progressOfPay',
    component: Loadable({
        loader: () => import('../pages/weeklyWageManager/progressOfPay'),
        loading: lazyLoad
    })
}];

