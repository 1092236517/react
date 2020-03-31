import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '返费申请导入',
    stores: ['returnApplicationStore']
})
@inject('returnApplicationStore', 'globalStore')
@observer
class ReturnApplicationImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/returnFee/returnApplication']);
    }

    render() {
        return (
            <div>
                <SearchForm {...this.props} />
                <ResTable {...this.props} />
            </div>
        );
    }
}

export default ReturnApplicationImport;
