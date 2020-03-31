import placeholderImg2 from 'ADMIN_ASSETS/images/placeholderImg-2.png';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { formItemLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';

const FormItem = Form.Item;

@inject('bankCardStore')
@observer
class AuditBankCardModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectIndex: null,
			record: '',
			isEditor: true,
			firstValue: {},
			num: 0,
			width: "auto",
            height: 300,
            rot: 0
		};
	}
	
	KeyPress = (e) => {
		if (e.which !== 13) return;
		this.handleOk();
	}

	handleOk = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if(this.state.num == 0) {
				this.setState({
                    firstValue: values,
					num: 1
				}, () =>{
					// this.props.form.setFieldsValue({BankCardNum: null});
					this.props.form.resetFields();
				});
				message.success('请再次重复输入！');
				this.textInput.focus();
				return;
			}else {
			/**  this.props.bankCardStore.view.bankCardInfo 审核银行卡信息的默认值
			 *    values 审核银行卡信息，表单选择的值
			 */
				if(!(values.BankName == this.state.firstValue.BankName && values.BankCardNum == this.state.firstValue.BankCardNum)) {
							message.error('两次输入内容不一致，请重新输入!');
							return;
				}else {
					this.setState({
						firstValue: {},
						num: 0,
						width: "auto",
						height: 300,
						rot: 0
					}, () =>{
						this.props.bankCardStore.handleBankCardAudit(values);
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
		}, () =>{
		// this.props.form.setFieldsValue({BankCardNum: null});
		this.props.form.resetFields();
		this.props.bankCardStore.handleGetNextBankCardPic();
		});
	}

	handleCancel = (e) => {
		e.preventDefault();
		this.setState({
			firstValue: {},
			num: 0,
			width: "auto",
            height: 300,
            rot: 0
		}, () =>{
			this.props.bankCardStore.setVisible(this.props.bankCardStore.view.addVisible, false);
			// this.props.form.setFieldsValue({BankCardNum: null});
			this.props.form.resetFields();
			this.props.bankCardStore.handleFormReset();
		});
	}

	// 放大缩小图片
    imgToSize = (size) => {
        var img = document.getElementById('img');
        let {width, height} = this.state;
        if (width === "auto") {
            width = img.width;
        }
        if(height <= 300 && size < 0) {
            return;
        }else {
            this.setState({
                width: width * 1 + size,
                height: (height + size / width * height)
            }, ()=>{
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
        }else {
            this.setState({
                rot: 0
            });
        }
            
    }
    // 像左转
    rotLeft = () => {
        if(this.state.rot === 0) {
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
		const { view} = this.props.bankCardStore;
		const { auditBankCardVisible, modalLoading, auditValue, bankCardInfo } = view;
		const { form } = this.props;
		const { getFieldDecorator } = form;
		let {width, height, rot} = this.state;
	
		return (
			<Modal
				title="审核银行卡信息"
				visible={auditBankCardVisible}
				width={800}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" loading={modalLoading} type="primary" onClick={this.handleOk}>确定</Button>,
					<Button key="back" loading={modalLoading} onClick={this.handleNext}>看不清</Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						bankCardInfo.BankCardUrl ?
							<div style = {{width: "600px"}}>
								<DragContainer style={{width: '600px', height: '400px', position: "relative", overflow: "hidden"}}>
									<img id = "img" width = {width} height = {height} src={bankCardInfo.BankCardUrl} className = {`rot${rot}`}/>
								</DragContainer>
								
								<div style = {{paddingTop: "15px"}}>	
									<Button className="ml-8" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(50)}><img src={add}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(-50)}><img src={minus}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotRight()}><img src={right}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotLeft()}><img src={left}/></Button>
								</div>
							</div>
							// <img style={{ width: "622px", height: "315px" }} src={bankCardInfo.BankCardUrl} />
							:
							<img src={placeholderImg2} alt="银行卡照片" />
					}
				</Row>
				<Form onSubmit={this.startQuery}>
					<Row>
						<Col span={16}>
							<FormItem {...formItemLayout} label="姓名" style={{ "marginBottom": 0 }}>
								{getFieldDecorator('RealName')(<div style={{ "color": "#999" }}>{bankCardInfo.RealName}</div>)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={16}>
							<FormItem {...formItemLayout} label="身份证号" style={{ "marginBottom": 0 }}>
								{getFieldDecorator('IdCardNum')(<div style={{ "color": "#999" }}>{bankCardInfo.IdCardNum}</div>)}
							</FormItem>
						</Col>
					</Row>
					<Row type="flex" align="middle">
						{/* {
							this.state.isEditor ?
								<Col span={16}>
									<FormItem {...formItemLayout} label="银行名称" style={{ "marginBottom": 0 }}>
												<div style={{ "color": "#999" }}>{bankCardInfo.BankName}</div>
									</FormItem>
								</Col>
								:*/}
								<Col span={16}>
									<FormItem {...formItemLayout} label="银行名称" style={{ "marginBottom": 0 }}>
										{getFieldDecorator('BankName', {
                                    initialValue: bankCardInfo.BankName,
									rules: [{
										required: true,
										message: "请输入银行卡名称"
									}]
                                })(
											<Select showSearch
												allowClear={true}
												placeholder="请选择银行名称"
											>
												{
													auditValue.bankLists.map((item, index) =>
														<Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>
													)}
											</Select>
										)}
									</FormItem>
								</Col>
						{/* }

						 <Col span={8}>
							<Icon type='form icon-bianji' onClick={this.handleEditor} />
						</Col>*/}
					</Row>
					<Row>
						<Col span={16}>
							<FormItem {...formItemLayout} label="请输入银行卡号" style={{ "marginBottom": 0 }}>
								{getFieldDecorator('BankCardNum', {
									rules: [{
										required: true,
										message: "请输入银行卡号"
									}, {
										pattern: /([\d]{4})([\d]{4})([\d]{4})([\d]{4})([\d]{0,})?/,
										message: '请输入正确的银行卡号'
									}
									]
								})(<Input ref={(input) => { this.textInput = input; }} autoComplete="off" onKeyPress={this.KeyPress} onPaste={(e) =>{e.preventDefault();}} placeholder="银行卡号" maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(AuditBankCardModal);