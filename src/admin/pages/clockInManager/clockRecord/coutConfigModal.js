import React, { Component } from 'react';
import { Button, Form, InputNumber, Modal, message } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from 'mobx-react';

@observer
class CountConfigModal extends Component {
    componentDidMount() {
        this.props.clockInMagStore.getMaxReissueCount();
    }

    setMaxReissueCount = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.props.clockInMagStore.setMaxReissueCount();
        });
    }

    hideModal = () => {
        const { setVisible } = this.props.clockInMagStore;
        setVisible('modalCountConfigVisible', false);
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                visible={true}
                title='补卡次数限制'
                footer={null}
                onCancel={this.hideModal}
            >
                <Form onSubmit={this.setMaxReissueCount} className='text-center'>
                    <div>每周最高{
                        getFieldDecorator('MaxReissueCntPerWeek')(
                            <InputNumber style={{ margin: '0 8px' }} precision={0} min={0} max={7}></InputNumber>
                        )
                    } 次</div>
                    <br />
                    <div>每月最高{
                        getFieldDecorator('MaxReissueCntPerMonth')(
                            <InputNumber style={{ margin: '0 8px' }} precision={0} min={0} max={31}></InputNumber>
                        )
                    }次</div>
                    <div className='mt-32'>
                        <Button type='primary' htmlType='submit' >确定</Button>
                        <Button className='ml-8' onClick={this.hideModal}>取消</Button>
                    </div>
                </Form>
            </Modal>
        );
    }
}


CountConfigModal = Form.create({
    mapPropsToFields: props => {
        return createFormField(props.clockInMagStore.view.maxReissueCount);
    },
    onValuesChange: (props, changedValues, allValues) => {
        const { MaxReissueCntPerWeek, MaxReissueCntPerMonth } = allValues;
        if (MaxReissueCntPerWeek > MaxReissueCntPerMonth) {
            message.info('每周最高次数不能超过每月最高次数！');
        } else {
            props.clockInMagStore.editMaxReissueCount(allValues);
        }
    }
})(CountConfigModal);

export default CountConfigModal;