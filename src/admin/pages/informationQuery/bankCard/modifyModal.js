import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Col, Form, Input, Select, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';
import DragContainer from './imageView';

const FormItem = Form.Item;

@observer
class ModifyModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: "auto",
            height: 300,
            rot: 0,
            px: 0,
            py: 100,
            isDrag: false
        };
        this.downX = 0;
        this.downY = 0;
	}

	fnDown = event => {
        event.preventDefault();
        console.log('------ ff  start drag ------');
        this.setState({
            isDrag: true
        });
        this.downX = event.clientX;
        this.downY = event.clientY;
    };

    fnMove = (event) => {
        event.persist();
        if (this.state.isDrag) {
            // 判断容器宽高
            this.setState(state => {
                let result = {
                    px: state.px + (event.clientX - this.downX),
                    py: state.py + (event.clientY - this.downY)
                };
                this.downX = event.clientX;
                this.downY = event.clientY;
                return result;
            });
        }
    };

    fnUp = (event) => {
        event.preventDefault();
        console.log('------ ff  stop drag ------');
        this.setState({
            isDrag: false
        });
    };

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
	KeyPress = (e) => {
		if (e.which !== 13) return;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
            }
            console.log(123, values);
            this.props.bankCardStore.handleModifyData(values);
            this.props.form.resetFields();		
		});
	}

	handleOk = (e) => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
            }
            this.props.bankCardStore.handleModifyData(values);
            this.props.form.resetFields();		
		});
	}

	handleCancel = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
		this.props.bankCardStore.handleModifyReset();
	}

	render() {
		const {modifyVisible, modalLoading, BankCardUrl} = this.props.bankCardStore.view;
		const { getFieldDecorator } = this.props.form;
        const bankList = this.props.bankList;
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
				title="修改银行卡信息"
				visible={modifyVisible}
				width={600}
				onCancel={this.handleCancel}
				confirmLoading={modalLoading}
				footer={[
					<Button key="submit" loading={modalLoading} type="primary" onClick={this.handleOk}>确定</Button>
				]}
			>
				<Row type="flex" justify="center" className="mb-16">
					{
						BankCardUrl ? 
						<div>
							<DragContainer style={{width: '500px', height: '400px', position: "relative", overflow: "hidden"}}>
								<img id = "img" width = {width} height = {height} src={BankCardUrl} className = {`rot${rot}`}/>
							</DragContainer>
							<div style = {{paddingTop: "15px"}}>
								<Button className="ml-8" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(50)}><img src={add}/></Button>
								<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(-50)}><img src={minus}/></Button>
								<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotRight()}><img src={right}/></Button>
								<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotLeft()}><img src={left}/></Button>
							</div>
						</div> : null
					}
                </Row>
				<Form onSubmit={this.auditIdCard}>
					<Row>
                        <Col span = {18}>
                            <FormItem {...formItemLayout} label="银行名称">
                                {getFieldDecorator('BankName', {
                                rules: [{
                                    required: true,
                                    message: '必填'
                                }, {
                                    whitespace: true,
                                    message: '不能输入空格'
                                }]
                            })(<Select
                                showSearch
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
					</Row>
					<Row>
						<Col span={18}>
							<FormItem {...formItemLayout} label="银行卡号">
								{getFieldDecorator('BankCardNum', {
									rules: [{
										required: true,
										message: "请输入银行卡号"
									}, {
										pattern: /(^[\d]{8,19}$)/,
                                        message: "请输入正确的8到19位银行卡号"
									}
									]
								})(<Input autoComplete="off" placeholder="请输入银行卡号" onKeyPress={this.KeyPress} onPaste={(e) =>{e.preventDefault();}} maxLength={23} />)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(ModifyModal);