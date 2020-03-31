import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';

export default [
	{
		path: '/basicData/company',
		component: Loadable({
			loader: () => import('../pages/basicData/company'),
			loading: lazyLoad
		})
	}, {
		path: '/basicData/company/edit/:id',
		component: Loadable({
			loader: () => import('../pages/basicData/company/edit'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/labar',
		component: Loadable({
			loader: () => import('../pages/basicData/labar'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/intermediaryAgent',
		component: Loadable({
			loader: () => import('../pages/basicData/intermediaryAgent'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/bankPayAccount',
		component: Loadable({
			loader: () => import('../pages/basicData/bankPayAccount'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/memberPayAccount',
		component: Loadable({
			loader: () => import('../pages/basicData/memberPayAccount'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/agentPayAccount',
		component: Loadable({
			loader: () => import('../pages/basicData/agentPayAccount'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/laborEntMap',
		component: Loadable({
			loader: () => import('../pages/basicData/laborEntMap'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/laborDepoMap',
		component: Loadable({
			loader: () => import('../pages/basicData/laborDepoMap'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/invoice',
		component: Loadable({
			loader: () => import('../pages/basicData/invoice'),
			loading: lazyLoad
		})
	},
	{
		path: '/basicData/monthlyMessageSet',
		component: Loadable({
			loader: () => import('../pages/basicData/monthlyMessageSet'),
			loading: lazyLoad
		})
	}
];