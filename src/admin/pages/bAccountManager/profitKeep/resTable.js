import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { UpdateProfitComment } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { message, Modal, Table, Input } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import FileInfo from './fileInfo';
const { TextArea } = Input;

@withRouter
@observer
class ResTable extends Component {
    state = {
        isShowWeekSplit: false,
        weekSplitReqParams: {},
        isShowFile: false,
        fileInfo: {},
        visible: false,
        Remark: '',
        DealStatus: null,
        record: null
    }
    setIsSettle = (record) => {
        window._czc.push(['_trackEvent', '利润留存报表', '是否结清操作', '利润留存报表_Y结算']);
        this.setState({
            record: record,
            visible: true
        });
    }


    handleRemark = (e) => {
        this.setState({
            Remark: e.target.value
        });
    }

    handleOk = () => {
        const { Remark, EntId, TrgtSpId, RelatedMo } = this.state.record;
        if (this.state.Remark !== '') {
            UpdateProfitComment({
                DealStatus: 2,
                Remark: this.state.Remark,
                EntId,
                TrgtSpId,
                RelatedMo: RelatedMo + '-01'
            }).then((resData) => {
                message.success('设置成功！');
                this.props.startQuery();
                this.setState({
                    visible: false,
                    Remark: '',
                    DealStatus: null
                });
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            Modal.warn({
                content: (
                    <p>备注必填</p>
                )
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            Remark: '',
            DealStatus: null
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


    closeModal = (type) => {
        this.setState({
            [{ file: 'isShowFile' }[type]]: false
        });
    }

    renderFile = (type, record) => {
        window._czc.push(['_trackEvent', '利润留存报表', type === 'PicUrl' ? '图片操作' : '表格操作', '利润留存报表_Y结算']);
        this.setState({
            isShowFile: true,
            fileInfo: {
                type,
                list: record[type].slice(),
                extra: record
            }
        });
    }

    render() {
        const { setIsSettle } = resId.bAccountManager.profitKeep;
        const columnsMap = [
            ['RelatedMo', '月份', undefined, 100],
            ['EntName', '企业', undefined, 130],
            ['TrgtSpName', '劳务', undefined, 220],
            ['TolPorfitAmt', '应付利润', convertCentToThousandth, 120],
            ['PaidProfitAmt', '实付利润', convertCentToThousandth, 120],
            ['NotPayProfitAmt', '差额', convertCentToThousandth, 120],
            ['IsSettle', '是否付清', (text, record) => {
                return { 1: authority(setIsSettle)(<a href='javascript:;' onClick={this.setIsSettle.bind(this, record)}>未结清</a>), 2: '已结清' }[text];
            }, 80],
            ['Remark', '备注', undefined, 220],
            ['PicUrl', '图片', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'PicUrl', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)],
            ['FileUrl', '表格', (fileInfo, record) => (<a href='#' onClick={this.renderFile.bind(this, 'FileUrl', record)}>{fileInfo.length > 0 ? '查看' : '上传'}</a>)]
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
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />

                {
                    isShowFile &&
                    <FileInfo
                        {...fileInfo}
                        startQuery={startQuery}
                        closeModal={this.closeModal.bind(this, 'file')} />
                }
                <div>
                    <Modal title="确认更改结清状态"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText='已结清'
                        maskClosable={true}
                    >
                        <TextArea onChange={this.handleRemark} value={this.state.Remark} style={{ "display": "inline", "width": "95%" }} rows={1} placeholder='备注必填' />
                    </Modal>
                </div>

            </div>


        );
    }
}

export default ResTable;