import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Button, Select, Icon, Input, Modal, message } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, fieldsValue) => {
            if (err) {
                return;
            }

            const { importPreview, view: { tableVisible } } = this.props.bankCardExmportStore;
            if (tableVisible) {
                Modal.confirm({
                    title: '提示',
                    content: '您的操作将会覆盖当前页面数据，当前页面数据不会被保存。是否确定重新导入预览？',
                    onOk: () => {
                        importPreview();
                    }
                });
            } else {
                importPreview();
            }
        });
    }

    resetTableInfo = () => {
        const { resetTableInfo, view: { tableVisible } } = this.props.bankCardExmportStore;
        if (tableVisible) {
            Modal.confirm({
                title: '提示',
                content: '取消导入将删除所有页面数据，且页面数据将不会被保存。是否确定取消导入？',
                onOk: () => {
                    resetTableInfo();
                    window._czc.push(['_trackEvent', '银行卡信息拉取', '取消导入', '银行卡信息拉取_Y结算']);
                }
            });
        } else {
            resetTableInfo();
        }
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const formOptLayout = getFormOptLayout(4);

        const {
            view: {
                importFile
            },
            setImportFile,
            exportPreview
        } = this.props.bankCardExmportStore;

        const { importPreviewX, exportPreviewX, resetTableInfoX } = resId.weeklyWageManager.import;

        return (
            <Form onSubmit={this.importPreview}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='excel文件'>
                            {getFieldDecorator('ImportFile', {
                                rules: [{ required: true, message: '请上传文件' }],
                                //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                normalize: () => (importFile.length > 0 && importFile[0].status == 'done' ? 'img' : '')
                            })(
                                <AliyunUpload
                                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    listType="text"
                                    oss={uploadRule.weekWageImp}
                                    maxNum={1}
                                    previewVisible={false}
                                    defaultFileList={importFile}
                                    uploadChange={(id, list) => {
                                        console.log(list);
                                        setImportFile(id, list);
                                    }}>
                                    <Button><Icon type="upload" />点击上传</Button>
                                </AliyunUpload>
                            )}


                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='默认导入'>
                            {getFieldDecorator('SheetName', {
                                rules: [{ required: true, message: '请填写表单名称' }]
                            })(
                                <Input maxLength={100} />
                            )}
                        </FormItem>
                    </Col>

                    {/* <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator('AuditStatus')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>周薪卡</Option>
                                    <Option value={2}>月薪卡</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col> */}



                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button type='primary' htmlType='submit'>导入预览</Button>
                            <Button type='primary' className='ml-8' onClick={exportPreview}>导出预览结果</Button>
                            <Button type='primary' className='ml-8' onClick={this.resetTableInfo}>取消导入</Button>
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.bankCardExmportStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.bankCardExmportStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;