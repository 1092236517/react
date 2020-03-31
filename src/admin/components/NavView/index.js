import React from 'react';
import { Layout, Icon, Menu } from 'antd';
import './index.less';

export default class extends React.Component {

  render() {
    const { collapsed, openKeys, selectedKeys, handleMenuItemClick, handleMenuOpenChange, menuList,
       onTriggerClick, handleLogout, accountInfo } = this.props;

    return (
      <Layout.Sider collapsed={collapsed} className='home-layout-sider'>
        <div className='logo-con'>
          <span>周薪薪运营后台</span>
          <Icon className="trigger" style={{ display: 'none' }}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={onTriggerClick} />
        </div>
        <div className="logo" />
        <Menu theme="dark" mode="inline"
          style={{ width: 200 }}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={handleMenuOpenChange}
          onClick={handleMenuItemClick}>
          {loop(menuList)}
        </Menu>
      </Layout.Sider>
    );
  }
}

const loop = (menuList, role) => {
  // let role = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role');
  return menuList.reduce((pre, cur) => {
    // if (this.judgeRole(item.role, role))
    if (cur.SubMenus && cur.SubMenus.length) {
      pre.push(
        <Menu.SubMenu key={cur.MID} path={cur.NavUrl}
          title={
            <span>
              {cur.ImgUrl && <img width={16} height={16} src={cur.ImgUrl} className='mr-8' />}
              <span>{cur.Name}</span>
            </span>}>
          {loop(cur.SubMenus, role)}
        </Menu.SubMenu>
      );
    } else {
      pre.push(
        <Menu.Item key={cur.MID} path={cur.NavUrl}>
          {cur.ImgUrl && <img width={16} height={16} src={cur.ImgUrl} className='mr-8' />}
          <span>{cur.Name}</span>
        </Menu.Item>
      );
    }
    return pre;
  }, []);
};
