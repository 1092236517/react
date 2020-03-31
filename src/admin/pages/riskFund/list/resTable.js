import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Col, Row, Table, Pagination } from 'antd';
import { tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['TrgtSpShortName', '劳务', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.LaborRowSpan }
                };
                return obj;
            }, 220],
            ['EntShortName', '企业', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.EntRowSpan }
                };
                return obj;
            }],
            ['SettlementTyp', '结算模式', settleTypeRender, 80],
            ['PersonCount', '计算风险金人数'],
            ['RiskFundNeed', '应收风险金', tableMoneyRender],
            ['RiskFundNeedTol', '应收风险金(总)', (value, record) => {
                const obj = {
                    children: tableMoneyRender(value),
                    props: { rowSpan: record.LaborRowSpan }
                };
                return obj;
            }],
            ['RiskFundTol', '风险总金额', (value, record) => {
                const obj = {
                    children: tableMoneyRender(value),
                    props: { rowSpan: record.LaborRowSpan }
                };
                return obj;
            }],
            ['RiskFundOver', '风险金余额', (value, record) => {
                const obj = {
                    children: tableMoneyRender(value),
                    props: { rowSpan: record.LaborRowSpan }
                };
                return obj;
            }]
        ];

        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            startQuery,
            setPagination
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
                    scroll={{ x: width, y: 550 }}
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
                    // pagination={false}
                    loading={loading}
                    refreshData={startQuery} pagination={false}>
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