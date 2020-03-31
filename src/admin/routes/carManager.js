import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

// 薪薪车管理
export default [ {
    // 支付
    path: '/carManager/payManager',
    component: Loadable({
        loader: () => import('../pages/carManager/payManager'),
        loading: lazyLoad
    })
}];