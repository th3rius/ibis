import serverMessages from './serverMessages';
import ServerDecoder from './serverDecoder';

serverMessages.login('username', 'password');
// eslint-disable-next-line no-unused-vars
const decoder = new ServerDecoder();
