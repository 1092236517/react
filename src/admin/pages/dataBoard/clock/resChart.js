import React, { Component, Fragment } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';

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
            }
        };
        const { chartData, CycleTyp } = this.props;
        const dv = new DataSet.View().source(chartData);
        dv.transform({
            type: 'fold',
            fields: ['ValidPersonCount', 'FullPersonCount'],
            key: 'type',
            value: 'Count'
        });

        return (
            <Fragment>
                <div className='w-100'>
                    <Chart
                        forceFit={true}
                        height={window.innerHeight - 350}
                        padding={[30, 20, 50, 60]}
                        data={dv}
                        scale={scale}
                        onTooltipChange={(ev) => {
                            //  有效打卡人数、全部打卡人数
                            const { title } = ev.items[0];
                            const originData = this.getOriginByTitle(CycleTyp == 1 ? title.replace(/-/g, '/') : title);
                            if (!originData) {
                                return;
                            }
                            const { ValidPersonCount, FullPersonCount, ValidRate, FullGrowthRate } = originData;
                            ev.items.length = 0;
                            const baseItem = {
                                title,
                                marker: true
                            };

                            ev.items.push(
                                {
                                    ...baseItem,
                                    name: '总打卡人数',
                                    value: `${FullPersonCount}人`,
                                    color: '#2FC25B'
                                }, {
                                    ...baseItem,
                                    name: '有效打卡人数',
                                    value: `${ValidPersonCount}人`,
                                    color: '#F04864'
                                }, {
                                    ...baseItem,
                                    name: '有效打卡比例',
                                    value: `${(ValidRate * 100).toFixed(2)}%`,
                                    color: '#1890FF'
                                }, {
                                    ...baseItem,
                                    name: '增长率',
                                    value: `${(FullGrowthRate * 100).toFixed(2)}%`,
                                    color: '#1890FF'
                                });

                        }} >
                        <Axis name='StrTime' title={false} label={{ offset: 10 }} />
                        <Axis title={false} name='Count' label={{ offset: 10, rotate: 30 }} title={{ offset: 30 }} />
                        <Tooltip crosshairs={{ type: 'y' }} />
                        <Geom type='line' position='StrTime*Count' size={2} color={['type', '#F04864-#2FC25B']} shape='smooth' />
                        <Geom type='point' position='StrTime*Count' size={4} color={['type', '#F04864-#2FC25B']} shape='circle' />
                    </Chart>
                </div>

                <div className='text-center chart-legend'>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#2FC25B' }}></span>
                    <span>总打卡人数</span>
                    <span className='chart-legend-tag' style={{ backgroundColor: '#F04864' }}></span>
                    <span>有效打卡人数</span>
                </div>
            </Fragment>
        );
    }
}