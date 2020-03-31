import React, { Component } from 'react';
import { Table, Button, Select, message } from 'antd';
import { observer } from "mobx-react";
import { tableDateRender, tableYesNoRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
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
        const { getFormatErrData } = this.props.chatAnalysisImportStore;

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
        } = this.props.chatAnalysisImportStore;

        const { excelData, XlsxDownload } = this.state;

        const columnsMap = [
            ['Day', '日期', tableDateRender, 100],
            ['HubName', '门店名称'],
            ['NickName', '昵称'],
            ['RemarkName', '马甲'],
            ['TotalChatMsgCount', '总聊天数'],
            ['BrokerChatCount', '经纪人发言数'],
            ['BrokerChatImageCount', '经纪人发言数（图片）'],
            ['BrokerChatTextCount', '经纪人发言数（文字）'],
            ['BrokerChatVideoCount', '经纪人发言数（视频）'],
            ['ChatUserCount', '发言人数'],
            ['UserCount', '群人数']
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