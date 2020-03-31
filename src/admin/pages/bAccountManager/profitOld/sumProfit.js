import {
    ExportAgentBillDetailForZProfit,
    ExportPlatformBillDetailForZProfit,
    GetAgentBillDetailForZProfit,
    GetPlatformBillDetailForZProfit,
    getResByBizID
} from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { generateColInfo, tablePageDefaultOpt, getResAsync } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { Button, message, Modal, Table } from 'antd';
import React, { Component, Fragment } from 'react';

class SumProfit extends Component {
    state = {
        pageSize: 10,
        current: 1,
        total: 0,
        loading: false,
        onPlatBtn: true,
        dataList: []
    }

    componentDidMount() {
        this.startQuery();
    }
    componentWillUnmount() {
        this.setState({
            pageSize: 10,
            current: 1,
            total: 0,
            loading: false,
            onPlatBtn: true
        });
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
            this.startQuery(); // 分页这里有问题，分页时调用接口的判断 待定
        });
    }

    startQuery = async () => {
        const { EntId, TrgtSpId, RelatedMo } = this.props;
        const { pageSize, current } = this.state;

        let reqParam = {
            EntId,
            TrgtSpId,
            RelatedMo,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            await this.setStateAsync({ loading: true });
            let resData = this.state.onPlatBtn ? await GetAgentBillDetailForZProfit(reqParam) : await GetPlatformBillDetailForZProfit(reqParam);
            let { Data: { RecordCount, RecordList } } = resData;
            RecordList = RecordList.map((item, primaryIndex) => {
                return { ...item, primaryIndex };
            });
            this.setState({
                dataList: RecordList || [],
                total: RecordCount,
                loading: false
            }, () => {
                console.log(RecordList, this.state.dataList);
            });
        } catch (err) {
            await this.setStateAsync({ loading: false });
            message.error(err.message);
            console.log(err);
        }
    }

    exportRecord = async (flag) => {
        console.log(this.state.onPlatBtn);
        const { EntId, TrgtSpId, RelatedMo } = this.props;
        let reqParam = {
            EntId,
            TrgtSpId,
            RelatedMo
        };
        window._czc.push(['_trackEvent', '盈利报表(旧)', flag ? '导出中介费' : '导出服务费', '盈利报表(旧)_Y结算']);
        try {
            let resData = flag ? await ExportAgentBillDetailForZProfit(reqParam) : await ExportPlatformBillDetailForZProfit(reqParam);

            const { BizID } = resData.Data;

            resData = await getResAsync(getResByBizID, { BizID });
            const { FileUrl } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    platBtn = () => {
        window._czc.push(['_trackEvent', '盈利报表(旧)', '中介费', '盈利报表(旧)_Y结算']);
        this.setState({
            onPlatBtn: true,
            pageSize: 10,
            current: 1
        }, () => {
            this.startQuery();
        });
    }

    srvBtn = () => {
        window._czc.push(['_trackEvent', '盈利报表(旧)', '服务费', '盈利报表(旧)_Y结算']);
        this.setState({
            onPlatBtn: false,
            pageSize: 10,
            current: 1
        }, () => {
            this.startQuery();
        });
    }

    render() {
        const { dataList, loading, pageSize, current, total } = this.state;
        const { closeModal } = this.props;
        const columnsMap = [
            ['BillType', '类型', (text) => ({ 1: '月批次', 2: '周批次' }[text]), 100],
            ['RealName', '姓名', undefined, 100],
            ['BillBatchId', '批次号', undefined, 80],
            ['IdCardNum', '身份证', undefined, 150],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', (text) => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未处理', 5: '未知', 6: '自离' }[text]), 80],
            ['LeaveDt', '离职/转正时间', tableDateRender, 150],
            ['BeginDt', '中介费起算日期', tableDateRender, 120],
            ['EndDt', '中介费截至日期', tableDateRender, 120],
            ['AgentDayNum', '天数'],
            ['AgentFee', '中介费', tableMoneyRender, 100],
            ['BillAuditTm', '账单审核时间', tableDateTimeRender, 150]
        ];

        const columnsMapSrv = [
            ['BillType', '类型', (text) => ({ 1: '月批次', 2: '周批次' }[text]), 100],
            ['RealName', '姓名', undefined, 100],
            ['BillBatchId', '批次号', undefined, 80],
            ['IdCardNum', '身份证', undefined, 150],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', (text) => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未处理', 5: '未知', 6: '自离' }[text]), 80],
            ['LeaveDt', '离职/转正时间', tableDateRender, 150],
            ['PlatformSrvcAmt', '服务费', tableMoneyRender, 100],
            ['BillAuditTm', '账单审核时间', tableDateTimeRender, 150]
        ];

        const [columns, width] = this.state.onPlatBtn ? generateColInfo(columnsMap) : generateColInfo(columnsMapSrv);

        return (
            <Fragment>
                <Modal
                    visible={true}
                    width={'80%'}
                    title={this.state.onPlatBtn ? '中介费' : '服务费'}
                    maskClosable={false}
                    onCancel={closeModal}
                    onOk={closeModal} >
                    <div>
                        <Button className='mb-16' type='primary' onClick={() => { this.exportRecord(true); }}>导出中介费</Button>
                        <Button className='mb-16 ml-8' type='primary' onClick={() => { this.exportRecord(false); }}>导出服务费</Button><br />
                        <Button className='mb-16' type={this.state.onPlatBtn ? 'primary' : ''} onClick={this.platBtn}>中介费</Button>
                        <Button className='mb-16 ml-8' type={!this.state.onPlatBtn ? 'primary' : ''} onClick={this.srvBtn}>服务费</Button>
                        <Table
                            rowKey={'primaryIndex'}
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

export default SumProfit;