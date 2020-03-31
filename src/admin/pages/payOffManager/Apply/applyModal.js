import React from 'react';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, DatePicker, Form, Input, Modal, Row, Select, InputNumber } from 'antd';
import moment from 'moment';
import { CreateApply, UpdateApply } from 'ADMIN_SERVICE/ZXX_Remit';
import { message } from 'antd';
import { safeMul, safeDiv } from 'ADMIN_UTILS/math';
import { selectInputSearch } from 'ADMIN_UTILS';

const Option = Select.Option;
const FormItem = Form.Item;
const inputStyle = {
    border: '1px solid #aaa'
};
const formItemStyle = {
    marginBottom: 0
};

class ApplyModal extends React.Component {
    state = {
        isShowAgent: this.props.record && this.props.record.BillBatchTyp == 2
    }

    sumbitApply = () => {
        this.props.form.validateFields(async (err, fieldsValue) => {
            if (err) {
                return;
            }

            const { RemittanceAppId, SettleBeginDt, SettleEndDt, BillBatchId, TotAmt, BillBatchTyp, AgentAmt, EntId, SrceSpId, TrgtSpId, PlatformSrvcAmt } = fieldsValue;
            const callFunc = RemittanceAppId ? UpdateApply : CreateApply;
            let reqParam = {
                ...fieldsValue,
                BillBatchId: BillBatchId * 1,
                EntId: EntId * 1,
                SrceSpId: SrceSpId * 1,
                TrgtSpId: TrgtSpId * 1,
                SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : "",
                SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : "",
                ApplyId: RemittanceAppId,
                TotAmt: safeMul(TotAmt, 100),
                PlatformSrvcAmt: safeMul(PlatformSrvcAmt, 100),
                // 为周薪时才有中介费
                AgentAmt: BillBatchTyp === 2 ? safeMul(AgentAmt, 100) : 0
            };

            if (!RemittanceAppId) {
                delete reqParam.RemittanceAppId;
            }

            try {
                await callFunc(reqParam);
                message.success('保存成功！');
                const { startQuery, closeModal } = this.props;
                closeModal();
                startQuery();
            } catch (err) {
                message.error(err.message);
                console.log(err);
            }
        });
    }

    upDateSettleDate = (which, date) => {
        if (date == null) {
            return;
        }

        const { form: { setFieldsValue } } = this.props;
        let dateC = date.clone();
        if (which == 'start') {
            dateC.add(6, 'days');
            setFieldsValue({
                SettleEndDt: dateC
            });
        } else {
            dateC.subtract(6, 'days');
            setFieldsValue({
                SettleBeginDt: dateC
            });
        }
    }

    handleBatchTypeChange = (type) => {
        const { form: { setFieldsValue } } = this.props;
        if (type == 2) {
            setFieldsValue({
                SettleBeginDt: moment().subtract(moment().day() + 7 + (moment().day() <= 3 ? 7 : 0), 'days'),
                SettleEndDt: moment().subtract(moment().day() - 6 + 7 + (moment().day() <= 3 ? 7 : 0), 'days')
            });
        }

        if (type == 1) {
            setFieldsValue({
                SettleBeginDt: undefined,
                SettleEndDt: undefined,
                AgentAmt: 0
            });
        }

        this.setState({
            isShowAgent: type == 2
        });
    }

