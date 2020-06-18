import {configure} from 'react-hotkeys';
import UserModal from './UserModal';
import LoginModal from './LoginModal';

configure({
    //logLevel:'verbose'
})

export const keyMap = {
  users: { name: 'Usuario', sequences: [], modalClass: UserModal },
  login: { name: 'Login', sequences: [], modalClass: LoginModal },
};
