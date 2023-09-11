const querystring = require('querystring');
const Request = require('../../config/request');

const getCategories = async () => {
  let dolibarrCategories;
  try {
    const arrayParameters = {
      sortfield: 't.rowid',
      sortorder: 'ASC',
      limit: 2000,
    };

    const strParameters = querystring.stringify(arrayParameters);
    const url = `categories?${strParameters}`;

    dolibarrCategories = await Request.getDolibarr(url);
  } catch (error) {
    // console.log('No se recupero productos ', error);
  }
  return dolibarrCategories;
};

module.exports = {
  getCategories,
};
