import React, { Component, Fragment } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';

export default class extends Component {
    getOriginByTitle = (title) => {
        const { chartData } = this.props;
        let originData;
        chartData.some((item) => {
            if (item.StrTime == title) {
                originData = item;
                return true;
            }
        });
        return originData;
    }

    render() {
        const scale = {
            Count: {
                alias: '人数（单位:千人）',
                formatter: val => `${parseInt(val / 1000, 10)}`
            },
            WeeklySalaryTotal: {
                alias: '周薪总额（单位:百万元）',
                formatter: val => `${parseInt(val / 1000000, 10)}`
            },
            GrowthRate: {
                alias: '增长率',
                formatter: val => `${val}%`
            }
        };
        const { chartData, CycleTyp } = this.props;
        const dv = new DataSet.View().source(chartData);
        dv.transform({
            type: 'fold',
            fields: ['OnWorkCount', 'WeekerCount', 'RelationCount'],
            key: 'type',
            value: 'Count'
        });

        return (
            <Fragment>
                <div className='w-100'>
                    <Chart
                        forceFit={true}
                        height={window.innerHeight - 350}
                        padding={[30, 60, 50, 60]}
                        data={dv}
                        scale={scale}
                        onTooltipChange={(ev) => {
                            //  在职人数、周薪人数、领取比例、增长率、周薪总额
                            const { title } = ev.items[0];
                            const originData = this.getOriginByTitle(CycleTyp == 2 ? title.replace(/-/g, '/') : title);
                            if (!originData) {
                                return;
                            }
                            const { OnWorkCount, WeekerCount, ReceiveRate, GrowthRate, WeeklySalaryTotal, RelationCount } = originData;
                            ev.items.length = 0;
                            const baseItem = {
                                title,
                                marker: true
                            };

                            ev.items.push(
                                {
                                    ...baseItem,
                                    name: '在职人数',
                                    value: `${OnWorkCount}人`,
                                    color: '#F04864'
                                }, {
                                    ...baseItem,
                                    name: '周薪人数',
                                    value: `${WeekerCount}人`,
                                    color: '#2FC25B'
                                }, {
                                    ...baseItem,
                                    name: '领取比率',
                                    value: `${(ReceiveRate * 100).toFixed(2)}%`,
                                    color: '#1890FF'
                                }, {
                                    ...baseItem,
                                    name: '增长率',
                                    value: `${(GrowthRate * 100).toFixed(2)}%`,
                                    color: '#1890FF'
                                }, {
                                    ...baseItem,
                                    name: '周薪总额',
                                    value: `${tableMoneyRender(WeeklySalaryTotal)}元`,
                                    color: '#74BCFF'
                                }, {
                                    ...baseItem,
                                    name: '有关系人数',
                                    value: `${RelationCount}人`,
                                    color: '#85138f'
                                });

                        }} >

                        <Axis name='StrTime' title={false} label={{ offset: 10 }} />
                        <Axis name='Count' title={{ offset: 20 }} position='left' label={{ offset: 35, rotate: 30 }} />
                        <Axis name='WeeklySalaryTotal' title={{ offset: 20 }} visible={true} position='right' label={{ offset: 35, rotate: 30 }} />
                        <Tooltip crosshairs={{ type: 'y' }} />
                        <Geom type='interval' position='StrTime*WeeklySalaryTotal' color='#74BCFF' />
                        <Geom type='line' position='StrTime*Count' size={2} color={['type', '#F04864-#2FC25B-#85138f']} shape='smooth' />
                        <Geom type='point' position='StrTime*Count' size={4} color={['type', '#F04864-#2FC25B-#85138f']} shape='circle' />
                    </Chart>
                </div>
                <div className='text-center chart-legend'>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#2FC25B' }}></span>
                    <span>周薪人数</span>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#F04864' }}></span>
                    <span>在职人数</span>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#74BCFF' }}></span>
                    <span>周薪总额</span>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#85138f' }}></span>
                    <span>有关系人数</span>
                </div>
            </Fragment>
        );
    }
}