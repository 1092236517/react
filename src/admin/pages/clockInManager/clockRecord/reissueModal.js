import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, Modal, Radio } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

const timeRange = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

@observer
class ReissueModal extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            this.props.clockInMagStore.reissueClock(fieldsValue);
            window._czc.push(['_trackEvent', '打卡记录管理', '保存补卡', '打卡记录管理_Y结算']);
        });
    }

    hideModal = () => {
        this.props.clockInMagStore.setVisible('modalReissuteClockVisible', false);
    }

    getInDisableDate = (pValue) => {
        let today = moment();
        if (!pValue) {
            return true;
        }

        if (today.day() <= 3) {
            // 如果今天是周三前（含周三），补卡选择的日期往前最多能选到上周，以及本周到今天（周日是一周的开始）
            if (pValue.isBefore(today, 'days')
                && pValue.clone().add(8 + today.day(), 'days').isAfter(today, 'days')) {
                return false;
            }
        }

        if (today.day() > 3) {
            //  如果今天是周四及之后，补卡选择的日期只能选本周直到今天
            if (pValue.isBefore(today, 'days')
                && pValue.clone().add(1 + today.day(), 'days').isAfter(today, 'days')) {
                return false;
            }
        }
        return true;
    }

    getOutDisableDate = (inDate, pValue) => {
        if (!inDate || !pValue) {
            return true;
        }

        //  同一天 过
        if (inDate.isSame(pValue, 'day')) {
            return false;
        }

        //  inDate + 12h 到了第二天，第二天过
        if (inDate.clone().add(12, 'hours').isSame(pValue, 'day')) {
            return false;
        }

        return true;
    }

    getOutDisableTime = (inDate, pValue) => {
        //  新的时间判断
        //  若上班卡在  上午， 则下班卡的时间范围为 [当前时间，当天24点前]
        //  若上班卡在  下午， 则下班卡的时间范围为 [当前时间 ，第二天12点前]
        if (pValue == undefined) {
            pValue = inDate.clone();
        }
        let disabledHours = [];
        let disabledMinutes = [];
        let disabledSeconds = [];

        let oldHour = inDate.hour();
        let oldMinite = inDate.minute();
        let oldSecond = inDate.second();

        let showHour = pValue.hour();
        let showMinute = pValue.minute();
        let showSecond = pValue.second();

        if (inDate.isSame(pValue, 'day')) {
            //  同一天
            disabledHours = [...timeRange(0, oldHour)];

            if (oldHour == showHour) {
                disabledMinutes = timeRange(0, oldMinite);
                if (oldMinite == showMinute) {
                    disabledSeconds = timeRange(0, oldSecond);
                }
            }

        } else {
            //  不是同一天
            disabledHours = timeRange(12, 24);
        }

        //  跟当前时间再做比较
        if (moment().isSame(pValue, 'day')) {
            let nowHour = moment().hour();
            let nowMinute = moment().minute();
            let nowSecond = moment().second();

            disabledHours = [...disabledHours, ...timeRange(nowHour + 1, 24)];
            if (nowHour == showHour) {
                disabledMinutes = [...disabledMinutes, ...timeRange(nowMinute + 1, 60)];
                if (nowMinute == showMinute) {
                    disabledSeconds = [...disabledSeconds, ...timeRange(nowSecond + 1, 60)];
                }
            }
        }
        return {
            disabledHours: () => disabledHours,
            disabledMinutes: () => disabledMinutes,
            disabledSeconds: () => disabledSeconds
        };
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const btnItemLayout = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } } };

        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        const {
            getEntByWorkCard,
            view: {
                entByWorkCard
            }
        } = this.props.clockInMagStore;

        return (
            <Modal
                title='补卡'
                visible={true}
                footer={null}
                onCancel={this.hideModal}>
                <Form onSubmit={this.saveData}>
                    <FormItem {...formItemLayout} label='工牌号码'>
                        {getFieldDecorator('WorkCardNo', {
                            rules: [{ required: true, message: '请输入工牌号码' }]
                        })(
                            <Input placeholder='请输入' onBlur={getEntByWorkCard} maxLength={20} />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='企业名称'>
                        {getFieldDecorator('EntShortName', {
                            initialValue: entByWorkCard.length == 1 ? entByWorkCard[0].EntShortName : undefined,
                            rules: [{ required: true, message: '请选择企业' }]
                        })(
                            <RadioGroup>
                                {
                                    entByWorkCard.map((ent, index) => (
                                        <Radio key={index} value={ent.EntShortName}>{ent.EntShortName}</Radio>)
                                    )
                                }
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='上班时间'>
                        {getFieldDecorator('ClockInDt', {
                            rules: [{ required: true, message: '请填写上班时间' }]
                        })(
                            <DatePicker
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                                disabledDate={this.getInDisableDate}
                                onOk={() => {
                                    setFieldsValue({
                                        ClockOutDt: undefined
                                    });
                                }}
                                allowClear={false}
                                className='w-100' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='下班时间'>
                        {getFieldDecorator('ClockOutDt', {
                            rules: [{ required: true, message: '请填写下班时间' }]
                        })(
                            <DatePicker
                                showTime
                                format='YYYY-MM-DD HH:mm:ss'
                                disabledDate={this.getOutDisableDate.bind(this, getFieldValue('ClockInDt'))}
                                disabledTime={this.getOutDisableTime.bind(this, getFieldValue('ClockInDt'))}
                                allowClear={false}
                                className='w-100' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='备注'>
                        {getFieldDecorator('Remark')(
                            <TextArea rows={3} maxLength={100} />
                        )}
                    </FormItem>

                    <FormItem {...btnItemLayout}>
                        <Button type="primary" htmlType="submit" >确定</Button>
                        <Button className='ml-8' onClick={this.hideModal}>取消</Button>
                    </FormItem>
                </Form>

            </Modal>


        );
    }
}

ReissueModal = Form.create()(ReissueModal);

export default ReissueModal;