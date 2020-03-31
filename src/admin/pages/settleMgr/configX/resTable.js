import React, { Component } from 'react';
import { Table, Switch, message, Modal } from 'antd';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { editConfigX } from 'ADMIN_SERVICE/ZXX_XManager';
import { generateColInfo } from 'ADMIN_UTILS';

const auditRender = (value) => ({ 1: '未审核', 2: '审核通过', 3: '审核不通过' }[value]);
const xRender = (value) => <span style={{ fontSize: 18 }}>{{ 1: ' ', 2: '√' }[value]}</span>;
@observer
class ResTable extends Component {  
    editConfig = (record) => {
        const { showModal } = this.props;
        const { LaborId, EntId, IsDisable, XConfigureID } = record;
        const xType = ['XLeaveSalary', 'XManageExpense', 'XOther', 'XRecruitmentFee', 'XSalary', 'XSocialSecurity'];
        const XType = [];
        xType.forEach((t) => {
            record[t] == 2 && XType.push(t);
        });
        window._czc.push(['_trackEvent', 'X项配置', '编辑操作', 'X项配置_Y结算']);
        const configInfo = {
            XConfigureID,
            LaborId,
            EntId,
            XType,
            IsDisable
        };
        showModal(configInfo);
    }

    handleDisable = (XConfigureID, checked) => {
        let reqParam = {
            XConfigureID,
            IsEdit: 2,
            IsDisable: checked ? 2 : 1
        };

        Modal.confirm({
            title: '信息',
            content: `确认将[禁用状态]修改为${checked ? '禁用' : '启用'}？`,
            onOk: () => {
                window._czc.push(['_trackEvent', 'X项配置', '列禁用状态操作', 'X项配置_Y结算']);
                editConfigX(reqParam).then((resData) => {
                    const { startQuery } = this.props;
                    startQuery();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    render() {
        const { editX } = resId.settleMgr.configX;

        const columnsMap = [
            ['LaborIdName', '劳务', undefined, 220],
            ['EntName', '企业'],
            ['XSalary', 'X-工资', xRender, 100],
            ['XSocialSecurity', 'X-社保', xRender, 100],
            ['XManageExpense', 'X-管理费', xRender, 100],
            ['XRecruitmentFee', 'X-招聘费', xRender, 100],
            ['XLeaveSalary', 'X-自离工资', xRender, 100],
            ['XOther', 'X-其他', xRender, 100],
            ['AuditSts', '审核状态', auditRender, 80],
            ['AuditByName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['AuditRemark', '审核备注'],
            ['OPUserName', '操作人', undefined, 100],
            ['OPTime', '操作时间', tableDateTimeRender, 150],
            ['IsDisable', '禁用状态', (value, record) => <Switch onChange={this.handleDisable.bind(this, record.XConfigureID)} checked={value == 2} checkedChildren='是' unCheckedChildren='否' />],
            ['Action', '操作', (value, record) => record.AuditSts != 2 && authority(editX)(<a type='primary' onClick={this.editConfig.bind(this, record)}>编辑</a>), 80]
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='XConfigureID'
                    scroll={{ x: width + 62, y: 550 }}
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
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({ disabled: record.AuditSts == 2 })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;