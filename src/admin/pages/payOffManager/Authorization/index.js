import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateTimeRender, tableSrcRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const confirm = Modal.confirm;

@tabWrap({
    tabName: '授权',
    stores: ['authorizationStore']
})

@inject('authorizationStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/payOffManager/Authorization']);
        if (!this.props.authorizationStore.view.isDirty) {
            this.queryAudit();
            this.getAllCompanyInfo();
        }
    }
    queryAudit = this.props.authorizationStore.queryAudit;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    audit = (id) => {
        let prop = this.props.authorizationStore;
        confirm({
            title: '授权',
            content: '您确定要授权这条申请吗？',
            onOk() {
                prop.audit(id);
                window._czc.push(['_trackEvent', '授权', '授权', '授权_Y结算']);
            },
            onCancel() { }
        });
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, queryAudit, resetPageCurrent, setPagination } = this.props.authorizationStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { agentList, companyList, laborList } = this.props.globalStore;

        let columns = [
            { title: '批次号', dataIndex: 'BillBatchId', align: 'center', width: 100 },
            { title: '开始时间', dataIndex: 'SettleBeginDt', align: 'center', width: 100 },
            { title: '结束时间', dataIndex: 'SettleEndDt', align: 'center', width: 100 },
            { title: '企业', dataIndex: 'EntShortName', align: 'center', width: 130 },
            { title: '劳务', dataIndex: 'TrgtSpShortName', align: 'center', width: 220 },
            { title: '中介', dataIndex: 'SrceSpShortName', align: 'center', width: 220 },
            { title: '财务输入总人数', dataIndex: 'TotCnt', align: 'center', width: 130 },
            {
                title: '财务输入总金额（元）',
                dataIndex: 'TotAmt',
                align: 'center',
                convertCentToThousandth,
                width: 170,
                render: convertCentToThousandth
            },
            {
                title: '财务输入服务费用（元）',
                dataIndex: 'AgentAmt',
                align: 'center',
                convertCentToThousandth,
                width: 170,
                render: convertCentToThousandth
            },
            {
                title: '财务输入平台费用（元）',
                dataIndex: 'PlatformSrvcAmt',
                convertCentToThousandth,
                align: 'center',
                width: 170,
                render: convertCentToThousandth
            },
            { title: '系统总人数', dataIndex: 'SysCnt', align: 'center', convertCentToThousandth, width: 100 },
            {
                title: '系统总金额（元）',
                dataIndex: 'SysTotAmt',
                align: 'center',
                convertCentToThousandth,
                width: 130,
                render: convertCentToThousandth
            },
            {
                title: '系统服务费（元）',
                dataIndex: 'SysAgentAmt',
                align: 'center',
                convertCentToThousandth,
                width: 130,
                render: convertCentToThousandth
            },
            {
                title: '系统平台费（元）',
                dataIndex: 'SysPlatformAmt',
                align: 'center',
                convertCentToThousandth,
                width: 130,
                render: convertCentToThousandth
            },
            {
                title: '类别',
                dataIndex: 'BillBatchTyp',
                align: 'center',
                width: 80,
                render: (text) => ({ 1: '月薪', 2: '周薪', 3: '返费', 4: '周返费' })[text]
            },
            {
                title: '来源',
                dataIndex: 'BillSrce',
                align: 'center',
                width: 80,
                render: tableSrcRender
            },
            { title: '申请人', dataIndex: 'UpdatedByName', align: 'center', width: 100 },
            { title: '创建时间', dataIndex: 'UpdatedTm', align: 'center', width: 150, render: tableDateTimeRender },
            { title: '授权时间', dataIndex: 'AuthTm', align: 'center', width: 150, render: tableDateTimeRender },
            { title: '授权人', dataIndex: 'AuthByName', align: 'center', width: 100 },

            {
                title: '授权', dataIndex: 'AuthSts',
                fixed: 'right',
                align: 'center',
                width: 100,
                render: (text, record) => ({
                    1: authority(resId.authorizationList.confirm)(<a href='#' onClick={() => { this.audit(record.RemittanceAppId); }}>{record.SalaryPayer == 2 ? '劳务打款' : '周薪薪打款'}</a>),
                    2: <span className='color-green'>通过</span>,
                    3: <span className='color-danger'>未通过</span>,
                    4: <span className='color-danger'>数据异常</span>,
                    5: authority(resId.authorizationList.confirm)(<a href='#' onClick={() => { this.audit(record.RemittanceAppId); }}>{record.SalaryPayer == 2 ? '劳务打款' : '周薪薪打款'}</a>)
                }[text])
            }
        ];

        return (
            <div>
                <SearchForm
                    {...{
                        searchValue,
                        agentList,
                        companyList,
                        laborList,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: queryAudit,
                        resetPageCurrent
                    }}
                />
                <Table
                    columns={columns}
                    bordered={true}
                    loading={FormListStatus === "pending"}
                    dataSource={RecordList.slice()}
                    rowKey='RemittanceAppId'
                    scroll={{ x: 2760, y: 550 }}
                    pagination={{
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

