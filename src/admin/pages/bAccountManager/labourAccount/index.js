import { tabWrap } from 'ADMIN_PAGES';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
    tabName: '劳务账户',
    stores: ['labourAccountStore']
})

@inject('labourAccountStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/labourAccount']);
        if (!this.props.labourAccountStore.view.isDirty) {
            this.getTrgtSp();
            this.getLaborList();
        }
    }

    getTrgtSp = this.props.labourAccountStore.getTrgtSp;
    getLaborList = this.props.globalStore.getLaborList;

    // 导出
    export = () => {
        let Data = this.props.labourAccountStore.exportTrgtSpList();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
        window._czc.push(['_trackEvent', '劳务账户', '导出', '劳务账户_N非结算']);
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, getTrgtSp, resetPageCurrent, setPagination } = this.props.labourAccountStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { laborList } = this.props.globalStore;
        let columns = [
            { title: '劳务全称', dataIndex: 'SpFullName', align: 'center', width: '24%' },
            { title: '劳务简称', dataIndex: 'SpShortName', align: 'center', width: '16%' },
            { title: '联系人', dataIndex: 'CtctName', align: 'center', width: '12%' },
            {
                title: '联系电话', dataIndex: 'CtctMobile', align: 'center', width: '12%',
                render: (text, record, index) => text && text.replace(text.slice(3, 7), '****')
            },
            {
                title: '用户押金（元）',
                dataIndex: 'DepositAccntBalance',
                align: 'center',
                width: '12%',
                render: convertCentToThousandth
            },
            {
                title: '账户余额（元）',
                dataIndex: 'AccntBalance',
                align: 'center',
                width: '12%',
                render: convertCentToThousandth
            },
            {
                title: '账户明细', dataIndex: 'SpId',
                align: 'center',
                width: '12%',
                render: (text) => <Link onClick={() => { window._czc.push(['_trackEvent', '劳务账户', '导出', '劳务账户_N非结算']); }} to={"/bAccountManager/labourAccount/LabourAccountDetail?id=" + text}>查看</Link>
            }
        ];
        return (
            <div>
                {authority(resId.labourAccountList.export)(<Button className="mb-20" type="primary" onClick={this.export}>导出</Button>)}
                <SearchForm
                    {...{
                        searchValue,
                        laborList,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getTrgtSp,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey={'SpId'}
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

