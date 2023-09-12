/**
 * line model
 * @author: Ronald Acha Ramos
 */
// import { uniqueId } from 'lodash';
const crypto = require('crypto');
const fs = require('fs');

/**
 * get string in format hexadecimal random
 * @param {*} length lenght of text
 */
const genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

const getNameModel = (text) => {
  try {
    return text.toLowerCase().split(/<b>/)[1].split('</b>')[0];
  } catch {
    return 'comp_00000NN';
  }
};

/**
 * convert number to literal value
 * @param {*} num
 */
function numberToLiteral(n) {
  const o = new Array(
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve',
    'veinte',
    'veintiuno',
    'veintidós',
    'veintitrés',
    'veinticuatro',
    'veinticinco',
    'veintiséis',
    'veintisiete',
    'veintiocho',
    'veintinueve',
  );
  const u = new Array(
    'cero',
    'uno',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
  );
  const d = new Array(
    '',
    '',
    '',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  );
  const c = new Array(
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  );

  n =
    parseFloat(n).toFixed(
      2,
    ); /* se limita a dos decimales, no sabía que existía toFixed() :) */
  const p = n
    .toString()
    .substring(n.toString().indexOf('.') + 1); /* decimales */
  let m = n
    .toString()
    .substring(0, n.toString().indexOf('.')); /* número sin decimales */
  m = parseFloat(m)
    .toString()
    .split('')
    .reverse(); /* tampoco que reverse() existía :D */
  let t = '';

  /* Se analiza cada 3 dígitos */
  for (let i = 0; i < m.length; i += 3) {
    const x = t;
    /* formamos un número de 2 dígitos */
    const b =
      m[i + 1] != undefined
        ? parseFloat(m[i + 1].toString() + m[i].toString())
        : parseFloat(m[i].toString());
    /* analizamos el 3 dígito */
    t = m[i + 2] != undefined ? `${c[m[i + 2]]} ` : '';
    t +=
      b < 10
        ? u[b]
        : b < 30
        ? o[b - 10]
        : d[m[i + 1]] + (m[i] == '0' ? '' : ` y ${u[m[i]]}`);
    t = t == 'ciento cero' ? 'cien' : t;
    if (i > 2 && i < 6)
      t = t == 'uno' ? 'mil ' : `${t.replace('uno', 'un')} mil `;
    if (i > 5 && i < 9)
      t = t == 'uno' ? 'un millón ' : `${t.replace('uno', 'un')} millones `;
    t += x;
  }

  // t += " con " + p + "/100";
  t = t.replace('  ', ' ');
  t = t.replace(' cero', '');
  return t;
}

const configureSalesPrice = (
  product,
  zone,
  productsPrice,
  value_add_tax,
  totalShoppingCart,
  badge = undefined,
) => {
  let defultMoney;
  let moneyBs;
  if (productsPrice.prices && productsPrice.prices.length > 0) {
    defultMoney = productsPrice.prices.filter(
      (money, index) => money.code === 'USD',
    );
    moneyBs = productsPrice.prices.filter(
      (money, index) => money.code === 'BOB',
    );
  }

  product.dataValues.sale_price = parseFloat(defultMoney[0].sale_price).toFixed(
    2,
  );

  const subTotal = parseFloat(
    parseFloat(defultMoney[0].sale_price) *
      parseFloat(product.dataValues.quantity),
  ).toFixed(2);

  product.dataValues.sub_total = parseFloat(parseFloat(subTotal)).toFixed(2);

  const subTotalIva = parseFloat(
    parseFloat(defultMoney[0].sale_price_iva) *
      parseFloat(product.dataValues.quantity),
  ).toFixed(2);
  product.dataValues.sub_total_iva = parseFloat(
    parseFloat(subTotalIva),
  ).toFixed(2);

  product.dataValues.subTotalWhitIva = parseFloat(totalShoppingCart).toFixed(2); // subTotalWhitoutIva

  if (zone)
    product.dataValues.totalShoppingCart = parseFloat(
      parseFloat(totalShoppingCart) + parseFloat(zone.dataValues.price),
    ).toFixed(2);
  else
    product.dataValues.totalShoppingCart = parseFloat(
      parseFloat(totalShoppingCart),
    ).toFixed(2);

  product.dataValues.totalShoppingCartBs = 0;
  if (badge && badge.dataValues.Rates) {
    const totalShoppingCartBs = parseFloat(
      parseFloat(totalShoppingCart) *
        badge.dataValues.Rates[0].dataValues.rate_sell_dolar,
    ).toFixed(2);
    product.dataValues.totalShoppingCartBs = totalShoppingCartBs;
  }

  product.dataValues.prices = productsPrice.prices;
  delete product.dataValues.total_shopping_cart;
};

