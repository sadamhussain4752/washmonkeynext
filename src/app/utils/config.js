import { ENDPOINTS } from './endpoints';



const DEBUG = true;
const BASE_URL = 'https://apis.washmonkey.in/';
// const BASE_URL = 'http://192.168.88.225:4000/';
// const BASE_URL = 'http://192.168.31.238:4000/';

const AUTHORIZATION_TOKEN = 'aH3KCew1YsWhWqW0tqNU3ndzHb3RdblI';

const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
  },
};

export { BASE_URL, AUTHORIZATION_TOKEN, CONFIG, DEBUG ,ENDPOINTS};
