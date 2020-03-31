import React, { Component } from 'react';
import { Button, Modal, Form, Checkbox, Input, Select, Radio, message } from 'antd';
import { selectInputSearch } from 'ADMIN_UTILS';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { editConfigX, addConfigX } from 'ADMIN_SERVICE/ZXX_XManager';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class ConfigInfo extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { XConfigureID, XType } = fieldsValue;
            const xType = ['XLeaveSalary', 'XManageExpense', 'XOther', 'XRecruitmentFee', 'XSalary', 'XSocialSecurity'];
            let reqParam = {};

            xType.forEach((t) => {
                reqParam[t] = XType.includes(t) ? 2 : 1;
            });

            reqParam = {
                ...reqParam,
                ...fieldsValue
            };
            delete reqParam['XType'];
            window._czc.push(['_trackEvent', 'X项配置', XConfigureID ? '保存修改' : '保存添加', 'X项配置_Y结算']);
            if (XConfigureID) {
                //  修改
                reqParam.IsEdit = 1;
                editConfigX(reqParam).then((res) => {
                    message.success('修改成功！');
                    this.reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            } else {
                //  新增
                delete reqParam['XConfigureID'];
                addConfigX(reqParam).then((res) => {
                    message.success('添加成功！');
                    this.reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    reloadData = () => {
        const { reloadData, hideModal } = this.props;
        reloadData();
        hideModal();
    }

    render() {
        const { record, hideModal, companyList, laborList } = this.props;
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                visible={true}
                title={record ? '修改' : '新增'}
                footer={null}
                onCancel={hideModal}>

                <Form onSubmit={this.saveData}>
                    <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('XConfigureID')(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='劳务'>
                        {getFieldDecorator('LaborId', {
                            rules: [{ required: true, message: '请选择劳务' }]
                        })(
                            <Select
                                disabled={!!record}
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
                        {getFieldDecorator('EntId', {
                            rules: [{ required: true, message: '请选择企业' }]
                        })(
                            <Select
                                disabled={!!record}
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

                    <FormItem {...formItemLayout} label='X'>
                        {getFieldDecorator('XType', {
                            rules: [{ required: true, message: '请选择X' }]
                        })(
                            <CheckboxGroup options={[
                                { label: 'X-工资', value: 'XSalary' },
                                { label: 'X-社保', value: 'XSocialSecurity' },
                                { label: 'X-管理费', value: 'XManageExpense' },
                                { label: 'X-招聘费', value: 'XRecruitmentFee' },
                                { label: 'X-自离工资', value: 'XLeaveSalary' },
                                { label: 'X-其他', value: 'XOther' }
                            ]} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='是否禁用'>
                        {
                            getFieldDecorator('IsDisable', {
                                initialValue: 1
                            })(
                                <RadioGroup>
                                    <Radio value={1}>否</Radio>
                                    <Radio value={2}>是</Radio>
                                </RadioGroup>
                            )
                        }
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

ConfigInfo = Form.create({
    mapPropsToFields: props => {
        const { record } = props;
        if (record) {
            return createFormField(record);
        }
    }
})(ConfigInfo);

export default ConfigInfo;