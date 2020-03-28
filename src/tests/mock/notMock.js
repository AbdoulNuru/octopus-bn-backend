import { query } from 'express-validator';

const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const notMoch = {
  response,
  request: {
    body: {
    }
  }
};

export const badTripMock = {
  response,
  request: {
    body: {
    },
    query: {
      page:"",
      limit:"",
    },
    user: {
      id:"",
      preferedLang:""
  }
  }
};

export default notMoch;
