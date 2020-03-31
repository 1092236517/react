import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table, Modal, message, Switch, Button, Icon, Checkbox, Menu, Dropdown, Input, Pagination, Row, Form } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';
import { convertCentToThousandth } from 'web-react-base-utils';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { closeFinance } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import FileInfo from './fileInfo';
import WeekSplit from './weekSplit';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
const fileRender = (record, type, fileName, fileUrlPath, _this) => {
    const downloadFile = async (OriginFileName, FileName) => {
        let client = await getClient(uploadRule.profitJustZX[type]);
        let fileUrl = client.signatureUrl(FileName, {
            response: {
                'content-disposition': `attachment; filename=${OriginFileName}`
            }
        });

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
        fileInfo: {}
    }
    showModalOpt = (typeFlag, record) => {
        const { setJustValue } = this.props;
        setJustValue(typeFlag, record);
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
            EntId, TrgtSpId, RelatedMo: `${RelatedMo}`, IsClose: newStatus, SettlementTyp: 1
        };
        const operName = { 1: '开账', 2: '关账' }[newStatus];

        Modal.confirm({
            title: <h4>{`确认要${operName}吗？`} </h4>,
            onOk: () => {
                closeFinance(reqParam).then((resData) => {
                    message.success(`${operName}成功！`);
                    //  列表慢查询，优化
                    const { editFinanceStatus } = this.props;
                    editFinanceStatus(RowCombIndex, newStatus);
                    window._czc.push(['_trackEvent', '1.0盈利报表', operName, '1.0盈利报表_Y结算']);
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    setModal = (record) => {
        Modal.info({
            title: '合计X（最终）备注',
            content: (
                <p>{record.EndModifyRemark}</p>
            ),
            onOk() { }
        });
    }

    moneyJumpPage = (type, value, record) => {
        const { RelatedMo, EntId, TrgtSpId } = record;
        //  合计X导入，跳转导入X查询/审核
        const { history } = this.props;

        if (type == 1) {
            // 合计x
            let params = {
                BeginMonth: `${moment(RelatedMo).format('YYYY-MM')}`,
                EndMonth: `${moment(RelatedMo).format('YYYY-MM')}`,
                EnterpriseID: EntId,
                LaborID: TrgtSpId,
                AuditStatus: 2
            };
            sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
            history.push('/settleMgr/importXList');
        } else if (type == 2) {
            //  已知周薪
            let BillRelatedMo = moment(RelatedMo).format('YYYY-MM') + '-01';
            let weekSplitReqParams = {
                EntId,
                TrgtSpId,
                BillRelatedMo,
                SettlementTyp: 1
            };
            //  已知周薪(新接口)
            this.setState({
                isShowWeekSplit: true,
                weekSplitReqParams
            });
        } else if (type == 3) {
            //  剩余月薪
            let params = {
                BillRelatedMoStart: moment(RelatedMo).format('YYYY-MM-DD'),
                BillRelatedMoEnd: moment(RelatedMo).format('YYYY-MM-DD'),
                EntId,
                TrgtSpId,
                TrgtSpAuditSts: 2,
                SettlementTyp: 1
            };
            sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
            history.push('/monthlyWageManager/list');
        }
    }

    closeModal = (type) => {
        this.setState({
            [{ split: 'isShowWeekSplit', file: 'isShowFile' }[type]]: false
        });
    }

    renderFile = (type, record) => {
        window._czc.push(['_trackEvent', '1.0盈利报表', type === 'PicInfo' ? '图片列操作' : 'Excel列操作', '1.0盈利报表_Y结算']);
        this.setState({
            isShowFile: true,
            fileInfo: {
                type,
                list: record[type].slice(),
                extra: record
            }
        });
    }
    redirectToEntryAndExit = (record, e) => {
        window._czc.push(['_trackEvent', '1.0盈利报表', '点击X已到账', '1.0盈利报表_Y结算']);
        const { RelatedMo, EntId, TrgtSpId } = record;
        this.props.history.push(`/bAccountManager/entryAndExitDetail?RelatedMo=${RelatedMo}&EntId=${EntId}&TrgtSpId=${TrgtSpId}&DireactType=zxreport`);
    }

    render() {
        const { closeFinanceX, openFinanceX } = resId.bAccountManager.profitForX;

        const columnsMap = [
            ['BossId', '大佬', (value, record) => {
                const obj = {
                    children: value,
                    props: { rowSpan: record.BossRowSpan }
                };
                return obj;
            }, 100, 'left'],
            ['RelatedMo', '月份', undefined, 100, 'left'],
            ['EntShortName', '企业名称', undefined, 130, 'left'],
            ['TrgtSpName', '劳务名称', undefined, 220, 'left'],
            ['ImportX', '合计X(导入)', this.moneyJumpPageRender.bind(this, 1), 120],
            ['EndX', '合计X(最终)', (text, record) => <a onClick={() => this.setModal(record)} > {convertCentToThousandth(text)}</a >, 120],
            ['AdjustX', 'X调整金额', (text, record) => fileRender(record, 'AdjustX', record.AdjustXName, record.AdjustXUrl, this)],
            ['WeeklyPaidAmt', '已支周薪', this.moneyJumpPageRender.bind(this, 2), 120],
            ['RemainingSalary', '剩余月薪', this.moneyJumpPageRender.bind(this, 3), 120],
            //  ['Subsidy', '补贴', convertCentToThousandth, 120],
            ['ReturnFee', '税前返费（元）', convertCentToThousandth, 120],
            ['PaidTax', '返费税额（元）', convertCentToThousandth, 120],
            ['ReturnFeeAfterTax', '实发返费（元）', convertCentToThousandth, 120],
            ['SumPay', '合计支出(Y)', convertCentToThousandth, 120],
            ['AdjustY', 'Y调整金额', (text, record) => fileRender(record, 'AdjustY', record.AdjustYName, record.AdjustYUrl, this)],
            ['SumProfit', '盈利(X-Y)/2', convertCentToThousandth, 120],
            ['XArrears', 'X欠款', convertCentToThousandth, 120],
            ['BossArrears', '大佬欠款', convertCentToThousandth, 220],
            ['XPaidBIllAmt', 'X已到账', (value, record) => {
                return (<a onClick={() => this.redirectToEntryAndExit(record)}>{convertCentToThousandth(value)}</a>);
            }, 120],

            ['IsClose1', '是否关账', (text, record) => ({ 1: '否', 2: '是' }[record.IsClose]), 80],
            ['IsClose', '关账', (text, record) => {
                if (text == 1) {
                    return authority(closeFinanceX)(<Switch checked={false} unCheckedChildren='否' onChange={this.handleFinanceStatus.bind(this, record, 2)} />);
                }
                return authority(openFinanceX)(<Switch checked={true} checkedChildren='是' onChange={this.handleFinanceStatus.bind(this, record, 1)} />);
            }, 80],
            ['OPUserName', '操作人'],
            ['OPTime', '操作时间', tableDateTimeRender, 160],
            ['PicInfo', '图片', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'PicInfo', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)],
            ['ExcelInfo', 'Excel', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'ExcelInfo', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            startQuery
        } = this.props;
        const { isShowFile, fileInfo, isShowWeekSplit, weekSplitReqParams } = this.state;

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
                    isShowFile &&
                    <FileInfo
                        {...fileInfo}
                        startQuery={startQuery}
                        closeModal={this.closeModal.bind(this, 'file')}
                        isX={true} />
                }
                <br />
                <br />
            </div>
        );
    }
}

export default ResTable;