import React from 'react';
import {Button} from 'antd';

let authoritySet = new Set(); // todo fix dead code

export function setAuthorityList(set) {
    authoritySet = set;
}

export function AuthorityButton(props) {
    return authority(props.resid)(<Button {...props}/>);
}

export function hasAuthority(resID) {
    return authoritySet.has(resID);
}

export default function authority(auth) {
    let resid;
    let tAuth = typeof auth;
    if (tAuth === 'object') {
        resid = auth.resid;
    } else if (tAuth === 'string') {
        resid = auth;
    }
    return component => authoritySet.has(resid) ? component : null;
}