import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import ResTable from './resTable';
import InfoModal from './infoModal';
@tabWrap({
    tabName: '1.0盈利报表',
    stores: ['profitForXStore']
})

@inject('profitForXStore', 'globalStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/profitForX']);
        if (!this.props.profitForXStore.view.isDirty) {
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
                attachInfo,
                justValue: { showJust }
            },
            handleFormValuesChange,
            handleFormReset,
            startQuery,
            resetPageCurrent,
            setPagination,
            exportProfitForX,
            editFinanceStatus,
            setJustValue
        } = this.props.profitForXStore;
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <Button className="mb-20" type="primary" onClick={() => { exportProfitForX(); window._czc.push(['_trackEvent', '1.0盈利报表', '导出', '1.0盈利报表_Y结算']); }}>导出</Button>
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

                <ResTable {...{ tableInfo, pagination, setPagination, startQuery, editFinanceStatus, setJustValue }} />
                {showJust ? <InfoModal {...this.props} /> : null}
            </div>
        );
    }
}