import { formItemLayout, createFormField, formLayout, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

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

      const { startQuery, resetPageCurrent } = this.props.priceDifferenceSubsidyListStore;
      resetPageCurrent();
      startQuery();
      window._czc.push(['_trackEvent', '差价/额外补贴清单', '查询']);
    });
  };
  handleReset = e => {
    const { resetFields, setFieldsValue } = this.props.form;
    resetFields();
    // 手动清空，触发form的onValuesChange事件
    setFieldsValue({
      TrgtSpId: null
    });
    const { startQuery, resetPageCurrent } = this.props.priceDifferenceSubsidyListStore;
    resetPageCurrent();
    startQuery();
  };
  export = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { exportSubsidyList } = this.props.priceDifferenceSubsidyListStore;
      exportSubsidyList();
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formOptLayout = getFormOptLayout(5);
    const { agentList, companyList, laborList } = this.props.globalStore;
    return (
      <Form onSubmit={this.startQuery}>
        <Row gutter={15} type='flex' justify='start'>
          <Col span={6}>
            <Row>
              <Col span={14}>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label='日期范围'>
                  {getFieldDecorator('OrderBeginDt', {
                    initialValue: moment(),
                    rules: [{ required: true, message: '请选择开始时间' }]
                  })(
                      <DatePicker
                          disabledDate={startValue => {
                            const endValue = getFieldValue('OrderEndDt');
                            if (!startValue || !endValue) {
                              return false;
                            }
                            return startValue.isAfter(endValue, 'day');
                          }}
                      />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label='--'>
                  {getFieldDecorator('OrderEndDt', {
                    initialValue: moment(),
                    rules: [{ required: true, message: '请选择结束时间' }]
                  })(
                      <DatePicker
                          disabledDate={endValue => {
                            const startValue = getFieldValue('OrderBeginDt');
                            if (!endValue || !startValue) {
                              return false;
                            }
                            if (endValue > moment()) {
                              return true;
                            }
                            return endValue.isBefore(startValue, 'day');
                          }}
                      />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
            <Col {...formLayout}>
              <FormItem {...formItemLayout} label='差价发放日'>
                {getFieldDecorator('DiffPriceIssueDt', {
                  initialValue: undefined
                })(
                    <Select placeholder='请选择'
                            filterOption={selectInputSearch}
                            optionFilterProp="children">
                      <Option value={-9999}>全部</Option>
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
            <Col {...formLayout}>
              <FormItem {...formItemLayout} label='结算模式'>
                {getFieldDecorator('SettlementTyp')(
                    <Select placeholder='请选择'
                            filterOption={selectInputSearch}
                            optionFilterProp="children">
                      <Option value={-9999}>全部</Option>
                      <Option value={1}>ZX模式</Option>
                      <Option value={2}>Z模式</Option>
                      <Option value={3}>ZA模式</Option>
                      <Option value={4}>Z-B模式</Option>
                      <Option value={5}>ZX-B模式</Option>
                      <Option value={6}>ZX-A模式</Option>
                    </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Row>
                <Col span={14}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label='补贴发放日'>
                    {getFieldDecorator('IssueDayBegin')(
                        <DatePicker
                            disabledDate={startValue => {
                              const endValue = getFieldValue('IssueDayEnd');
                              if (!startValue || !endValue) {
                                return false;
                              }
                              return startValue.isAfter(endValue, 'day');
                            }}
                        />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label='-'>
                    {getFieldDecorator('IssueDayEnd')(
                        <DatePicker
                            disabledDate={endValue => {
                              const startValue = getFieldValue('IssueDayBegin');
                              if (!endValue || !startValue) {
                                return false;
                              }
                              if (endValue > moment()) {
                                return true;
                              }
                              return endValue.isBefore(startValue, 'day');
                            }}
                        />
                    )}
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
              {authority(resId.dataBoard.priceDifferenceSubsidy.exportX)(
                  <Button
                      onClick={() => {
                        this.props.setVisible('exportVisible', true);
                        window._czc.push(['_trackEvent', '名单管理', '同步名单', '名单管理_Y结算']);
                      }}
                      className='ml-8'
                      onClick={this.export}>
                    导出
                  </Button>
              )}
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
    } = props.priceDifferenceSubsidyListStore;
    return createFormField(searchValue);
  },
  onValuesChange: (props, changedValues, allValues) => {
    props.priceDifferenceSubsidyListStore.handleFormValuesChange(allValues);
  }
})(SearchForm);

export default SearchForm;
