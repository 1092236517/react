import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import ResTable from './resTable';
import OperBtn from './operBtn';
import InfoModal from './infoModal';
@tabWrap({
    tabName: 'z盈利报表',
    stores: ['profitStore']
})

@inject('profitStore', 'globalStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/profit']);
        if (!this.props.profitStore.view.isDirty) {
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
                checkedBillRows,
                infoModal,
                justValue: { showJust }
            },
            handleFormValuesChange,
            handleFormReset,
            startQuery,
            resetPageCurrent,
            setPagination,
            exportProfit,
            exportBill,
            editFinanceStatus,
            setCheckedBillRows,
            updataAdjustProfit,
            setJustValue
        } = this.props.profitStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { BeginMo, EndMo } = searchValue;
        return (
            <div>
                <OperBtn {...{
                    exportProfit,
                    exportBill,
                    checkedBillRows,
                    setCheckedBillRows,
                    BeginMo,
                    EndMo
                }} />

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

                <ResTable {...{
                    tableInfo,
                    pagination,
                    setPagination,
                    editFinanceStatus,
                    startQuery,
                    BeginMo,
                    EndMo,
                    checkedBillRows,
                    setCheckedBillRows,
                    updataAdjustProfit,
                    setJustValue
                }} />
                {showJust ? <InfoModal {...this.props} /> : null}
            </div>
        );
    }
}