import React from 'react';
import {
    Modal,
    Form,
    Input
} from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import {RoleType} from 'ADMIN_CONFIG/enum/Role';

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 8}},
    wrapperCol: {xs: {span: 24}, sm: {span: 16}}
};
const ModalForm = Form.create({
    mapPropsToFields: props => createFormField(props.formValue),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(changedValues)
})(({handleSubmit, handleFormReset, form, type}) => {
    const {getFieldDecorator} = form;

    return (
        <Form>
            <Form.Item {...formItemLayout} label="角色名称">
                {getFieldDecorator('Name')(<Input placeholder='请输入' maxLength={20}/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('Remark')(<Input.TextArea placeholder='请输入' maxLength={200}/>)}
            </Form.Item>

        </Form>
    );
});

export default class RoleModal extends React.PureComponent {

    formRef = React.createRef();

    handleOk = () => {
        const { roleModalInfo} = this.props;
        this.formRef.current.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.handleModalChange.onOk();
            window._czc.push(['_trackEvent', '平台角色管理', roleModalInfo.RID ? '修改角色保存' : '新增角色保存', '平台角色管理_N非结算']);
        });
    };

    render() {
        const {Visible, confirmLoading, roleModalInfo, handleModalChange} = this.props;
        return (
            <Modal
                title={roleModalInfo.RID ? '修改角色' : '新增角色'}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={handleModalChange.onCancel}
                afterClose={handleModalChange.afterClose}
                visible={Visible}>
                <ModalForm ref={this.formRef}
                           formValue={roleModalInfo}
                           onValuesChange={handleModalChange.handleValuesChange}
                />
            </Modal>
        );
    }
};