import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table, Modal, message, Switch, Button, Icon, Checkbox, Menu, Dropdown, Input, Pagination, Row, Form } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';
import { convertCentToThousandth } from 'web-react-base-utils';
import authority, { hasAuthority } from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { closeFinance } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import WeekSplit from './weekSplit';
import SumProfit from './sumProfit';
import FileInfo from './fileInfo';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
const fileRender = (record, type, fileName, fileUrlPath, _this) => {
    const downloadFile = async (OriginFileName, FileName) => {
        let client = await getClient(uploadRule.profitJust[type]);
        let fileUrl = client.signatureUrl(FileName, {
            response: {
                'content-disposition': `attachment; filename=${OriginFileName}`
            }
        });
        convertCentToThousandth(record[type]); window._czc.push(['_trackEvent', 'z盈利报表', { 'AdjustY': 'Y调整金额', 'AdjustProfit': '盈利调整金额' }[type], 'z盈利报表_Y结算']);
        window.open(fileUrl);
    };

    const menu = (
        <Menu>
            {
                <Menu.Item onClick={downloadFile.bind(this, fileName, fileUrlPath)}>
                    <a href='#' >{fileName}</a>
                </Menu.Item>
            }
        </Menu>
    );

    return (
        <Fragment>
            <a href="#" onClick={() => _this.showModalOpt(type, record)}>{convertCentToThousandth(record[type])}</a>
            {fileUrlPath !== '' &&
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className='ml-8' href='#'>
                        查看<Icon type='down' />
                    </a>
                </Dropdown>

            }

        </Fragment>
    );
};
@withRouter
@observer
class ResTable extends Component {
    state = {
        isShowWeekSplit: false,
        weekSplitReqParams: {},
        isShowFile: false,
        fileInfo: {},
        isShowSumProfit: false,
        sumProfitReqParams: {}
    }
    showModalOpt = (typeFlag, record) => {
        const { setJustValue } = this.props;
        setJustValue(typeFlag, record);
        window._czc.push(['_trackEvent', 'z盈利报表', '查看', 'z盈利报表_Y结算']);
    }
    moneyJumpPage = (type, value, record) => {
        const { RelatedMo, SettleBeginDy, EntId, TrgtSpId } = record;
        if (type == 1) {
            let BeginDt = '';
            let EndDt = '';
            let BillRelatedMo = moment(RelatedMo).subtract(1, 'month').format('YYYY-MM');

            if (SettleBeginDy <= 0) {
                message.info('该企业的发薪周期未设置');
                return;
            } else if (SettleBeginDy == 1) {
                BeginDt = `${moment(RelatedMo).subtract(1, 'month').format('YYYY-MM')}-${SettleBeginDy}`;
                EndDt = `${moment(RelatedMo).subtract(1, 'day').format('YYYY-MM-DD')}`;
            } else if (SettleBeginDy <= 15) {
                BeginDt = `${moment(RelatedMo).subtract(1, 'month').format('YYYY-MM')}-${SettleBeginDy}`;
                EndDt = `${moment(RelatedMo).format('YYYY-MM')}-${SettleBeginDy - 1}`;
            } else {
                BeginDt = `${moment(RelatedMo).subtract(2, 'month').format('YYYY-MM')}-${SettleBeginDy}`;
                EndDt = `${moment(RelatedMo).subtract(1, 'month').format('YYYY-MM')}-${SettleBeginDy - 1}`;
            }

            let weekSplitReqParams = {
                EntId,
                TrgtSpId,
                BeginDt,
                EndDt,
                BillRelatedMo,
                SettlementTyp: 2
            };
            //  已知周薪(新接口)
            this.setState({
                isShowWeekSplit: true,
                weekSplitReqParams
            });
        } else if (type == 2) {
            //  剩余月薪，跳转月薪查询
            const { history } = this.props;
            let params = {
                BillRelatedMoStart: moment(RelatedMo).subtract(1, 'month').format('YYYY-MM-DD'),
                BillRelatedMoEnd: moment(RelatedMo).subtract(1, 'month').format('YYYY-MM-DD'),
                EntId,
                TrgtSpId,
                TrgtSpAuditSts: 2,
                SettlementTyp: 2
            };
            sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
            history.push('/monthlyWageManager/list');
        } else if (type == 3) {
            //  我打中介费，跳转周薪查询，SrceFlag=1
            const { history } = this.props;
            let params = {
                AuditBeginDt: `${moment(RelatedMo).subtract(1, 'month').format('YYYY-MM')}-26`,
                AuditEndDt: `${moment(RelatedMo).format('YYYY-MM')}-25`,
                SrceFlag: 1,
                AuditSts: 2,
                EntId,
                TrgtSpId,
                SettlementTyp: 2
            };
            sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
            history.push('/weeklyWageManager/list');
        } else {
            //  萌店中介费，跳转周薪查询，SrceFlag=2
            const { history } = this.props;
            let params = {
                AuditBeginDt: `${moment(RelatedMo).subtract(1, 'month').format('YYYY-MM')}-26`,
                AuditEndDt: `${moment(RelatedMo).format('YYYY-MM')}-25`,
                SrceFlag: 2,
                AuditSts: 2,
                EntId,
                TrgtSpId,
                SettlementTyp: 2
            };
            sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
            history.push('/weeklyWageManager/list');
        }
    }

