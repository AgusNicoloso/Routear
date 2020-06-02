import {configure} from 'react-hotkeys';
import UserModal from './UserModal';

configure({
    //logLevel:'verbose'
})

export const keyMap = {
  users: { name: 'Usuario', sequences: [], modalClass: UserModal },
};
