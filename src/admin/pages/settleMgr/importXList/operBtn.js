import React, { PureComponent } from 'react';
import { Button, Modal, message, Input } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { auditImpX, delImpX } from 'ADMIN_SERVICE/ZXX_XManager';
const { TextArea } = Input;

export default class extends PureComponent {
    state = {
        remark: ''
    }

    handleRemark = (e) => {
        this.setState({
            remark: e.target.value
        });
    }

    audit = (sts) => {
        const { selectedRowKeys, reloadData, selectedRows } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        let hasDeal = selectedRows.filter((item) => (item.AuditStatus == 2 || item.AuditStatus == 3)).length > 0;
        if (hasDeal) {
            message.info('选中的记录中存在已审核或未审核数据，请重新选择！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: (
                <TextArea onChange={this.handleRemark} style={{ marginTop: 16 }} rows={3} maxLength={100} placeholder='审核备注' />
            ),
            onOk: () => {
                window._czc.push(['_trackEvent', '导入X查询/审核', sts == 2 ? '审核通过' : '审核不通过', '导入X查询/审核_Y结算']);
                const { remark } = this.state;
                let reqParam = {
                    RecordIDList: selectedRowKeys,
                    AuditRemark: remark,
                    AuditStatus: sts
                };
                auditImpX(reqParam).then((resData) => {
                    message.success('审核成功！');
                    reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    del = () => {
        const { selectedRowKeys, reloadData, selectedRows } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        let hasDeal = selectedRows.filter((item) => (item.AuditStatus == 2 || item.AuditStatus == 3)).length > 0;
        if (hasDeal) {
            message.info('选中的记录中存在已审核或未审核数据，请重新选择！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: '确定要删除选中记录吗？',
            onOk: () => {
                window._czc.push(['_trackEvent', '导入X查询/审核', '删除', '导入X查询/审核_Y结算']);
                let reqParam = {
                    RecordIDList: selectedRowKeys
                };
                delImpX(reqParam).then((resData) => {
                    message.success('删除成功！');
                    reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    render() {
        const { exportX, auditPassX, auditNotPassX, delX } = resId.settleMgr.importXList;
        const { exportTB } = this.props;
        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportTB(); window._czc.push(['_trackEvent', '导入X查询/审核', '导出', '导入X查询/审核_Y结算']); }}>导出</Button>)}
                {authority(auditPassX)(<Button type='primary' className='ml-8' onClick={this.audit.bind(this, 2)} >审核通过</Button>)}
                {authority(auditNotPassX)(<Button type='primary' className='ml-8' onClick={this.audit.bind(this, 3)}>审核不通过</Button>)}
                {authority(delX)(<Button type='primary' className='ml-8' onClick={this.del}>删除</Button>)}
            </div>
        );
    }
} 