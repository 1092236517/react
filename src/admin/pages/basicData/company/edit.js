import React from 'react';
import {Form, Input, message, Button, Spin} from 'antd';
import {tabWrap} from 'ADMIN_PAGES';
import {observer, inject} from "mobx-react";
import {homeStore} from 'ADMIN_STORE';
import 'ADMIN_ASSETS/less/pages/edit-company.less';
import Locations from './Locations';
import {FooterToolbar} from 'web-react-base-component';
import MapView from 'ADMIN_COMPONENTS/MapView';

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
    }
};

@tabWrap({
    tabName: '编辑企业基础数据',
    stores: ['companyEditStore']
})
@inject('companyEditStore', 'companyStore')
@observer
class EditCompany extends React.Component {
    state = {};

    componentDidMount() {
        if (!this.props.companyEditStore.view.isDirty) {
            let record = this.props.companyEditStore.record;
            if (!record) {
                homeStore.handleTabOperate('close');
            } else {
                this.props.companyEditStore.setRecord();
                if (record && record.Location && record.Location.length) {
                    let loc = record.Location[record.Location.length - 1];
                    console.log(loc);
                    this.setState({
                        initPoi: {
                            longlat: loc.Longitude + ',' + loc.Latitude
                        }
                    });
                }
            }
        }
    }

    handleLocationChange = (value) => {
        this.props.companyEditStore.view.Location = value;
    };

    handleInputChange(name, event) {
        this.props.companyEditStore.view[name] = event.target.value;
    };

    handleInputBlur(name, event) {
        this.props.companyEditStore.handleDateInputBlur(name, event.target.value);
    }

    handleLocationBlur = ({value, errors}) => {
        if (errors) {
            this.props.companyEditStore.view.LocationError = errors;
        }
        if (value) {
            this.props.companyEditStore.view.Location = value;
        }
    };

    handleAddMapLocation = () => {
        this.setState({
            showMap: true
        });
    };

    closeMapCall = (type, poi) => {
        if (type === 'cancel') {
            this.setState({
                showMap: false
            });
        }
        if (type === 'ok') {
            this.props.companyEditStore.setPoi(poi);
            this.setState({
                showMap: false,
                initPoi: poi
            });
        }
    };

    handleToolbarSubmit = () => {
        window._czc.push(['_trackEvent', '企业基础数据', '提交修改', '企业基础数据_N非结算']);
        let view = this.props.companyEditStore.view;
        // if (!view.CtctName) {
        //     message.error('请输入联系人');
        //     return;
        // }
        // if (!(/^1[3-9][0-9]\d{8}$/.test(view.CtctMobile))) {
        //     message.error('请输入正确的手机号');
        //     return;
        // }
        // if (!view.SettleBeginDy || !view.SettleEndDy) {
        //     message.error('请输入正确的发薪周期');
        //     return;
        // }
        // if (!view.PayDy) {
        //     message.error('请输入正确的发薪日');
        //     return;
        // }
        // if (!view.Location || !view.Location.length) {
        //     message.error('请添加白名单');
        // }
        let param = {
            EntId: view.EntId,
            CtctName: view.CtctName,
            CtctMobile: view.CtctMobile,
            Location: view.Location.map(item => {
                let result = {};
                result.ClockRange = parseInt(item.ClockRange, 10);
                result.EntLocId = item.EntLocId || 0;
                result.Latitude = item.Latitude.toString();
                result.Longitude = item.Longitude.toString();
                if (isNaN(result.ClockRange)) result.ClockRange = 0;
                return result;
            })
        };
        param.SettleBeginDy = parseInt(view.SettleBeginDy, 10);
        param.SettleEndDy = parseInt(view.SettleEndDy, 10);
        param.PayDy = parseInt(view.PayDy, 10);
        this.props.companyEditStore.editCompanyInfo(param, (res) => {
            setTimeout(this.handlePageClose, 500);
        });
    };

    handlePageClose = () => {
        homeStore.handleTabOperate('close');
        this.props.companyStore.companyQueryInfoLisit();
    };

    render() {
        const {EntId, EntFullName, EntShortName, CtctName, CtctMobile, SettleBeginDy, SettleEndDy, PayDy, Location, edit, SettleBeginDyError, PayDyError, LocationError, disableEditSettleDy} = this.props.companyEditStore.view;
        return (
            <div className='edit-company-page'>
                <FooterToolbar type='head'>
                    <Button htmlType="button" onClick={this.handlePageClose} disabled={!!edit}>取消</Button>
                    <Button htmlType="button" className="ml-8" type="primary"
                            disabled={!!edit || SettleBeginDyError || PayDyError || LocationError}
                            onClick={this.handleToolbarSubmit}>提交</Button>
                </FooterToolbar>
                {this.state.showMap && <MapView
                    enableEdit={true}
                    closeCall={this.closeMapCall}
                    initPoi={this.state.initPoi || {}}/>}
                <div className='edit-company-container'>
                    <Spin spinning={!!edit}>
                        <Form>
                            <Form.Item {...formItemLayout} label="企业ID">
                                <Input disabled value={EntId}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="企业全称">
                                <Input disabled value={EntFullName}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="企业简称">
                                <Input value={EntShortName} disabled
                                />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="联系人" >
                                <Input placeholder='请输入' maxLength={10} value={CtctName}
                                       onChange={this.handleInputChange.bind(this, 'CtctName')}
                                />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="联系手机" >
                                <Input placeholder='请输入' maxLength={11} value={CtctMobile}
                                       onChange={this.handleInputChange.bind(this, 'CtctMobile')}
                                />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="发薪周期" {...SettleBeginDyError} >
                                <div className='form-item-flex'>
                                    <Input className='form-item-SettleDy' value={SettleBeginDy}
                                           disabled={disableEditSettleDy}
                                           placeholder='请输入' maxLength={2}
                                           onBlur={this.handleInputBlur.bind(this, 'SettleBeginDy')}
                                           onChange={this.handleInputChange.bind(this, 'SettleBeginDy')}/>
                                    <span className='ml-8 mr-8'>至</span>
                                    <Input className='form-item-SettleDy' value={SettleEndDy}
                                           disabled placeholder='请输入'/>
                                    <span className='form-item-SettleDy-tip'>发薪周期一旦填写将无法修改，请谨慎填写。</span>
                                </div>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="发薪日" {...PayDyError} >
                                <Input placeholder='请输入' maxLength={2}
                                       onBlur={this.handleInputBlur.bind(this, 'PayDy')}
                                       onChange={this.handleInputChange.bind(this, 'PayDy')}
                                       className='form-item-SettleDy' value={PayDy}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="白名单设置" {...LocationError} >
                                <Locations value={Location}
                                           onChange={this.handleLocationChange}
                                           addMapLocation={this.handleAddMapLocation} isMapInput
                                    // onBlurValidate={this.handleLocationBlur}
                                />
                            </Form.Item>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default EditCompany;