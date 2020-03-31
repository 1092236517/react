import React from 'react';
import {Tabs, Dropdown, Icon, Menu} from 'antd';
import {observer} from "mobx-react";

const TabPane = Tabs.TabPane;

@observer
export default class extends React.Component {

    /*  constructor(props) {
          super(props);
          console.log('constructor');
      }

      componentWillMount() {
          console.log('componentWillMount');
      }

      componentDidMount() {
          console.log('componentDidMount');
      }

      componentWillUpdate() {
          console.log('componentWillUpdate');
      }

      componentDidUpdate() {
          console.log('componentDidUpdate');
      }

      componentWillUnmount() {
          console.log('componentWillUnmount');
      }*/

    handleDropDownMenuClick = ({item, key}) => this.props.handleTabOperate && this.props.handleTabOperate(key);

    menu = <Menu onClick={this.handleDropDownMenuClick}>
        <Menu.Item key="close"><Icon type="close" className='mr-8'/>关闭当前</Menu.Item>
        <Menu.Item key="close-other"><Icon type="ellipsis" className='mr-8'/>关闭其他</Menu.Item>
        <Menu.Item key="clear"><Icon type="close-circle-o" className='mr-8'/>关闭所有</Menu.Item>
    </Menu>;

    tabBarExtraContent = <Dropdown overlay={this.menu} trigger={['click']}>
        <a className="ant-dropdown-link mr-16" href="#">
            操作 <Icon type="down"/>
        </a>
    </Dropdown>;

    render() {
        const {tabList, activeKey, handleTabClick, handleTabEdit} = this.props;
        return (
            <Tabs hideAdd animated={false}
                  activeKey={activeKey}
                  type="editable-card"
                  onEdit={handleTabEdit}
                  onTabClick={handleTabClick}
                  tabBarExtraContent={this.tabBarExtraContent}>
                {[...tabList.entries()].map(item => <TabPane key={item[0]} tab={item[1].tabName}/>)}
            </Tabs>
        );
    }
}
