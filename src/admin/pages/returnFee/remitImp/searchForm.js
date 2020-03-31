import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, Icon, Input } from 'antd';
import { formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from "mobx-react";
import { selectInputSearch } from 'ADMIN_UTILS';
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
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { importPreview } = this.props;
            importPreview();
        });
    }

    handleReset = (e) => {
        const { resetForm } = this.props;
        resetForm();
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { laborList, searchValue: { ImportFile }, setImportFile, expPreview, geneRemitSave, resetTable, enableImp } = this.props;
        const { impPreviewX, expPreviewX, generateBatchX, resetTableInfoX } = resId.returnFee.remitImp;

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
                                    oss={uploadRule.settleMgrImportX}
                                    maxNum={1}
                                    previewVisible={false}
                                    defaultFileList={ImportFile}
                                    disabled={!enableImp}
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
                                <Input maxLength={100} disabled={!enableImp} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId', {
                                rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    disabled={!enableImp}
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

                    <Col span={9} className='text-right'>
                        <FormItem>
                            {authority(impPreviewX)(<Button htmlType="submit" type="primary">导入预览</Button>)}
                            {authority(expPreviewX)(<Button type="primary" className="ml-8" onClick={expPreview}>导出预览结果</Button>)}
                            {authority(generateBatchX)(<Button type="primary" className="ml-8" onClick={geneRemitSave}>提交保存</Button>)}
                            {authority(resetTableInfoX)(<Button type="primary" className="ml-8" onClick={resetTable}>取消导入</Button>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(SearchForm);

export default SearchForm;