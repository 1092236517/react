import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/approvedBillVoided/deleteBill',
    component: Loadable({
        loader: () => import('../pages/approvedBillVoided/deleteBill'),
        loading: lazyLoad
    })
}];

