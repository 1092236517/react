import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { selectInputSearch } from 'ADMIN_UTILS';
import { createFormField, formItemLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Icon, Input, Modal, Row, Select } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, fieldsValue) => {
            if (err) {
                return;
            }
            const { importPreview, view: { tableVisible } } = this.props.payrollImportStore;
            if (tableVisible) {
                Modal.confirm({
                    title: '提示',
                    content: '您的操作将会覆盖当前页面数据，当前页面数据不会被保存。是否确定重新导入预览？',
                    onOk: () => {
                        importPreview();
                        window._czc.push(['_trackEvent', '工资单导入', '导入预览', '工资单导入_Y结算']);
                    }
                });
            } else {
                importPreview();
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { companyList, laborList } = this.props.globalStore;
        const { view: { importFile }, setImportFile, save } = this.props.payrollImportStore;

        return (
            <Form onSubmit={this.importPreview}>
                <Row gutter={15} type="flex" justify="start">
                    <Col span={6}>
                        <FormItem {...formItemLayout} label='excel文件'>
                            {getFieldDecorator('ImportFile', {
                                rules: [{ required: true, message: '请上传文件' }],
                                //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                normalize: () => (importFile.length > 0 && importFile[0].status == 'done' ? 'img' : '')
                            })(
                                <AliyunUpload
                                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    listType="text"
                                    oss={uploadRule.payrollImport}
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

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='默认导入'>
                            {getFieldDecorator('SheetName', {
                                rules: [{ required: true, message: '请填写表单名称' }]
                            })(
                                <Input maxLength={100} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId', {
                                rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId', {
                                rules: [{ required: true, message: '请选择企业' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.map((value) => {
                                            return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='选择月份'>
                            {getFieldDecorator('Month', {
                                rules: [{ required: true, message: '请选择月份' }]
                            })(
                                <MonthPicker
                                    allowClear={false}
                                    className='w-100'
                                    disabledDate={(val) => (val && val.isAfter(moment(), 'day'))}
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={18} className='text-right'>
                        <FormItem>
                            <Button type='primary' htmlType='submit'>导入预览</Button>
                            <Button type='primary' className='ml-8' onClick={()=>{save();window._czc.push(['_trackEvent', '工资单导入', '提交保存', '工资单导入_Y结算']);}}>提交保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.payrollImportStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.payrollImportStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;