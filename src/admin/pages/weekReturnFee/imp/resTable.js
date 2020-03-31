import React, { Component } from 'react';
import { Table, Button, Select, message } from 'antd';
import { tableDateRender, tableYesNoRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const { Option } = Select;

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
        const { getFormatErrData } = this.props;

        if (getFormatErrData.length == 0) {
            return;
        }
        window._czc.push(['_trackEvent', '导入返费周薪', '导出格式化错误数据', '导入返费周薪_N非结算']);
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
            tableInfo: {
                loading, dataListShow, filterInfo
            },
            tableVisible,
            selectAgentID,
            selectJoinState,
            agentList,
            joinBatchCountInAgent,
            totalCountInAgent,
            hanleJoinBatchState,
            switchAgent
        } = this.props;

        const { excelData, XlsxDownload } = this.state;

        const columnsMap = [
            ['SettleBeginDate', '结算开始日期'],
            ['SettleEndDate', '结算结束日期	'],
            ['EnterpriseName', '企业'],
            ['LaborName', '劳务', undefined, 220],
            ['AgentName', '中介', undefined, 220],
            ['IDCardNum', '身份证号码', undefined, 150],
            ['UserName', '姓名', undefined, 100],
            ['EmployeeNo', '工号'],
            ['EntryDate', '入职日期', tableDateRender, 100],
            ['WorkStateOriginText', '在职状态', undefined, 80],
            ['LeaveDate', '离职/转正/自离日期', tableDateRender, 150],
            ['WorkDayNum', '上班天数', (value) => (value == -1 ? '' : value), 80],
            ['Remark', '备注'],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['Join', '加入对账单', tableYesNoRender, undefined, filterInfo && filterInfo.Join || null, (value, record) => {
                return record.Join == value;
            }]
        ];

        const [columns, width] = this.createColumns(columnsMap);

        return tableVisible &&
            (
                <div>
                    <div className='mb-16'>
                        <Button type='primary' className='mr-8' onClick={this.exportFormatErrData}>导出格式化错误数据</Button>
                        {
                            agentList.map(({ NewAgentID, AgentName }, index) => {
                                return <Button type={selectAgentID == NewAgentID ? 'primary' : 'default'} className={index == 0 ? '' : 'ml-8'} key={NewAgentID} onClick={switchAgent.bind(this, NewAgentID)}>{AgentName}</Button>;
                            })
                        }
                    </div>

                    <div className='mb-16'>
                        <label>加入对账单：</label>
                        <Select value={selectJoinState} onChange={hanleJoinBatchState} style={{ width: '100px' }}>
                            <Option value='0'>全部</Option>
                            <Option value='1'>是</Option>
                            <Option value='2'>否</Option>
                        </Select>
                        <span className='ml-16'>数据共有{totalCountInAgent}条，加入对账单{joinBatchCountInAgent}条，不加入对账单{totalCountInAgent - joinBatchCountInAgent}条。</span>
                    </div>

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