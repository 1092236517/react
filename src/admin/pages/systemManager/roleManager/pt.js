import React, { Fragment } from 'react';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from "mobx-react";
import { Button, Table, Row, Modal } from 'antd';
import RoleModal from './roleModal';
import RoleResourceModal from './roleResourceModal';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
const confirm = Modal.confirm;
@tabWrap({
    tabName: '平台角色管理',
    stores: ['ptRoleStore']
})
@inject('ptRoleStore', 'globalStore')
@observer
export default class extends React.Component {
    loadRoleList = this.props.ptRoleStore.loadRoleList;
    handleTabRowClick = this.props.ptRoleStore.handleTabRowClick;
    handleDeleteRole = this.props.ptRoleStore.handleDeleteRole;

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/system/role/pt']);
        if (!this.props.ptRoleStore.view.isDirty) {
            this.loadRoleList();
        }
    }

    handleDeleteRoleConfirm = () => {
        window._czc.push(['_trackEvent', '平台角色管理', '删除', '平台角色管理_N非结算']);
        confirm({
            title: '提示',
            content: '删除记录后不可恢复，确定删除删除吗？',
            onOk: () => this.handleDeleteRole()
        });
    };

    handleTableRow = {
        onRow: record => ({
            // 点击表格行
            onClick: event => this.handleTabRowClick(event.target.name, record),
            // 鼠标移入行
            onMouseEnter: event => {
            }
        }),

        onHeaderRow: column => ({
            // 点击表头行
            onClick: () => {
            }
        })
    };

    render() {
        const { view, handleTableChange, handleTabRowChange, handleRoleModalChange, handleRoleResourceModalChange, deleteDisabled } = this.props.ptRoleStore;
        const { pagination, roleModalInfo, roleResourceModalInfo, ResourceData, expandedKeys, tableRecordList, tableLoading, selectedRowKeys } = view;
        return (
            <Fragment>
                <Row className='mb-16'>
                    <Button onClick={() => { handleRoleModalChange.onShow(); window._czc.push(['_trackEvent', '平台角色管理', '新增', '平台角色管理_N非结算']); }} type='primary'>新增</Button>
                    <Button className='ml-8' type='danger'
                        onClick={this.handleDeleteRoleConfirm}
                        disabled={deleteDisabled}>删除</Button>
                </Row>
                <RoleModal
                    Visible={roleModalInfo.Visible}
                    confirmLoading={roleModalInfo.confirmLoading}
                    roleModalInfo={roleModalInfo}
                    handleModalChange={handleRoleModalChange} />
                <RoleResourceModal
                    Visible={roleResourceModalInfo.Visible}
                    confirmLoading={roleResourceModalInfo.confirmLoading}
                    checkedKeys={roleResourceModalInfo.checkedKeys}
                    expandedKeys={expandedKeys}
                    ResourceData={ResourceData}
                    handleModalChange={handleRoleResourceModalChange} />
                <Table
                    rowKey='RID' bordered={true}
                    {...this.handleTableRow}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: handleTabRowChange
                    }}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '50', '100', '200'],
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`,
                        size: 'small'
                    }}
                    dataSource={tableRecordList.toJS()} // mobx的数组，实际上是一个obj，需要转换成 js 的数组，mobx数组有个 toJS 的 function
                    loading={tableLoading}
                    onChange={handleTableChange}
                    columns={[
                        { title: '角色名称', dataIndex: 'Name' },
                        { title: '备注', dataIndex: 'Remark' },
                        { title: '操作人', dataIndex: 'Operator' },
                        {
                            title: '操作时间', dataIndex: 'OperatTm', render: (text, record) =>
                                tableDateTimeRender(text)
                        },
                        {
                            title: '操作', dataIndex: 'xxx',
                            render: (text, record) => <span>
                                <a name="edit" className='mr-8' onClick={() => { window._czc.push(['_trackEvent', '平台角色管理', '修改', '平台角色管理_N非结算']); }}>修改</a>|
                                <a name="config" className='ml-8' onClick={() => { window._czc.push(['_trackEvent', '平台角色管理', '配置权限', '平台角色管理_N非结算']); }}>配置权限</a>
                            </span>
                        }
                    ]} />
            </Fragment>
        );
    }
}