import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Modal, message, Select } from 'antd';
import { addEntLaborMap } from 'ADMIN_SERVICE/ZXX_BaseData';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;

@observer
class InfoModal extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '企业对应劳务', '保存新增', '企业对应劳务_Y结算']);
            addEntLaborMap(fieldsValue).then((res) => {
                const { startQuery, closeModal } = this.props;
                message.success('添加成功！');
                startQuery();
                closeModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        });
    }


    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const {
            form: {
                getFieldDecorator
            },
            companyList,
            laborList,
            closeModal
        } = this.props;

        return (
            <Modal
                visible={true}
                onOk={this.saveData}
                title={'新增'}
                onCancel={closeModal}>
                <Form onSubmit={this.saveData}>
                    <FormItem {...formItemLayout} label='劳务'>
                        {getFieldDecorator('LaborID', {
                            rules: [{ required: true, message: '请选择劳务' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch>
                                {
                                    laborList.map((value) => {
                                        return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='企业'>
                        {getFieldDecorator('EnterID', {
                            rules: [{ required: true, message: '请选择企业' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch>
                                {
                                    companyList.map((value) => {
                                        return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="是否劳务发放" {...formItemLayout}>
                        {getFieldDecorator('MonthSalaryPayer', {
                            rules: [{ required: true, message: '请选择是否劳务发放' }]
                        })(
                            <Select placeholder="请选择">
                                <Option value={2}>是</Option>
                                <Option value={1}>否</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

InfoModal = Form.create({})(InfoModal);

export default InfoModal;