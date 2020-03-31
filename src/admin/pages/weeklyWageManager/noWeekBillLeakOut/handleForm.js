import React, { PureComponent } from 'react';
import { LeakHandle } from 'ADMIN_SERVICE/ZXX_WeekLeak';
import { Button, message, Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class HandleForm extends PureComponent {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '不发薪.周薪查漏', '未发周薪操作处理确定', '不发薪周薪查漏_Y结算']);
            const { selectedRowKeys, reloadData, hideModal } = this.props;

            let reqParam = {
                ...fieldsValue,
                DataIds: selectedRowKeys
            };

            LeakHandle(reqParam).then((resData) => {
                hideModal();
                reloadData();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        });
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };

        const { hideModal, form: { getFieldDecorator } } = this.props;
        return (
            <Modal
                title='未发周薪操作处理'
                footer={null}
                onCancel={hideModal}
                visible>
                <Form onSubmit={this.saveData}>
                    <FormItem {...formItemLayout} label='操作'>
                        {getFieldDecorator('OperationSts', {
                            rules: [{ required: true, message: '请选择操作' }]
                        })(
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value={2}>处理正常</Radio.Button>
                                <Radio.Button value={3}>处理异常</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('Remark', {
                            rules: [{ required: true, message: '请输入备注' }]
                        })(
                            <TextArea rows={3} placeholder='请输入备注信息' maxLength={50} />
                        )}
                    </FormItem>

                    <FormItem {...btnItemLayout}>
                        <Button type="primary" htmlType="submit" >确定</Button>
                        <Button className='ml-8' onClick={hideModal}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

HandleForm = Form.create()(HandleForm);

export default HandleForm;