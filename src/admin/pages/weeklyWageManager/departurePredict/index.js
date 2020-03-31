import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import { Button } from 'antd';
import ResLable from './resLable';
@tabWrap({
    tabName: '在离职名单预测表',
    stores: ['departurePredictStore']
})
@inject('departurePredictStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/departurePredict']);
        if (!this.props.departurePredictStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    render() {
        const { view: { tableInfo } } = this.props.departurePredictStore;
        return (
            <div>
                <SearchForm {...this.props} />
                <ResLable {...tableInfo} />
                <ResTable {...this.props} />
            </div >
        );
    }
}