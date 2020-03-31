import React, { Fragment } from 'react';
import { Tree, Button, Menu, Icon, Spin } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from "mobx-react";
import ResourceModal from './resourceModal';

@tabWrap({
    tabName: '平台菜单管理',
    stores: ['ptResourceStore']
})
@inject('ptResourceStore')
@observer
export default class extends React.Component {

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/system/menu/pt']);
        if (!this.props.ptResourceStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.ptResourceStore.getResourceList();
    }

    handleDropDownMenuClick = ({ item, key }) => {
        this.props.ptResourceStore.handleResourceSave(item.props.pos, key);
        window._czc.push(['_trackEvent', '平台菜单管理', '功能操作', '平台菜单管理_N非结算']);
    };

    /**
     * attrType
     *
     *  当Resource.Type === 2    按钮
     *      1：按钮
     *  当Resource.Type === 1    菜单
     *      2：有子菜单
     *      3：有子功能
     *      4：既有子菜单，又有子功能
     *      5：无child
     *      6：有child，无子菜单，无子功能(特殊情况)
     *
     * @param data
     * @param pPos
     * @param hasChange
     * @returns {any}
     */

    loop = (data, pPos, hasChange) => {
        const Resources = data.SubResources || data.Resources;
        return Resources && Resources.length ? Resources.map((item, index) => {
            let pos = (pPos ? pPos + '-' : '') + index;
            let attrType = item.attrType;
            let icon = item.IconUrl ? <img width={16} height={16} src={item.IconUrl} /> :
                attrType === 1 ? <Icon type="appstore-o" /> :
                    attrType === 5 ? <Icon type="file" /> :
                        <Icon type="folder" />;

            const title = <span>
                <span className={item.Name ? 'color-cyan' : 'color-red'}>{item.Name || '(未配置名称)'}</span>
                <span style={{ userSelect: 'none' }}>{item.NavUrl ? '（链接：' + item.NavUrl + '）' : ''}</span>
                <MenuEditGroup pos={pos} attrType={attrType} handleMenuEdit={this.handleDropDownMenuClick} />
            </span>;
            return (
                <Tree.TreeNode
                    icon={icon}
                    key={item.ResID} selectable={false}
                    title={title}>
                    {this.loop(item, pos, hasChange)}
                </Tree.TreeNode>
            );
        }) : undefined;
    };

    render() {
        const { getResourceList, handleResourceChangeCommit, handleResourceDrop, handleResourceModalCancel, handleResourceModalConfirm, handleResourceModalAfterClose } = this.props.ptResourceStore;
        const { ResourceData, hasChange, ResourceModal: ResourceModalItem, loadResourceLoading } = this.props.ptResourceStore.view;
        return (
            <Spin spinning={loadResourceLoading}>
                <Button type='primary' className='mr-8' disabled={!hasChange}
                    onClick={() => { handleResourceChangeCommit(); window._czc.push(['_trackEvent', '平台菜单管理', '点击保存按钮', '平台菜单管理_N非结算']); }}>保存</Button>
                <Button disabled={!hasChange} onClick={() => { getResourceList(); window._czc.push(['_trackEvent', '平台菜单管理', '点击重置按钮', '平台菜单管理_N非结算']); }}>重置</Button>
                {!loadResourceLoading && <Tree
                    showIcon showLine draggable
                    onDrop={handleResourceDrop}>
                    {this.loop(ResourceData, '', hasChange)}
                </Tree>}
                <ResourceModal {...ResourceModalItem}
                    handleCancel={handleResourceModalCancel}
                    handleAfterClose={handleResourceModalAfterClose}
                    handleConfirm={handleResourceModalConfirm}
                />
            </Spin>
        );
    }
}

class MenuEditGroup extends React.Component {

    handleMenuEdit = this.props.handleMenuEdit;

    handleClick = (e) => {
        window._czc.push(['_trackEvent', '平台菜单管理', '功能操作', '平台菜单管理_N非结算']);
        const pos = this.props.pos;
        const key = e.target.name;
        if (key && pos) {
            const position = pos.split('-');
            this.handleMenuEdit({
                item: { props: { pos: position } }, key
            });
        }
    };

    render() {
        const attrType = this.props.attrType;
        return (
            <span onClick={this.handleClick} className='ml-8'>
                {(attrType === 2 || attrType === 5 || attrType === 6) &&
                    <Fragment>| <a className='ml-8 mr-8' name="add">添加子菜单</a></Fragment>}
                {(attrType === 3 || attrType === 5 || attrType === 6) &&
                    <Fragment>| <a className='ml-8 mr-8' name="add-fun">添加功能</a></Fragment>}
                <Fragment>| <a className='ml-8 mr-8' name="modify">修改</a></Fragment>
                {(attrType === 1 || attrType === 5) &&
                    <Fragment>| <a className='ml-8 mr-8' name="delete">删除</a></Fragment>}
            </span>
        );
    }
}