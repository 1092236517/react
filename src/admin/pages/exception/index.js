import React from 'react';
import {Exception} from 'web-react-base-component';

export default class extends React.Component {

    componentDidMount() {
        if (this.props.onException) {
            this.props.onException();
        }
    }

    render() {
        const {onException, ...prop} = this.props;
        return (
            <Exception {...prop} style={{minHeight: 500, height: '80%'}}/>
        );
    }
}
