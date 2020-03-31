import React from 'react';
import { Modal, Row, Col, Button, Form, Input } from 'antd';
import { observer, inject } from 'mobx-react';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import placeholderImg2 from 'ADMIN_ASSETS/images/placeholderImg-2.png';

const FormItem = Form.Item;

@inject('idCardStore')
@observer
class reviseModal extends React.Component {
	constructor(props) {
		super(props);
	}
	handleOk = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			this.props.idCardStore.handleIdCardRevise(values, this.props.form.resetFields);
		});
	}


	handleCancel = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
		this.props.idCardStore.handleReviseFormReset();
	}

	render() {
		const { view, setVisible, bind, handleFormValuesChange } = this.props.idCardStore;
		const { reviseIdCardVisible, modalLoading, orderList, selectedRows, iDCardInfo, disableAudit } = view;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 9 },
				sm: { span: 9 }
			},
			wrapperCol: {
				xs: { span: 15 },
				sm: { span: 15 }
			}
		};

		return (
			<Modal
				title="修改身份证信息"
				visible={reviseIdCardVisible}
				width={800}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>,
					<Button key="back" loading={modalLoading} onClick={this.handleCancel}>
						取消
            </Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						iDCardInfo.IdcardFrontUrl ?
							<img style={{ width: "622px", height: "315px" }} src={iDCardInfo.IdcardFrontUrl} alt="身份证照片" />
							:
							<img src={placeholderImg2} alt="身份证照片" />
					}
				</Row>

				<Form onSubmit={this.startQuery}>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="请输入姓名">
								{getFieldDecorator('Realname', {
									initialValue: iDCardInfo && iDCardInfo.RealName,
									rules: [{
										required: true,
										message: "请输入姓名"
									}
									]
								})(<Input disabled={disableAudit} placeholder="会员姓名" maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="请输入身份证号">
								{getFieldDecorator('IdCardNum', {
									initialValue: iDCardInfo && iDCardInfo.IdCardNum,
									rules: [{
										required: true,
										message: "请输入身份证号"
									}
									]
								})(<Input disabled={disableAudit} placeholder="会员身份证号" maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(reviseModal);