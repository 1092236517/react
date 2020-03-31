import { formItemLayout, createFormField, formLayout, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
class SearchForm extends Component {
  startQuery = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { startQuery, resetPageCurrent } = this.props.grantScheduleStore;
      resetPageCurrent();
      startQuery();
      window._czc.push(['_trackEvent', '月薪发放进度', '查询']);
    });
  };
  handleReset = e => {
    const { resetFields, setFieldsValue } = this.props.form;
    resetFields();
    // 手动清空，触发form的onValuesChange事件
    setFieldsValue({
      TrgtSpId: null
    });
  };
  export = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { exportMonthSalarySchedule } = this.props.grantScheduleStore;
      exportMonthSalarySchedule();
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { agentList, companyList, laborList, handleFormReset } = this.props;
    const formOptLayout = getFormOptLayout(5);
    return (
      <Form onSubmit={this.startQuery}>
        <Row gutter={15} type='flex' justify='start'>
          <Col span={6}>
            <FormItem {...formItemLayout} label='企业'>
              {getFieldDecorator('EntId')(
                <Select allowClear={true} placeholder='请选择' filterOption={selectInputSearch} optionFilterProp='children' showSearch>
                  {companyList.map(value => {
                    return (
                      <Option key={value.EntId} value={value.EntId}>
                        {value.EntShortName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label='月薪发放方'>
              {getFieldDecorator('MonthSalaryPayer', {
                initialValue: -9999
              })(
                <Select placeholder='请选择'>
                  <Option value={-9999}>全部</Option>
                  <Option value={1}>周薪薪</Option>
                  <Option value={2}>劳务</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label='发薪日'>
              {getFieldDecorator('PayDy', {
                initialValue: 1
              })(
                  <Select placeholder='请选择'>
                    {Array.from({ length: 31 })
                        .map((item, index) => {
                          return { key: index + 1, value: index + 1 };
                        })
                        .map(item => {
                          return <Option value={item.key}>{item.value}</Option>;
                        })}
                  </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label='劳务'>
              {getFieldDecorator('TrgtSpId')(
                <Select allowClear={true} placeholder='请选择' filterOption={selectInputSearch} optionFilterProp='children' showSearch>
                  {laborList.map(value => {
                    return (
                      <Option key={value.SpId} value={value.SpId}>
                        {value.SpShortName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <Row>
              <Col span={14}>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                          label="归属月份">
                  {getFieldDecorator('BeginMo')(<MonthPicker placeholder='请选择归属月份开始' format="YYYY-MM" picker="month" style={{ width: '100%' }}
                                                                 disabledDate={(currentDate) =>
                                                                     getFieldValue('EndMo') ? moment(currentDate).isAfter(moment(getFieldValue('EndMo')), 'days') : false
                                                                 }
                  />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} colon={false} label="-">
                  {getFieldDecorator('EndMo')(<MonthPicker placeholder='请选择归属月份结束' format="YYYY-MM" picker="month" style={{ width: '100%' }}
                                                               disabledDate={(currentDate) =>
                                                                   getFieldValue('BeginMo') ? moment(currentDate).isBefore(moment(getFieldValue('BeginMo')), 'days') : false
                                                               }
                  />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={15} type='flex' justify='end'>
          <Col {...formOptLayout} className='text-right'>
            <FormItem label=''>
              <Button onClick={this.handleReset}>重置</Button>
              <Button type='primary' htmlType='submit' className='ml-8'>
                查询
              </Button>
              <Button className='ml-8' onClick={this.export}>
                导出
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

SearchForm = Form.create({
  mapPropsToFields: props => {
    const {
      view: { searchValue }
    } = props.grantScheduleStore;
    return createFormField(searchValue);
  },
  onValuesChange: (props, changedValues, allValues) => {
    props.grantScheduleStore.handleFormValuesChange(allValues);
  }
})(SearchForm);

export default SearchForm;
