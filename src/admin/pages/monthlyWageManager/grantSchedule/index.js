import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
  tabName: '月薪发放进度',
  stores: ['grantScheduleStore']
})
@inject('grantScheduleStore', 'globalStore')
@observer
export default class extends Component {
  componentDidMount() {
    window._czc.push(['_trackPageview', location.pathname, window.location.href]);
    if (!this.props.grantScheduleStore.view.isDirty) {
      this.init();
    }
  }

  init() {
    const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
    if (!hasAllCompanyInfo) {
      getAllCompanyInfo();
    }
    this.props.grantScheduleStore.startQuery();
  }

  render() {
    const { companyList, laborList } = this.props.globalStore;
    return (
      <div>
        <SearchForm {...this.props} companyList={companyList} laborList={laborList} />
        <ResTable {...this.props} />
      </div>
    );
  }
}
