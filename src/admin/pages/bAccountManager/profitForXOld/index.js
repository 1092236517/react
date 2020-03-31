import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import ResTable from './resTable';

@tabWrap({
    tabName: '1.0盈利报表',
    stores: ['profitForXStoreOld']
})

@inject('profitForXStoreOld', 'globalStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/profitForXOld']);
        if (!this.props.profitForXStoreOld.view.isDirty) {
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
        const {
            view: {
                searchValue,
                tableInfo,
                pagination,
                attachInfo
            },
            handleFormValuesChange,
            handleFormReset,
            startQuery,
            resetPageCurrent,
            setPagination,
            exportProfitForXOld,
            editFinanceStatus
        } = this.props.profitForXStoreOld;
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <Button className="mb-20" type="primary" onClick={() => { exportProfitForXOld(); window._czc.push(['_trackEvent', 'ZX盈利报表(旧)', '导出', 'ZX盈利报表(旧)_Y结算']); }}>导出</Button>
                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        agentList,
                        companyList,
                        laborList,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: startQuery,
                        resetPageCurrent
                    }} />

                <ResLabel {...attachInfo} />

                <ResTable {...{ tableInfo, pagination, setPagination, startQuery, editFinanceStatus }} />
            </div>
        );
    }
}