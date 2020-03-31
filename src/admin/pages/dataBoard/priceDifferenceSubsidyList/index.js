import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
  tabName: '差价/额外补贴清单',
  stores: ['priceDifferenceSubsidyListStore']
})
@inject('priceDifferenceSubsidyListStore', 'globalStore')
@observer
export default class extends Component {
  componentDidMount() {
    window._czc.push(['_trackPageview', location.pathname, window.location.href]);
    if (!this.props.priceDifferenceSubsidyListStore.view.isDirty) {
      this.init();
    }
  }

  init() {
    this.props.priceDifferenceSubsidyListStore.startQuery();
  }

  render() {
    const { setVisible } = this.props.priceDifferenceSubsidyListStore;
    return (
      <div>
        <SearchForm {...this.props} setVisible={setVisible} />
        <ResTable {...this.props} />
      </div>
    );
  }
}
