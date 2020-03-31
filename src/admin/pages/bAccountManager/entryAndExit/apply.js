// 该页面为到账出账录入
import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { homeStore } from 'ADMIN_STORE';
import { createFormField, formLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ImageView from './showImage';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import { selectInputSearch } from 'ADMIN_UTILS';
@observer
// 详细信息
class Apply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: '',
            imageView: false,
            imageSource: ''
        };
    }

    handleFormReset = (e) => {
        if (this.props.entryAndExitStore.view.rightBoxVis) {
            this.props.entryAndExitStore.resetImport();
        } else {
            this.handlePageClose();
        }
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        const { request } = this.props.entryAndExitStore;
        validateFields((err, fieldsValue) => {
            if (err) return;
            if (this.state.flag === 'done') {
                request(() => {
                    if (this.props.entryAndExitStore.view.rightBoxVis) {
                        this.props.entryAndExitStore.importPreview(true);
                        this.setState({
                            flag: ''
                        });
                    } else {
                        this.handlePageClose();
                        this.setState({
                            flag: ''
                        });
                    }
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: '银行凭证必填'
                });
            }

        });
    };

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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { bankList, companyList } = this.props.globalStore;
        const {
            view: {
                ExcelData: { PayBankNameExc, RecvBankNameExc },
                OPType, ImageUrl, commitedImage, dis, subDis, rightBoxVis, showImg, transferType
            },
            getTradeType, saveImage, getTransferType } = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 11 },
            wrapperCol: { span: 13 }
        };

        let { imageSource, imageView } = this.state;
        return (
            <div>
                <div style={{ marginTop: "30px" }}>
                    <span>出入金类型:  </span>
                    <RadioGroup disabled={dis} onChange={(e) => { getTradeType(e.target.value); }} value={OPType}>
                        <Radio value={1}>到账</Radio>
                        <Radio value={2}>出账</Radio>
                        <Radio value={3}>押金换到账</Radio>
                    </RadioGroup>
                </div>
                <Form onSubmit={this.handleFormSubmit}>
                    {
                        (OPType !== 3) && rightBoxVis && (PayBankNameExc || RecvBankNameExc) &&
                        <Row>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="导入件" className="mb-8 titleShow">
                                    <span className="bankShow" >{PayBankNameExc}</span>
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="导入件" className="mb-8 titleShow">
                                    <span className="bankShow" >{RecvBankNameExc}</span>
                                </FormItem>
                            </Col>
                        </Row>
                    }

                    {(OPType !== 3) && <div><Row>
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
                                    disabled={dis}
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
                                    disabled={dis}
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
                                    })(<Input disabled={dis} maxLength={20} className="inputbgc" />)}
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
                                    })(<Input disabled={dis} maxLength={20} className="inputbgc" />)}
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
                                    })(<Input disabled={dis} className="inputbgc" maxLength={25} />)}
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
                                    })(<Input disabled={dis} className="inputbgc" maxLength={25} />)}
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
                                    })(<Input disabled={dis} maxLength={30} className="inputbgc" />)}
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="金额（元）" className="mb-8">
                                    {getFieldDecorator('Amount', {
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(<InputNumber disabled={dis} precision={2} maxLength={15} style={{ width: "100%", border: "1px solid #aaa" }} className="inputbgc" />)}
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
                                    })(<DatePicker disabled={dis} className="w-100 inputbgc" />)}
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="备注" className="mb-8">
                                    {getFieldDecorator('Remark', {
                                        initialValue: ''
                                    })(
                                        <Input disabled={dis} maxLength={100} style={{ border: "1px solid #aaa" }} className="inputbgc w-100" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="被红冲的记录ID" className="mb-8">
                                    {getFieldDecorator('BeRedRunRecordID', {
                                        rules: [{
                                            whitespace: true,
                                            message: '不能输入空格'
                                        }]
                                    })(<Input className="inputbgc" />)}
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label="是否虚拟到出账" className="mb-8">
                                    {getFieldDecorator('IsVirtual')(
                                        <Select placeholder="请选择">
                                            <Option value={1}>是</Option>
                                            <Option value={2}>否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <FormItem {...formItemLayout} label={<span><span style={{ color: "red" }}>*</span>上传凭证</span>} >
                                    {
                                        commitedImage !== "" ? <img style={{ width: "150px", height: "auto" }} src={commitedImage} onClick={() => { this.imgOpen(commitedImage); }} alt="这里是一张照片" /> :
                                            <AliyunUpload id={'ImageUrl'}
                                                // 上传格式
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
                                    }
                                </FormItem>
                            </Col>
                        </Row></div>}


                    {
                        OPType === 3 &&
                        <div>
                            <Row>
                                <Col span={7}>
                                    <FormItem {...formItemLayout} label="转账金额(元)" className="mb-8">
                                        {getFieldDecorator('Amount', {
                                            rules: [{
                                                required: true,
                                                message: '必填'
                                            }]
                                        })(<InputNumber disabled={dis} precision={2} maxLength={15} style={{ width: "100%", border: "1px solid #aaa" }} className="inputbgc" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem {...formItemLayout} label="备注" className="mb-8">
                                        {getFieldDecorator('Remark', {
                                        })(<TextArea rows={6} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <FormItem {...formItemLayout} label={<span><span style={{ color: "red" }}>*</span>上传凭证</span>} >
                                        {
                                            commitedImage !== "" ? <img style={{ width: "150px", height: "auto" }} src={commitedImage} onClick={() => { this.imgOpen(commitedImage); }} alt="这里是一张照片" /> :
                                                <AliyunUpload id={'ImageUrl'}
                                                    // 上传格式
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
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    }
                    <Row>
                        <Col {...formLayout} offset={1} style={{ marginBottom: "20px" }}>
                            <Button className="ml-8" disabled={dis ? true : subDis} type="primary" htmlType="submit">确定</Button>
                            <Button className="ml-8" onClick={this.handleFormReset}>返回</Button>
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
})(Apply);