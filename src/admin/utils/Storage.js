import {Storage} from 'web-react-base-utils';
const name = '_ZXX_Admin';

const localStorage = new Storage(name, self.localStorage);
if (!self.localStorage.getItem(name)) {
    localStorage.build();
}
const sessionStorage = new Storage(name, self.sessionStorage);
if (!self.sessionStorage.getItem(name)) {
    sessionStorage.build();
}
export {sessionStorage, localStorage};