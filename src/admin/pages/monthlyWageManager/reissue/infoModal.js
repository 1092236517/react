import React, { Component } from 'react';
import { Form, Input, Button, Radio, InputNumber, message, DatePicker, Modal, Select } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { monthlyWageCheckSingle } from 'ADMIN_SERVICE/ZXX_MonthBillGen';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import moment from 'moment';
import { selectInputSearch } from 'ADMIN_UTILS';
import { safeMul, safeDiv } from 'ADMIN_UTILS/math';
import { getUerInfoById } from 'ADMIN_SERVICE/ZXX_MonthBillGen';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { TextArea } = Input;
const Option = Select.Option;
class RequestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WorkState: 1,
            amoutClass: '',
            NameList: [],
            NameListID: 0
        };
    }

    componentDidMount() {
        const { recordInfo } = this.props;
        if (recordInfo) {
            this.setState({
                WorkState: recordInfo.WorkState
            });
        }
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { EnterpriseID, LaborID, Month, SalaryType, updataForSixType, recordInfo, operType } = this.props;
            const { getFieldValue } = this.props.form;
            let NameListID = getFieldValue('NameListID');
            //  表添加key
            fieldsValue.RecordID = fieldsValue.RecordID || new Date().getTime();

            let record = { ...fieldsValue };

            //  在职 过滤转正/离职日期
            if (record.WorkState == 1) {
                record.LeaveDate = undefined;
            }


            const { EntryDate, WorkState, LeaveDate, Amount, CloseMonth, WorkHours } = record;

            let reqParam = {
                ...record,
                Amount: safeMul(Amount, 100),
                EntryDate: EntryDate.format('YYYY-MM-DD'),
                EnterpriseID,
                LaborID,
                OPType: 2,
                Month: Month ? Month.format('YYYY-MM') : '',
                WorkState,
                LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
                SalaryType,
                CloseMonth: CloseMonth ? CloseMonth.format('YYYY-MM') : '',
                WorkHours: WorkHours ? safeMul(WorkHours, 100) : -1,
                NameListID: NameListID ? NameListID : 0
            };

            delete reqParam['RecordID'];

            monthlyWageCheckSingle(reqParam).then((resData) => {
                let { Amount, WorkHours, ...excludeAmount } = resData.Data;
                record = {
                    ...record,
                    ...excludeAmount,
                    Amount2: tableMoneyRender(Amount),
                    SalaryType,
                    WorkHours: WorkHours == -1 ? undefined : safeDiv(WorkHours, 100)
                };
                record.NameListID = NameListID ? NameListID : 0;
                if (SalaryType === 6 && operType === 'import') {
                    updataForSixType(record, recordInfo.Number);
                } else {
                    this.props.editRecord(record);
                }
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
            amoutClass: amout > 8000 ? 'color-danger' : ''
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

        const { Month } = this.props;
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
            Month: Month ? Month.format('YYYY-MM') : '',
            WorkState: WorkState * 1,
            LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
            //  此时form中数据还未更新 需手动携带
            IsCaculateAgentFee
        };

        if (IsCaculateAgentFee == 1) {
            //  后台计算
            monthlyWageCheckSingle(reqParam).then(({ Data }) => {
                setFieldsValue({
                    AgentAmount: tableMoneyRender(Data.RemainingAgentAmount)
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
            this.setState({
                NameList: resultData.Data.NameList || []
            });
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
    InterviewDateChange = async (value) => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        const { NameList } = this.state;
        let current = NameList.find((item) => {
            return item.RecordID === value;
        });

        setFieldsValue({
            Profession: current.WorkClass,
            NameListID: current.RecordID
        });
    }
    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };

        const { fromJump, form: { getFieldDecorator, getFieldValue }, SalaryType, modalShow } = this.props;
        const { NameList } = this.state;
        return (

            <Modal
                visible={modalShow}
                title='月薪补发'
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
                            <Input placeholder='请输入' maxLength={18} disabled={fromJump} onChange={this.searchByIdInput} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='姓名'>
                        {getFieldDecorator('UserName', {
                            rules: [{ required: true, message: '请输入姓名' }]
                        })(
                            <Input placeholder='请输入' maxLength={10} disabled={fromJump} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='工号'>
                        {getFieldDecorator('EmployeeNo', {
                            rules: [{ required: true, message: '请填写工号' }]
                        })(
                            <Input placeholder='请输入' maxLength={50} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='面试日期'>
                        {getFieldDecorator('InterviewDate')(
                            <Select
                                onChange={this.InterviewDateChange}
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch>
                                {
                                    NameList.map((item, index) => {
                                        return <Option key={index} value={item.RecordID}>{item.IntvDate}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='工种'>
                        {getFieldDecorator('Profession')(
                            <Input placeholder='工种' maxLength={50} disabled={true} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='实发工资(元)'>
                        {getFieldDecorator('Amount', {
                            rules: [{ required: true, message: '请填写实发工资' }]
                        })(
                            <InputNumber min={0} max={10000} precision={2} onChange={this.handleAmout} className={'w-100 ' + this.state.amoutClass} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='入职日期'>
                        {getFieldDecorator('EntryDate', {
                            rules: [{ required: true, message: '请填写入职日期' }]
                        })(
                            <DatePicker allowClear={false} className='w-100' disabled={fromJump} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='是否在职'>
                        {getFieldDecorator('WorkState', {
                            initialValue: 1,
                            rules: [{ required: true, message: '请选择在职状态' }]
                        })(
                            <RadioGroup onChange={this.handleWorkState} disabled={fromJump}>
                                <RadioButton value={1}>在职</RadioButton>
                                <RadioButton value={2}>离职</RadioButton>
                                <RadioButton value={3}>转正</RadioButton>
                                <RadioButton value={6}>自离</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='出勤小时数'>
                        {getFieldDecorator('WorkHours')(
                            <InputNumber min={0} max={2000} precision={2} className='w-100' />
                        )}
                    </FormItem>
                    {
                        [2, 3, 6].includes(getFieldValue('WorkState')) &&
                        <FormItem {...formItemLayout} label={{ 2: '离职日期', 3: '转正日期', 6: '自离日期' }[getFieldValue('WorkState')]}>
                            {getFieldDecorator('LeaveDate', {
                                initialValue: moment(),
                                rules: [{ required: true, message: '请填写日期' }]
                            })(
                                <DatePicker allowClear={false} className='w-100' format="YYYY-MM-DD" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    }

                    {
                        SalaryType == 6 &&
                        <FormItem {...formItemLayout} label='发生月份'>
                            {getFieldDecorator('CloseMonth', {
                                rules: [{ required: true, message: '请填写发生月份' }]
                            })(
                                <DatePicker.MonthPicker allowClear={false} className='w-100' />
                            )}
                        </FormItem>
                    }

                    <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('Remark', {
                            rules: [{ required: SalaryType == 6, message: '当前月薪类型为补发，请填写备注' }]
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
                        <Button type="primary" htmlType="submit" >确定</Button>
                        <Button className='ml-8' onClick={this.props.hideModal}>取消</Button>
                    </FormItem>
                    <div style={{ display: 'none' }}>
                        <FormItem {...formItemLayout} label='不需要显示只是记录值'>
                            {getFieldDecorator('NameListID')(
                                <InputNumber />
                            )}
                        </FormItem>
                    </div>
                </Form>

            </Modal>


        );
    }
}

RequestForm = Form.create({
    mapPropsToFields: props => {
        const { recordInfo } = props;
        if (recordInfo) {
            return createFormField(recordInfo);
        }
    }
})(RequestForm);

export default RequestForm;