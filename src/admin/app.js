import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';
import history from 'ADMIN/routes/history';
import Loadable from "react-loadable";
import {lazyLoad} from 'web-react-base-component';
import zhCN from "antd/lib/locale-provider/zh_CN";
import {Provider} from 'mobx-react';
import {LocaleProvider, message} from 'antd';
import store from "ADMIN/store";
import 'ADMIN_ASSETS/less/framework.less';
import 'web-react-base-component/lib/index.css';

message.config({
    maxCount: 1
});
const Login = Loadable({
    loader: () => import('./pages/login'),
    loading: lazyLoad
});

const JFF = Loadable({
    loader: () => import('./pages'),
    loading: lazyLoad
});

ReactDOM.render((
    <LocaleProvider locale={zhCN}>
        <Provider {...store}>
            <Router history={history}>
                <Switch>
                    <Route path={'/login'} component={Login}/>
                    <Route path={'/'} component={JFF}/>     
                </Switch>
            </Router>
        </Provider>
    </LocaleProvider>
), document.getElementById('app'));

module.hot && module.hot.accept();