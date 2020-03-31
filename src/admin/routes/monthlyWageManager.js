import Loadable from 'react-loadable';
import { lazyLoad } from 'web-react-base-component';

export default [
  {
    path: '/monthlyWageManager/import',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/import'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/importRecord',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/importRecord'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/list',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/list'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/reissue',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/reissue'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/bill',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/bill'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/bill/:MonthBatchId',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/billDetail'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/leak',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/leak'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/missInfo',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/missInfoList'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/payrollImport',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/payrollImport'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/payrollSelect',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/payrollSelect'),
      loading: lazyLoad
    })
  },
  {
    path: '/monthlyWageManager/grantSchedule',
    component: Loadable({
      loader: () => import('../pages/monthlyWageManager/grantSchedule'),
      loading: lazyLoad
    })
  }
];
