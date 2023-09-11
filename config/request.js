const axios = require('axios');
const local = require('./local.env');
const logger = require('./logger');

const apiDolibarr = local.API_DOLIBARR; // API server
const keyDolibar = local.KEY_API_DOLIBARR; // API server

/// ////////////////////////////////////////////////////////////////
/// /////// FUNCIONES PRIVADAS //////////////////////////////////

const Axios = (url, options) => {
  const axiosConfig = {
    ...options,
    url,
  };

  return axios(axiosConfig)
    .then((response) => {
      return response;
    })
    .catch(function (err) {
      logger.info(`Error function Axios: ${err} URL = ${url}`);
      // winston.error(`Error function Axios + ${err}`);
      const error = new Error(err);
      return error;
    });
};

const requestAxios = (url, options, isExternal = false) => {
  return Axios(url, {
    ...options,
  })
    .then((res) => {
      if (isExternal) return Promise.resolve(res);
      if (res instanceof Object) {
        return Promise.resolve(res.data);
      }
      return Promise.resolve(res);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const headerDolibarr = () => ({
  'Content-Type': 'application/json',
  DOLAPIKEY: keyDolibar,
});
/// /////// END FUNCIONES PRIVADAS //////////////////////////////////
/// ////////////////////////////////////////////////////////////////
const getDolibarr = (url) => {
  const vUrl = `${apiDolibarr}${url}`;
  return requestAxios(vUrl, {
    method: 'GET',
    headers: headerDolibarr(),
  });
};

const postDolibarr = (url, dataJson) => {
  const vUrl = `${apiDolibarr}${url}`;
  // console.log('url para dolibarr+++++++++++++++++++++++++++ ', vUrl);
  return requestAxios(vUrl, {
    method: 'POST',
    headers: headerDolibarr(),
    data: dataJson !== undefined ? JSON.parse(dataJson) : {},
  });
};

const putDolibarr = (url, dataJson = undefined) => {
  const vUrl = `${apiDolibarr}${url}`;
  // console.log('url para dolibarr+++++++++++++++++++++++++++ ', vUrl);
  return requestAxios(vUrl, {
    method: 'PUT',
    headers: headerDolibarr(),
    data: dataJson ? JSON.parse(dataJson) : {},
  });
};

const deleteDolibarr = (url) => {
  const vUrl = `${apiDolibarr}${url}`;
  return requestAxios(vUrl, {
    method: 'DELETE',
    headers: headerDolibarr(),
  });
};

module.exports = {
  getDolibarr,
  postDolibarr,
  putDolibarr,
  deleteDolibarr,
};
