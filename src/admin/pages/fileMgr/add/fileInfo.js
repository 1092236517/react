import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Radio, Button, Icon, message } from 'antd';
import { selectInputSearch } from 'ADMIN_UTILS';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { addFile, editFile } from 'ADMIN_SERVICE/ZXX_FileMgr';

const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { TextArea } = Input;
const { Option } = Select;

const validateFiles = (fileList) => (fileList.length > 0 && fileList.slice().every((file) => (file.status == 'done')));
const fixFile = (fileList) => (fileList.map((file) => ({
    Bucket: file.response.bucket,
    FileName: file.response.name.substr(1),
    OriginFileName: file.name
})));

class FileInfo extends Component {
    saveData = (e) => {
        e.preventDefault();
        const { editMode } = this.props;
        this.props.form.validateFields(async (err, fieldsValue) => {
            if (err) {
                return;
            }

            const { RecordID, FileList1, FileList2, BeginDate, EndDate, Month } = fieldsValue;
            const { refreshData } = this.props;

            let reqParam = {
                ...fieldsValue,
                FileList1: fixFile(FileList1),
                FileList2: fixFile(FileList2),
                BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : '',
                EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : '',
                Month: Month ? Month.format('YYYY-MM') : ''
            };
            if (editMode) {
                window._czc.push(['_trackEvent', '文件查询', '保存文件信息', '文件查询_Y结算']);
            } else {
                window._czc.push(['_trackEvent', '文件添加', '保存文件信息', '文件添加_Y结算']);
            }

            try {
                if (RecordID) {
                    await editFile(reqParam);
                } else {
                    delete reqParam['RecordID'];
                    await addFile(reqParam);
                }
                message.success('文件保存成功！');
                this.resetForm();
                refreshData && refreshData();
            } catch (err) {
                message.error(err.message);
                console.log(err);
            }
        });
    }

    resetForm = () => {
        const { resetForm, editMode, form: { resetFields } } = this.props;
        editMode ? resetFields() : resetForm();
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 8 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } } };

        const {
            setStoreFile,
            companyList,
            laborList,
            form: { getFieldDecorator, getFieldValue },
            formValue: { FileList1, FileList2, FileType }
        } = this.props;

        return (
            <Form onSubmit={this.saveData}>
                <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('RecordID')(
                        <Input maxLength={100} />
                    )}
                </FormItem>

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

                <FormItem {...formItemLayout} label='企业'>
                    {getFieldDecorator('EnterID', {
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

                <FormItem {...formItemLayout} label='文件类型'>
                    {getFieldDecorator('FileType', {
                        rules: [{ required: true, message: '请选择文件类型' }]
                    })(
                        <RadioGroup>
                            <RadioButton value={1}>周薪</RadioButton>
                            <RadioButton value={2}>月薪</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>

                {
                    FileType == 1 &&
                    <Fragment>
                        <FormItem {...formItemLayout} label='开始时间'>
                            {getFieldDecorator('BeginDate', {
                                rules: [{ required: true, message: '请填写入职日期' }]
                            })(
                                <DatePicker
                                    allowClear={false}
                                    className='w-100'
                                    disabledDate={(startValue) => {
                                        const endValue = getFieldValue('EndDate');
                                        if (!startValue || !endValue) {
                                            return false;
                                        }
                                        return startValue.isAfter(endValue, 'day');
                                    }} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='结束时间'>
                            {getFieldDecorator('EndDate', {
                                rules: [{ required: true, message: '请填写入职日期' }]
                            })(
                                <DatePicker
                                    allowClear={false}
                                    className='w-100'
                                    disabledDate={(endValue) => {
                                        const startValue = getFieldValue('BeginDate');
                                        if (!endValue || !startValue) {
                                            return false;
                                        }
                                        return endValue.isBefore(startValue, 'day');
                                    }} />
                            )}
                        </FormItem>
                    </Fragment>

                }

                {
                    FileType == 2 &&
                    <FormItem {...formItemLayout} label='归属月份'>
                        {getFieldDecorator('Month', {
                            rules: [{ required: true, message: '请填写归属月份' }]
                        })(
                            <DatePicker.MonthPicker
                                allowClear={false}
                                className='w-100' />
                        )}
                    </FormItem>
                }

                <FormItem {...formItemLayout} label='原件'>
                    {getFieldDecorator('FileList1', {
                        rules: [{ required: true, message: '请上传文件' }],
                        //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                        normalize: () => (validateFiles(FileList1) ? FileList1 : '')
                    })(
                        <AliyunUpload
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            listType="text"
                            oss={uploadRule.fileMgr.origin}
                            maxNum={5}
                            previewVisible={false}
                            defaultFileList={FileList1}
                            uploadChange={(id, list) => {
                                setStoreFile(id, list);
                            }}>
                            <Button><Icon type="upload" />点击上传</Button>
                        </AliyunUpload>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label='导入件'>
                    {getFieldDecorator('FileList2', {
                        rules: [{ required: true, message: '请上传文件' }],
                        normalize: () => (validateFiles(FileList2) ? FileList2 : '')
                    })(
                        <AliyunUpload
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            listType="text"
                            oss={uploadRule.fileMgr.import}
                            maxNum={5}
                            previewVisible={false}
                            defaultFileList={FileList2}
                            uploadChange={(id, list) => {
                                setStoreFile(id, list);
                            }}>
                            <Button><Icon type="upload" />点击上传</Button>
                        </AliyunUpload>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label='备注'>
                    {getFieldDecorator('Remark')(
                        <TextArea rows={3} maxLength={100} />
                    )}
                </FormItem>

                <FormItem {...btnItemLayout}>
                    <Button type="primary" htmlType="submit" >确定</Button>
                    <Button className='ml-8' onClick={this.resetForm}>清空</Button>
                </FormItem>
            </Form>
        );
    }
}

FileInfo = Form.create({
    mapPropsToFields: props => (createFormField(props.formValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(FileInfo);

export default FileInfo;