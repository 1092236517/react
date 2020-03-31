import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import ResLable from './resLable';

@tabWrap({
    tabName: '发薪进度表',
    stores: ['progressOfPayStore']
})
@inject('progressOfPayStore', 'globalStore')
@observer
class ProgressOfPay extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/progressOfPay']);
        const { progressOfPayStore } = this.props;
        if (!progressOfPayStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { startQuery } = this.props.progressOfPayStore;
        startQuery();
    }

    render() {
        const {
            view: { tableInfo, rowCount, pepoleCount },
            startQuery
        } = this.props.progressOfPayStore;

        return (
            <div>
                <ResLable rowCount={rowCount} pepoleCount={pepoleCount} refresh={startQuery} />
                <ResTable {...{ tableInfo }} />
            </div>
        );
    }
}

export default ProgressOfPay;