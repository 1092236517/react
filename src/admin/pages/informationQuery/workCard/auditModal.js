import placeholderImg2 from 'ADMIN_ASSETS/images/placeholderImg-2.png';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import 'ADMIN_ASSETS/less/pages/listManager.less';
import ossConfig from 'ADMIN_CONFIG/ossConfig';
import { Button, Col, Form, Input, message, Modal, Row, Select, Icon } from 'antd';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';


const IMG_PATH = ossConfig.getImgPath();
const FormItem = Form.Item;
@inject('globalStore')
@observer
class AuditModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			WorkCardNo: null,
			num: 0,
			width: 500,
			height: 400,
			rot: 0
		};
	}

	KeyPress = (e) => {
		if (e.which !== 13) return;
		this.handleOk();
	}

	handleOk = () => {
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const workCardInfo = toJS(this.props.workCardInfo);
				if (this.state.num == 0) {
					if (values.SubmitEntId) {
						this.setState({
							WorkCardNo: values.WorkCardNo,
							num: 1
						}, () => {
							this.props.form.resetFields();
							// this.props.form.setFieldsValue({WorkCardNo: null});
						});
						message.success('请再次重复输入！');
						this.workCardInput.focus();
						return;
					} else if (workCardInfo.EntId) {
						this.setState({
							WorkCardNo: values.WorkCardNo,
							num: 1
						}, () => {
							this.props.form.resetFields();
							// this.props.form.setFieldsValue({WorkCardNo: null});
						});
						message.success('请再次重复输入！');
						this.workCardInput.focus();
						return;
					}
				} else {
					if (values.SubmitEntId) {
						if (!(values.WorkCardNo == this.state.WorkCardNo)) {
							message.error('两次输入内容不一致，请重新输入!');
							return;
						} else {
							message.success('审核成功!');
							this.setState({
								WorkCardNo: null,
								num: 0,
								width: "auto",
								height: 300,
								rot: 0
							}, () => {
								this.props.workCardStore.handleWorkCardAudit(values);
								this.props.form.resetFields();
							});
						}
					} else if (workCardInfo.EntId) {
						if (!(values.WorkCardNo == this.state.WorkCardNo)) {
							message.error('两次输入内容不一致，请重新输入!');
							return;
						} else {
							message.success('审核成功!');
							this.setState({
								WorkCardNo: null,
								num: 0,
								width: "auto",
								height: 300,
								rot: 0
							}, () => {
								this.props.workCardStore.handleWorkCardAudit(values);
								this.props.form.resetFields();
							});
						}
					}
				}
			}
		});
	}

	handleNext = () => {
		this.setState({
			WorkCardNo: null,
			num: 0,
			width: 500,
			height: 400,
			rot: 0
		}, () => {
			this.props.form.resetFields();
			this.props.workCardStore.getNextWorkCardPic();
		});
	}

	handleCancel = (e) => {
		e.preventDefault();
		this.setState({
			WorkCardNo: null,
			num: 0,
			width: 500,
			height: 400,
			rot: 0
		}, () => {
			// this.props.form.setFieldsValue({WorkCardNo: null});
			this.props.form.resetFields();
			this.props.workCardStore.handleFormReset();
		});
	}
	handleEditor = (e) => {
		this.props.workCardStore.changeIsEditor(false);
	}

	// 放大缩小图片
	imgToSize = (size) => {
		var img = document.getElementById('img');
		let { width, height } = this.state;
		// if (width === "auto") {
		// 	width = img.width;
		// }
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
	selectEntId = (e, value) => {
		if (this.props) {
			this.props.workCardStore.changeEnt(e, value.props.children);
		}
	}

	render() {
		const { setVisible, handleFormValuesChange, workCardStore, isEditor, auditVisible, modalLoading, workCardInfo, aduitType } = this.props;
		const ItemLayout = {
			labelCol: { span: 10, offset: 0 },
			wrapperCol: { span: 14, offset: 0 }
		};
		const ItemLayout2 = {
			labelCol: { span: 12, offset: 0 },
			wrapperCol: { span: 12, offset: 0 }
		};
		const formItemLayout = {
			labelCol: { span: 3, offset: 0 },
			wrapperCol: { span: 12, offset: 0 }
		};
		const { companyList } = this.props.globalStore;
		const { getFieldDecorator } = this.props.form;
		let { width, height, rot } = this.state;

		return (
			<Modal
				title="审核"
				visible={auditVisible}
				width={800}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>,
					aduitType == 1 ? <Button key="back" loading={modalLoading} onClick={() => setVisible('auditVisible', false)}>
						取消
            </Button> : <Button key="back" loading={modalLoading} onClick={this.handleNext}>
							看不清
            </Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						workCardInfo.WorkCardUrl ?
							<div style={{ width: "600px" }}>
								<DragContainer style={{ width: '600px', height: '400px', position: "relative", overflow: "hidden" }}>
									<img id="img" width={width} height={height} src={`${IMG_PATH}${workCardInfo.WorkCardUrl}`} className={`rot${rot}`} />
								</DragContainer>

								<div style={{ paddingTop: "15px" }}>
									<Button className="ml-8" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(50)}><img src={add} /></Button>
									<Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(-50)}><img src={minus} /></Button>
									<Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotRight()}><img src={right} /></Button>
									<Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotLeft()}><img src={left} /></Button>
								</div>
							</div>
							:
							<img style={{ width: '600px', height: '300px' }} src={placeholderImg2} />
					}


				</Row>
				<Form onSubmit={this.startQuery}>
					<Row type="flex">
						<Col span={12}>
							<FormItem {...ItemLayout} style={{ marginBottom: '0' }} label='面试名单企业名：'>
								{workCardInfo.InterViewEntShortNme}
							</FormItem>
							{
								workCardInfo.InterViewEntId !== workCardInfo.EntId ?
									<span style={{ "color": "red", "fontSize": "12px" }}>
										用户提交的企业名称和面试名单企业名称不符
									</span>
									: ''
							}
						</Col>
						{this.props.isEditor ?
							<Col span={10}>
								<FormItem {...ItemLayout2} label='用户提交企业名称'>
									<div style={{ "color": "#999" }}>{workCardInfo.EntShortName}</div>
								</FormItem>
							</Col> :
							<Col span={10}>
								<FormItem {...ItemLayout2} label='用户提交企业名称'>
									{getFieldDecorator('SubmitEntId', {
										initialValue: workCardInfo.EntId
									})(
										<Select
											allowClear={true}
											placeholder="企业名称"
											optionFilterProp="children"
											onChange={this.selectEntId}
											showSearch>
											{
												companyList.map((value) => {
													return <Select.Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Select.Option>;
												})
											}
										</Select>
									)
									}
								</FormItem>
							</Col>
						}
						{
							(isEditor) &&
							<Col span={2}>
								<FormItem>
									<Icon type='form' className='icon-bianji' onClick={this.handleEditor} />
								</FormItem>
							</Col>
						}
					</Row>
					<Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label="姓名" style={{ "marginBottom": 0 }}>
								<div style={{ "color": "#999" }}>{workCardInfo.RealName}</div>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label="身份证号码" style={{ "marginBottom": 0 }}>
								<div style={{ "color": "#999" }}>{workCardInfo.IdCardNum}</div>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label="面试日期" style={{ "marginBottom": 0 }}>
								<div style={{ "color": "#999" }}>{workCardInfo.IneterviewDate}</div>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<FormItem {...formItemLayout} label="工号" style={{ "marginBottom": 0 }}>
								{getFieldDecorator('WorkCardNo', {
									rules: [{
										required: true,
										message: "请填写工号"
									}
									]
								})(<Input ref={(input) => { this.workCardInput = input; }} autoComplete="off" placeholder="请填写工号" onKeyPress={this.KeyPress} onPaste={(e) => { e.preventDefault(); }} maxLength={50} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(AuditModal);
