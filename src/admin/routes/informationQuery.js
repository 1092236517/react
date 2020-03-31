import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [
	{
		path: '/informationQuery/idCard',
		component: Loadable({
			loader: () => import('../pages/informationQuery/idCard/index'),
			loading: lazyLoad
		})
	},
	{
		path: '/informationQuery/bankCard',
		component: Loadable({
			loader: () => import('../pages/informationQuery/bankCard/index'),
			loading: lazyLoad
		})
	},
	{
		path: '/informationQuery/workCard',
		component: Loadable({
			loader: () => import('../pages/informationQuery/workCard/index'),
			loading: lazyLoad
		})
	},
	{
		path: '/informationQuery/bankCarfExmport',
		component: Loadable({
			loader: () => import('../pages/informationQuery/bankCarfExmport/index'),
			loading: lazyLoad
		})
	}
];

