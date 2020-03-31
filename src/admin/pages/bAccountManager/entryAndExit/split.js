// 该页面为到账出账 拆分和审核
import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { homeStore } from 'ADMIN_STORE';
import { createFormField, formLayout } from 'ADMIN_UTILS/searchFormUtil';
import {Col, Form, Input, InputNumber, Row, Select, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import ImageView from './showImage';

const FormItem = Form.Item;

@observer
class Split extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageView: false,
            imageSource: ''
        };
    }

    imgOpen = (value) => {
        this.setState({
            imageSource: value,
            imageView: true
        });
    }

    setModalVisible = () => {
        this.setState({
            imageSource: '',
            imageView: false
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { bankList } = this.props.globalStore;
        const {
            view: {
                RequestValue: { PayBankCardNo, RecvBankCardNo },
                OPType, showImg
            }} = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 11 },
            wrapperCol: { span: 13 }
        };
        let { imageSource, imageView } = this.state;
        return (
            <div>
                <span style={{ marginTop: "20px", display: "block", fontWeight: 700 }}>充值类型: {{ 1: "到账", 2: "出账" }[OPType]}</span>
                <Form>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="付款银行" className="mb-8">
                                {getFieldDecorator('PayBankName')(<Select
                                    className="inputbgc"
                                    disabled={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {bankList.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="收款银行" className="mb-8">
                                {getFieldDecorator('RecvBankName')(<Select
                                    className="inputbgc"
                                    disabled={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {bankList.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="付款银行账号名" className="mb-8">
                                {getFieldDecorator('PayAccountName')(<Input disabled={true} maxLength={20} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="收款银行账号名" className="mb-8">
                                {getFieldDecorator('RecvAccountName')(<Input disabled={true} maxLength={20} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="付款银行账号" className="mb-8">
                                <Input disabled={true}
                                    className="inputbgc"
                                    value={PayBankCardNo.replace(PayBankCardNo.slice(0, PayBankCardNo.length - 6), '****')}
                                />
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="收款银行账号" className="mb-8">
                                <Input disabled={true}
                                    className="inputbgc"
                                    value={RecvBankCardNo.replace(RecvBankCardNo.slice(0, RecvBankCardNo.length - 6), '****')}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="银行流水号" className="mb-8">
                                {getFieldDecorator('BankOrderID')(<Input disabled={true} maxLength={30} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="金额（元）" className="mb-8">
                                {getFieldDecorator('Amount')(<InputNumber disabled={true} precision={2} maxLength={15} style={{ width: "100%", border: "1px solid #aaa" }} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="银行打款时间" className="mb-8">
                                {getFieldDecorator('BankTransferTm')(<DatePicker disabled={true} className="w-100 inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="备注" className="mb-8">
                                {getFieldDecorator('Remark', {
                                    initialValue: ''
                                })(
                                    <Input disabled={true} maxLength={100} style={{ border: "1px solid #aaa" }} className="inputbgc w-100" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label={<span><span style={{ color: "red" }}>*</span>上传凭证</span>} >
                                {
                                    showImg !== "" ?
                                        <img style={{ width: "150px", height: "auto" }} src={showImg} onClick={() => { this.imgOpen(showImg); }} alt="这里是一张照片" /> :
                                        <span>未上传凭证</span>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                {
                    imageView &&
                    <ImageView setModalVisible={this.setModalVisible.bind(this)} imageView source={imageSource} />
                }
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.RequestValue),
    onValuesChange: (props, changedValues, allValues) => props.entryAndExitStore.handleRequestFormValuesChange(allValues)
})(Split);