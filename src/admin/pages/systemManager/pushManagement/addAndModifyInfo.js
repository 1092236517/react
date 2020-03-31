import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Radio, Button, Icon, message } from 'antd';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { saveNoticeData, modifyNoticeData } from 'ADMIN_SERVICE/ZXX_SystemCfg';
import { toJS } from 'mobx';
import ImageView from './showImageForNotice';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { TextArea } = Input;

const validateFiles = (fileList) => (fileList.length > 0 && fileList.slice().every((file) => (file.status == 'done')));
class AddAndModifyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageView: false,
            imageSource: ''
        };
    }
    saveData = (e) => {
        e.preventDefault();
        const { infoBean, radioButtonBean, startQuery, toMainPage, resetForm } = this.props;
        this.props.form.validateFields(async (err, fieldsValue) => {
            if (err) {
                return;
            }
            const { BeginDt, EndDt, ImageUrl } = fieldsValue;
            let reqParam = {
                ...infoBean,
                BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
                EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
                MsgURL: ImageUrl
            };
            reqParam = Object.assign(radioButtonBean, reqParam);
            window._czc.push(['_trackEvent', '公告推送管理', '提交', '公告推送管理_N非结算']);
            try {
                if (reqParam.DataId) {
                    delete reqParam['ImageUrl'];
                    reqParam.ReceiveId = reqParam.ReceiveId == 10000 ? '' : reqParam.ReceiveId;
                    if (reqParam.MsgURL.indexOf('aliyuncs.com') !== -1) {
                        reqParam.MsgURL = reqParam.MsgURL.substring(0, reqParam.MsgURL.indexOf('?')).substring(reqParam.MsgURL.indexOf('aliyuncs.com')).replace('aliyuncs.com', '');
                    }
                    reqParam['MsgURL'] = reqParam['MsgURL'].slice(1);
                    await modifyNoticeData(reqParam);
                } else {
                    delete reqParam['DataId'];
                    delete reqParam['ImageUrl'];
                    reqParam.ReceiveId = reqParam.ReceiveId == 10000 ? '' : reqParam.ReceiveId;
                    reqParam['MsgURL'] = reqParam['MsgURL'].slice(1);
                    await saveNoticeData(reqParam);
                }
                message.success('文件保存成功！');
                resetForm();
                toMainPage();
                startQuery();
            } catch (err) {
                message.error(err.message);
                console.log(err);
            }
        });
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
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 8 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } } };

        const {

            receiveMemberOpt,
            toMainPage,
            saveImage,
            ImageUrl,
            form: { getFieldDecorator, getFieldValue }
        } = this.props;
        let { imageSource, imageView } = this.state;
        return (
            <div>
                <Form onSubmit={this.saveData}>
                    <FormItem {...formItemLayout} label='标题'>
                        {getFieldDecorator('Title', {
                            rules: [{ required: true, message: '请输入标题' }]
                        })(
                            <Input maxLength={55} placeholder='标题关键字' />
                        )}
                    </FormItem>

                    {
                        <Fragment>
                            <FormItem {...formItemLayout} label='开始时间'>
                                {getFieldDecorator('BeginDt', {
                                    rules: [{ required: true, message: '请填写入职日期' }]
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD" style={{ width: '100%' }}
                                        className='w-100'
                                        disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDt');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label='结束时间'>
                                {getFieldDecorator('EndDt', {
                                    rules: [{ required: true, message: '请填写入职日期' }]
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD" style={{ width: '100%' }}
                                        className='w-100'
                                        disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDt');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />
                                )}
                            </FormItem>
                        </Fragment>

                    }


                    <FormItem {...formItemLayout} label='是否禁用'>
                        {getFieldDecorator('Enable', {
                            rules: [{ required: true, message: '请选择文件类型' }]
                        })(
                            <RadioGroup>
                                <RadioButton value={1}>否</RadioButton>
                                <RadioButton value={2}>是</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='图片选择'>
                        {getFieldDecorator('ImageUrl', {
                            rules: [{ required: true, message: '请上传图片' }]
                        })(
                            <AliyunUpload id={'ImageUrl'}
                                // 上传格式
                                accept="image/jpeg,image/png,image/jpg,image/bmp,image/gif"
                                listType="picture-card" // 文件格式
                                oss={uploadRule.pushMant} // 阿里云的文件
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
                    </FormItem>

                    <FormItem {...formItemLayout} label='接收会员'>
                        {getFieldDecorator('ReceiveId', {
                            rules: [{ required: true, message: '请选择接收会员' }]
                        })(
                            <Button className='ml-8' onClick={receiveMemberOpt}>会员</Button>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='推送文案'>
                        {getFieldDecorator('MsgText', {
                            rules: [{ required: true, message: '推送文案不能为空' }]
                        })(
                            <TextArea rows={5} maxLength={1000} />
                        )}
                    </FormItem>

                    <FormItem {...btnItemLayout}>
                        <Button type="primary" htmlType="submit" >确定</Button>
                        <Button className='ml-8' onClick={toMainPage}>返回</Button>
                    </FormItem>
                </Form>
                {
                    imageView &&
                    <ImageView setModalVisible={this.setModalVisible.bind(this)} imageView source={imageSource} />
                }
            </div>
        );
    }
}

AddAndModifyInfo = Form.create({
    mapPropsToFields: props => (createFormField(props.infoBean)),
    onValuesChange: (props, changedValues, allValues) => (props.handleInfoFormValuesChange(allValues))
})(AddAndModifyInfo);

export default AddAndModifyInfo;