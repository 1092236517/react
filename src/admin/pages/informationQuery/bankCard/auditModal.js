import placeholderImg2 from 'ADMIN_ASSETS/images/placeholderImg-2.png';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';

const FormItem = Form.Item;

@observer
class AuditModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstValue: {},
			num: 0,
			width: "auto",
			height: 300,
			rot: 0
		};
	}
	KeyPress = (e) => {
		if (e.which !== 13) return;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (this.state.num == 0) {
				this.setState({
					firstValue: values,
					num: 1
				}, () => {
					this.props.form.resetFields();
				});
				message.success('请再次重复输入！');
				return;
			} else {
				if (!(values.RealName == this.state.firstValue.RealName && values.IdCardNum == this.state.firstValue.IdCardNum)) {
					message.error('两次输入内容不一致，请重新输入!');
					return;
				} else {
					this.setState({
						firstValue: {},
						num: 0,
						width: "auto",
						height: 300,
						rot: 0
					}, () => {
						this.props.bankCardStore.handleIdCardAudit(values, this.props.form.resetFields);
						this.props.form.resetFields();
					});
				}
			}
		});
	}

	handleOk = (e) => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (this.state.num == 0) {
				this.setState({
					firstValue: values,
					num: 1
				}, () => {
					this.props.form.resetFields();
				});
				message.success('请再次重复输入！');
				return;
			} else {
				if (!(values.RealName == this.state.firstValue.RealName && values.IdCardNum == this.state.firstValue.IdCardNum)) {
					message.error('两次输入内容不一致，请重新输入!');
					return;
				} else {
					window._czc.push(['_trackEvent', '银行卡信息查询', '审核身份证_保存', '银行卡信息查询_Y结算']);
					this.setState({
						firstValue: {},
						num: 0,
						width: "auto",
						height: 300,
						rot: 0
					}, () => {
						this.props.bankCardStore.handleIdCardAudit(values, this.props.form.resetFields);
						this.props.form.resetFields();
					});
				}
			}
		});
	}

	handleNext = () => {
		this.setState({
			firstValue: {},
			num: 0,
			width: "auto",
			height: 300,
			rot: 0
		}, () => {
			this.props.form.resetFields();
			this.props.bankCardStore.handleGetNextIDCardPic();
		});
		window._czc.push(['_trackEvent', '银行卡信息查询', '审核身份证_看不清', '银行卡信息查询_Y结算']);
	}

	handleCancel = (e) => {
		e.preventDefault();
		this.setState({
			firstValue: {},
			num: 0,
			width: "auto",
			height: 300,
			rot: 0
		}, () => {
			this.props.form.resetFields();
			this.props.bankCardStore.handleIDFormReset();
		});
	}

	// 放大缩小图片
	imgToSize = (size) => {
		var img = document.getElementById('img');
		let { width, height } = this.state;
		if (width === "auto") {
			width = img.width;
		}
		if (height <= 300 && size < 0) {
			return;
		} else {
			this.setState({
				width: width * 1 + size,
				height: (height + size / width * height)
			}, () => {
				console.log(this.state.width, this.state.height);
			});
		}
	}
	// 向右转
	rotRight = () => {
		if (this.state.rot < 3) {
			this.setState({
				rot: this.state.rot + 1
			});
		} else {
			this.setState({
				rot: 0
			});
		}

	}
	// 像左转
	rotLeft = () => {
		if (this.state.rot === 0) {
			this.setState({
				rot: 3
			});
		} else {
			this.setState({
				rot: this.state.rot - 1
			});
		}
	}

	render() {
		const { iDCardInfo, auditIdCardVisible, modalLoading } = this.props.bankCardStore.view;
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

		let { source, imageView } = this.props;
		let { width, height, rot } = this.state;
		return (
			<Modal
				title="审核身份证信息"
				visible={auditIdCardVisible}
				width={800}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" loading={modalLoading} type="primary" onClick={this.handleOk}>确定</Button>,
					<Button key="back" loading={modalLoading} onClick={this.handleNext}>
						看不清
            </Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						iDCardInfo && iDCardInfo.IdcardFrontUrl ?
							<div>
								<DragContainer style={{ width: '600px', height: '400px', position: "relative", overflow: "hidden" }}>
									<img id="img" width={width} height={height} src={iDCardInfo.IdcardFrontUrl} className={`rot${rot}`} />
								</DragContainer>
								<div style={{ paddingTop: "15px" }}>
									<input type="button" value="放大" onClick={() => this.imgToSize(100)} />
									<input type="button" value="缩小" onClick={() => this.imgToSize(-100)} />
									<input type="button" value="向右旋转" onClick={() => this.rotRight()} />
									<input type="button" value="向左旋转" onClick={() => this.rotLeft()} />
								</div>
							</div>

							// <img style={{ width: "622px", height: "315px" }} src={iDCardInfo.IdcardFrontUrl} />
							:
							<img src={placeholderImg2} alt="身份证照片" />
					}
				</Row>
				<Form onSubmit={this.auditIdCard}>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="请输入姓名">
								{getFieldDecorator('RealName', {
									rules: [{
										required: true,
										message: "请输入姓名"
									}
									]
								})(<Input autoComplete="off" placeholder="会员姓名" onKeyPress={this.KeyPress} onPaste={(e) => { e.preventDefault(); }} maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="请输入身份证号">
								{getFieldDecorator('IdCardNum', {
									rules: [{
										required: true,
										message: "请输入身份证号"
									}, {
										pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
										message: '请输入正确的18位身份证号'
									}
									]
								})(<Input autoComplete="off" placeholder="会员身份证号" onKeyPress={this.KeyPress} onPaste={(e) => { e.preventDefault(); }} maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create({
	// mapPropsToFields: props => createFormField(props.iDCardInfo)
	// onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
}
)(AuditModal);