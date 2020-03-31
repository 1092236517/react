import React from 'react';
import {observable, action, computed} from 'mobx';
import {message} from 'antd';
import {BaseView, BaseViewStore} from "../BaseViewStore";
import {
    loadRoleList,
    configRoleResource,
    createRole,
    updateRole,
    deleteRole,
    loadSysResources
} from 'ADMIN_SERVICE/ZXX_Authority';

export class View extends BaseView {
    @observable pagination = {
        total: 0,
        pageSize: 10,
        current: 1
    };
    @observable tableRecordList = [];
    @observable selectedRowKeys = [];
    @observable tableLoading = false; // 用于table组件的loading状态

    @observable roleModalInfo = {
        Visible: false,
        confirmLoading: false
    };

    @observable ResourceData = {};
    @observable roleResourceModalInfo = {
        Visible: false,
        confirmLoading: false,
        checkedKeys: {}
    };
}


export default class extends BaseViewStore {

    @action
    handleTableChange = (pagination, filters, sorter) => {
        let change = {
            current: pagination.current < 1 ? 1 : pagination.current,
            pageSize: pagination.pageSize
        };
        this.view.pagination.current = change.current;
        this.view.pagination.pageSize = change.pageSize;
        this.loadRoleList();
    };

    @action.bound
    async mergeResourceList(record) {
        let res = await loadSysResources();
        this.view.ResourceData = res.Data || {};
        this.view.roleResourceModalInfo = {
            ...this.view.roleResourceModalInfo,
            Visible: true,
            RID: record.RID,
            checkedKeys: {
                checked: (record.ResourceIDs || []).map(item => item.toString())
            }
        };
    };

    @action.bound
    handleTabRowClick(name, record) {
        if (name === 'edit') {
            this.view.roleModalInfo = {
                ...this.view.roleModalInfo,
                Visible: true,
                RID: record.RID,
                Name: record.Name,
                Remark: record.Remark
            };
        } else if (name === 'config') {
            this.mergeResourceList(record);
        }
    }

    @action.bound
    async handleDeleteRole() {
        try {
            await deleteRole({RIDs: this.view.selectedRowKeys});
            message.success('成功');
        } catch (e) {
            message.error(e.message);
        }
        this.loadRoleList();
    }

    handleRoleModalChange = {
        @action
        onShow: () => {
            this.view.roleModalInfo = {
                ...this.view.roleModalInfo,
                Visible: true
            };
        },
        @action
        onOk: async () => {
            this.view.roleModalInfo.confirmLoading = true;
            try {
                let roleModalInfo = this.view.roleModalInfo;
                let param = {
                    Department: 1,
                    RID: roleModalInfo.RID,
                    Remark: roleModalInfo.Remark,
                    Name: roleModalInfo.Name
                };
                param.RID ? await updateRole(param) : await createRole(param);
                this.view.roleModalInfo.Visible = false;
            } catch (e) {
                message.error(e.message);
            }
            this.view.roleModalInfo.confirmLoading = false;
            this.loadRoleList();
        },
        @action
        onCancel: () => {
            this.view.roleModalInfo.Visible = false;
        },
        @action
        afterClose: () => {
            this.view.resetProperty('roleModalInfo');
        },
        @action
        handleValuesChange: values => (this.view.roleModalInfo = {...this.view.roleModalInfo, ...values})
    };

    handleRoleResourceModalChange = {
        @action
        onOk: async () => {
            this.view.roleResourceModalInfo.confirmLoading = true;
            try {
                const {checkedKeys, RID} = this.view.roleResourceModalInfo;
                let checkedList = [];
                if (checkedKeys.checked) checkedList.push(...checkedKeys.checked);
                if (checkedKeys.halfChecked) checkedList.push(...checkedKeys.halfChecked);
                let ResIDList = Array.from(new Set(checkedList)).map(item => Number(item));
                await configRoleResource({ResIDList, RID});
                this.view.roleResourceModalInfo.Visible = false;
            } catch (e) {
                message.error(e.message);
            }
            this.view.roleResourceModalInfo.confirmLoading = false;
            this.loadRoleList();
        },
        @action
        onCancel: () => {
            this.view.roleResourceModalInfo.Visible = false;
        },
        @action
        afterClose: () => {
            this.view.resetProperty('roleResourceModalInfo');
        },
        @action
        onResourceCheck: checkedKeys => {
            this.view.roleResourceModalInfo = {
                ...this.view.roleResourceModalInfo,
                checkedKeys
            };
        }
    };

    @action
    handleTabRowChange = (selectedRowKeys, selectedRows) => {
        this.view.selectedRowKeys = selectedRowKeys;
    };

    @action
    loadRoleList = async () => {
        this.view.tableLoading = true;
        try {
            const {current, pageSize} = this.view.pagination;
            let res = await loadRoleList({
                RecordIndex: (current - 1) * pageSize,
                RecordSize: pageSize
            });
            this.view.tableRecordList = res.Data.RoleList || [];
            this.view.selectedRowKeys = [];
            this.view.pagination.total = res.Data.Count;
        } catch (e) {
            this.view.tableRecordList = [];
        }
        this.view.tableLoading = false;
    };

    @computed
    get deleteDisabled() {
        return this.view.selectedRowKeys.length === 0;
    }
}