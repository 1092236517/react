import React from "react";
import {Layout, Spin} from 'antd';
import 'ADMIN_ASSETS/less/pages/main.less';
import TabView from "ADMIN_COMPONENTS/TabView";
import NavView from "ADMIN_COMPONENTS/NavView";
import HeadView from "ADMIN_COMPONENTS/HeadView";
import {observer, inject} from "mobx-react";

const {Header, Content} = Layout;
@inject('authStore')
@observer
export default class extends React.Component {

    handleNavViewChange = (obj) => {
        let path = obj && obj.item && obj.item.props && obj.item.props.path;
        if (path) this.props.homeStore.handleTabPageChange(path, 'nav');
    };

    render() {
        const {hideTabView, homeStore, authStore, onLoadResources} = this.props;
        const {handleLogout, authInfo} = authStore;
        const {navCollapsed, handleNavToggle, MenuList, navOpenKeys, navSelectedKeys, handleNavOpenChange} = homeStore;
        return (
            <Layout className='main-layout-container'>
                <NavView
                    menuList={MenuList}
                    collapsed={navCollapsed}
                    openKeys={navOpenKeys.slice()}
                    selectedKeys={navSelectedKeys}
                    handleMenuOpenChange={handleNavOpenChange}
                    handleMenuItemClick={this.handleNavViewChange}/>
                <Layout>
                    <Header>
                        <HeadView onTriggerClick={handleNavToggle} collapsed={navCollapsed}
                                  handleLogout={handleLogout}
                                  accountInfo={{
                                      Name: authInfo.CnName,
                                      RoleName: authInfo.RoleName,
                                      SPName: authInfo.SPName
                                  }}
                        />
                    </Header>
                    <TabContent
                        onLoadResources={onLoadResources}
                        homeStore={homeStore}
                        hideTabView={hideTabView}>
                        {this.props.children}
                    </TabContent>
                </Layout>
            </Layout>
        );
    }
}

@observer
class TabContent extends React.Component {

    componentDidMount() {
        this.props.homeStore.loadResources(this.props.onLoadResources);
    }

    handleTabViewChange = (key) => {
        this.props.homeStore.handleTabPageChange(key, 'tab');
    };

    render() {
        const {isLoadResource, tabList, tabActiveKey, handleTabEdit, handleTabOperate} = this.props.homeStore;
        return (
            <Content className='main-layout-content-container'>
                {!this.props.hideTabView && <TabView
                    tabList={tabList}
                    handleTabEdit={handleTabEdit}
                    handleTabOperate={handleTabOperate}
                    handleTabClick={this.handleTabViewChange}
                    activeKey={tabActiveKey}/>}
                {
                    isLoadResource ? <div className='main-layout-content'>
                        <div className='main-layout-content-page'>
                            {this.props.children}
                        </div>
                    </div> : <Spin/>
                }
            </Content>
        );
    }
}
