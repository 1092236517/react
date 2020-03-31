import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [
	{
		path: '/chatAnalysis/import',
		component: Loadable({
			loader: () => import('../pages/chatAnalysis/import'),
			loading: lazyLoad
		})
	},
	{
		path: '/chatAnalysis/list',
		component: Loadable({
			loader: () => import('../pages/chatAnalysis/list'),
			loading: lazyLoad
		})
	}
];