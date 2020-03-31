import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';

export default [
    {
        path: '/system/menu/pt',
        component: Loadable({
            loader: () => import('../pages/systemManager/menuManager/pt'),
            loading: lazyLoad
        })
    },
    {
        path: '/system/role/pt',
        component: Loadable({
            loader: () => import('../pages/systemManager/roleManager/pt'),
            loading: lazyLoad
        })
    },
    {
        path: '/system/user',
        component: Loadable({
            loader: () => import('../pages/systemManager/userManager/index'),
            loading: lazyLoad
        })
    },
    {
        path: '/system/pushmant',
        component: Loadable({
            loader: () => import('../pages/systemManager/pushManagement/index'),
            loading: lazyLoad
        })
    }
];

