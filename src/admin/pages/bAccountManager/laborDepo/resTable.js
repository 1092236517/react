import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { withRouter } from 'react-router';
const generateColInfo = (columnsMap) => (
    columnsMap.map((aColumn) => {
        const [dataIndex, title, render = null, align = 'center', width] = aColumn;
        return { dataIndex, title, render, align, width };
    })
);

@withRouter
@observer
class ResTable extends Component {
    redirectToEntryAndExit = (record, e) => {
        const { EntShortName, LaborList } = record;
        const { BossListData } = this.props;
        window._czc.push(['_trackEvent', '劳务押金表', '点击押金总额', '劳务押金表_Y结算']);
        console.log('BossListData' + BossListData);
        let boss = BossListData.filter((item, index) => {
            return item.BossID == record.BossID;
        });
        let LaborIds = boss[0].LaborList.map((item, index) => {
            return item.LaborID;
        });
        this.props.history.push(`/bAccountManager/entryAndExit?LaborIds=${LaborIds}`);
    }
    render() {
        const columnsMap = [
            ['BossName', '大佬', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }],
            ['LaborName', '劳务', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.LaborRowSpan }
                };
                return obj;
            }],
            ['EntShortName', '企业', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.EntRowSpan }
                };
                return obj;
            }],
            // ['EnterName', '企业', undefined],
            ['SettlementTyp', '结算模式', (value) => ({ 1: 'ZX结算方式', 2: 'Z结算方式', 3: 'ZA结算方式', 4: 'Z-B结算方式', 5: 'ZX-B结算方式', 6: 'ZX-A结算方式' }[value])],
            ['DepositAmount', '押金标准', tableMoneyRender],
            ['WorkorNum', '在职人数'],
            ['TotalWorkerNum', '大佬在职', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }],
            ['WantDepositAmount', '应收押金', tableMoneyRender],
            ['TotalDepositAmount', '押金总额', (value, record) => {
                const obj = {
                    children: <a onClick={() => this.redirectToEntryAndExit(record)}>{tableMoneyRender(value)}</a>,
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }],
            ['DepositBalance', '押金余额', (value, record) => {
                const obj = {
                    children: tableMoneyRender(value),
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }],
            ['IntvPassNum', '面试通过会员数'],
            ['PreDeposit', '预收押金', (value, record) => {
                const obj = {
                    children: tableMoneyRender(value),
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }],
            ['Remark', '备注', undefined]
        ];

        const {
            tableInfo: {
                dataList, loading, total
            },
            pagination: {
                current,
                pageSize
            },
            setPagination
        } = this.props;

        const columns = generateColInfo(columnsMap);
        console.log("dataList" + dataList);
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='Number'
                    // pagination={{
                    //     ...tablePageDefaultOpt,
                    //     current,
                    //     pageSize,
                    //     total,
                    //     onShowSizeChange: (current, size) => {
                    //         setPagination(current, size);
                    //     },
                    //     onChange: (page, pageSize) => {
                    //         setPagination(page, pageSize);
                    //     }
                    // }}
                    pagination={false}
                    loading={loading} >
                </Table>
                <br />
                {dataList.length > 0 && (<Pagination
                    style={{ float: 'right' }}
                    size="small"
                    showSizeChanger
                    onShowSizeChange={(current, size) => {
                        setPagination(current, size);
                    }}
                    current={current}
                    total={total}
                    onChange={(page, pageSize) => {
                        setPagination(page, pageSize);
                    }}
                    pageSizeOptions={['10', '20', '30', '50', '100', '200']}
                    showQuickJumper={true}
                    showSizeChanger={true}
                    showTotal={(total, range) => (`第${range[0]}-${range[1]}条 共${total}条`)}
                />)}
                <br />
            </div>
        );
    }
}

export default ResTable;