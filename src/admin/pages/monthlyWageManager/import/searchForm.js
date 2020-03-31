import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select, Icon, Input, message, Modal, Popconfirm } from 'antd';
import { formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import { selectInputSearch } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
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

            const { importPreview, view: { tableVisible } } = this.props.monthlyWageImportStore;
            if (tableVisible) {
                Modal.confirm({
                    title: '提示',
                    content: '您的操作将会覆盖当前页面数据，当前页面数据不会被保存。是否确定重新导入预览？',
                    onOk: () => {
                        importPreview();
                        window._czc.push(['_trackEvent', '导入月薪', '导入预览', '导入月薪_Y结算']);
                    }
                });
            } else {
                importPreview();
            }
        });
    }

    resetTableInfo = () => {
        const { resetTableInfo, view: { tableVisible } } = this.props.monthlyWageImportStore;
        if (tableVisible) {
            Modal.confirm({
                title: '提示',
                content: '取消导入将删除所有页面数据，且页面数据将不会被保存。是否确定取消导入？',
                onOk: () => {
                    resetTableInfo();
                    window._czc.push(['_trackEvent', '导入月薪', '取消导入', '导入月薪_Y结算']);
                }
            });
        } else {
            resetTableInfo();
        }
    }

    generateBatch = (flag) => {
        const { generateBatch, getFormatErrData, handleFormValuesChange, view: { searchValue } } = this.props.monthlyWageImportStore;
        const { length } = getFormatErrData;
        if (length) {
            Modal.confirm({
                title: '提交确认',
                content: `${length}条数据格式错误，错误数据无法提交保存。是否确定提交？`,
                onOk: () => {
                    generateBatch();
                    window._czc.push(['_trackEvent', '导入月薪', '提交确认', '导入月薪_Y结算']);
                }
            });
        } else {
            searchValue['GeneratePayroll'] = flag;
            handleFormValuesChange(searchValue);
            generateBatch();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { companyList, laborList } = this.props.globalStore;

        const {
            view: {
                importFile
            },
            setImportFile,
            exportPreview
        } = this.props.monthlyWageImportStore;

        const { importPreviewX, generateBatchX, resetTableInfoX, exportPreviewX } = resId.monthlyWageManager.import;

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
                                    oss={uploadRule.monthWageImp}
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

                    <Col span={6}>
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

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='月薪类型'>
                            {getFieldDecorator('SalaryType', {
                                rules: [{ required: true, message: '请选择类型' }]
                            })(
                                <Select>
                                    <Option value={1}>工资</Option>
                                    <Option value={2}>社保</Option>
                                    <Option value={3}>补贴</Option>
                                    <Option value={4}>公积金</Option>
                                    <Option value={5}>其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label='所属月份'>
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

                    <Col span={12} className='text-right'>
                        <FormItem>
                            {authority(importPreviewX)(<Button type='primary' htmlType='submit'>导入预览</Button>)}
                            {authority(importPreviewX)(<Button type='primary' className='ml-8' onClick={() => { exportPreview(); window._czc.push(['_trackEvent', '导入月薪', '导出预览结果', '导入月薪_Y结算']); }}>导出预览结果</Button>)}
                            {authority(generateBatchX)(
                                <Popconfirm placement="top" title='是否要同步至工资单' onConfirm={() => this.generateBatch(1)} onCancel={() => this.generateBatch(2)} okText="是" cancelText="否">
                                    <Button type='primary' className='ml-8' >提交保存</Button>
                                </Popconfirm>
                            )}
                            {authority(resetTableInfoX)(<Button type='primary' className='ml-8' onClick={this.resetTableInfo}>取消导入</Button>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.monthlyWageImportStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.monthlyWageImportStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;