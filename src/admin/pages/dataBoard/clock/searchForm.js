import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Radio } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import moment from 'moment';
const RadioButton = Radio.Button;

@observer
class SearchForm extends Component {
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { CycleTyp } = this.props.searchValue;

        return (
            <Fragment>
                <Row gutter={15} type="flex" justify="start">
                    <Col span={12}>
                        {/* 此处需要吐槽antd，month year模式下，不触发onChange事件，不主动关闭日历面板，艹 */}
                        {getFieldDecorator('BeginDt')(
                            <DatePicker
                                allowClear={false}
                                format={{ 1: 'YYYY-MM-DD', 2: 'YYYY-MM-DD', 3: 'YYYY-MM', 4: 'YYYY' }[CycleTyp]}
                                //  mode={{ 1: 'date', 2: 'date', 3: 'month', 4: 'year' }[CycleTyp]}
                                disabledDate={(startValue) => {
                                    const endValue = getFieldValue('EndDt');
                                    if (!startValue || !endValue) {
                                        return false;
                                    }

                                    if (CycleTyp == 1) {
                                        return startValue.isAfter(endValue, 'day') || startValue.isBefore(endValue.clone().subtract(1, 'month'), 'day');
                                    } else if (CycleTyp == 2) {
                                        return startValue.isAfter(endValue, 'day') || startValue.isBefore(endValue.clone().subtract(8, 'week'), 'day');
                                    } else {
                                        return startValue.isAfter(endValue, 'day');
                                    }
                                }} />
                        )}
                        <span className='ml-8 mr-8'>-</span>
                        {getFieldDecorator('EndDt')(
                            <DatePicker
                                allowClear={false}
                                format={{ 1: 'YYYY-MM-DD', 2: 'YYYY-MM-DD', 3: 'YYYY-MM', 4: 'YYYY' }[CycleTyp]}
                                //  mode={{ 1: 'date', 2: 'date', 3: 'month', 4: 'year' }[CycleTyp]}
                                disabledDate={(endValue) => {
                                    const startValue = getFieldValue('BeginDt');
                                    if (!endValue || !startValue) {
                                        return false;
                                    }
                                    return endValue.isBefore(startValue, 'day') || endValue.isAfter(moment(), 'day');
                                }} />
                        )}
                    </Col>

                    <Col span={12} className='text-right'>
                        {getFieldDecorator('CycleTyp')(
                            <Radio.Group
                                buttonStyle="solid" >
                                <RadioButton value={1}>日</RadioButton>
                                <RadioButton value={2}>周</RadioButton>
                                <RadioButton value={3}>月</RadioButton>
                                <RadioButton value={4}>年</RadioButton>
                            </Radio.Group>
                        )}
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(changedValues, allValues))
})(SearchForm);

export default SearchForm;