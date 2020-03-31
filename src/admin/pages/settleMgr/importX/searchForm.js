import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, Icon, Input, DatePicker } from 'antd';
import { formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from "mobx-react";
import { selectInputSearch } from 'ADMIN_UTILS';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const xType = { 1: '工资', 2: '社保', 3: '管理费', 4: '招聘费', 5: '自离工资', 6: '其他' };
@observer
class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { importPreview } = this.props;
            importPreview();
            window._czc.push(['_trackEvent', '导入X', '导入预览', '导入X_Y结算']);
        });
    }

    handleReset = (e) => {
        const { resetForm } = this.props;
        resetForm();
    }

    render() {
        const { form: { getFieldDecorator }, canUseXType } = this.props;
        const { companyList, laborList, searchValue: { ImportFile }, setImportFile, exportImpXPre, generateBatchImpX } = this.props;

        return (
            <Form onSubmit={this.importPreview}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='选择文件'>
                            {getFieldDecorator('ImportFile', {
                                rules: [{ required: true, message: '请上传文件' }],
                                //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                normalize: () => (ImportFile.length > 0 && ImportFile[0].status == 'done' ? 'img' : '')
                            })(
                                <AliyunUpload
                                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    listType="text"
                                    oss={uploadRule.settleMgrImportX}
                                    maxNum={1}
                                    previewVisible={false}
                                    defaultFileList={ImportFile}
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
                        <FormItem {...formItemLayout} label='sheet名称'>
                            {getFieldDecorator('SheetName', {
                                initialValue: 'sheet1',
                                rules: [{ required: true, message: '请填写表单名称' }]
                            })(
                                <Input maxLength={100} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborID', {
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

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EnterpriseID', {
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

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='月份'>
                            {getFieldDecorator('Month', {
                                rules: [{ required: true, message: '请选择月份' }]
                            })(
                                <MonthPicker format='YYYY-MM' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='X类型'>
                            {getFieldDecorator('XType', {
                                rules: [{ required: true, message: '请选择X类型' }]
                            })(
                                <Select placeholder='请选择' notFoundContent='没有可选的X类型'>
                                    {
                                        canUseXType.map((val) => (
                                            <Option key={val} value={val}>{xType[val]}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12} className='text-right'>
                        <FormItem>
                            <Button htmlType="submit" type="primary">导入预览</Button>
                            <Button type="primary" className="ml-8" onClick={exportImpXPre}>导出预览结果</Button>
                            <Button type="primary" className="ml-8" onClick={generateBatchImpX}>提交保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        if (props.canUseXType.length == 0) {
            props.searchValue.XType = undefined;
        }
        return createFormField(props.searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.handleFormValuesChange(changedValues, allValues);
    }
})(SearchForm);

export default SearchForm;