import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import ResTable from './resTable';

@tabWrap({
    tabName: '利润留存报表',
    stores: ['profitKeepStore']
})

@inject('profitKeepStore', 'globalStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/profitKeep']);
        if (!this.props.profitKeepStore.view.isDirty) {
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
            exportProfitList,
            editFinanceStatus
        } = this.props.profitKeepStore;
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <Button className="mb-20" type="primary" onClick={() => { exportProfitList(); window._czc.push(['_trackEvent', '利润留存报表', '导出', '利润留存报表_Y结算']); }}>导出</Button>
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

                {/* <ResLabel {...attachInfo} /> */}

                <ResTable {...{ tableInfo, pagination, setPagination, startQuery, editFinanceStatus }} />
            </div>
        );
    }
}