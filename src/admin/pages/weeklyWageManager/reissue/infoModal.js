import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Button, Radio, InputNumber, message, DatePicker, Modal } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { weeklyWageCheckSingle, getUerInfoById } from 'ADMIN_SERVICE/ZXX_WeekBillGen';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import moment from 'moment';
import { safeMul } from 'ADMIN_UTILS/math';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { TextArea } = Input;

@observer
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
            window._czc.push(['_trackEvent', '周薪补发', '保存周薪补发', '周薪补发_Y结算']);
            //  表添加key
            fieldsValue.RecordID = fieldsValue.RecordID || new Date().getTime();

            let record = { ...fieldsValue };
            //  在职 过滤转正/离职日期
            if (record.WorkState == 1) {
                record.LeaveDate = undefined;
            }

            const { EnterpriseID, LaborID, SettleBeginDate, SettleEndDate, WeekSalaryType } = this.props;
            const { EntryDate, WorkState, LeaveDate, BaseAmount, CreditSubsidyAmt } = record;
            let reqParam = {
                ...record,
                BaseAmount: safeMul(BaseAmount, 100),
                CreditSubsidyAmt: WeekSalaryType !== 2 ? safeMul(CreditSubsidyAmt, 100) : 0,
                EntryDate: EntryDate.format('YYYY-MM-DD'),
                EnterpriseID,
                LaborID,
                OPType: 2,
                SettleBeginDate: SettleBeginDate.format('YYYY-MM-DD'),
                SettleEndDate: SettleEndDate.format('YYYY-MM-DD'),
                WorkState: WorkState * 1,
                LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
                WorkDayNum: -1,
                WeekSalaryType: WeekSalaryType || 1
            };

            delete reqParam['RecordID'];
            delete reqParam['Amount'];
            weeklyWageCheckSingle(reqParam).then((resData) => {
                let { BaseAmount, CreditSubsidyAmt, AgentAmount, PlatformAmount, UserAmount, Join, ...excludeAmount } = resData.Data;
                record = {
                    ...record,
                    ...excludeAmount,
                    BaseAmount: tableMoneyRender(BaseAmount),
                    CreditSubsidyAmt: tableMoneyRender(CreditSubsidyAmt),
                    Amount: tableMoneyRender(BaseAmount + CreditSubsidyAmt),
                    AgentAmount: tableMoneyRender(AgentAmount),
                    PlatformAmount: tableMoneyRender(PlatformAmount),
                    UserAmount: tableMoneyRender(UserAmount),
                    Join: Join
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
        const { setFieldsValue, getFieldValue } = this.props.form;
        // const data = this.props.getAmountDetail();
        let BaseAmount = getFieldValue('BaseAmount') ? getFieldValue('BaseAmount') : 0;
        let CreditSubsidyAmt = getFieldValue('CreditSubsidyAmt') ? getFieldValue('CreditSubsidyAmt') : 0;
        setFieldsValue({
            Amount: parseFloat(BaseAmount) + parseFloat(CreditSubsidyAmt)
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

        const { SettleBeginDate, SettleEndDate, WeekSalaryType } = this.props;
        let { EntryDate, WorkState, LeaveDate, Amount, UserName, IDCardNum, EmployeeNo, BaseAmount, CreditSubsidyAmt } = reqParam;
        CreditSubsidyAmt = WeekSalaryType !== 2 ? CreditSubsidyAmt : 0;
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
            BaseAmount: safeMul(BaseAmount, 100),
            CreditSubsidyAmt: safeMul(CreditSubsidyAmt, 100),
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
            delete reqParam['Amount'];
            weeklyWageCheckSingle(reqParam).then(({ Data }) => {
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

    searchByIdInput = async (e) => {
        const { EnterpriseID, LaborID } = { ...this.props };
        const { getFieldValue, setFieldsValue } = this.props.form;
        let param = {
            EnterID: EnterpriseID, IDCardNum: e.target.value, LaborID: LaborID
        };
        if (e.target.value && e.target.value.length === 18) {
            let resultData = await getUerInfoById(param);
            if (!getFieldValue('UserName') && resultData.Data.RealName) {
                setFieldsValue({
                    'UserName': resultData.Data.RealName
                });
            }
            if (!getFieldValue('EmployeeNo') && resultData.Data.WorkCardNo) {
                setFieldsValue({
                    'EmployeeNo': resultData.Data.WorkCardNo
                });
            }
            if (!getFieldValue('EntryDate') && resultData.Data.EntryDate) {
                setFieldsValue({
                    'EntryDate': moment(resultData.Data.EntryDate, 'YYYY-MM-DD')
                });
            }
        } else {
            setFieldsValue({
                'UserName': ''
            });
            setFieldsValue({
                'EmployeeNo': ''
            });
            setFieldsValue({
                'EntryDate': ''
            });
        }

    }
    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };

        const { getFieldDecorator } = this.props.form;
        const { WeekSalaryType } = this.props;
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
                            <Input maxLength={100} className='w-100' maxLength={18} onChange={this.searchByIdInput} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='姓名'>
                        {getFieldDecorator('UserName', {
                            rules: [{ required: true, message: '请输入姓名' }]
                        })(
                            <Input maxLength={10} placeholder='请输入' />
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
                        {getFieldDecorator('BaseAmount', {
                            rules: [{ required: true, message: '请填写补发金额' }]
                        })(
                            <InputNumber min={0} max={2000} precision={2} onKeyUp={this.handleAmout} className={'w-100 ' + this.state.amoutClass} placeholder='不包含信用金额' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='信用金额(元)'>
                        {getFieldDecorator('CreditSubsidyAmt', {
                            rules: [{ required: WeekSalaryType !== 2, message: '请填写信用金额' }]
                        })(
                            <InputNumber disabled={WeekSalaryType === 2} precision={2} onKeyUp={this.handleAmout} className={'w-100 ' + this.state.amoutClass} />
                        )}
                    </FormItem>


                    <FormItem {...formItemLayout} label='总补发金额(元)'>
                        {getFieldDecorator('Amount', {

                        })(
                            <InputNumber disabled={true} min={0} max={2000} precision={2} onChange={this.handleAmout} className={'w-100 ' + this.state.amoutClass} placeholder='系统自动计算' />
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
