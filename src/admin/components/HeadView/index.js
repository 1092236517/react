import React from 'react';
import { Icon } from 'antd';
import './index.less';

class HeadView extends React.Component {

    render() {
        const {collapsed, onTriggerClick, handleLogout, accountInfo} = this.props;
        return (
            <div className='main-layout-header'>
                <div className='header-right'>
                    <Icon type='user' className='icon-wo mr-8' />
                    <pre className='account-info'>
                        {`您好，${accountInfo.Name || ''}\n${accountInfo.SPName ? accountInfo.SPName + '，' : ''}${accountInfo.RoleName || ''}`}</pre>
                    <div className='line ml-24 mr-24'/>
                    <Icon type='logout' className='icon-Logout' onClick={handleLogout} />
                </div>
            </div>
        );
    }
}

export default HeadView;
