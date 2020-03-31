import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/riskFund/list',
    component: Loadable({
        loader: () => import('../pages/riskFund/list'),
        loading: lazyLoad
    })
}];

