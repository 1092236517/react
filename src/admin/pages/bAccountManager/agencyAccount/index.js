import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import history from 'ADMIN_ROUTES/history';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
    tabName: '中介费到账记录',
    stores: ['agencyAccountStore']
})

@inject('agencyAccountStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/agencyAccount']);
        if (!this.props.agencyAccountStore.view.isDirty) {
            this.getAgentAccount();
            this.getAgentList();
        }
    }
    getAgentAccount = this.props.agencyAccountStore.getAgentAccount;
    getAgentList = this.props.globalStore.getAgentList;

    // 导出
    export = () => {
        window._czc.push(['_trackEvent', '中介费到账记录', '导出', '中介费到账记录_N非结算']);
        let Data = this.props.agencyAccountStore.exportAgentAccount();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
    }

    // 跳转页面同时获取中介信息
    getAgencyInfo = (id, record) => {
        this.props.agencyAccountStore.record = record;
        history.push(`/bAccountManager/agencyAccount/AgencyAccountDetail?id=${id}`);
        window._czc.push(['_trackEvent', '中介费到账记录', '查看', '中介费到账记录_N非结算']);
    }

    render() {
        const {view, handleFormValuesChange, handleFormReset, getAgentAccount, resetPageCurrent, setPagination} = this.props.agencyAccountStore;
        const {searchValue, RecordList, FormListStatus, pagination, totalNum} = view;
        const {agentList} = this.props.globalStore;

        let columns = [
            {title: '中介全称', dataIndex: 'SrceSpFullName', align: 'center', width: '21%'},
            {title: '中介简称', dataIndex: 'SrceSpShortName', align: 'center', width: '20%'},
            {title: '联系人', dataIndex: 'CtctName', align: 'center', width: '16%'},
            {title: '联系电话', dataIndex: 'CtctMobile', align: 'center', width: '16%',
            render: (text, record, index) => text && text.replace(text.slice(3, 7), '****')},
            {
                title: '共收服务费（元）', 
                dataIndex: 'AgentAmt', 
                align: 'center', 
                width: '18%',
                render: convertCentToThousandth
            },
            {
                title: '账户明细', dataIndex: 'SrceSpId',
                align: 'center',
                width: '9%',
                render: (text, record) => <a onClick = {() => this.getAgencyInfo(text, record)} >查看</a>
            }
        ];
        return (
            <div>
                {authority(resId.agencyAccountList.export)(<Button className = "mb-20" type = "primary" onClick = {this.export}>导出</Button>)}
                <SearchForm 
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getAgentAccount,
                        agentList,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey = {'SrceSpId'} 
                    bordered = {true}
                    dataSource = {RecordList.slice()} 
                    loading = {FormListStatus === "pending"}
                    columns = {columns}
                    scroll = {{y: 550}}
                    pagination = {{
                        ...tablePageDefaultOpt,
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        total: totalNum,
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />
            </div>
            
        );
    }
}

