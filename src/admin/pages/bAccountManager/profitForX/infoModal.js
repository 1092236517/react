import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Modal, Button, Icon } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';

const FormItem = Form.Item;
@observer
class InfoModal extends Component {
    saveData = (e) => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.props.profitForXStore.showAndHideModal('ok');
        });
    }


    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };

        const { getFieldDecorator } = this.props.form;
        const {
            view: { justValue: { justTitle, uploadJustType, showJust },
                infoModal: { ImportFile } },
            showAndHideModal,
            setImportFile
        } = this.props.profitForXStore;
        return (
            <Modal
                visible={showJust}
                onOk={() => this.saveData()}
                title={justTitle}
                onCancel={() => showAndHideModal('cancel')}>
                <Form >
                    <FormItem {...formItemLayout} label='金额'>
                        {getFieldDecorator('adjustValue', {
                            rules: [{ required: true, message: '请输入金额' }]
                        })(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='导入文件'>
                        {getFieldDecorator('ImportFileOriginName', {
                            rules: [{ required: true, message: '请上传文件' }]
                        })(
                            <AliyunUpload
                                id='justUpload'
                                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                listType="text"
                                oss={uploadRule.profitJustZX[uploadJustType]}
                                maxNum={1}
                                previewVisible={false}
                                defaultFileList={ImportFile}
                                uploadChange={(id, list) => {
                                    console.log(list);
                                    setImportFile(list);
                                }}>
                                <Button><Icon type="upload" />点击上传</Button>
                            </AliyunUpload>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


InfoModal = Form.create({
    mapPropsToFields: props => {
        const { infoModal } = props.profitForXStore.view;
        console.log(infoModal);
        if (infoModal) {
            return createFormField(infoModal);
        }
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.profitForXStore.handleModalFormValuesChange(allValues);
    }
})(InfoModal);

export default InfoModal;