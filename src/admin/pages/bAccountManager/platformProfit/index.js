import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
    tabName: '平台盈利报表',
    stores: ['platformProfitStore']
})

@inject('platformProfitStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/platformProfit']);
        if (!this.props.platformProfitStore.view.isDirty) {
            this.platform();
            this.getAllCompanyInfo();
        }
    }
    platform = this.props.platformProfitStore.platform;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    render() {
        const { view, handleFormValuesChange, handleFormReset, platform, resetPageCurrent, setPagination } = this.props.platformProfitStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum, TotalSum } = view;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };

        let columns = [
            { title: '批次号', dataIndex: 'BillBatchId', align: 'center', width: '10%' },
            {
                title: '批次类型',
                dataIndex: 'BillBatchTyp',
                align: 'center',
                width: '10%',
                render: (text) => text === 1 ? <span>月薪</span> : <span>周薪</span>
            },
            { title: '开始时间', dataIndex: 'BeginDt', align: 'center', width: '12%' },
            { title: '结束时间', dataIndex: 'EndDt', align: 'center', width: '12%' },
            { title: '企业', dataIndex: 'EntName', align: 'center', width: '12%' },
            { title: '劳务', dataIndex: 'TrgtSpName', align: 'center', width: '12%' },
            { title: '中介', dataIndex: 'SrceSpName', align: 'center', width: '12%' },
            {
                title: '平台费用（元）',
                dataIndex: 'PlatformSrvcAmt',
                align: 'center',
                width: '10%',
                render: convertCentToThousandth
            },
            {
                title: '查看',
                dataIndex: 'RemittanceAppId',
                align: 'center',
                width: '10%',
                render: (text, record, index) => {
                    return (
                        record.BillBatchTyp === 1 ?
                            <div>{authority(resId.applyList.modify)(<Link onClick={() => { window._czc.push(['_trackEvent', '平台盈利报表', '查看', '平台盈利报表_N非结算']); }} to={"/monthlyWageManager/bill/" + record.BillBatchId}>查看</Link>)}</div>
                            :
                            <div>{authority(resId.applyList.delete)(<Link onClick={() => { window._czc.push(['_trackEvent', '平台盈利报表', '查看', '平台盈利报表_N非结算']); }} to={"/weeklyWageManager/bill/" + record.BillBatchId}>查看</Link>)}</div>
                    );
                }
            }
        ];
        return (
            <div>
                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        agentList,
                        companyList,
                        laborList,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: platform,
                        resetPageCurrent
                    }}

                />

                <div className='mb-16 color-black'>
                    当前筛选条件下，累计平台费用为{convertCentToThousandth(TotalSum)}元。
                </div>

                <Table
                    rowKey={'RemittanceAppId'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ y: 550 }}
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

