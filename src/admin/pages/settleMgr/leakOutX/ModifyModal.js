import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, Form, Input, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
const FormItem = Form.Item;

@observer
class ModifyModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { record: {RecordID, XType}} = this.props;
            let Data = this.props.saveData(RecordID, XType, fieldsValue.Remark);
            window._czc.push(['_trackEvent', 'X查漏-X项', '修改缺', 'X查漏-X项_Y结算']);
            Data.then((res) => {
                this.props.ModalHidden();
            });
        });
    }

    render() {
        const { form, record: {EnterpriseName, LaborName, Month, type}} = this.props;

        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        };
        return (
            <Modal title="修改缺" width="600px" visible={this.props.visible} onOk={this.handleOk} onCancel={this.props.ModalHidden}>
                <Form>
                    <Row>
                        <Col span={24}>
                            <p className='text-center'>是否要把"
                            <span style= {{fontWeight: "600"}}>{EnterpriseName}</span>"-"
                            <span style= {{fontWeight: "600"}}>{LaborName}</span>"-"
                            <span style= {{fontWeight: "600"}}>{Month}</span>"-"
                            <span style= {{fontWeight: "600"}}>{type}</span>"的状态由"缺"改成&radic;</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="备注" style={{ marginBottom: "0" }}>
                                {getFieldDecorator('Remark', {
                                    rules: [{
                                        required: true,
                                        message: "备注必填"
                                    }
                                    ]
                                })(<Input placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

ModifyModal = Form.create({
    mapPropsToFields: props => {
        const { record } = props;
        if (record) {
            return createFormField(record);
        }
    }
})(ModifyModal);
export default ModifyModal;
