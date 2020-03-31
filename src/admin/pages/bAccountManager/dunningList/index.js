import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
@tabWrap({
    tabName: '劳务催款单',
    stores: ['dunningListStore']
})

@inject('dunningListStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/dunningList']);
        if (!this.props.dunningListStore.view.isDirty) {
            this.getDunningList();
            this.getAllCompanyInfo();
        }
    }
    getDunningList = this.props.dunningListStore.getDunningList;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    // 导出
    export = () => {
        window._czc.push(['_trackEvent', '劳务催款单', '导出', '劳务催款单_Y结算']);
        let Data = this.props.dunningListStore.exportDunningList();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, getDunningList, resetPageCurrent, setPagination } = this.props.dunningListStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { laborList, companyList } = this.props.globalStore;

        let columns = [
            { title: '月份', dataIndex: 'Month', align: 'center', width: 100 },
            { title: '劳务名称', dataIndex: 'SpShortName', align: 'center', width: 220 },
            { title: '企业名称', dataIndex: 'EntShortName', align: 'center', width: 160 },
            {
                title: '应收',
                children: [{
                    title: '服务费（元）',
                    dataIndex: 'RecvableAgentBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '平台费（元）',
                    dataIndex: 'RecvablePlatformBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '周薪（元）',
                    dataIndex: 'RecvableWeekBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '月薪（元）',
                    dataIndex: 'RecvableMonthBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '合计（元）',
                    dataIndex: 'RecvableTotal',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }]
            },
            {
                title: '实收',
                children: [{
                    title: '服务费（元）',
                    dataIndex: 'InComeAgentBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '平台费（元）',
                    dataIndex: 'InComePlatformBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '周薪（元）',
                    dataIndex: 'InComeWeekBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '月薪（元）',
                    dataIndex: 'InComeMonthBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '合计（元）',
                    dataIndex: 'InComeTotal',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }]
            },
            {
                title: '欠款',
                children: [{
                    title: '服务费（元）',
                    dataIndex: 'OweAgentBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '平台费（元）',
                    dataIndex: 'OwePlatformBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '周薪（元）',
                    dataIndex: 'OweWeekBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '月薪（元）',
                    dataIndex: 'OweMonthBill',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }, {
                    title: '合计（元）',
                    dataIndex: 'OweTotal',
                    align: 'center',
                    width: 100,
                    render: convertCentToThousandth
                }]
            }
        ];
        return (
            <div>
                {authority(resId.dunningList.export)(<Button className="mb-20" type="primary" onClick={this.export}>导出</Button>)}
                <SearchForm
                    {...{
                        searchValue,
                        laborList,
                        companyList,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getDunningList,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey={'primaryIndex'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ x: 1980, y: 550 }}
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