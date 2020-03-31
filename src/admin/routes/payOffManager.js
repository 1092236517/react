import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';

// 发薪审核
export default [{
    path: '/payOffManager/Apply',
    component: Loadable({
        loader: () => import('../pages/payOffManager/Apply'),
        loading: lazyLoad
    })
}, {
    path: '/payOffManager/Authorization',
    component: Loadable({
        loader: () => import('../pages/payOffManager/Authorization'),
        loading: lazyLoad
    })
}, {
    path: '/payOffManager/ReAuthorization',
    component: Loadable({
        loader: () => import('../pages/payOffManager/ReAuthorization'),
        loading: lazyLoad
    })
}];

