import React, { Component, Fragment } from 'react';
import { Table, Modal, Button, message } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender, tableWorkStateRender, tableBillAuditRender } from 'ADMIN_UTILS/tableItemRender';
import { getWeeklyWageSplitSelect, exportWeeklyWageSplit } from 'ADMIN_SERVICE/ZXX_WeekBill';
import { getWeeklyWageExportRes } from 'ADMIN_SERVICE/ZXX_WeekBill';
import { generateColInfo } from 'ADMIN_UTILS';

class WeekSplit extends Component {
    state = {
        dataList: [],
        pageSize: 10,
        current: 1,
        total: 0,
        loading: false
    }

    componentDidMount() {
        this.startQuery();
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    setPagination = (current, pageSize) => {
        this.setState({
            current, pageSize
        }, () => {
            this.startQuery();
        });
    }

    startQuery = async () => {
        const { BeginDt, EndDt, EntId, TrgtSpId, BillRelatedMo, SettlementTyp } = this.props;
        const { pageSize, current } = this.state;

        let reqParam = {
            EntId,
            TrgtSpId,
            BeginDt: BeginDt || '',
            EndDt: EndDt || '',
            BillRelatedMo,
            SettlementTyp,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            await this.setStateAsync({ loading: true });

            let resData = await getWeeklyWageSplitSelect(reqParam);
            let { Data: { RecordCount, RecordList } } = resData;

            this.setState({
                dataList: RecordList || [],
                total: RecordCount,
                loading: false
            });
        } catch (err) {
            await this.setStateAsync({ loading: false });
            message.error(err.message);
            console.log(err);
        }
    }

    exportRecord = async () => {
        const { BeginDt, EndDt, EntId, TrgtSpId, BillRelatedMo, SettlementTyp } = this.props;

        let reqParam = {
            EntId,
            TrgtSpId,
            BeginDt: BeginDt || '',
            EndDt: EndDt || '',
            BillRelatedMo,
            SettlementTyp
        };
        window._czc.push(['_trackEvent', 'ZX盈利报表(旧)', '导出', 'ZX盈利报表(旧)_Y结算']);
        try {
            let resData = await exportWeeklyWageSplit(reqParam);
            const { Data: { BizID } } = resData;
            this.getWeeklyWageExportRes(BizID);
            this.schedulerID = setInterval(() => {
                this.getWeeklyWageExportRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    getWeeklyWageExportRes = async (BizID) => {
        let reqParam = { BizID };
        try {
            let resData = await getWeeklyWageExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(this.schedulerID);
                this.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(this.schedulerID);
            this.schedulerID = '';
            message.error(err.message);
            console.log(err);
        }
    }

    render() {
        const { dataList, loading, pageSize, current, total } = this.state;
        const { closeModal } = this.props;
        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '开始时间', tableDateRender, 100],
            ['EndDt', '结束时间', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender, 80],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['AdvancePayAmt', '应发周薪(元)', tableMoneyRender, 100],
            ['TrgtSpAuditSts', '审核状态', tableBillAuditRender, 80],
            ['TrgtSpAuditTm', '账单审核日期', tableDateRender, 100]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <Fragment>
                <Modal
                    visible={true}
                    width={'80%'}
                    title={'已知周薪'}
                    maskClosable={false}
                    onCancel={closeModal}
                    onOk={closeModal} >
                    <div>
                        <Button className='mb-16' type='primary' onClick={this.exportRecord}>导出</Button>
                        <Table
                            rowKey={'RowIndex'}
                            bordered={true}
                            dataSource={dataList.slice()}
                            loading={loading}
                            columns={columns}
                            scroll={{ x: width, y: 550 }}
                            pagination={{
                                ...tablePageDefaultOpt,
                                pageSize,
                                current,
                                total,
                                onChange: (page, pageSize) => {
                                    this.setPagination(page, pageSize);
                                },
                                onShowSizeChange: (current, size) => {
                                    this.setPagination(current, size);
                                }
                            }}>

                        </Table>
                    </div>

                </Modal>
            </Fragment>
        );
    }
}

export default WeekSplit;