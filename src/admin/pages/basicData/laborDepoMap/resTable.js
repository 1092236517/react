import React, { Component } from 'react';
import { Table, Pagination, Popconfirm } from 'antd';
import { tableMoneyRender, tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
const generateColInfo = (columnsMap) => (
    columnsMap.map((aColumn) => {
        const [dataIndex, title, render = null, align = 'center', width] = aColumn;
        return { dataIndex, title, render, align, width };
    })
);

@observer
class ResTable extends Component {
    render() {
        const { editX, deleteX } = resId.basicData.laborDepoMap;
        const { editRecord, deleteRecord } = this.props;

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
            ['Action', '配置', (value, record) => (
                <div>
                    {authority(editX)(<a href='#' style={{ marginRight: '5px' }} onClick={() => { editRecord(record); window._czc.push(['_trackEvent', '劳务押金关系表', '修改', '劳务押金关系表_Y结算']); }}>修改</a>)}
                    {authority(deleteX)(
                        <Popconfirm
                            title="是否确定删除？"
                            onConfirm={() => { deleteRecord(record); window._czc.push(['_trackEvent', '劳务押金关系表', '删除', '劳务押金关系表_Y结算']); }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href='#' >删除</a>
                        </Popconfirm>)
                    }
                </div>
            )],
            ['OPUserName', '操作人'],
            ['OPTime', '操作时间', tableDateRender, 100],
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
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RecordID'
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
                    loading={loading} pagination={false}>
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