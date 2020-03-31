import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';

export default [{
    path: '/orderlist/listManager',
    component: Loadable({
        loader: () => import('../pages/orderlist/listManager'),
        loading: lazyLoad
    })
}, {
    path: '/orderlist/orderManager',
    component: Loadable({
        loader: () => import('../pages/orderlist/orderManager'),
        loading: lazyLoad
    })
}];

