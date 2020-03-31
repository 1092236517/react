import React, { Component, Fragment } from 'react';
import { Form, Row, Col, DatePicker, Button, Select, Modal, Icon, Input } from 'antd';
import { formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from "mobx-react";
import moment from 'moment';
import { selectInputSearch } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import monthImpTemp from 'ADMIN_ASSETS/template/month_reissue.xlsx';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
class SearchForm extends Component {
    state = {
        //  补发的操作类型。import：批量导入，single：单条补发
        operType: '',
        //  是否首次进入页面
        firstInPage: true
    }

    componentDidMount() {
        let jumpParms = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (jumpParms) {
            jumpParms = JSON.parse(jumpParms);
            const { Month, EnterpriseID, LaborID, SalaryType } = jumpParms;

            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                Month: moment(Month),
                EnterpriseID,
                LaborID,
                SalaryType
            });

            this.generateTable(null, true);
        }
    }

    generateTable = (e, ignoreTips = false) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { tableVisible, showNewTable } = this.props;
            const generateTable2 = () => {
                if (tableVisible && !ignoreTips) {
                    Modal.confirm({
                        title: '生成表格',
                        content: '生成表格将清除原有表格的所有数据。您确定要生成新的表格吗？',
                        onOk: () => {
                            showNewTable(fieldsValue);
                            this.setState({ firstInPage: true });
                            window._czc.push(['_trackEvent', '补发月薪', '生成表格', '补发月薪_Y结算']);
                        }
                    });
                } else {
                    showNewTable(fieldsValue);
                    this.setState({ firstInPage: true });
                }
            };

            if (fieldsValue.SalaryType == 6) {
                Modal.confirm({
                    title: '提示',
                    content: <span className='color-danger'>该月薪类型不会扣除当月的已知周薪和已发月薪，请谨慎使用。</span>,
                    okText: '好的，我知道了。',
                    onOk: () => {
                        generateTable2();
                    }
                });
            } else {
                generateTable2();
            }
        });
    }

    switchOperType = (type) => {
        const { switchOperTypeStore } = this.props;
        switchOperTypeStore(type);
        this.setState({
            operType: type,
            firstInPage: false
        });
        window._czc.push(['_trackEvent', '补发月薪', '点击上传', '补发月薪_Y结算']);
    }

    startAdd = (e) => {
        const { startAdd } = this.props;
        this.switchOperType('single');
        startAdd(e);
        window._czc.push(['_trackEvent', '补发月薪', '单条添加', '补发月薪_Y结算']);
    }

    render() {
        const {
            form: {
                getFieldDecorator
            },
            searchValue: {
                ImportFile,
                SalaryType
            },
            companyList,
            laborList,
            tableVisible,
            resetOldTable,
            commitData,
            setImportFile,
            impPreview,
            expPreview,
            getCompanyText,
            getLaborText,
            schedulerID
        } = this.props;
        const { searchValue } = this.props;
        const { generateTableX, addTableDataX, resetOldTableX, commitDataX, impPreviewX, expPreviewX } = resId.monthlyWageManager.reissue;
        const { operType, firstInPage } = this.state;
        //  显示批量导入的操作区域
        const isShowImport = SalaryType === 6 && (firstInPage || !firstInPage && operType === 'import');

        return (
            <Fragment>
                <Form onSubmit={this.generateTable}>
                    <Row gutter={15} type="flex" justify="start">
                        <Col span={5}>
                            <FormItem {...formItemLayout} label='发薪月份'>
                                {getFieldDecorator('Month', {
                                    initialValue: moment(),
                                    rules: [{ required: true, message: '请选择企业' }]
                                })(
                                    <MonthPicker
                                        allowClear={false}
                                        className='w-100'
                                        disabled={tableVisible}
                                        disabledDate={(val) => (val && val.isAfter(moment().add(1, 'month'), 'month'))} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem {...formItemLayout} label='企业'>
                                {getFieldDecorator('EnterpriseID', {
                                    rules: [{ required: true, message: '请选择企业' }]
                                })(
                                    <Select
                                        disabled={tableVisible}
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

                        <Col span={5}>
                            <FormItem {...formItemLayout} label='劳务'>
                                {getFieldDecorator('LaborID', {
                                    rules: [{ required: true, message: '请选择劳务' }]
                                })(
                                    <Select
                                        disabled={tableVisible}
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

                        <Col span={5}>
                            <FormItem {...formItemLayout} label='月薪类型'>
                                {getFieldDecorator('SalaryType', {
                                    rules: [{ required: true, message: '请选择类型' }]
                                })(
                                    <Select disabled={tableVisible}>
                                        <Option value={1}>工资</Option>
                                        <Option value={2}>社保</Option>
                                        <Option value={3}>补贴</Option>
                                        <Option value={4}>公积金</Option>
                                        <Option value={5}>其他</Option>
                                        <Option value={6}>跨月补发</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={4} className="text-right">
                            <FormItem>
                                {authority(generateTableX)(<Button type="primary" htmlType="submit">生成表格</Button>)}
                            </FormItem>
                        </Col>
                    </Row>

                    {
                        tableVisible &&
                        <Row gutter={15} type="flex" justify="start">
                            <Col span={5}>
                                {
                                    (firstInPage || !firstInPage && operType === 'single') &&
                                    authority(addTableDataX)(<Button type='primary' className='ml-8' onClick={this.startAdd}>单条添加</Button>)
                                }
                            </Col>

                            <Col span={5}>
                                {
                                    isShowImport &&
                                    <FormItem {...formItemLayout} label='excel文件'>
                                        {getFieldDecorator('ImportFile', {
                                            rules: [{ required: true, message: '请上传文件' }],
                                            //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                            normalize: () => (ImportFile.length > 0 && ImportFile[0].status == 'done' ? 'img' : '')
                                        })(
                                            <AliyunUpload
                                                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                listType="text"
                                                oss={uploadRule.monthWageReissue}
                                                maxNum={1}
                                                previewVisible={false}
                                                defaultFileList={ImportFile}
                                                uploadChange={(id, list) => {
                                                    console.log(list);
                                                    setImportFile(id, list);
                                                }}>
                                                <Button onClick={this.switchOperType.bind(this, 'import')}><Icon type="upload" />点击上传</Button>
                                                <a className='ml-8' href={monthImpTemp} onClick={() => {
                                                    window._czc.push(['_trackEvent', '补发月薪', '模板下载', '补发月薪_Y结算']);
                                                }}>模板下载</a>
                                            </AliyunUpload>
                                        )}
                                    </FormItem>
                                }
                            </Col>

                            <Col span={5}>
                                {
                                    isShowImport &&
                                    <FormItem {...formItemLayout} label='默认导入'>
                                        {getFieldDecorator('SheetName', {
                                            rules: [{ required: true, message: '请填写表单名称' }]
                                        })(
                                            <Input maxLength={100} />
                                        )}
                                    </FormItem>
                                }
                            </Col>

                            <Col span={5} className='text-right'>
                                {
                                    isShowImport &&
                                    <FormItem>
                                        {authority(impPreviewX)(<Button type='primary' className='ml-8' onClick={() => { impPreview(); window._czc.push(['_trackEvent', '补发月薪', '导入预览', '补发月薪_Y结算']); }}>导入预览</Button>)}
                                        {authority(expPreviewX)(<Button type='primary' className='ml-8' onClick={() => { expPreview(); window._czc.push(['_trackEvent', '补发月薪', '导出预览', '补发月薪_Y结算']); }}>导出预览</Button>)}
                                    </FormItem>
                                }
                            </Col>

                            <Col span={4} className='text-right'>
                                <FormItem>
                                    {authority(resetOldTableX)(<Button type='primary' onClick={() => { resetOldTable(); window._czc.push(['_trackEvent', '补发月薪', '删除表格', '补发月薪_Y结算']); }}>删除表格</Button>)}
                                    {authority(commitDataX)(<Button type='primary' className='ml-8' onClick={() => { commitData(); window._czc.push(['_trackEvent', '补发月薪', '提交', '补发月薪_Y结算']); }}>提交</Button>)}
                                </FormItem>
                            </Col>
                        </Row>
                    }
                </Form>

                {
                    tableVisible &&
                    <p>归属月份：{searchValue.Month.format('YYYY-MM')}&nbsp;企业：{getCompanyText(searchValue.EnterpriseID)}&nbsp;劳务：{getLaborText(searchValue.LaborID)}&nbsp;</p>
                }
            </Fragment>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => props.handleFormValuesChange(changedValues)
})(SearchForm);

export default SearchForm;