import React from 'react';
import {Modal, Form, DatePicker, Radio, Input, Select, Button, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import 'ADMIN_ASSETS/less/pages/clockInMag.less';
const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19}
};
@inject('clockInMagStore', 'globalStore')
@observer
class AddModalComp extends React.Component {

    componentDidMount() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
           if(!err) {
               values = {...values, InterviewDt: values.InterviewDt.format('YYYY-MM-DD'), RepairTm: values.RepairTm.format('YYYY-MM-DD HH:mm:ss')};
               this.props.clockInMagStore.handleSave(values, this.props.form.resetFields);
           }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.clockInMagStore.setVisible(this.props.clockInMagStore.view.addVisible ? 'addVisible' : 'detailsVisible', false);
        this.props.form.resetFields();
    }

    render() {
        const { agentList, companyList, laborList } = this.props.globalStore;
        const {view} = this.props.clockInMagStore;
        const {addVisible, modalLoading, recordDataSource, detailsVisible} = view;
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                className="clock-in-manager"
                title={addVisible ? "补打卡" : "补打卡记录"}
                visible={addVisible || detailsVisible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                footer={addVisible ? [
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleSubmit}>确定</Button>
                ] : [<Button key="back" type="primary" onClick={this.handleCancel}>确定</Button>]}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form className="modal">
                        <Form.Item {...formItemLayout} label="身份证号码">
                            {
                                getFieldDecorator('IDCardNum', {
                                    initialValue: recordDataSource.IDCardNum,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }, {
                                            pattern: /(^\d{17}(\d|X|x)$)/,
                                            message: '请输入正确的18位身份证号码'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入" disabled={detailsVisible} maxLength={18}/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="面试日期">
                            {
                                getFieldDecorator('InterviewDt', {
                                    initialValue: recordDataSource.InterviewDt,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        disabled={detailsVisible}
                                        format="YYYY-MM-DD"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="企业">
                            {
                                getFieldDecorator('EntID', {
                                    initialValue: recordDataSource.EntID,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={detailsVisible}
                                        showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {companyList.map((item, index) => <Select.Option key={index} value={item.EntId}>{item.EntShortName}</Select.Option>)}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="劳务">
                            {
                                getFieldDecorator('TrgtSpID', {
                                    initialValue: recordDataSource.TrgtSpID,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={detailsVisible}
                                        showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {laborList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="中介">
                            {
                                getFieldDecorator('SrceSpID', {
                                    initialValue: recordDataSource.SrceSpID,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={detailsVisible}
                                        showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {agentList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="补卡类型">
                            {
                                getFieldDecorator('RepairType', {
                                    initialValue: recordDataSource.RepairType,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <Radio.Group disabled={detailsVisible}>
                                        <Radio.Button value={1}>上班卡</Radio.Button>
                                        <Radio.Button value={2}>下班卡</Radio.Button>
                                    </Radio.Group>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="打卡时间">
                            {
                                getFieldDecorator('RepairTm', {
                                    initialValue: recordDataSource.RepairTm,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写完整'
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        disabled={detailsVisible}
                                        showTime
                                        disabledDate={(currentDate) => moment(currentDate).isAfter(moment()) || moment(currentDate).isBefore(moment().day('Sunday').day(-8))}
                                        format="YYYY-MM-DD HH:mm:ss"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="备注">
                            {
                                getFieldDecorator('Remark', {
                                    initialValue: recordDataSource.Remark
                                })(
                                    <Input.TextArea placeholder="请输入" disabled={detailsVisible} />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(AddModalComp);