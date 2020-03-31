import React, { Component } from 'react';
import { Table, Button, Select, message } from 'antd';
import { observer } from "mobx-react";
import { tableDateRender, tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const { Option } = Select;

@observer
class ResTable extends Component {
    state = {
        excelData: [],
        XlsxDownload: null
    }

    createColumns = columnsMap => {
        let allWidth = 0;
        return [
            columnsMap.map((aColumn) => {
                const [dataIndex, title, render = null, width = 130, filteredValue = null, onFilter = null, align = 'center'] = aColumn;
                allWidth += width;
                return { dataIndex, title, render, filteredValue, onFilter, align, width };
            }),
            allWidth
        ];
    };

    exportFormatErrData = () => {
        const { getFormatErrData } = this.props.weeklyWagePerksStore;

        if (getFormatErrData.length == 0) {
            return;
        }

        import('./xlsxDownload').then((XlsxDownload) => {
            this.setState({
                XlsxDownload: XlsxDownload.default,
                excelData: getFormatErrData
            }, () => {
                this.setState({
                    XlsxDownload: null,
                    excelData: []
                });
            });
        }).catch((err) => {
            message.error(`加载文件错误：${err.message}，请刷新页面后重试。`);
            console.log(err);
        });
    }

    render() {
        const {
            view: {
                tableInfo: {
                    loading, dataListShow
                },
                tableVisible
            }
        } = this.props.weeklyWagePerksStore;
        const { excelData, XlsxDownload } = this.state;
        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['IDCardNum', '身份证号码', undefined, 150],
            ['WorkCardNo', '工号'],
            ['EnterpriseName', '企业'],
            ['LaborName', '劳务', undefined, 100],
            ['WorkClass', '工种'],
            ['SettlementType', '订单模式'],
            ['IntvDate', '面试日期', tableDateRender, 100],
            ['EntryDate', '入职日期', tableDateRender, 100],
            ['LeaveDate', '离职日期', tableDateRender, 100],
            ['WorkState', '在离职状态', undefined, 100],
            ['OrderDiffFee', '差价补发日'],
            ['SubsidyFeeWorkDay', '额外补贴在职日'],
            ['SubsidyFeeAmount', '补贴金额'],
            ['SubsidyFeeDuration', '享受周期'],
            ['SubsidyFeePayDuration', '发放日期'],
            ['PreCheckInfo', '检测结果']
        ];

        const [columns, width] = this.createColumns(columnsMap);

        return tableVisible &&
            (
                <div>
                    <Table
                        columns={columns}
                        scroll={{ x: width, y: 550 }}
                        bordered={true}
                        dataSource={dataListShow.slice()}
                        rowKey='Number'
                        pagination={{
                            ...tablePageDefaultOpt
                        }}
                        loading={loading} >
                    </Table>

                    {XlsxDownload && <XlsxDownload excelData={excelData}></XlsxDownload>}
                </div>
            );
    }
}

export default ResTable;