    render() {
        const {
            form: {
                getFieldDecorator, getFieldValue
            },
            closeModal, record, agentList, companyList, laborList
        } = this.props;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
        const { isShowAgent } = this.state;

        return (
            <Modal
                title={record ? '修改' : '新增'}
                width={600}
                visible={true}
                onOk={this.sumbitApply}
                onCancel={closeModal}>
                <Form>
                    <Row>
                        <Col span={0} className='d-none'>
                            {
                                getFieldDecorator('RemittanceAppId')(<Input />)
                            }
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="发薪类别" style={formItemStyle}>
                                {
                                    getFieldDecorator('BillBatchTyp', {
                                        rules: [{
                                            required: true, message: "发薪类别必填"
                                        }]
                                    })(
                                        <Select
                                            onChange={this.handleBatchTypeChange}
                                            placeholder="请选择" >
                                            <Option value={1}>月薪</Option>
                                            <Option value={2}>周薪</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} >
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期" style={formItemStyle}>
                                {getFieldDecorator('SettleBeginDt', {
                                    rules: [{
                                        required: true, message: "发薪开始时间必填"
                                    }]
                                })(
                                    <DatePicker
                                        className='w-100'
                                        allowClear={false}
                                        onChange={getFieldValue('BillBatchTyp') == 2 ? this.upDateSettleDate.bind(this, 'start') : null}
                                        disabledDate={
                                            getFieldValue('BillBatchTyp') == 2
                                                ? (currentDate) => {
                                                    return (
                                                        currentDate &&
                                                        (currentDate.day() != 0 || currentDate.isAfter(moment().subtract(moment().day() + 7 + (moment().day() <= 3 ? 7 : 0), 'days'), 'days'))
                                                    );
                                                }
                                                : (startValue) => {
                                                    const endValue = getFieldValue('SettleEndDt');
                                                    if (!startValue || !endValue) {
                                                        return false;
                                                    }
                                                    return startValue.isAfter(endValue, 'day');
                                                }
                                        }
                                    />)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false} style={formItemStyle}>
                                {
                                    getFieldDecorator('SettleEndDt', {
                                        rules: [{
                                            required: true, message: "发薪结束时间必填"
                                        }]
                                    })(
                                        <DatePicker
                                            className='w-100'
                                            allowClear={false}
                                            onChange={getFieldValue('BillBatchTyp') == 2 ? this.upDateSettleDate.bind(this, 'end') : null}
                                            disabledDate={
                                                getFieldValue('BillBatchTyp') == 2
                                                    ? (currentDate) => {
                                                        return (
                                                            currentDate &&
                                                            (currentDate.day() != 6 || currentDate.isAfter(moment().subtract(moment().day() - 6 + 7 + (moment().day() <= 3 ? 7 : 0), 'days'), 'days'))
                                                        );
                                                    }
                                                    : (endValue) => {
                                                        const startValue = getFieldValue('SettleBeginDt');
                                                        if (!endValue || !startValue) {
                                                            return false;
                                                        }
                                                        return endValue.isBefore(startValue, 'day');
                                                    }
                                            }
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="批次号" style={formItemStyle}>
                                {
                                    getFieldDecorator('BillBatchId', {
                                        rules: [{
                                            required: true, message: "批次号必填"
                                        }, {
                                            pattern: /^\d+$/, message: '请输入正确的批次号'
                                        }]
                                    })(
                                        <Input placeholder="请输入" maxLength={15} />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="企业" style={formItemStyle}>
                                {getFieldDecorator('EntId', {
                                    rules: [{
                                        required: true, message: "企业必选"
                                    }]
                                })(
                                    <Select showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={selectInputSearch}>
                                        {
                                            companyList.map((item, index) => (<Option key={index} value={item.EntId}>{item.EntShortName}</Option>))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="劳务" style={formItemStyle}>
                                {getFieldDecorator('TrgtSpId', {
                                    rules: [{
                                        required: true, message: "劳务必选"
                                    }]
                                })(
                                    <Select showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={selectInputSearch} >
                                        {
                                            laborList.map((item, index) => (<Option key={index} value={item.SpId}>{item.SpShortName}</Option>))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="中介" style={formItemStyle}>
                                {getFieldDecorator('SrceSpId', {
                                    rules: [{
                                        required: true, message: "中介必选"
                                    }]
                                })(
                                    <Select showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={selectInputSearch} >
                                        {
                                            agentList.map((item, index) => (<Option key={index} value={item.SpId}>{item.SpShortName}</Option>))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="总人数" style={formItemStyle}>
                                {getFieldDecorator('TotCnt', {
                                    rules: [{
                                        required: true, message: "总人数必填"
                                    }]
                                })(<InputNumber precision={0} placeholder="请输入" min={0} maxLength={15} className='w-100' style={inputStyle} />)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="会员金额" style={formItemStyle}>
                                {getFieldDecorator('TotAmt', {
                                    rules: [{
                                        required: true, message: "会员金额必填"
                                    }]
                                })(<InputNumber precision={2} placeholder="请输入" min={0} maxLength={15} className='w-100' style={inputStyle} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {
                            isShowAgent &&
                            <Col span={24}>
                                <FormItem {...formItemLayout} label="中介费用" style={formItemStyle}>
                                    {getFieldDecorator('AgentAmt', {
                                        rules: [{
                                            required: true, message: "中介费用必填"
                                        }]
                                    })(<InputNumber precision={2} min={0} maxLength={15} className='w-100' style={inputStyle} />)}
                                </FormItem>
                            </Col>
                        }

                        <Col span={24}>
                            <FormItem {...formItemLayout} label="平台费用" style={formItemStyle}>
                                {getFieldDecorator('PlatformSrvcAmt', {
                                    rules: [{
                                        required: true, message: "平台费用必填"
                                    }]
                                })(<InputNumber precision={2} placeholder="请输入" min={0} maxLength={15} className='w-100' style={inputStyle} />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => {
        const { record } = props;
        if (!record) {
            return null;
        }
        const { TotAmt, AgentAmt, PlatformSrvcAmt, SettleBeginDt, SettleEndDt } = record;
        return createFormField({
            ...record,
            TotAmt: safeDiv(TotAmt, 100),
            AgentAmt: safeDiv(AgentAmt, 100),
            PlatformSrvcAmt: safeDiv(PlatformSrvcAmt, 100),
            SettleBeginDt: moment(SettleBeginDt),
            SettleEndDt: moment(SettleEndDt)
        });
    }
})(ApplyModal);
