import React from 'react';
import { Table, Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { toJS } from 'mobx';
import SearchForm from './searchForm';
import AddUserModel from './addUserModel';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
    tabName: '用户管理',
    stores: ['userManagerStore']
})
@inject('userManagerStore')
@observer
export default class extends React.Component {
    state = {
        selectedRowKeys: []
    };
    onChange = (page, pageSize) => {
        this.props.userManagerStore.savePage({ page: page, pageSize: pageSize });
        this.init(1);
    };

    showTotal = (total) => {
        return `总共 ${total} 条数`;
    };

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/system/user']);
        if (!this.props.userManagerStore.view.isDirty) {
            this.init();
        }
    };

    init = (query) => {
        this.props.userManagerStore.getBillList(query);
        this.props.userManagerStore.getRoleList();
    };

    showAddModelChange = () => {
        let { userManagerStore } = this.props;
        userManagerStore.showAddModel();
        window._czc.push(['_trackEvent', '用户管理', '点击新增按钮', '用户管理_N非结算']);
    }

    editAddModeValue = (Id) => {
        let { userManagerStore } = this.props;
        userManagerStore.editAddModeValue(Id);
        window._czc.push(['_trackEvent', '用户管理', '点击修改按钮', '用户管理_N非结算']);
    }
    getRoleNames = (arr) => {
        let RoleName = [];
        arr.map((item) => {
            RoleName.push(item.RoleName);
        });
        return RoleName.join(",");
    }

    render() {
        const { view, handleFormReset, handleFormValuesChange, handleAddValuesChange, getBillList, showAddModel, hiddenAddModel, saveAddModeValue } = this.props.userManagerStore;
        const { searchValue, billList, showUsers, paging, getBillListStatus, total, cityModelValue, addressOptions, cityModelName, provincesCities, AreaShortName, roleList } = view;
        let columns = [
            {
                title: '用户名',
                dataIndex: 'Mobile',
                width: '10%',
                render: (text, record) => {
                    let Id = record.UID;
                    return (
                        <a href="javascript:;" onClick={() => this.editAddModeValue(Id)}>{text.substring(0, 3) + "****" + text.substring(7, 11)}</a>
                    );
                }
            }, {
                title: '姓名',
                dataIndex: 'CnName',
                className: 'bg-y',
                width: '10%'
            }, {
                title: '英文名',
                dataIndex: 'EnName',
                className: 'bg-y',
                width: '10%'
            }, {
                title: '昵称',
                dataIndex: 'Nickname',
                className: 'bg-y',
                width: '10%'
            }, {
                title: '角色',
                dataIndex: 'RoleName',
                className: 'bg-y',
                width: '10%',
                render: (text, record) => {
                    let Roles = record.Roles;
                    return (
                        <div>{this.getRoleNames(record.Roles)}</div>
                    );
                }
            }, {
                title: '是否有效',
                dataIndex: 'IsValide',
                className: 'bg-y',
                width: '6%',
                render: (text, record) =>
                    <span>{text == 0 ? <span className="color-red">无效</span> :
                        <span className="color-green">有效</span>}</span>
            }, {
                title: '创建时间',
                dataIndex: 'CreateTime',
                className: 'bg-y',
                width: '10%'
            },
            {
                title: '操作人',
                dataIndex: 'Operator',
                className: 'bg-y',
                width: '8%'
            }, {
                title: '操作时间',
                dataIndex: 'OperatTm',
                className: 'bg-y',
                width: '10%'
            },
            {
                title: '操作',
                dataIndex: 'oprate',
                className: 'bg-y',
                width: '18%',
                render: (text, record) => {
                    let Id = record.UID;
                    return (
                        <a href="javascript:;" onClick={() => this.editAddModeValue(Id)}>修改</a>
                    );
                }

            }];
        return (
            <div>
                <SearchForm
                    onValuesChange={handleFormValuesChange}
                    searchValue={searchValue}
                    handleSubmit={getBillList}
                    handleFormReset={handleFormReset}
                />
                <AddUserModel
                    roleList={roleList}
                    userManagerStore={this.props.userManagerStore}
                    cityModelName={cityModelName}
                    cityModelValue={cityModelValue}
                    onValuesChange={handleAddValuesChange}
                    hiddenAddModel={hiddenAddModel}
                    getBillListStatus={getBillListStatus}
                    saveAddModeValue={saveAddModeValue}
                />
                <div style={{ marginBottom: '10px' }}><Button type="primary"
                    onClick={() => this.showAddModelChange()}>新增</Button></div>
                <Table
                    rowKey="UID"
                    columns={columns}
                    bordered
                    dataSource={toJS(billList)}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current: paging.RecordIndex,
                        pageSize: paging.RecordSize,
                        total: total,
                        showTotal: this.showTotal,
                        onChange: (page, pageSize) => this.onChange(page, pageSize),
                        onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
                    }}
                    loading={getBillListStatus} />
            </div>
        );
    }
}