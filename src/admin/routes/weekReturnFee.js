import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/weekReturnFee/imp',
    component: Loadable({
        loader: () => import(/* webpackChunkName: 'weekReturnFee-imp' */'../pages/weekReturnFee/imp'),
        loading: lazyLoad
    })
}, {
    path: '/weekReturnFee/list',
    component: Loadable({
        loader: () => import(/* webpackChunkName: 'weekReturnFee-list' */'../pages/weekReturnFee/list'),
        loading: lazyLoad
    })
}, {
    path: '/weekReturnFee/bill',
    component: Loadable({
        loader: () => import(/* webpackChunkName: 'weekReturnFee-bill' */'../pages/weekReturnFee/bill'),
        loading: lazyLoad
    })
}, {
    path: '/weekReturnFee/billDetail/:batchID',
    component: Loadable({
        loader: () => import(/* webpackChunkName: 'weekReturnFee-billDetail' */'../pages/weekReturnFee/billDetail'),
        loading: lazyLoad
    })
}, {
    path: '/weekReturnFee/reissue',
    component: Loadable({
        loader: () => import(/* webpackChunkName: 'weekReturnFee-reissue' */'../pages/weekReturnFee/reissue'),
        loading: lazyLoad
    })
}];