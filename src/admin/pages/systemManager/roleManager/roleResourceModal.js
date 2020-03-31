import React from 'react';
import {
    Modal,
    Tree,
    Icon
} from 'antd';
import { toJS } from 'mobx';

export default class RoleResourceModal extends React.PureComponent {

    loop = (data) => {
        const Resources = data.SubResources || data.Resources;
        return Resources && Resources.length ? Resources.map(item => {
            let icon = item.SubResources && item.SubResources.length ? <Icon type="folder" /> :
                item.Type === 1 ? <Icon type="file" /> :
                    item.Type === 2 ? <Icon type="appstore-o" /> : undefined;
            return (
                <Tree.TreeNode
                    icon={icon}
                    key={item.ResID} selectable={false}
                    title={item.Name}>
                    {this.loop(item)}
                </Tree.TreeNode>
            );
        }) : undefined;
    };

    render() {
        const { Visible, confirmLoading, ResourceData, checkedKeys, handleModalChange } = this.props;
        return (
            <Modal
                title='配置权限'
                confirmLoading={confirmLoading}
                onOk={() => { handleModalChange.onOk(); window._czc.push(['_trackEvent', '平台角色管理', '配置权限', '平台角色管理_N非结算']); }}
                onCancel={handleModalChange.onCancel}
                afterClose={handleModalChange.afterClose}
                visible={Visible}>
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    <Tree
                        checkStrictly={true}
                        checkable
                        showIcon
                        showLine
                        onCheck={handleModalChange.onResourceCheck}
                        checkedKeys={toJS(checkedKeys)}>
                        {this.loop(ResourceData)}
                    </Tree>
                </div>
            </Modal>
        );
    }
};