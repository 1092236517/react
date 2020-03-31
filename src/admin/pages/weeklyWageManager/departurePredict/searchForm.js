import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import moment from 'moment';
import resId from 'ADMIN_CONFIG/resId';
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '在离职名单预测表', '查询', '在离职名单预测表_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props.departurePredictStore;
            resetPageCurrent();
            startQuery();
        });
    }
    calculateOption = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '在离职名单预测表', '计算', '在离职名单预测表_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { calculateOption, resetPageCurrent } = this.props.departurePredictStore;
            resetPageCurrent();
            calculateOption();
        });
    }
    exportRecord = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '在离职名单预测表', '导出', '在离职名单预测表_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { exportRecord, resetPageCurrent } = this.props.departurePredictStore;
            resetPageCurrent();
            exportRecord();
        });
    }
    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件   
        setFieldsValue({
            IdCardNum: ''
        });
    }
    upDateSettleDate = (which, date) => {
        if (date == null) {
            return;
        }
        let dateC = date.clone();
        if (which == 'start') {
            dateC.add(6, 'days');
            this.props.form.setFieldsValue({
                SettleEndDt: dateC
            });
        } else {
            dateC.subtract(6, 'days');
            this.props.form.setFieldsValue({
                SettleBeginDt: dateC
            });
        }
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(4);
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { view: { schedulerID } } = this.props.departurePredictStore;
        const { exportX, calculate, queryData } = resId.weeklyWageManager.departurePredict;
        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期">
                                    {getFieldDecorator('SettleBeginDt', {
                                        initialValue: moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'start')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 0 || currentDate.isAfter(moment().subtract(moment().day() - 7 + (moment().day() < 1 ? 7 : 0), 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('SettleEndDt', {
                                        initialValue: moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'end')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 6 || currentDate.isAfter(moment().subtract(moment().day() - 6 - 7 + (moment().day() < 1 ? 7 : 0), 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>


                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId', {
                                rules: [{ required: true, message: '请选择企业！' }]
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
                            {getFieldDecorator('TrgtSpId')(
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


                    <Col {...formOptLayout}>
                        <FormItem className='text-right' label=''>
                            <Button onClick={this.handleReset}>重置</Button>
                            {authority(calculate)(<Button type='primary' className='ml-8' onClick={this.calculateOption}>计算</Button>)}
                            {authority(queryData)(<Button type='primary' htmlType='submit' className='ml-8'>查询</Button>)}
                            {authority(exportX)(<Button type='primary' loading={schedulerID != ''} className='ml-8' onClick={this.exportRecord}>导出</Button>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.departurePredictStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.departurePredictStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;