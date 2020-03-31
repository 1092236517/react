import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, Form, Input, Modal, Row, InputNumber } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
const FormItem = Form.Item;

@observer
class ModifyModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            const {RelatedMo, EntId, TrgtSpId} = this.props.record;
            let Data = this.props.saveData(RelatedMo, EntId, TrgtSpId, fieldsValue.ModifyRemark, fieldsValue.EndXmoney);
            window._czc.push(['_trackEvent', 'X汇总表', '修改X', 'X汇总表Y结算']);
            Data.then((res) => {
                this.props.ModalHidden();
            });
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        };
        return (
            <Modal title="修改X" width="600px" visible={this.props.visible} onOk={this.handleOk} onCancel={this.props.ModalHidden}>
                <Form>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="最终X" style={{ marginBottom: "0" }}>
                                {getFieldDecorator('EndXmoney', {
                                    rules: [{
                                        required: true,
                                        message: "最终X必填"
                                    }
                                    ]
                                })(<InputNumber className='w-100' min={0} precision={2} placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="备注" style={{ marginBottom: "0" }}>
                                {getFieldDecorator('ModifyRemark', {
                                    rules: [{
                                        required: true,
                                        message: "备注必填"
                                    }
                                    ]
                                })(<Input placeholder="请输入" maxLength={50} />)}
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
            console.log('record', record);
            return createFormField({
                ...record,
                EndXmoney: record.EndXmoney / 100
            });
        }
    }
})(ModifyModal);
export default ModifyModal;
