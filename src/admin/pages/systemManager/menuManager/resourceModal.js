import React from 'react';
import { Modal, Form, Input, Row, Col, Button, Icon } from 'antd';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';

const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
};
const ResourceForm = Form.create({
    mapPropsToFields: props => ({
        parentNav: Form.createFormField({ value: props.parentResourceName }),
        Name: Form.createFormField({ value: props.Name }),
        NavUrl: Form.createFormField({ value: props.NavUrl }),
        Remark: Form.createFormField({ value: props.Remark }),
        IconUrl: Form.createFormField({ value: props.IconUrl }),
        BtnUid: Form.createFormField({ value: props.BtnUid })
    }),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(({ form, Type, logoUrlList, handleUploadChange }) => {
    const { getFieldDecorator } = form;
    let parentNav = form.getFieldValue('parentNav');

    return (
        <Form>
            {parentNav && <Form.Item {...formItemLayout} label="上级导航">
                {getFieldDecorator('parentNav', {
                    rules: [{ required: true, message: '必填' }]
                })(<Input disabled />)}
            </Form.Item>}
            <Form.Item {...formItemLayout} label={`${Type === 1 ? '导航标题' : '功能名称'}`}>
                {getFieldDecorator('Name', {
                    rules: [{
                        required: true, message: `请输入${Type === 1 ? '导航标题' : '功能名称'}`
                    }]
                })(<Input maxLength={30} placeholder='请输入' />)}
            </Form.Item>
            {Type !== 2 &&
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 16 }}>
                        <Form.Item labelCol={{ xs: { span: 24 }, sm: { span: 9 } }}
                            wrapperCol={{ xs: { span: 24 }, sm: { span: 15 } }}
                            label="自定义图标">
                            {getFieldDecorator('IconUrl', {
                                rules: [
                                    { type: 'url', message: '请输入正确的图片URL' }
                                ]
                            })(<Input placeholder='请输入图片链接或上传' />)}
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                        <Form.Item {...formItemLayout} label=" " colon={false}>
                            <AliyunUpload id='logoUrlList'
                                accept="image/jpeg,image/png"
                                oss={uploadRule.resourceLogo}
                                listType="text" previewVisible={false}
                                defaultFileList={logoUrlList}
                                maxNum={1}
                                uploadChange={handleUploadChange}>
                                <Button><Icon type="upload" /> 点击上传</Button>
                            </AliyunUpload>
                        </Form.Item>
                    </Col>
                </Row>}
            {Type !== 2 && <Form.Item {...formItemLayout} label="链接地址">
                {getFieldDecorator('NavUrl')(<Input maxLength={50} placeholder='有子导航不用填' />)}
            </Form.Item>}
            {Type === 2 && <Form.Item {...formItemLayout} label="功能ID">
                {getFieldDecorator('BtnUid', {
                    rules: [{ required: true, message: '必填', whitespace: true }]
                })(<Input placeholder='必填且唯一' maxLength={50} />)}
            </Form.Item>}
            <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('Remark')(<Input.TextArea maxLength={200} placeholder="请输入" />)}
            </Form.Item>
        </Form>
    );
});

export default class extends React.Component {

    resourceForm = React.createRef();
    state = {};

    handleConfirm = () => {
        const resourceForm = this.resourceForm.current;
        resourceForm && resourceForm.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.handleConfirm(fieldsValue);
            const { Type } = this.props;
            window._czc.push(['_trackEvent', '平台菜单管理', Type === 2 ? '功能信息' : '菜单信息', '平台菜单管理_N非结算']);
        });
    };

    handleUploadChange = (id, fileList) => {
        this.setState({ [id]: fileList });
        const resourceForm = this.resourceForm.current;
        if (fileList.length) {
            let uploadFileRes = fileList[0];
            if (uploadFileRes.status === 'done') {
                let requestUrls = uploadFileRes.response.res.requestUrls;
                if (requestUrls) {
                    resourceForm && resourceForm.setFieldsValue({
                        IconUrl: requestUrls[0]
                    });
                }
            }
        } else {
            resourceForm && resourceForm.setFieldsValue({
                IconUrl: ''
            });
        }
    };

    handleAfterClose = () => {
        this.props.handleAfterClose();
        this.setState({
            logoUrlList: [],
            formInfo: {}
        });
    };

    handleFormValuesChange = (formInfo) => {
        this.setState({
            formInfo
        });
    };

    render() {
        const { Visible, handleCancel, handleAfterClose, handleConfirm, Type, ...formInfo } = this.props;
        const formValues = { ...formInfo, ...this.state.formInfo };
        return (
            <Modal
                maskClosable={false}
                title={Type === 2 ? '功能信息' : '菜单信息'} visible={Visible}
                onOk={this.handleConfirm}
                afterClose={this.handleAfterClose}
                onCancel={handleCancel}
                okText="确定" cancelText="取消">
                <ResourceForm ref={this.resourceForm} Type={Type} {...formValues}
                    onValuesChange={this.handleFormValuesChange}
                    logoUrlList={this.state.logoUrlList || []}
                    handleUploadChange={this.handleUploadChange} />
            </Modal>
        );
    }
}