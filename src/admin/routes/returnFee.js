import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/returnFee/detail',
    component: Loadable({
        loader: () => import('../pages/returnFee/detail'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/remitAudit',
    component: Loadable({
        loader: () => import('../pages/returnFee/remitAudit'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/remitImp',
    component: Loadable({
        loader: () => import('../pages/returnFee/remitImp'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/report',
    component: Loadable({
        loader: () => import('../pages/returnFee/report'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/bill',
    component: Loadable({
        loader: () => import('../pages/returnFee/bill'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/labourBill',
    component: Loadable({
        loader: () => import('../pages/returnFee/labourBill'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/memberApply',
    component: Loadable({
        loader: () => import('../pages/returnFee/memberApply'),
        loading: lazyLoad
    })
}, {
    path: '/returnFee/returnApplication',
    component: Loadable({
        loader: () => import('../pages/returnFee/returnApplication'),
        loading: lazyLoad
    })
}];
