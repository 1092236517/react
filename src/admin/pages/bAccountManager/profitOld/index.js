import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import ResTable from './resTable';
import OperBtn from './operBtn';

@tabWrap({
    tabName: 'z盈利报表',
    stores: ['profitStoreOld']
})

@inject('profitStoreOld', 'globalStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        
        window._czc.push(['_trackPageview', '/admin/bAccountManager/profitOld']);
        if (!this.props.profitStoreOld.view.isDirty) {
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
                checkedBillRows
            },
            handleFormValuesChange,
            handleFormReset,
            startQuery,
            resetPageCurrent,
            setPagination,
            exportProfitOld,
            exportBill,
            editFinanceStatus,
            setCheckedBillRows
        } = this.props.profitStoreOld;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { BeginMo, EndMo } = searchValue;

        return (
            <div>
                <OperBtn {...{
                    exportProfitOld,
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
                    setCheckedBillRows
                }} />
            </div>
        );
    }
}