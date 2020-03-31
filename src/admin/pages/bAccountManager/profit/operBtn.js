import React, { PureComponent, Fragment } from 'react';
import { Button, message, Tooltip } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { listInvoice } from 'ADMIN_SERVICE/ZXX_BaseData';
import { convertCentToThousandth } from 'web-react-base-utils';

const exportWord = (innerHtml) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>盈利报表对账单</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + innerHtml + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = '盈利报表对账单.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
};

const trStyle = { border: '1px solid black' };
const tdStyle = { border: '1px solid black', padding: '14px 0' };

export default class extends PureComponent {
    state = {
        expDataList: []
    }

    exportBill = async () => {
        const { checkedBillRows, BeginMo, EndMo, setCheckedBillRows } = this.props;
        
        if (!(BeginMo && EndMo && BeginMo.format('YYYY-MM') === EndMo.format('YYYY-MM'))) {
            message.info('请选择一个月的数据导出！');
            return;
        }

        if (checkedBillRows.length === 0) {
            message.info('请选择一条记录导出！');
            return;
        }
        window._czc.push(['_trackEvent', 'z盈利报表', '导出选中对账单', 'z盈利报表_Y结算']);
        const reqParam = {
            AuditSts: 2,
            EntId: undefined,
            InvoiceTyp: -9999,
            RecordIndex: 0,
            RecordSize: 10,
            TrgtSpId: undefined
        };

        const reqList = checkedBillRows.slice().map(({ EntId, TrgtSpId }) => {
            return listInvoice({
                ...reqParam,
                EntId,
                TrgtSpId
            });
        });

        try {
            const resDataList = await Promise.all(reqList);

            let expDataList = [];

            resDataList.forEach((resData, index) => {
                const { RecordCount, RecordList } = resData.Data;
                if (RecordCount === 0) {
                    throw new Error('查询开票信息失败！');
                }

                const { InvoiceTyp, TrgtCn, TaxpayerId, AccntBank, AccntNum, Address, TelPhone } = RecordList[0];
                const { WodaAgentAmt, OtherAgentAmt, WodaPlatformSrvcAmt, OtherPlatformSrvcAmt, SumProfit, WeeklyPaidAmt, RemainingSalary, ReturnFee, SumPay, SalaryPayer, BillExportSts, EntShortName, TrgtSpName } = checkedBillRows[index];


                expDataList.push({
                    BeginMo, EntShortName, TrgtSpName, InvoiceTyp, TrgtCn, TaxpayerId, AccntBank, AccntNum, Address, TelPhone,
                    AgentFee: convertCentToThousandth(WodaAgentAmt + OtherAgentAmt),
                    PlatFee: convertCentToThousandth(WodaPlatformSrvcAmt + OtherPlatformSrvcAmt),
                    SumProfit: convertCentToThousandth(SumProfit),
                    // 导出件导出的是中介费平台费，则空出周薪、月薪、返费处
                    WeekSalary: BillExportSts == 2 ? '' : convertCentToThousandth(WeeklyPaidAmt),
                    // 月薪是否劳务打款：是，则导出对账单存在月薪时月薪置为0
                    MonthSalary: BillExportSts == 2 ? '' : (SalaryPayer == 2 ? 0 : convertCentToThousandth(RemainingSalary)),
                    ReturnFee: BillExportSts == 2 ? '' : convertCentToThousandth(ReturnFee),
                    SumPay: BillExportSts == 2 ? '' : convertCentToThousandth(SumPay)
                });
            });

            this.setState({
                expDataList
            }, () => {
                const { innerHTML } = document.getElementById('expContent');
                exportWord(innerHTML);
                setCheckedBillRows([]);
            });
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    render() {
        const { exportX, exportBillX } = resId.bAccountManager.profit;
        const { exportProfit } = this.props;
        const { expDataList } = this.state;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportProfit(); window._czc.push(['_trackEvent', 'z盈利报表', '导出', 'z盈利报表_Y结算']); }}>导出</Button>)}
                {authority(exportBillX)(
                    <Fragment>
                        <Button className='ml-8' type='primary' onClick={this.exportBill}>导出选中对账单</Button>
                        <Tooltip title={
                            <Fragment>
                                <p>1.导出对账单的前提条件为所选月份为单个月份、有可用开票信息</p>
                                <p>2.到26号（包括26），可导出中介费、平台费、返费（平台返费且金额>0）</p>
                                <p>3.到26号（包括26）且该企业-劳务当月关账，可导出中介费、平台费、周月薪</p>
                                <p>4.如企业-劳务月薪为劳务发，导出的对账单月薪金额为0</p>
                            </Fragment>
                        }
                            placement='bottom'
                            className='ml-8' >
                            <a href='#'>帮助</a>
                        </Tooltip>
                    </Fragment>
                )}

                <div id='expContent' className='d-none'>
                    {
                        expDataList.map(({ InvoiceTyp, TrgtCn, TaxpayerId, AccntBank, AccntNum, Address, TelPhone, WodaAgentAmt, OtherAgentAmt, WodaPlatformSrvcAmt, OtherPlatformSrvcAmt, SumProfit, WeeklyPaidAmt, RemainingSalary, ReturnFee, SumPay, SalaryPayer, BillExportSts, EntShortName, TrgtSpName, BeginMo, AgentFee, PlatFee, WeekSalary,
                            MonthSalary }, index) => (
                                <div key={index} className='page'>
                                    <table
                                        style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
                                        <tbody>
                                            <tr style={trStyle}>
                                                <td colSpan={3} style={tdStyle}><h2>{TrgtSpName + ' ' + EntShortName}对账单</h2></td>
                                            </tr>

                                            <tr style={trStyle} >
                                                <td style={tdStyle}>企业</td>
                                                <td colSpan={2} style={tdStyle}>{EntShortName}</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>项目  --  月份</td>
                                                <td style={tdStyle}>{BeginMo.format('YYYY年MM月')}</td>
                                                <td style={tdStyle}>合计（单位：元）</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>中介费（单位：元）</td>
                                                <td style={tdStyle}>{AgentFee}</td>
                                                <td style={tdStyle}>{AgentFee}</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>平台费（单位：元）</td>
                                                <td style={tdStyle}>{PlatFee}</td>
                                                <td style={tdStyle}>{PlatFee}</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>合计（单位：元）</td>
                                                <td style={tdStyle}>{SumProfit}</td>
                                                <td style={tdStyle}>{SumProfit}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style={{ lineHeight: '28px' }}>&nbsp;</div>

                                    <table
                                        style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
                                        <tbody>
                                            <tr style={trStyle}>
                                                <td colSpan={3} style={tdStyle}><h2>{TrgtSpName + ' ' + EntShortName}对账单</h2></td>
                                            </tr>

                                            <tr style={trStyle} >
                                                <td style={tdStyle}>企业</td>
                                                <td colSpan={2} style={tdStyle}>{EntShortName}</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>项目  --  月份</td>
                                                <td style={tdStyle}>{BeginMo.clone().subtract(1, 'months').format('YYYY年MM月')}</td>
                                                <td style={tdStyle}>合计（单位：元）</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>周薪（单位：元）</td>
                                                <td style={tdStyle}>{WeekSalary}</td>
                                                <td style={tdStyle}>{WeekSalary}</td>
                                            </tr>

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>月薪（单位：元）</td>
                                                <td style={tdStyle}>{MonthSalary}</td>
                                                <td style={tdStyle}>{MonthSalary}</td>
                                            </tr>

                                            {
                                                Number(ReturnFee) != 0 &&
                                                <tr style={trStyle}>
                                                    <td style={tdStyle}>返费（单位：元）</td>
                                                    <td style={tdStyle}>{ReturnFee}</td>
                                                    <td style={tdStyle}>{ReturnFee}</td>
                                                </tr>
                                            }

                                            <tr style={trStyle}>
                                                <td style={tdStyle}>合计（单位：元）</td>
                                                <td style={tdStyle}>{SumPay}</td>
                                                <td style={tdStyle}>{SumPay}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style={{ lineHeight: '28px' }}>&nbsp;</div>

                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td width='25%'>劳务确认盖章</td>
                                                <td width='25%'>核准</td>
                                                <td width='25%'>财务复核</td>
                                                <td width='25%'>制单</td>
                                            </tr>

                                            <tr><td>&nbsp;</td></tr>

                                            <tr>
                                                <td>开票信息：</td>
                                                <td colSpan={3}>单位名称：{TrgtCn}</td>
                                            </tr>

                                            <tr>
                                                <td>开票类型：{{ 1: '普票', 2: '专票' }[InvoiceTyp]}</td>
                                                <td colSpan={3}>信用统一代码：{TaxpayerId}</td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td colSpan={3}>银行名称：{AccntBank}</td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td colSpan={3}>银行账号：{AccntNum}</td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td colSpan={3}>地址：{Address}</td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td colSpan={3}>电话：{TelPhone}</td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td colSpan={3}>扫描件等同于原件</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                    }
                </div>
            </div>
        );
    }
} 