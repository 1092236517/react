import React, { Component } from 'react';
import { Form, Row, Col, DatePicker, Button, Select, Icon, Input, Modal, message } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import { selectInputSearch } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, fieldsValue) => {
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '导入返费周薪', '导入预览', '导入返费周薪_N非结算']);
            const { importPreview, tableVisible } = this.props;
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
        const { resetTableInfo, tableVisible } = this.props;
        if (tableVisible) {
            Modal.confirm({
                title: '提示',
                content: '取消导入将删除所有页面数据，且页面数据将不会被保存。是否确定取消导入？',
                onOk: () => {
                    resetTableInfo();
                    window._czc.push(['_trackEvent', '导入返费周薪', '取消导入', '导入返费周薪_N非结算']);
                }
            });
        } else {
            resetTableInfo();
        }
    }

    generateBatch = () => {
        const { generateBatch, getFormatErrData } = this.props;
        const { length } = getFormatErrData;
        if (length) {
            Modal.confirm({
                title: '提交确认',
                content: `${length}条数据格式错误，错误数据无法提交保存。是否确定提交？`,
                onOk: () => {
                    generateBatch();
                    window._czc.push(['_trackEvent', '导入返费周薪', '提交保存', '导入返费周薪_N非结算']);
                }
            });
        } else {
            generateBatch();
        }
    }

    upDateSettleDate = (which, date) => {
        if (date == null) {
            return;
        }
        let dateC = date.clone();
        if (which == 'start') {
            dateC.add(6, 'days');
            this.props.form.setFieldsValue({
                SettleEndDate: dateC
            });
        } else {
            dateC.subtract(6, 'days');
            this.props.form.setFieldsValue({
                SettleBeginDate: dateC
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formOptLayout = getFormOptLayout(5);
        const {
            importFile,
            setImportFile,
            expPreview,
            companyList,
            laborList
        } = this.props;
        const { impPreviewX, expPreviewX, geneBatchX, resetTableX } = resId.weekReturnFee.imp;

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

                    <Col {...formLayout} >
                        <Row>
                            <Col span={16}>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="结算时间">
                                    {getFieldDecorator('SettleBeginDate', {
                                        rules: [{ required: true }]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'start')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 0 || currentDate.isAfter(moment().subtract(moment().day() + 7, 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('SettleEndDate')(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'end')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 6 || currentDate.isAfter(moment().subtract(moment().day() - 6 + 7, 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            {authority(impPreviewX)(<Button type='primary' htmlType='submit'>导入预览</Button>)}
                            {authority(expPreviewX)(<Button type='primary' className='ml-8' onClick={()=>{expPreview();window._czc.push(['_trackEvent', '导入返费周薪', '导出预览结果', '导入返费周薪_N非结算']);}}>导出预览结果</Button>)}
                            {authority(geneBatchX)(<Button type='primary' className='ml-8' onClick={this.generateBatch}>提交保存</Button>)}
                            {authority(resetTableX)(<Button type='primary' className='ml-8' onClick={this.resetTableInfo}>取消导入</Button>)}
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => {
        props.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;