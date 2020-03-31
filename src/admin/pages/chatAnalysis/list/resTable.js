import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender} from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';

@withRouter
@observer
class ResTable extends Component {
    //  跳转至发薪列表
    jumpToPay = (record) => {
        const { history } = this.props;
        let params = {
            BatchID: record.BillWeeklyBatchId,
            RealName: record.RealName,
            TradeType: 1
        };
        //  通过push携带state存在bug，必须发薪tab页存在时才有效，可能是封装的框架组件造成的
        sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
        history.push('/withdrawManager/pay');
    }

    render() {
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
                    rowKey='BillWeeklyBatchDetailId'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    loading={loading}
                    refreshData={startQuery} >
                </Table>
            </div>
        );
    }
}

export default ResTable;