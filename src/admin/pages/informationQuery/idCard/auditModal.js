import placeholderImg2 from 'ADMIN_ASSETS/images/placeholderImg-2.png';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';

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
		this.handleOk();
	}

	handleOk = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			this.setState({
				width: "auto",
				height: 300,
				rot: 0
				}, () =>{
					this.props.handleIdCardAudit(values, this.props.form.resetFields);
					this.props.form.resetFields();
			});

			// if(this.state.num == 0) {
			// 	this.setState({
            //         firstValue: values,
			// 		num: 1
			// 	}, () =>{
            //         // this.props.form.resetFields();
			// 	});
				
			// 	message.success('请再次重复输入！');
			// 	this.textInput.focus();
			// 	return;
			// }else {
			// 	if(!(values.RealName == this.state.firstValue.RealName && values.IdCardNum == this.state.firstValue.IdCardNum)) {
			// 			message.error('两次输入内容不一致，请重新输入!');
			// 			return;
			// 	}else {
			// 		this.setState({
			// 			firstValue: {},
			// 			num: 0,
			// 			width: "auto",
			// 			height: 300,
			// 			rot: 0
			// 		}, () =>{
			// 			this.props.handleIdCardAudit(values, this.props.form.resetFields);
			// 			this.props.form.resetFields();
			// 	});
			// 	}
			// }
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
			this.props.form.resetFields();
			this.props.handleGetNextIDCardPic();

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
			this.textInput.focus();
			this.props.form.resetFields();
			this.props.handleIDFormReset();
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
		const { iDCardInfo, auditIdCardVisible, modalLoading} = this.props;
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
		let {width, height, rot} = this.state;
		return (
			<Modal
				title="审核身份证信息"
				visible={auditIdCardVisible}
				width={800}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" type="primary" loading={modalLoading} onClick={this.handleOk}>确定</Button>,
					<Button key="back" loading={modalLoading} onClick={this.handleNext}>
						看不清
            </Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						iDCardInfo && iDCardInfo.IdcardFrontUrl ?
							<div style = {{width: "600px"}}>
								<DragContainer style={{width: '600px', height: '400px', position: "relative", overflow: "hidden"}}>
									<img id = "img" width = {width} height = {height} src={iDCardInfo.IdcardFrontUrl} className = {`rot${rot}`}/>
								</DragContainer>
								
								<div style = {{paddingTop: "15px"}}>
									<Button className="ml-8" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(50)}><img src={add}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(-50)}><img src={minus}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotRight()}><img src={right}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotLeft()}><img src={left}/></Button>
								</div>
							</div>
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
								})(<Input ref={(input) => { this.textInput = input; }} autoComplete="off" placeholder="会员姓名" onKeyPress={this.KeyPress} onPaste={(e) =>{e.preventDefault();}} maxLength={23} />)}
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
								})(<Input autoComplete="off" placeholder="会员身份证号" onKeyPress={this.KeyPress} onPaste={(e) =>{e.preventDefault();}} maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

// export default Form.create()(AuditModal);
export default Form.create({
    mapPropsToFields: props => createFormField(props.auditNameAndId)
})(AuditModal);