const configureUtilidadSalePrice = (perentage, salePriceArray) => {
  const percentagePriceBuy = perentage || 0;
  salePriceArray.prices.forEach((price) => {
    const valorPercent = parseFloat(
      (parseFloat(percentagePriceBuy) * parseFloat(price.sale_price)) /
        parseFloat(100 - parseFloat(percentagePriceBuy)),
    ).toFixed(2);
    const valorPercentIva = parseFloat(
      (parseFloat(percentagePriceBuy) * parseFloat(price.sale_price_iva)) /
        parseFloat(100 - parseFloat(percentagePriceBuy)),
    ).toFixed(2);
    price.sale_price = parseFloat(price.sale_price) + parseFloat(valorPercent);
    price.sale_price_iva =
      parseFloat(price.sale_price_iva) + parseFloat(valorPercentIva);
  });
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const getText = (text) => {
  return text.replace(/<[^>]+>/g, '');
};

const forceDownloadPdf = (baseUrl, name, res) => {
  const file = fs.readFileSync(baseUrl, 'binary');

  res.setHeader('Content-Type', 'application/pdf');

  fs.unlinkSync(baseUrl);
  configureHeaderDownload(res, file, name);
};

const forceDownloadExcel = (baseUrl, name, res) => {
  const file = fs.readFileSync(baseUrl, 'binary');

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

  fs.unlinkSync(baseUrl);
  configureHeaderDownload(res, file, name);
};

const configureHeaderDownload = (res, file, name) => {
  res.setHeader('Content-disposition', `attachment; filename=${name}`);
  res.setHeader('Content-Type', 'application/force-download');
  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();
};

/**
 *
 * @param {*} baseUrl
 * @param {*} name
 * @param {*} res
 */
const previewFilePdf = (baseUrl, name, res, deleteFile = true) => {
  const file = fs.readFileSync(baseUrl, 'binary');

  res.setHeader('Content-Type', 'application/pdf');
  if (deleteFile) {
    fs.unlinkSync(baseUrl);
  }
  configureHeaderPreview(res, file, name);
};

const configureHeaderPreview = (res, file, name) => {
  res.setHeader('Content-disposition', `inline; filename=${name}`);
  // res.setHeader('Expires: 0');
  // res.setHeader('Pragma: no-cache');
  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();
};

/**
 *
 * @param {*} baseUrl
 * @param {*} name
 * @param {*} res
 */
const previewFileImage = (baseUrl, name, res, deleteFile = true) => {
  const file = fs.readFileSync(baseUrl, 'binary');

  if (name.includes('png')) {
    res.setHeader('Content-Type', 'image/png');
  }

  if (name.includes('jpg')) {
    res.setHeader('Content-Type', 'image/jpg');
  }

  if (name.includes('jpeg')) {
    res.setHeader('Content-Type', 'image/jpeg');
  }

  if (name.includes('gif')) {
    res.setHeader('Content-Type', 'image/gif');
  }

  if (deleteFile) {
    fs.unlinkSync(baseUrl);
  }
  configureHeaderPreview(res, file, name);
};

const validateDate = (date) => {
  return new Date(date) !== 'Invalid Date' && !Number.isNaN(new Date(date));
};

/**
 * remueve todos los caracteres dejando solo números
 * @param {*} text
 */
const getNumber = (text) => {
  return text.replace(/[^0-9]/g, '');
};

const getDateOfUnixTime = (unixTime) => {
  return new Date(unixTime * 1000);
};

const userAutenticated = (req, Auth) => {
  const authenticated = Auth.decodedToken(Auth.getBearerToken(req));
  return authenticated.user;
};

// Retorna un entero aleatorio entre min (incluido) y max (excluido)
// ¡Usando Math.round() te dará una distribución no-uniforme!
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * permite dormir el proceso del hilo en un tiempo determinado en milisegundos
 * @param {*} ms
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * permite convertir la primera letra de la cadena a mayuscula
 * @param {*} string
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * permite usarse la ',' como separador de miles
 * ejemplo numberWithCommas('1234.00')  => '1,234.00'
 * @param {*} stringNumber
 */
const numberWithCommas = (stringNumber) => {
  if (stringNumber) {
    const parts = stringNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }
  return '';
};

const isValidUrl = (string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(string);

  /* const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null; */
};

/**
 * elimina todos los atributos del Json excepto los de la lista
 * @param {*} jsonOriginObject  objectJson
 * @param {*} listKeyExcept list key expcetion, ha no eliminate
 * @returns
 */
const getAllAtributInListKeyException = (
  jsonOriginObject,
  listKeyExcept = [],
) => {
  const tempJson = {};
  if (listKeyExcept.length > 0) {
    Object.keys(jsonOriginObject).forEach((key, value) => {
      const keyExist = Object.keys(listKeyExcept).some(
        (except) => listKeyExcept[except] === key,
      );
      if (keyExist) {
        tempJson[key] = jsonOriginObject[key];
      }
    });
  }

  return tempJson;
};

/**
 * permit to order down the method burbuja
 * @param {*} groups
 */
const orderByMethodBurbujaSection = (groups) => {
  let i;
  let j;
  let aux;
  for (i = 0; i < groups.length - 1; i++) {
    for (j = 0; j < groups.length - i - 1; j++) {
      if (
        groups[j + 1].dataValues.order_section <
        groups[j].dataValues.order_section
      ) {
        aux = groups[j + 1];
        groups[j + 1] = groups[j];
        groups[j] = aux;
      }
    }
  }
};

/**
 * permit to order down the method burbuja
 * @param {*} groups
 */
const orderByMethodBurbuja = (groups) => {
  let i;
  let j;
  let aux;
  for (i = 0; i < groups.length - 1; i++) {
    for (j = 0; j < groups.length - i - 1; j++) {
      if (groups[j + 1].dataValues.order < groups[j].dataValues.order) {
        aux = groups[j + 1];
        groups[j + 1] = groups[j];
        groups[j] = aux;
      }
    }
  }
};

/**
 * orden to array
 * @param {*} array => [1,2,3,4]
 */
const orderArray = (array) => {
  let i;
  let j;
  let aux;
  for (i = 0; i < array.length - 1; i++) {
    for (j = 0; j < array.length - i - 1; j++) {
      if (array[j + 1] < array[j]) {
        aux = array[j + 1];
        array[j + 1] = array[j];
        array[j] = aux;
      }
    }
  }
};

module.exports = {
  genRandomString,
  numberToLiteral,
  configureSalesPrice,
  validateEmail,
  getText,
  forceDownloadExcel,
  forceDownloadPdf,
  validateDate,
  getNumber,
  getDateOfUnixTime,
  userAutenticated,
  getRandomInt,
  sleep,
  previewFilePdf,
  capitalizeFirstLetter,
  numberWithCommas,
  getNameModel,
  previewFileImage,
  isValidUrl,
  getAllAtributInListKeyException,
  configureUtilidadSalePrice,
  orderByMethodBurbuja,
  orderByMethodBurbujaSection,
  orderArray,
};
