import React, { Component } from 'react';
import { Table } from 'antd';
import { observer } from "mobx-react";

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



    render() {
        const {
            view: {
                tableInfo: {
                    loading, dataListShow
                },
                tableVisible
            }
        } = this.props.bankCardExmportStore;

        const { excelData, XlsxDownload } = this.state;

        const columnsMap = [
            ['IDCardNum', '身份证号码', undefined, 150],
            ['RealName', '姓名', undefined, 100],
            ['BankCardNum', '银行卡号', undefined, 100],
            ['BankName', '银行名称', undefined, 100],
            ['Zone', '开户地', undefined, 100]
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
                        pagination={false}
                        loading={loading} >
                    </Table>

                    {XlsxDownload && <XlsxDownload excelData={excelData}></XlsxDownload>}
                </div>
            );
    }
}

export default ResTable;