    moneyJumpPageRender = (type, value, record) => {
        const showValue = convertCentToThousandth(value);
        if (value > 0) {
            return <a href='#' onClick={this.moneyJumpPage.bind(this, type, value, record)}>{showValue}</a>;
        } else {
            return showValue;
        }
    }

    handleFinanceStatus = ({ EntId, TrgtSpId, RelatedMo, RowCombIndex }, newStatus) => {
        let reqParam = {
            EntId, TrgtSpId, RelatedMo: `${RelatedMo}`, IsClose: newStatus, SettlementTyp: 2
        };
        const operName = { 1: '开账', 2: '关账' }[newStatus];

        Modal.confirm({
            title: <h4>{`确认要${operName}吗？`} </h4>,
            onOk: () => {
                closeFinance(reqParam).then((resData) => {
                    message.success(`${operName}成功！`);
                    //  列表慢查询，优化
                    //  const { editFinanceStatus } = this.props;
                    //  editFinanceStatus(RowIndex, newStatus);
                    //  保证关账后，选中可导出对账单的记录数据刷新
                    const { startQuery } = this.props;
                    window._czc.push(['_trackEvent', 'z盈利报表', operName, 'z盈利报表_Y结算']);
                    startQuery();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    closeModal = (type) => {
        this.setState({
            [{ split: 'isShowWeekSplit', file: 'isShowFile' }[type]]: false
        });
    }

    sumProfitTable = (value, record) => {
        const { RelatedMo, EntId, TrgtSpId } = record;
        let sumProfitReqParams = {
            EntId,
            TrgtSpId,
            RelatedMo: RelatedMo
        };
        window._czc.push(['_trackEvent', 'z盈利报表', '合计盈利', 'z盈利报表_Y结算']);
        //  合计盈利
        this.setState({
            isShowSumProfit: true,
            sumProfitReqParams
        });
    }

    closeSumProfitModal = (type) => {
        this.setState({
            isShowSumProfit: false
        });
    }

    renderFile = (type, record) => {
        window._czc.push(['_trackEvent', 'z盈利报表', '上传', 'z盈利报表_Y结算']);
        this.setState({
            isShowFile: true,
            fileInfo: {
                type,
                list: record[type].slice(),
                extra: record
            }
        });
    }

    checkAllBill = (e) => {
        const { checked } = e.target;
        const { tableInfo: { dataList }, setCheckedBillRows } = this.props;
        window._czc.push(['_trackEvent', 'z盈利报表', '导出', 'z盈利报表_Y结算']);
        if (checked) {
            let canCheckRows = [];

            dataList.forEach((row) => {
                row.BillExportSts != 1 && canCheckRows.push(row);
            });

            setCheckedBillRows(canCheckRows);
        } else {
            setCheckedBillRows([]);
        }
    }

    checkBill = (row, e) => {
        const { checked } = e.target;
        let { checkedBillRows, setCheckedBillRows } = this.props;
        checkedBillRows = checkedBillRows.slice();

        if (checked) {
            setCheckedBillRows([...checkedBillRows, row]);
        } else {
            const resIndex = checkedBillRows.findIndex((item) => (item.RowCombIndex === row.RowCombIndex));
            checkedBillRows.splice(resIndex, 1);
            setCheckedBillRows(checkedBillRows);
        }
    }

    redirectToEntryAndExit = (record, e) => {
        window._czc.push(['_trackEvent', 'z盈利报表', '已到账款', 'z盈利报表_Y结算']);
        const { RelatedMo, EntId, TrgtSpId } = record;
        this.props.history.push(`/bAccountManager/entryAndExitDetail?RelatedMo=${RelatedMo}&EntId=${EntId}&TrgtSpId=${TrgtSpId}&DireactType=zreport`);
    }
    render() {
        const { closeFinanceX, openFinanceX } = resId.bAccountManager.profit;
        const { isShowWeekSplit, isShowSumProfit, weekSplitReqParams, sumProfitReqParams, isShowFile, fileInfo } = this.state;
        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            startQuery,
            BeginMo,
            EndMo,
            checkedBillRows
        } = this.props;
        const checkedBillRowIDs = checkedBillRows.map((row) => (row.RowCombIndex));

        const columnsMap = [
            ['BossId', '大佬', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }, 100, 'left'],
            ['RelatedMo', '所属月份', undefined, 100, 'left'],
            ['TrgtSpName', '劳务名称', undefined, 220, 'left'],

            ['EntShortName', '企业名称', undefined, 130, 'left'],
            ['WeeklyPaidAmt', '已支周薪(元)', this.moneyJumpPageRender.bind(this, 1), 120],
            ['RemainingSalary', '剩余月薪(元)', this.moneyJumpPageRender.bind(this, 2), 120],
            ['SalaryPayer', '月薪是否劳务打款', (text) => ({ 1: "否", 2: "是" }[text]), 160],
            ['ReturnFee', '税前返费（元）', convertCentToThousandth, 120],
            ['PaidTax', '返费税额（元）', convertCentToThousandth, 120],
            ['ReturnFeeAfterTax', '实发返费（元）', convertCentToThousandth, 120],
            ['SumPay', '合计支出(元)', convertCentToThousandth, 120],
            ['AdjustY', 'Y调整金额', (text, record) => fileRender(record, 'AdjustY', record.AdjustYName, record.AdjustYUrl, this)],
            //  ['WodaAgentAmt', '我打中介费(元)', this.moneyJumpPageRender.bind(this, 3), 120],
            //  ['OtherAgentAmt', '萌店中介费(元)', this.moneyJumpPageRender.bind(this, 4), 120],
            ['WodaAgentAmt', '我打服务费(元)', convertCentToThousandth, 120],
            ['OtherAgentAmt', '萌店服务费(元)', convertCentToThousandth, 120],
            ['WodaPlatformSrvcAmt', '我打平台费(元)', convertCentToThousandth, 120],
            ['OtherPlatformSrvcAmt', '萌店平台费(元)', convertCentToThousandth, 120],
            ['SumProfit', '合计盈利(元)', (text, record) => {
                return (<a href='#' onClick={this.sumProfitTable.bind(this, text, record)}>{convertCentToThousandth(text)}</a>);
            }, 120],
            ['AdjustProfit', '盈利调整金额', (text, record) => fileRender(record, 'AdjustProfit', record.AdjustProfitName, record.AdjustProfitUrl, this)],
            ['PaidBIllAmt', '已到账款(元)', (value, record) => {
                return (<a onClick={() => this.redirectToEntryAndExit(record)}>{convertCentToThousandth(value)}</a>);
            }, 120],

            ['TrgtSpArrears', '劳务欠款(元)', convertCentToThousandth, 120],
            ['BossArrears', '大佬欠款', convertCentToThousandth, 220],
            ['IsClose1', '是否关账', (text, record) => ({ 1: '否', 2: '是' }[record.IsClose]), 80],
            ['IsClose', '关账', (text, record) => {
                if (text == 1) {
                    return authority(closeFinanceX)(<Switch checked={false} unCheckedChildren='否' onChange={this.handleFinanceStatus.bind(this, record, 2)} />);
                }
                return authority(openFinanceX)(<Switch checked={true} checkedChildren='是' onChange={this.handleFinanceStatus.bind(this, record, 1)} />);
            }, 100],
            ['PicInfo', '图片', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'PicInfo', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)],
            ['ExcelInfo', 'Excel', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'ExcelInfo', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)],
            ['InvoiceSts', '开票信息', (val, record) => ({ 1: '暂无可用', 2: '可用' }[val] || '')]
        ];

        //  有权限，并且选择日期跨度是一个月
        if (hasAuthority(resId.bAccountManager.profit.exportBillX) && BeginMo && EndMo && BeginMo.format('YYYY-MM') == EndMo.format('YYYY-MM')) {
            columnsMap.push(['BillExportSts', <Checkbox onChange={this.checkAllBill}>选中可导出对账单的记录</Checkbox>, (val, record) => (
                <Checkbox
                    disabled={val == 1}
                    checked={checkedBillRowIDs.includes(record.RowCombIndex)}
                    onChange={this.checkBill.bind(this, record)} >
                    {{ 1: '不可导出', 2: '可导出中平', 3: '可导出中平、周月返' }[val]}
                </Checkbox>
            ), 200]);
        }

        const [columns, width] = generateColInfo(columnsMap);
        const { ImportFile, uploadJustType } = this.state;
        return (
            <div>
                <Table
                    rowKey={'RowIndex'}
                    bordered={true}
                    dataSource={dataList.slice()}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: width, y: 550 }}
                    // pagination={{
                    //     ...tablePageDefaultOpt,
                    //     pageSize,
                    //     current,
                    //     total,
                    //     onChange: (page, pageSize) => {
                    //         setPagination(page, pageSize);
                    //     },
                    //     onShowSizeChange: (current, size) => {
                    //         setPagination(current, size);
                    //     }
                    // }}
                    pagination={false}
                />
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
                {
                    isShowWeekSplit &&
                    <WeekSplit
                        {...weekSplitReqParams}
                        closeModal={this.closeModal.bind(this, 'split')} />
                }

                {
                    isShowSumProfit &&
                    <SumProfit
                        {...sumProfitReqParams}
                        closeModal={this.closeSumProfitModal} />
                }

                {
                    isShowFile &&
                    <FileInfo
                        {...fileInfo}
                        startQuery={startQuery}
                        closeModal={this.closeModal.bind(this, 'file')} />
                }
                <br />
                <br />

            </div>
        );
    }
}

export default ResTable;