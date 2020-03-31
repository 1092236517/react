import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';

export default [{
    path: '/clickin',
    component: Loadable({
        loader: () => import('../pages/clockInManager/clockRecord'),
        loading: lazyLoad
    })
}, {
    path: '/clockInManager/clockStatistic',
    component: Loadable({
        loader: () => import('../pages/clockInManager/clockStatistic'),
        loading: lazyLoad
    })
}];

