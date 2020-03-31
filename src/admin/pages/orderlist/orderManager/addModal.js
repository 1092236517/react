import React from 'react';
import {Input, Modal, Select, Form, Spin, DatePicker, Radio, InputNumber, Row, Col, Icon, Button} from 'antd';
import {observer, inject} from 'mobx-react';
import 'ADMIN_ASSETS/less/pages/orderManager.less';
import { safeMul } from 'ADMIN_UTILS/math';
import moment from 'moment';

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const formItemLayoutSecond = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
};
const formItemLayoutAdd = {
    labelCol: {span: 4},
    wrapperCol: {span: 20}
};
@inject('orderStore', 'globalStore')
@observer
class AddForm extends React.Component {
    constructor(props) {
        super(props);
        this.props.form.getFieldDecorator('weekKeys', { initialValue: [1] });
        this.props.form.getFieldDecorator('agencyKeys', { initialValue: [1] });
        this.weekNum = 1;
        this.agencyNum = 1;
    }

    addWeek = () => {
        this.weekNum++;
        const { getFieldValue, setFieldsValue } = this.props.form;
        const weekKeys = getFieldValue('weekKeys');
        const nextWeekKeys = weekKeys.concat(this.weekNum);
        setFieldsValue({
            weekKeys: nextWeekKeys
        });
    }

    removeWeek = (k) => {
        let weekKeys = this.props.form.getFieldValue('weekKeys');
        if (weekKeys.length === 1) {
            return;
        }
        this.props.form.setFieldsValue({
            weekKeys: weekKeys.filter(key => key !== k)
        });
        this.weekNum--;
    };

    addAgency = () => {
        this.agencyNum++;
        const { getFieldValue, setFieldsValue } = this.props.form;
        const agencyKeys = getFieldValue('agencyKeys');
        const nextAgencyKeys = agencyKeys.concat(this.agencyNum);
        setFieldsValue({
            agencyKeys: nextAgencyKeys
        });
        setFieldsValue({
            [`MaxDays-${getFieldValue('agencyKeys').length - 1}`]: ''
        });
    }

