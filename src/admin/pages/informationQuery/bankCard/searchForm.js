import React from 'react';
import { Input, Button, Form, Row, Col, DatePicker, Select } from 'antd';
import { inject, observer } from "mobx-react";
import moment from 'moment';
import { formLayout, formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

const FormItem = Form.Item;
const Option = Select.Option;

@inject('bankCardStore')
@observer
class SearchForm extends React.Component {
	constructor(props) {
		super(props);
	}

	startQuery = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			this.props.resetPageCurrent();
			this.props.startQuery(fieldsValue);
			window._czc.push(['_trackEvent', '银行卡信息查询', '查询', '银行卡信息查询_Y结算']);
		});
	}

	handleReset = (e) => {
		this.props.bankCardStore.handleSearchForm();
	}

	render() {
		const { form, auditValue } = this.props;
		const { getFieldDecorator, getFieldValue } = form;

		return (
			<div>
				<Form onSubmit={this.startQuery}>
					<Row gutter={15} type="flex" justify="start">
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label='身份证号码'>
								{getFieldDecorator('IdCardNum', {
									initialValue: '',
									rules: [{
										pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
										message: '请输入正确的18位身份证号'
									}]
								})(
									<Input autoComplete="off" placeholder='请填写身份证号码' maxLength={18} />
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...formItemLayout} label='姓名'>
								{getFieldDecorator('RealName')(
									<Input autoComplete="off" maxLength={100} placeholder='请填写姓名' />
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<Form.Item label="手机号码" {...formItemLayout}>
								{getFieldDecorator('Mobile', {
									rules: [{
										pattern: /^1[3-9][0-9]\d{8}$/,
										message: '请输入正确的手机号格式'
									}]
								})(
									<Input autoComplete="off" maxLength={11} placeholder='请填写手机号码' />
								)}
							</Form.Item>
						</Col>
						<Col {...formLayout}>
							<Form.Item placeholder="请选择" label="银行名称" {...formItemLayout}>
								{getFieldDecorator('BankName')(
									<Select
										showSearch
										allowClear={true}
										placeholder="请选择"
										optionFilterProp="children"
									>
										<Option value={null}>全部</Option>
										{auditValue.bankLists && auditValue.bankLists.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout}
								label="银行卡号">
								{getFieldDecorator('BankCardNum')(<Input placeholder="请选择银行卡号" />)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="审核状态">
								{getFieldDecorator('AuditSts')(
									<Select placeholder='请选择审核状态'>
										<Option value={-9999}>全部</Option>
										<Option value={2}>通过</Option>
										<Option value={3}>未通过</Option>
										<Option value={1}>未审核</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="是否删除">
								{getFieldDecorator('IsUserDelete')(
									<Select placeholder='请选择是否删除'>
										<Option value={-9999}>全部</Option>
										<Option value={1}>否</Option>
										<Option value={2}>是</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="接口调用状态">
								{getFieldDecorator('Bank3keyCheckResult')(
									<Select placeholder='请选择接口调用状态'>
										<Option value={-9999}>全部</Option>
										<Option value={1}>未调用</Option>
										<Option value={2}>调用成功</Option>
										<Option value={3}>调用失败</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="是否可用">
								{getFieldDecorator('Bank3keyAvlSts')(
									<Select placeholder='请选择是否可用'>
										<Option value={-9999}>全部</Option>
										<Option value={2}>是</Option>
										<Option value={1}>否</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={10}>
							<Row>
								<Col span={14}>
									<FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
										label="上传日期">
										{getFieldDecorator('UploadTimeBegin')(<DatePicker placeholder='请选择开始上传日期' format="YYYY-MM-DD" style={{ width: '100%' }}
											disabledDate={(currentDate) =>
												getFieldValue('UploadTimeEnd') ? moment(currentDate).isAfter(moment(getFieldValue('UploadTimeEnd')), 'days') : false
											}
										/>)}
									</FormItem>
								</Col>
								<Col span={10}>
									<FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} colon={false} label="-">
										{getFieldDecorator('UploadTimeEnd')(<DatePicker placeholder='请选择结束上传日期' format="YYYY-MM-DD" style={{ width: '100%' }}
											disabledDate={(currentDate) =>
												getFieldValue('UploadTimeBegin') ? moment(currentDate).isBefore(moment(getFieldValue('UploadTimeBegin')), 'days') : false
											}
										/>)}
									</FormItem>
								</Col>
							</Row>
						</Col>
						<Col span={8} className='text-right'>
							<Button style={{ marginBottom: 24 }} onClick={this.handleReset}>重置</Button>
							<Button type="primary" className="ml-8" htmlType="submit">查询</Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
export default Form.create({
	mapPropsToFields: props => createFormField(props.searchValue),
	onValuesChange: (props, changedValues, allValues) => {
		props.handleFormValuesChange(allValues);
	}
})(SearchForm);
