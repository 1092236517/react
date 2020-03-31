import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/withdrawManager/pay',
    component: Loadable({
        loader: () => import('../pages/withdrawManager/pay'),
        loading: lazyLoad
    })
}, {
    path: '/withdrawManager/back',
    component: Loadable({
        loader: () => import('../pages/withdrawManager/back'),
        loading: lazyLoad
    })
}];

