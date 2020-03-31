import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { selectInputSearch } from 'ADMIN_UTILS';
import { formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.importPreview();
            window._czc.push(['_trackEvent', '筛选会员费用明细', '导入预览', '筛选会员费用明细_Y结算']);
        });
    }

    handleReset = (e) => {
        const { resetForm } = this.props;
        resetForm();
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { companyList, laborList, ImportFile, setImportFile, exportImpXPre } = this.props;

        return (
            <Form onSubmit={this.importPreview}>
                <Row gutter={15} type="flex" justify="start">
                    <Col span={5}>
                        <FormItem {...formItemLayout} label='选择文件'>
                            {getFieldDecorator('ImportFile', {
                                rules: [{ required: true, message: '请上传文件' }],
                                //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                normalize: () => (ImportFile.length > 0 && ImportFile[0].status == 'done' ? 'img' : '')
                            })(
                                <AliyunUpload
                                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    listType="text"
                                    oss={uploadRule.memberImp}
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

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='sheet名称'>
                            {getFieldDecorator('SheetName', {
                                initialValue: 'sheet1',
                                rules: [{ required: true, message: '请填写表单名称' }]
                            })(
                                <Input maxLength={100} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborID', {
                                rules: [{ required: true, message: '劳务必填' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.length > 0 ? laborList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EnterpriseID', {
                                rules: [{ required: true, message: '企业必填' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.length > 0 ? companyList.map((value) => {
                                            return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} className='text-right'>
                        <FormItem>
                            <Button htmlType="submit" type="primary">导入预览</Button>
                            <Button type="primary" className="ml-8" onClick={() => { exportImpXPre(); window._czc.push(['_trackEvent', '筛选会员费用明细', '导出', '筛选会员费用明细_Y结算']); }}>导出</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
    // mapPropsToFields: props => {
    //     // const { view: { searchValue } } = props.memberImpDetailStore;
    //     return createFormField(props.searchValue);
    // },
    // onValuesChange: (props, changedValues, allValues) => {
    //     props.onValuesChange(allValues);
    // }
})(SearchForm);
