// 该页面为到账出账查看
import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { homeStore } from 'ADMIN_STORE';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ImageView from './showImage';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@observer
class Check extends React.Component {
    constructor(props) {
        super(props);
        let url = window.location.href;
        let idCode1 = url.indexOf("=");
        let idCode2 = url.indexOf("&");
        let id = url.substring(idCode1 + 1, idCode2);

        this.state = {
            flag: '',
            imageView: false,
            imageSource: '',
            edit: false,
            cancelSpl: false,
            RecordID: id
        };
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        const { fundAdujEdit, view: { ImageUrl } } = this.props.entryAndExitStore;
        window._czc.push(['_trackEvent', '到账/出账', '单条明细提交', '到账/出账_Y结算']);
        validateFields((err, fieldsValue) => {
            if (err) return;
            if (ImageUrl[0] !== undefined) {
                fundAdujEdit(this.state.RecordID).then(() => {
                    this.setState({
                        edit: false
                    });
                    this.handlePageClose();
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: '银行凭证必填'
                });
            }
        });
    };

    handleFormReset = (e) => {
        if (this.props.entryAndExitStore.view.rightBoxVis) {
            this.props.entryAndExitStore.resetImport();
        } else {
            this.handlePageClose();
        }
        window._czc.push(['_trackEvent', '到账/出账', '返回', '到账/出账_Y结算']);
    }

    handlePageClose = () => {
        homeStore.handleTabOperate('close');
        this.props.entryAndExitStore.getList();
    };

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

    // 审核前修改
    modify = () => {
        this.setState({
            edit: true
        });
    }

    // 修改金额
    changeAmount = () => {
        const that = this;
        const { hideSpl } = this.props.entryAndExitStore;
        if (this.state.edit && this.props.entryAndExitStore.view.SplitSts === 2) {
            if (!this.state.cancelSpl) {
                confirm({
                    title: '金额修改',
                    content: '修改金额会导致拆分状态更改为"未拆分"，是否继续？',
                    onOk() {
                        window._czc.push(['_trackEvent', '到账/出账', '金额修改', '到账/出账_Y结算']);
                        that.setState({
                            cancelSpl: true
                        }, () => {
                            hideSpl(true);
                        });
                    }
                });
            }
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { bankList } = this.props.globalStore;
        const { view: { OPType, ImageUrl, showImg, SplitSts, AuditStatus }, saveImage } = this.props.entryAndExitStore;

        const formItemLayout = {
            labelCol: { span: 11 },
            wrapperCol: { span: 13 }
        };

        let { imageSource, imageView, edit } = this.state;
        return (
            <div>
                <span style={{ marginTop: "20px", display: "block", fontWeight: 700 }}>充值类型: {{ 1: "到账", 2: "出账" }[OPType]}</span>
                <Form onSubmit={this.handleFormSubmit}>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="付款银行" className="mb-8">
                                {getFieldDecorator('PayBankName', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }]
                                })(<Select
                                    className="inputbgc"
                                    disabled={!edit}
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
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
                                {getFieldDecorator('RecvBankName', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }]
                                })(<Select
                                    className="inputbgc"
                                    disabled={!edit}
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
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
                                {getFieldDecorator('PayAccountName', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }]
                                })(<Input disabled={!edit} maxLength={20} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="收款银行账号名" className="mb-8">
                                {getFieldDecorator('RecvAccountName', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }]
                                })(<Input disabled={!edit} maxLength={20} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="付款银行账号" className="mb-8">
                                {getFieldDecorator('PayBankCardNo', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }, {
                                        pattern: /(^[\d]{8,25}$)/,
                                        message: "请输入正确的8到25位银行卡号"
                                    }]
                                })(<Input disabled={!edit} className="inputbgc" maxLength={25} />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="收款银行账号" className="mb-8">
                                {getFieldDecorator('RecvBankCardNo', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }, {
                                        pattern: /(^[\d]{8,25}$)/,
                                        message: "请输入正确的8到25位银行卡号"
                                    }]
                                })(<Input disabled={!edit} className="inputbgc" maxLength={25} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="银行流水号" className="mb-8">
                                {getFieldDecorator('BankOrderID', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }, {
                                        whitespace: true,
                                        message: '不能输入空格'
                                    }]
                                })(<Input disabled={!edit} maxLength={30} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="金额（元）" className="mb-8">
                                {getFieldDecorator('Amount', {
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }]
                                })(<InputNumber disabled={!edit} onClick={this.changeAmount} precision={2} maxLength={15} style={{ width: "100%", border: "1px solid #aaa" }} className="inputbgc" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="银行打款时间" className="mb-8">
                                {getFieldDecorator('BankTransferTm', {
                                    rules: [{
                                        required: true,
                                        message: '请填写银行打款时间'
                                    }]
                                })(<DatePicker disabled={!edit} className="w-100 inputbgc" />)}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem {...formItemLayout} label="备注" className="mb-8">
                                {getFieldDecorator('Remark', {
                                    initialValue: ''
                                })(
                                    <Input disabled={!edit} maxLength={100} style={{ border: "1px solid #aaa" }} className="inputbgc w-100" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            {
                                edit ? <FormItem {...formItemLayout} label='选择文件'>
                                    {getFieldDecorator('ImageUrl')(
                                        <AliyunUpload
                                            id={'ImageUrl'}
                                            accept="image/jpeg,image/png,image/jpg,image/bmp,image/gif"
                                            listType="picture-card" // 文件格式
                                            oss={uploadRule.labourCertificate} // 阿里云的文件
                                            maxNum={1}
                                            defaultFileList={toJS(ImageUrl) || []}
                                            fileMaxSize={1024 * 1024 * 20}
                                            uploadChange={(id, list) => {
                                                list[0] && this.setState({
                                                    flag: list[0].status
                                                });
                                                saveImage(id, list);
                                            }}>
                                        </AliyunUpload>
                                    )}
                                </FormItem> :
                                    <FormItem {...formItemLayout} label={<span><span style={{ color: "red" }}>*</span>上传凭证</span>} >
                                        {showImg !== "" ?
                                            <img style={{ width: "150px", height: "auto" }} src={showImg} onClick={() => { this.imgOpen(showImg); }} alt="这里是一张照片" /> :
                                            <span>未上传凭证</span>
                                        }
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    {
                        AuditStatus === 1 ? <Row style={{ 'marginBottom': '10px' }}>
                            <Col offset={5}>
                                <Button type="primary" onClick={this.modify}>修改</Button>
                                <Button type="primary" htmlType="submit" className="ml-8">确定</Button>
                                <Button className="primary ml-8" onClick={this.handleFormReset}>返回</Button>
                            </Col>
                        </Row> : ''
                    }

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
})(Check);