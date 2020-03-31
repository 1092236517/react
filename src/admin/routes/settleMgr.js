import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/settleMgr/configAgentA',
    component: Loadable({
        loader: () => import('../pages/settleMgr/configAgentA'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/configX',
    component: Loadable({
        loader: () => import('../pages/settleMgr/configX'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/importX',
    component: Loadable({
        loader: () => import('../pages/settleMgr/importX'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/importXList',
    component: Loadable({
        loader: () => import('../pages/settleMgr/importXList'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/leakOutPerson',
    component: Loadable({
        loader: () => import('../pages/settleMgr/leakOutPerson'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/leakOutX',
    component: Loadable({
        loader: () => import('../pages/settleMgr/leakOutX'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/memberImpDetail',
    component: Loadable({
        loader: () => import('../pages/settleMgr/memberImpDetail'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/settleCount',
    component: Loadable({
        loader: () => import('../pages/settleMgr/settleCount'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/settleDetail',
    component: Loadable({
        loader: () => import('../pages/settleMgr/settleDetail'),
        loading: lazyLoad
    })
}, {
    path: '/settleMgr/xCount',
    component: Loadable({
        loader: () => import('../pages/settleMgr/xCount'),
        loading: lazyLoad
    })
}];

