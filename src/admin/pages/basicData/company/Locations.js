import React from 'react';
import {Input, Button, Icon} from 'antd';

const Location = ({Longitude, onLonChange, Latitude, onLatChange, onClockRangeChange, onBlur, ClockRange, handleDelete, disabled}) => {
    return (
        <div>
            <span>经度</span>
            <Input style={{width: '120px', marginLeft: 8, marginRight: 8}}
                   onChange={onLonChange} onBlur={onBlur} disabled={disabled}
                   value={Longitude}/>
            <span>纬度</span>
            <Input style={{width: '120px', marginLeft: 8, marginRight: 8}}
                   onChange={onLatChange} onBlur={onBlur} disabled={disabled}
                   value={Latitude}/>
            <span>范围</span>
            <Input style={{width: '80px', marginLeft: 8, marginRight: 8}}
                   onChange={onClockRangeChange} onBlur={onBlur} disabled={disabled}
                   value={ClockRange}/>
            <Icon type='delete' onClick={handleDelete}/>
        </div>
    );
};


export default class Locations extends React.Component {

    state = {};

    onChange = value => this.props.onChange ? this.props.onChange(value) : this.setState({value});

    handleChange = (index, type) => (event) => {
        let list = this.props.value || this.state.value;
        let value = [...list];
        switch (type) {
            case 'Latitude':
            case 'Longitude':
            case 'ClockRange':
                value[index][type] = event.target.value;
                break;
            case 'Delete':
                value.splice(index, 1);
                break;
            case 'Add':
                let i = {Latitude: 0, Longitude: 0, ClockRange: 0};
                i.Latitude = i.Latitude.toFixed(6);
                i.Longitude = i.Longitude.toFixed(6);
                i.ClockRange = i.ClockRange.toFixed(6);
                value.push(i);
                break;
        }
        this.onChange(value);
    };

    handleAdd = this.props.isMapInput ? this.props.addMapLocation : this.handleChange(undefined, 'Add');

    handleBlur = () => {
        if (!this.props.onBlurValidate && typeof this.props.onBlurValidate !== 'function') return;
        let list = this.props.value || this.state.value || [];
        let value = [...list];
        let errors;
        let hasCorrect = false;
        for (let item of value) {
            let ClockRange = this.validateLocation(item.ClockRange);
            let Latitude = this.validateLocation(item.Latitude);
            let Longitude = this.validateLocation(item.Longitude);
            if (ClockRange) {
                if (ClockRange.correct) {
                    hasCorrect = true;
                    item.ClockRange = ClockRange.correct;
                } else if (!errors) {
                    errors = ClockRange;
                }
            }

            if (Latitude) {
                if (Latitude.correct) {
                    hasCorrect = true;
                    item.Latitude = Latitude.correct;
                } else if (!errors) {
                    errors = Latitude;
                }
            }

            if (Longitude) {
                if (Longitude.correct) {
                    hasCorrect = true;
                    item.Longitude = Longitude.correct;
                } else if (!errors) {
                    errors = Longitude;
                }
            }
        }
        this.props.onBlurValidate(hasCorrect ? {value, errors} : {errors});
    };

    validateLocation = (value) => {
        let v = parseFloat(value);
        if (isNaN(v)) {
            return {
                validateStatus: "error",
                help: "请输入数字"
            };
        } else if (v.toFixed(6) !== value) {
            return {correct: v.toFixed(6)};
        }
    };

    render() {
        let value = this.props.value || this.state.value || [];

        return (
            <div>
                {value.map((item, index) => <Location
                    ClockRange={item.ClockRange || 0}
                    Latitude={item.Latitude || 0}
                    Longitude={item.Longitude || 0}
                    disabled={this.props.isMapInput}
                    onClockRangeChange={this.handleChange(index, 'ClockRange')}
                    onLatChange={this.handleChange(index, 'Latitude')}
                    onLonChange={this.handleChange(index, 'Longitude')}
                    onBlur={this.handleBlur}

                    handleDelete={this.handleChange(index, 'Delete')}
                    key={index}/>
                )}
                <Button size='small' icon='plus' onClick={this.handleAdd}>添加</Button>
            </div>
        );
    }

}