    removeAgency = (k) => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        let agencyKeys = getFieldValue('agencyKeys');
        if (agencyKeys.length === 1) {
            return;
        }
        setFieldsValue({
            agencyKeys: agencyKeys.filter(key => key !== k)
        });
        setFieldsValue({
            [`MaxDays-${getFieldValue('agencyKeys').length}`]: '订单截止日期，'
        });
    };

    // C端借支标准
    getType = () => {
        const {getFieldDecorator} = this.props.form;
        return(
            <div className="week-price" >
                <Row>
                    <Col span={20} offset={1}>
                        <Form.Item label="C端借支标准：" labelCol={{span: 3}} wrapperCol={{span: 20}}>
                            {getFieldDecorator('OrderChargeTyp', {
                                initialValue: 6,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择C端借支标准'
                                    }
                                ]})(
                                <Radio.Group>
                                    <Radio value={5}>
                                        <span>每周最多发5天周薪&nbsp;</span>
                                    </Radio>
                                    <Radio value={6}>
                                        <span>每周最多发6天周薪&nbsp;</span>
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    }


    // 周借支费用
    getWeek = () => {
        const {getFieldDecorator, getFieldValue, setFieldsValue, resetFields} = this.props.form;
        const weekKeys = getFieldValue('weekKeys');
        return weekKeys.map((k, index) => {
            return(
                <div className="week-price" key={index}>
                    {weekKeys.length > 1 && <div className="circle">{index + 1}</div>}
                    <Row>
                        <Col span={9} offset={1}>
                            <Form.Item className="text-center" label="生效日期：" labelCol={{span: 6}} wrapperCol={{span: 13}}>
                                {
                                    getFieldDecorator(`BeginDt_${index + 1}`, {
                                        initialValue: index === 0 ? null : moment(getFieldValue(`EndDt_${index}`)).add(1, 'days'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择生效日期'
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            disabled={ index !== 0}
                                            disabledDate={(currentDate) =>
                                               getFieldValue(`EndDt_${index + 1}`) ?
                                                moment(currentDate).isAfter(moment(getFieldValue(`EndDt_${index + 1}`)).add(1, 'days')) || moment(currentDate).isBefore(moment().subtract(30, 'days')) :
                                                moment(currentDate).isBefore(moment().subtract(30, 'days'))
                                            }
                                            format="YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={7} style={{display: (index === weekKeys.length - 1) ? 'inline-block' : 'none'}}>
                            <Form.Item label={index === weekKeys.length - 1 ? "截止日期" : ''} labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {
                                    getFieldDecorator(`TerminateTyp_${index + 1}`, {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择截止日期'
                                            }
                                        ]
                                    })(
                                        <Radio.Group style={{marginRight: '10px'}}
                                            onChange={e => e.target.value === 1 && resetFields([`EndDt_${index + 1}`])}
                                        >
                                            <Radio.Button value={2}>员工转正</Radio.Button>
                                            <Radio.Button value={1}>选择日期</Radio.Button>
                                        </Radio.Group>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            {(getFieldValue(`TerminateTyp_${index + 1}`) === 1) &&
                            <Form.Item className="ml-3" label={!(index === weekKeys.length - 1) ? '截止日期' : ''} labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {
                                    getFieldDecorator(`EndDt_${index + 1}`, {
                                        initialValue: null,
                                        rules: [
                                            {
                                                required: getFieldValue(`TerminateTyp_${index + 1}`) === 1 ? true : false,
                                                message: '请选择截止日期'
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            disabled={index !== weekKeys.length - 1}
                                            disabledDate={(currentDate) =>
                                                getFieldValue(`BeginDt_${index + 1}`) ?
                                                    moment(currentDate).isBefore(moment(getFieldValue(`BeginDt_${index + 1}`))) :
                                                    moment(currentDate).isBefore(moment().subtract(30, 'days'))
                                            }
                                            format="YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Form.Item>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={1}>
                            <Form.Item label="计打卡" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                                {getFieldDecorator(`AdvancePayAmt_day_${index + 1}`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: "计打卡费用必填"
                                        }
                                    ]
                                })(
                                    <InputNumber placeholder="请输入" precision={2} min={0} maxLength={15}/>
                                )}
                                &nbsp;元/天
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={1}>
                            <Form.Item label="C端工资说明：" labelCol={{span: 3}} wrapperCol={{span: 20}}>
                                {
                                    getFieldDecorator(`Remark_${index + 1}`, {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写C端工资说明'
                                            }
                                        ]
                                    })(
                                        <Input.TextArea placeholder="请输入" />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            );
        });
    }

    // 中介费用
    getAgency = () => {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const agencyKeys = getFieldValue('agencyKeys');
        return agencyKeys.map((k, index) => {
            return (
                <div key={index}>
                    <Row className="agency-content" key={index}>
                        <Col>
                            <Form.Item>第&nbsp;
                                {
                                    getFieldDecorator(`MinDays-${index + 1}`, {
                                        initialValue: index ? (getFieldValue(`MaxDays-${index}`) === '' ? '' : getFieldValue(`MaxDays-${index}`) + 1) : 1,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写天数'
                                            }
                                        ]
                                    })(
                                        index === 0 ? <InputNumber precision={0.1} disabled={true}/> :
                                            <InputNumber precision={0.1} disabled={true} /* min={Number(getFieldValue(`MaxDays-${index}`) === undefined ? 0 : getFieldValue(`MaxDays-${index}`)) + 1} precision={0.1} *//>
                                    )
                                }&nbsp;天&nbsp;至&nbsp;
                            </Form.Item>
                            <Form.Item>{index !== agencyKeys.length - 1 && '第  '}
                                {
                                    getFieldDecorator(`MaxDays-${index + 1}`, {
                                        initialValue: index === agencyKeys.length - 1 ? '订单截止日期，' : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写天数'
                                            }
                                        ]
                                    })(
                                        index === agencyKeys.length - 1 ? <Input className="input-none" disabled={true}/> :
                                            <InputNumber placeholder="请输入" disabled={agencyKeys.length - 2 !== index} min={(getFieldValue(`MinDays-${index + 1}`)) || 0} maxLength={15} precision={0.1}/>
                                    )
                                }{index !== agencyKeys.length - 1 && '  天，'}
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator(`AgentFee-${index + 1}`, {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写价格'
                                            }
                                        ]
                                    })(
                                        <InputNumber placeholder="请输入" precision={2} min={0} maxLength={15}/>
                                    )
                                }&nbsp;元/天
                            </Form.Item>
                        </Col>
                    </Row>
                    {
                        agencyKeys.length - 1 === index && <Row>
                            {(agencyKeys.length - 1 === index) && <Button className="mr-16" type="primary" disabled={(getFieldValue(`MaxDays-${index}`)) === '' || agencyKeys.length > 9} onClick={this.addAgency} >
                                <Icon type="plus" />添加
                            </Button>}
                            {
                                (agencyKeys.length !== 1 && agencyKeys.length - 1 === index) && <Button className="delete" onClick={() => this.removeAgency(agencyKeys[agencyKeys.length - 1])}>
                                    <Icon type="delete" />删除
                                </Button>
                            }
                        </Row>
                    }
                </div>
            );
        });
    }

    componentDidMount() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err && err.PlatformSrvcFee) {
                err.PlatformSrvcFee.errors[0].message === "" && delete err.PlatformSrvcFee;
            }
            if(err && err.DaysNoMoney) {
                err.DaysNoMoney.errors[0].message === "" && delete err.DaysNoMoney;
            }
            if(err) {
                Object.keys(err).forEach(item => {
                    if(/^AdvancePayAmt/.test(item)) {
                        err[item].errors[0].message === "" && delete err[item];
                    }
                });
            }
           if(!err || Object.keys(err).length === 0) {
               let OrderWeekFeeList = values.weekKeys.map(num =>
                   ({
                       BeginDt: values[`BeginDt_${num}`] ? values[`BeginDt_${num}`].format('YYYY-MM-DD') : '',
                       TerminateTyp: Number(values[`TerminateTyp_${num}`]),
                       EndDt: values[`EndDt_${num}`] ? values[`EndDt_${num}`].format('YYYY-MM-DD') : '',
                       AdvancePayAmt: safeMul(values[`AdvancePayAmt_day_${num}`], 100),
                       Remark: values[`Remark_${num}`]
                   })
               );
               let OrderAgencyFee = values.agencyKeys.map(num =>
                   ({
                       MinDays: Number(values[`MinDays-${num}`]),
                       MaxDays: (typeof values[`MaxDays-${num}`]) === 'string' ? 0 : Number(values[`MaxDays-${num}`]),
                       AgentFee: safeMul(values[`AgentFee-${num}`], 100),
                       TerminateTyp: Number(values[`TerminateTyp_${values.weekKeys.length}`]),
                       BeginDt: values[`BeginDt_${values.weekKeys[0]}`] ? values[`BeginDt_${values.weekKeys[0]}`].format('YYYY-MM-DD') : '',
                       EndDt: values[`EndDt_${values.weekKeys.length}`] ? values[`EndDt_${values.weekKeys.length}`].format('YYYY-MM-DD') : ''
                   })
               );
               OrderAgencyFee.push({
                    DaysNoMoney: Number(values.DaysNoMoney), 
                    TerminateTyp: Number(values[`TerminateTyp_${values.weekKeys.length}`]),
                    BeginDt: values[`BeginDt_${values.weekKeys[0]}`] ? values[`BeginDt_${values.weekKeys[0]}`].format('YYYY-MM-DD') : '',
                    EndDt: values[`EndDt_${values.weekKeys.length}`] ? values[`EndDt_${values.weekKeys.length}`].format('YYYY-MM-DD') : ''});
               let OrderServiceFee = [{
                   PlatformSrvcFee: safeMul(values.PlatformSrvcFee, 100),
                   TerminateTyp: Number(values[`TerminateTyp_${values.weekKeys.length}`]),
                   BeginDt: values[`BeginDt_${values.weekKeys[0]}`] ? values[`BeginDt_${values.weekKeys[0]}`].format('YYYY-MM-DD') : '',
                   EndDt: values[`EndDt_${values.weekKeys.length}`] ? values[`EndDt_${values.weekKeys.length}`].format('YYYY-MM-DD') : ''
               }];
               this.props.orderStore.addOrder({
                   OrderChargeTyp: values.OrderChargeTyp,
                   EntId: values.EntId,
                   SrceSpId: values.SrceSpId,
                   TrgtSpId: values.TrgtSpId,
                   OrderDt: values.OrderDt.format('YYYY-MM-DD'),
                   ...{OrderWeekFeeList},
                   ...{OrderAgencyFee},
                   ...{OrderServiceFee},
                   Remark: values.Remark
               }, this.reset);
           }
        });
    }

    reset = () => {
        this.props.form.resetFields();
        this.props.form.getFieldDecorator('weekKeys', { initialValue: [1] });
        this.props.form.getFieldDecorator('agencyKeys', { initialValue: [1] });
        this.weekNum = 1;
        this.agencyNum = 1;
    }

    handleCancel = () => {
        this.props.form.resetFields();
        this.props.form.getFieldDecorator('weekKeys', { initialValue: [1] });
        this.props.form.getFieldDecorator('agencyKeys', { initialValue: [1] });
        this.weekNum = 1;
        this.agencyNum = 1;
        this.props.orderStore.setVisible('addVisible', false);
        this.props.orderStore.view.flag && this.props.orderStore.getList();
    }

    render() {
        const { agentList, companyList, laborList } = this.props.globalStore;
        const {getFieldValue, getFieldDecorator} = this.props.form;
        const weekKeys = getFieldValue('weekKeys');
        const {view} = this.props.orderStore;
        const {addVisible, modalLoading} = view;
        return(
            <Modal
                title="新增订单"
                visible={addVisible}
                width={980}
                maskClosable={false}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form className="order-add">
                        <Row>
                            <Col span={9} offset={1}>
                                <Form.Item className="text-center" label="选择企业" {...formItemLayout}>
                                    {
                                        getFieldDecorator('EntId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择企业'
                                                }
                                            ]     
                                        })(
                                            <Select
                                                showSearch
                                                allowClear={true}
                                                placeholder="请选择"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {companyList.map((item, index) => <Select.Option key={index} value={item.EntId}>{item.EntShortName}</Select.Option>)}
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label="选择劳务" {...formItemLayoutSecond}>
                                    {
                                        getFieldDecorator('TrgtSpId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择劳务'
                                                }
                                            ]
                                        })(
                                            <Select
                                                showSearch
                                                allowClear={true}
                                                placeholder="请选择"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {laborList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="row-second">
                            <Col span={9} offset={1}>
                                <Form.Item className="text-center" label="选择中介" {...formItemLayout}>
                                    {
                                        getFieldDecorator('SrceSpId')(
                                            <Select showSearch
                                                    allowClear={true}
                                                    placeholder="请选择"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {agentList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label="报价日期" {...formItemLayoutSecond}>
                                    {
                                        getFieldDecorator('OrderDt', {
                                            initialValue: moment(),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请填写报价日期'
                                                }
                                            ]
                                        })(
                                            <DatePicker
                                                disabledDate={(currentDate) => moment(currentDate).isAfter(moment()) || moment(currentDate).isBefore(moment().subtract(30, 'days'))}
                                            />
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        {this.getType()}
                        {this.getWeek()}
                        <Row className="line-second">
                            <Col span={20} offset={3}>
                                <Button className="ml-20 mr-16" type="primary" disabled={!getFieldValue(`EndDt_${weekKeys.length}`) || weekKeys.length > 9} onClick={this.addWeek}>
                                    <Icon type="plus" />添加
                                </Button>
                                {weekKeys.length !== 1 && <Button className="delete" onClick={() => this.removeWeek(weekKeys[weekKeys.length - 1])}>
                                    <Icon type="delete" />删除
                                </Button>}
                            </Col>
                        </Row>
                        <Row>
                            <div className="agency-title">
                                <span className="xing">*</span>中介费用：
                            </div>
                            <div className="agency-content">{this.getAgency()}</div>
                        </Row>
                        <div className="no-money">
                            <Form.Item labelCol={{span: 2}} wrapperCol={{span: 20}}>不足&nbsp;
                                {
                                    getFieldDecorator('DaysNoMoney', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写不足天数'
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    if(value <= 30) {
                                                        callback();
                                                    } else {
                                                        callback('');
                                                    }
                                                }
                                            }
                                        ]
                                    })(
                                        <InputNumber placeholder="请输入" min={1} maxLength={15} precision={0.1}/>
                                    )
                                }&nbsp;天，无费用。
                            </Form.Item>
                        </div>
                        <div className="plat-form">
                            <Form.Item label="平台费用：" labelCol={{span: 3}} wrapperCol={{span: 20}}>&nbsp;
                                {
                                    getFieldDecorator('PlatformSrvcFee', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写平台费用'
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    if(value >= 0 && value <= 20) {
                                                        callback();
                                                    } else {
                                                        callback('');
                                                    }
                                                }
                                            }
                                        ]
                                    })(
                                        <InputNumber placeholder="请输入" maxLength={15} min={0} precision={2}/>
                                    )
                                }&nbsp;元/笔。
                            </Form.Item>
                        </div>
                        <div className="plat-form">
                            <Form.Item label="备注" labelCol={{span: 3}} wrapperCol={{span: 20}}>
                                {
                                    getFieldDecorator('Remark')(
                                        <Input.TextArea placeholder="请输入"/>
                                    )
                                }
                            </Form.Item>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(AddForm);