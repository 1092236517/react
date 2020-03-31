import React, { Component } from 'react';
import { Form, Input, Button, Radio, InputNumber, message, DatePicker, Modal } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { reissueCheckSingle } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import moment from 'moment';
import { safeMul } from 'ADMIN_UTILS/math';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { TextArea } = Input;

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WorkState: '1',
            amoutClass: ''
        };
    }

    componentDidMount() {
        this.setState({
            WorkState: this.props.recordInfo ? this.props.recordInfo.WorkState : '1'
        });
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '补发返费周薪', '保存周薪补发', '补发返费周薪_N非结算']);
            //  表添加key
            fieldsValue.RecordID = fieldsValue.RecordID || new Date().getTime();

            let record = { ...fieldsValue };
            //  在职 过滤转正/离职日期
            if (record.WorkState == 1) {
                record.LeaveDate = undefined;
            }

            const { EnterpriseID, LaborID, SettleBeginDate, SettleEndDate } = this.props;
            const { EntryDate, WorkState, LeaveDate, Amount } = record;
            let reqParam = {
                ...record,
                Amount: safeMul(Amount, 100),
                EntryDate: EntryDate.format('YYYY-MM-DD'),
                EnterpriseID,
                LaborID,
                OPType: 2,
                SettleBeginDate: SettleBeginDate.format('YYYY-MM-DD'),
                SettleEndDate: SettleEndDate.format('YYYY-MM-DD'),
                WorkState: WorkState * 1,
                LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
                WorkDayNum: -1
            };

            delete reqParam['RecordID'];

            reissueCheckSingle(reqParam).then((resData) => {
                let { Amount, AgentAmount, ...excludeAmount } = resData.Data;
                record = {
                    ...record,
                    ...excludeAmount,
                    AgentAmount: tableMoneyRender(AgentAmount)
                };

                console.log(' infomodal record', record);

                this.props.editRecord(record);
                this.props.hideModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        });
    }

    handleWorkState = (e) => {
        this.setState({
            WorkState: e.target.value
        });
    }

    handleAmout = (amout) => {
        this.setState({
            amoutClass: amout > 1000 ? 'color-danger' : ''
        });
    }

    handleCompAgentFee = (e) => {
        const IsCaculateAgentFee = e.target.value;

        const { setFieldsValue, getFieldsValue } = this.props.form;
        const fieldsValue = getFieldsValue();

        let reqParam = { ...fieldsValue };

        //  在职 过滤转正/离职日期
        if (reqParam.WorkState == 1) {
            reqParam.LeaveDate = undefined;
        }

        const { SettleBeginDate, SettleEndDate } = this.props;
        const { EntryDate, WorkState, LeaveDate, Amount, UserName, IDCardNum, EmployeeNo } = reqParam;
        if (!UserName || !IDCardNum || !EmployeeNo || Amount == undefined || !WorkState) {
            setTimeout(() => {
                setFieldsValue({
                    IsCaculateAgentFee: undefined
                });
            }, 200);
            return;
        }
        reqParam = {
            ...reqParam,
            ...this.props,
            Amount: safeMul(Amount, 100),
            EntryDate: EntryDate.format('YYYY-MM-DD'),            
            OPType: 2,
            SettleBeginDate: SettleBeginDate.format('YYYY-MM-DD'),
            SettleEndDate: SettleEndDate.format('YYYY-MM-DD'),
            WorkState: WorkState * 1,
            LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
            //  此时form中数据还未更新 需手动携带
            IsCaculateAgentFee
        };

        if (IsCaculateAgentFee == 1) {
            //  后台计算
            reissueCheckSingle(reqParam).then(({ Data }) => {
                setFieldsValue({
                    AgentAmount: tableMoneyRender(Data.AgentAmount)
                });
            }).catch((err) => {
                setFieldsValue({
                    IsCaculateAgentFee: undefined
                });
                message.error(err.message);
                console.log(err);
            });
        } else {
            setFieldsValue({
                AgentAmount: '0.00'
            });
        }
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };

        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title='周薪补发'
                visible={true}
                footer={null}
                onCancel={this.props.hideModal}>
                <Form onSubmit={this.saveData}>
                    <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('RecordID')(
                            <Input maxLength={100} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='姓名'>
                        {getFieldDecorator('UserName', {
                            rules: [{ required: true, message: '请输入姓名' }]
                        })(
                            <Input maxLength={10} placeholder='请输入' />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='身份证号码'>
                        {getFieldDecorator('IDCardNum', {
                            rules: [{
                                required: true,
                                message: '请输入身份证号码'
                            }, {
                                pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                message: '请输入正确的18位身份证号'
                            }]
                        })(
                            <Input maxLength={100} className='w-100' maxLength={18} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='工号'>
                        {getFieldDecorator('EmployeeNo', {
                            rules: [{
                                required: true,
                                message: '请输入工号'
                            }]
                        })(
                            <Input maxLength={50} placeholder='请输入' />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='补发金额(元)'>
                        {getFieldDecorator('Amount', {
                            rules: [{ required: true, message: '请填写补发金额' }]
                        })(
                            <InputNumber min={0} max={2000} precision={2} onChange={this.handleAmout} className={'w-100 ' + this.state.amoutClass} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='入职日期'>
                        {getFieldDecorator('EntryDate', {
                            rules: [{ required: true, message: '请填写入职日期' }]
                        })(
                            <DatePicker allowClear={false} className='w-100' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='是否在职'>
                        {getFieldDecorator('WorkState', {
                            rules: [{ required: true, message: '请选择在职状态' }]
                        })(
                            <RadioGroup onChange={this.handleWorkState}>
                                <RadioButton value="1">在职</RadioButton>
                                <RadioButton value="2">离职</RadioButton>
                                <RadioButton value="3">转正</RadioButton>
                                <RadioButton value="6">自离</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>

                    {
                        ['2', '3', '6'].includes(this.state.WorkState) &&
                        <FormItem {...formItemLayout} label={{ 2: '离职日期', 3: '转正日期', 6: '自离日期' }[this.state.WorkState]}>
                            {getFieldDecorator('LeaveDate', {
                                initialValue: moment(),
                                rules: [{ required: true, message: '请填写日期' }]
                            })(
                                <DatePicker allowClear={false} className='w-100' />
                            )}
                        </FormItem>
                    }

                    <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('Remark', {
                            initialValue: ''
                        })(
                            <TextArea rows={3} maxLength={100} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='是否补发服务费'>
                        {getFieldDecorator('IsCaculateAgentFee', {
                            rules: [{ required: true, message: '请选择是否需要补发服务费' }]
                        })(
                            <RadioGroup onChange={this.handleCompAgentFee}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='服务费金额(元)'>
                        {getFieldDecorator('AgentAmount', {
                            rules: [{ required: true, message: '请填写服务费' }]
                        })(
                            <Input disabled className='w-100' />
                        )}
                    </FormItem>

                    <FormItem {...btnItemLayout}>
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button className='ml-8' onClick={this.props.hideModal}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

InfoModal = Form.create({
    mapPropsToFields: props => {
        const { recordInfo } = props;
        if (recordInfo) {
            return createFormField(recordInfo);
        }
    }
})(InfoModal);

export default InfoModal;