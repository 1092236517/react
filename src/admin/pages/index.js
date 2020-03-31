import React from "react";
import { homeStore } from "ADMIN/store";
import { inject, observer } from "mobx-react";
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from "react-loadable";
import { lazyLoad } from 'web-react-base-component';
import ExceptionPage from './exception';
import basename from 'ADMIN_CONFIG/basename';

const { tabSave, tabOut } = homeStore;

const Home = Loadable({
    loader: () => import('./Home'),
    loading: lazyLoad
});

@inject('authStore')
@observer
export default class extends React.Component {

    componentDidMount() {


        /** 页面埋点用 **/
        var cnzz_s_tag = document.createElement('script');
        var AccountId = '';
        cnzz_s_tag.type = 'text/javascript';
        cnzz_s_tag.async = true;
        cnzz_s_tag.charset = 'utf-8';
        if (process.env.NODE_ENV === 'production') {
            cnzz_s_tag.src = 'https://v1.cnzz.com/z_stat.php?id=1278522253&web_id=1278522253&async=1';
            AccountId = '1278522253';
        } else {
            cnzz_s_tag.src = 'https://s4.cnzz.com/z_stat.php?id=1278292479&web_id=1278292479&async=1';
            AccountId = '1278292479';
        }
        var root_s = document.getElementsByTagName('script')[0];
        root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
        window._czc = [];
        window._czc.push(['_setAutoPageview', false]);
        window._czc.push(['_setAccount', AccountId]);
        /** 页面埋点用 **/
        const homeRoute = homeStore.homeRoute;
        const pathname = this.props.location.pathname;
        if (pathname === '/' || pathname === '/404') {
            homeRoute.indexPage && homeRoute.indexPage.path && this.props.history.push(homeRoute.indexPage.path);
        }
    }

    onLoadResources = () => {
        const homeRoute = homeStore.homeRoute;
        const pathname = this.props.location.pathname;
        if (pathname === '/' || pathname === '/404') {
            if (homeRoute.authRoute && homeRoute.authRoute.path !== this.props.location.pathname) {
                this.props.history.push(homeRoute.authRoute.path);
            }
        }
    };

    onException() {
        homeStore.tabActiveKey = '';
    }

    render() {
        const { isLogin } = this.props.authStore;
        const homeRoute = homeStore.homeRoute;

        const authLink = homeRoute.authRoute && homeRoute.authRoute.path && {
            to: homeRoute.authRoute.path,
            href: basename + homeRoute.authRoute.path
        };
        const indexLink = homeRoute.indexPage && homeRoute.indexPage.path ? {
            to: homeRoute.indexPage.path,
            href: basename + homeRoute.indexPage.path
        } : authLink;

        return isLogin ?
            <Home homeStore={homeStore} hideTabView={this.props.location.pathname === '/404'}
                onLoadResources={this.onLoadResources}>
                <Switch>
                    {homeRoute.children.map(route => {
                        return (
                            <Route key={route.path}
                                path={route.path}
                                exact={route.exact || true}
                                component={route.isAuth ? route.component : props =>
                                    React.createElement(ExceptionPage, {
                                        type: '403',
                                        actions: authLink ? undefined : <span />,
                                        linkObject: authLink,
                                        onException: this.onException
                                    })}
                            />
                        );
                    }
                    )}
                    <Route path='/404' render={props =>
                        React.createElement('div', { className: 'not-found' }, React.createElement(ExceptionPage, {
                            type: '404',
                            actions: indexLink ? undefined : <span />,
                            linkObject: indexLink,
                            onException: this.onException
                        }))
                    } />
                    <Redirect to='/404' />
                </Switch>
            </Home> :
            <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />;
    }
}

// 可以通过decorators或者func
export function tabWrap(tabParam) {
    const getKey = (location) => location.pathname + location.search; // todo fix deadCode

    function WrappedComponent(component, param) {
        if (!component.prototype || !component.prototype.isReactComponent) return;
        return class extends React.Component {

            constructor(props) {
                super(props);
                let tabKey = getKey(props.location);
                this.addTab(this.props, getKey(this.props.location));
                this.state = { tabKey, props: this.props, nTabKey: tabKey };
            }

            static getDerivedStateFromProps(nextProps, prevState) {
                let nTabKey = getKey(nextProps.location);
                if (prevState.tabKey !== nTabKey) {
                    return { nTabKey };
                }
                return null;
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                let tabKey = this.state.nTabKey;
                if (this.state.tabKey === -1) {
                    this.addTab(this.props, tabKey);
                    this.setState({ tabKey: this.state.nTabKey, props: this.props });
                } else if (tabKey && tabKey !== prevState.nTabKey) {
                    tabOut(prevState.tabKey);
                    this.setState({ tabKey: -1 });
                }
            }

            componentWillUnmount() {
                tabOut(this.state.tabKey);
            }

            render = () => this.state.tabKey === -1 ? null :
                React.createElement(component, {
                    ...this.state.props,
                    key: this.state.tabKey
                });

            addTab = (props, tabKey) => {
                if (!tabKey) return;
                let paramT = typeof param;
                let tabName;
                let tabItem = {};
                switch (paramT) {
                    case 'string':
                        tabName = param;
                        break;
                    case 'object':
                        let tName = param.tabName;
                        if (typeof tName === 'string') {
                            tabName = tName;
                        } else if (typeof tName === 'function') {
                            tabName = tName(props);
                        }
                        tabItem = { ...param };
                        break;
                    case 'function':
                        tabName = param(props);
                        break;
                    default:
                        throw new Error('tabWrap first param can only be a string/object/function');
                }
                if (!tabName) throw new Error('tabWrap first param can only be a string/object/function that specifies a tabName');
                // delete tabItem.tabId;
                delete tabItem.tabName;
                tabSave({ tabKey, tabName, ...tabItem });
            };
        };
    }

    if (tabParam.prototype && tabParam.prototype.isReactComponent) {
        return WrappedComponent(tabParam);
    }
    return (component) => WrappedComponent(component, tabParam);
}