import React from 'react';
import { Input, Button, Form, Row, Col, Select } from 'antd';
import { observer } from "mobx-react";
import {getFormOptLayout, formItemLayout, formLayout, createFormField} from 'ADMIN_UTILS/searchFormUtil';
const formOptLayout = getFormOptLayout(6);
const FormItem = Form.Item;

@observer
class SearchForm extends React.Component {
	constructor(props) {
		super(props);
	}

    handleSubmit = (e) => {
		window._czc.push(['_trackEvent', '劳务基础数据', '查询', '劳务基础数据_N非结算']);
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				this.props.getList();
			}
		});
	}
	render() {
		const { form, handleFormReset, laborList, bankList, loading } = this.props;
		const { getFieldDecorator } = form;
		return (
			<div>
				<Form onSubmit={this.startQuery}>
					<Row gutter={15} type="flex" justify="start">
						<Col span={6}>
							<FormItem {...formItemLayout} label='劳务简称'>
								{getFieldDecorator('SpId')(
                                    <Select showSearch
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {laborList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                    </Select>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout}
								label="联系人">
								{getFieldDecorator('CtctPeople')(<Input placeholder="请输入" maxLength={10}/>)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout}
								label="手机号码">
                                {getFieldDecorator('CtctMobile', {
                                    rules: [{
                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                        message: '请输入正确的手机号格式'
                                    }]
                                })(
                                    <Input placeholder="请输入" maxLength={11}/>
                                )}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="银行名称">
								{getFieldDecorator('BankName')(
                                    <Select showSearch
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {bankList.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
                                    </Select>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="银行账号">
								{getFieldDecorator('BankCardNo')(
                                    <Input placeholder="请输入" maxLength={20}/>
								)}
							</FormItem>
						</Col>
						<Col {...formLayout}>
							<FormItem {...formItemLayout} label="银行账号名">
								{getFieldDecorator('BankAccountName')(
                                    <Input placeholder="请输入" maxLength={50}/>
								)}
							</FormItem>
						</Col>
						<Col {...formOptLayout} className='text-right'>
							<FormItem>
								<Button onClick={handleFormReset}>重置</Button>
								<Button className="ml-8" loading={loading} type="primary" onClick={this.handleSubmit}>查询</Button>
							</FormItem>
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
