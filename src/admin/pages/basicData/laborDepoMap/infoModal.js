import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Modal, Select, InputNumber } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@observer
class InfoModal extends Component {
    saveData = (e) => {
        const {
            infoModal: { record }
        } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            console.log(fieldsValue);
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '劳务押金关系表', record ? '保存修改' : '保存新增', '劳务押金关系表_Y结算']);
            this.props.addLaborDepoMap(fieldsValue);
        });
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };

        const { getFieldDecorator } = this.props.form;
        const {
            infoModal: { record },
            setInfoModalShow,
            bossList,
            companyList,
            laborList
        } = this.props;

        return (
            <Modal
                visible={true}
                title={record ? '修改' : '新增'}
                onOk={this.saveData}
                onCancel={setInfoModalShow.bind(this, false)}>
                <Form onSubmit={this.saveData}>
                    <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('RecordID')(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='大佬'>
                        {getFieldDecorator('BossID', {
                            rules: [{ required: true, message: '请选择大佬' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                disabled={!!record}
                                showSearch >
                                {
                                    bossList.map((value) => {
                                        return <Option key={value.BossID} value={value.BossID}>{value.BossName}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='劳务'>
                        {getFieldDecorator('LaborID', {
                            rules: [{ required: true, message: '请选择中介' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                // disabled={!!record}
                                showSearch >
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
                                // disabled={!!record}
                                showSearch >
                                {
                                    companyList.map((value) => {
                                        return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='结算模式'>
                        {getFieldDecorator('SettlementTyp', {
                            rules: [{ required: true, message: '请选择大结算模式' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                // disabled={!!record}
                                showSearch >
                                    <Option key={1} value={1}>ZX结算方式</Option>
                                    <Option key={2} value={2}>Z结算方式</Option>
                                    <Option key={3} value={3}>ZA结算方式</Option>
                                    <Option key={4} value={4}>Z-B结算方式</Option>
                                    <Option key={5} value={5}>ZX-B结算方式</Option>
                                    <Option key={6} value={6}>ZX-A结算方式</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='押金标准'>
                        {getFieldDecorator('DepositAmount', {
                            rules: [{ required: true, message: '请输入押金标准' }]
                        })(
                            <InputNumber min={0} precision={2} className='w-100' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('Remark')(
                            <TextArea rows={3} maxLength={50} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

InfoModal = Form.create({
    mapPropsToFields: props => {
        const { record } = props.infoModal;
        if (record) {
            return createFormField(record);
        }
    }
})(InfoModal);

export default InfoModal;