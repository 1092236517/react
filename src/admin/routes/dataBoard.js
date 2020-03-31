import Loadable from 'react-loadable';
import { lazyLoad } from 'web-react-base-component';

export default [
  {
    path: '/dataBoard/clock',
    component: Loadable({
      loader: () => import('../pages/dataBoard/clock'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/zxx',
    component: Loadable({
      loader: () => import('../pages/dataBoard/zxx'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/workingDays',
    component: Loadable({
      loader: () => import('../pages/dataBoard/workingDays'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/inWorkDaysByCycleSelect',
    component: Loadable({
      loader: () => import('../pages/dataBoard/inWorkDaysByCycleSelect'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/zxxReten',
    component: Loadable({
      loader: () => import('../pages/dataBoard/zxxReten'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/rebateForecastReport',
    component: Loadable({
      loader: () => import('../pages/dataBoard/rebateForecastReport'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/profitAnalysisSummary',
    component: Loadable({
      loader: () => import('../pages/dataBoard/profitAnalysisSummary'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/profitAnalysisDetail',
    component: Loadable({
      loader: () => import('../pages/dataBoard/profitAnalysisDetail'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/departureWageanAlysis',
    component: Loadable({
      loader: () => import('../pages/dataBoard/departureWageanAlysis'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/monthyWagePaySet',
    component: Loadable({
      loader: () => import('../pages/dataBoard/monthyWagePaySet'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/rateOfRetentionAndRegister',
    component: Loadable({
      loader: () => import('../pages/dataBoard/rateOfRetentionAndRegister'),
      loading: lazyLoad
    })
  },
  {
    path: '/dataBoard/priceDifferenceSubsidyList',
    component: Loadable({
      loader: () => import('../pages/dataBoard/priceDifferenceSubsidyList'),
      loading: lazyLoad
    })
  }
];
