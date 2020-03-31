import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [{
    path: '/fileMgr/list',
    component: Loadable({
        loader: () => import('../pages/fileMgr/list'),
        loading: lazyLoad
    })
}, {
    path: '/fileMgr/add',
    component: Loadable({
        loader: () => import('../pages/fileMgr/add'),
        loading: lazyLoad
    })
}];