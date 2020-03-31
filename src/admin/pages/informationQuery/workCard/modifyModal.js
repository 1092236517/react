import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import ossConfig from 'ADMIN_CONFIG/ossConfig';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';
import DragContainer from './imageView';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';

const IMG_PATH = ossConfig.getImgPath();
const FormItem = Form.Item;
const Option = Select.Option;

@inject('workCardStore', 'globalStore')

@observer
class ModifyModal extends React.Component {
    componentDidMount() {
        this.init();
    }

    init() {
        const { getAllCompanyInfo } = this.props.globalStore;
        getAllCompanyInfo();
    }

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

    KeyPress = (e) => {
        if (e.which !== 13) return;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.workCardStore.handleModifyData(values);
            this.props.form.resetFields();
        });
    }

    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.workCardStore.handleModifyData(values);
            this.props.form.resetFields();
        });
        window._czc.push(['_trackEvent', '工牌信息查询', '保存修改', '工牌信息查询_Y结算']);
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        this.props.workCardStore.handleModifyReset();
    }

    render() {
        const { modifyVisible, modalLoading, WorkCardUrl } = this.props.workCardStore.view;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 8 }
            },
            wrapperCol: {
                sm: { span: 14 }
            }
        };
        let { width, height, rot } = this.state;
        return (
            <Modal
                title="修改工牌信息"
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
                        WorkCardUrl ?
                            <div>
                                <DragContainer style={{ width: '500px', height: '400px', position: "relative", overflow: "hidden" }}>
                                    <img id="img" width={width} height={height} src={IMG_PATH + WorkCardUrl} className={`rot${rot}`} />
                                </DragContainer>
                                <div style={{ paddingTop: "15px" }}>
                                    <Button className="ml-8" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(50)}><img src={add} /></Button>
                                    <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(-50)}><img src={minus} /></Button>
                                    <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotRight()}><img src={right} /></Button>
                                    <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotLeft()}><img src={left} /></Button>
                                </div>
                            </div> : null
                    }
                </Row>
                <Form onSubmit={this.auditIdCard}>
                    <Row>
                        <Col span={18}>
                            <FormItem {...formItemLayout} label="选择企业">
                                {getFieldDecorator('EntId')(<Select
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择企业"
                                    optionFilterProp="children"
                                >
                                    <Option key={-9999} value={-9999}>全部</Option>
                                    {this.props.globalStore.companyList.map((item, index) => <Option key={index} value={item.EntId}>{item.EntShortName}</Option>)}
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <FormItem {...formItemLayout} label="工号">
                                {getFieldDecorator('WorkCardNo', {
                                    rules: [{
                                        required: true,
                                        message: "请输入工号"
                                    }
                                    ]
                                })(<Input autoComplete="off" placeholder="请输入工号" onKeyPress={this.KeyPress} onPaste={(e) => { e.preventDefault(); }} maxLength={23} />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

// export default Form.create()(ModifyModal);
export default Form.create({
    mapPropsToFields: props => createFormField(props.workCardStore.view.ModifyWorkCardNoAndEntId),
    onValuesChange: (props, changedValues, allValues) => {
        props.workCardStore.EntIdAndWorkNoChange(allValues);
    }
})(ModifyModal);