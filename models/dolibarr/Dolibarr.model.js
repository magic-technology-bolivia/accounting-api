const querystring = require('querystring');
const Request = require('../../config/request');

const config = require('../../config/environment/index');
const {
  forceDownloadExcel,
  getText,
} = require('../../utils/utils');


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


const generateProductReport = async () => {
  const resultList = await detailListProductStock(true);

  return createExcel(resultList, (state, baseUrl, name) => {
    if (state) {
      /* if (fs.existsSync(baseUrl)) {
        return forceDownloadExcel(baseUrl, name, res);
      } */
      const result = {
        result: true,
        data: { order: resultList },
        message:
          'Se ha completado con la recopilacion de datos, lamentablemente el archivo no se ha logrado crear. ',
      };
      return result;
    }
    const result = {
      result: false,
      data: { order: [] },
      message: 'Archivo no generado',
    };
    return result;
  });
};



const detailListProductStock = async (formatText) => {
  let resultList = [];
  try {
    const categories = await DollibarrGetCategoriesById(2596);
    const productList = [];
    for (let i = 0; i < categories.length; i++) {
      const dolibarrProducts =
        await DollibarrGetProductsSearchByCategoriesAndPrices(
          categories[i].id,
          (paramPage = 0),
          (paramLimit = undefined),
          (paramOnlyToSell = false),
          false,
        );
      productList.push(dolibarrProducts);
    }

    const resList = await Promise.all(productList);

    for (let i = 0; i < resList.length; i++) {
      const nameCategory = categories[i].label;
      const list = resList[i];
      list.shift();

      const resBuild = buildList(list, nameCategory, formatText);
      resultList = [...resultList, ...resBuild];
    }

    return resultList;
  } catch (error) {
    return resultList;
  }
};

const createExcel = (listProducts, callback) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('ListProducts');

  worksheet.columns = [
    { header: 'CODIGO', key: 'code', width: 12 },
    { header: 'DESCRIPCION', key: 'description', width: 70 },
    { header: 'PRECIO', key: 'price', width: 10 },
    { header: 'STOCK FISICO', key: 'physicalStock', width: 15 },
    { header: 'PRECIOS', key: 'prices', width: 12 },
    { header: 'TIPO DE PRODUCTO', key: 'typeOfProduct', width: 25 },
    { header: 'MARCA', key: 'brand', width: 20 },
    { header: 'MODELO', key: 'model', width: 25 },
  ];

  worksheet.getRow(1).font = { bold: true, size: 13, name: 'Arial' };
  worksheet.addRows(listProducts);

  const name = 'report-products.xlsx';
  const baseUrl = `${config.root}/accounting-api/public/upload/order/document/${name}`;

  workbook.xlsx
    .writeFile(baseUrl)
    .then(() => {
      return callback(true, baseUrl, name);
    })
    .catch((err) => {
      return callback(false, err, name);
    });
};


const buildList = (listProducts, nameCategory, format) => {
  return listProducts.map(({ ref, label, price, stock_reel }) => {
    const [typeProduct, brandProduct] = label.split(/(?:<[^>]+>)/gi);
    const nameModel = label.split(/<b>|<B>/);
    let productModel = '';
    if (nameModel[1] !== undefined) {
      const [model] = nameModel[1].split('</b>');
      const [name] = model.split('</B>');
      productModel = name;
    }

    const item = {};
    item.code = ref;
    item.description = format ? getText(label) : label;
    item.price = parseFloat(price).toFixed(2);
    item.physicalStock = stock_reel || 0;
    item.prices = nameCategory;
    item.typeOfProduct = brandProduct ? typeProduct : '';
    item.brand = brandProduct || '';
    item.model = productModel;
    return item;
  });
};

const DollibarrGetCategoriesById = async (id) => {
  let categories;
  try {
    const parameter = { sqlfilters: `fk_parent=${id}` };
    const strParameters = querystring.stringify(parameter);

    const queryDolibarr = `categories?${strParameters}`;

    categories = await Request.getDolibarr(queryDolibarr);
  } catch (error) {
    // console.log('Error ', error);
  }

  return categories;
};

/**
 * add product
 * @param {*} paramPage
 * @param {*} paramLimit
 * @param {*} strCategoryIds
 */
const DollibarrGetProductsSearchByCategoriesAndPrices = async (
  strCategoryIds,
  paramPage = 0,
  paramLimit = undefined,
  paramOnlyToSell = true,
  onlyIds = false,
  strPromotionsCategoriesIds = '',
  codeProduct = undefined,
  textSearch = undefined,
  withVirtualStock = true,
) => {
  let dolibarrProducts;
  try {
    const arrayParameters = {};
    arrayParameters.sortfield = 't.ref';
    arrayParameters.sortorder = 'DESC';

    if (strPromotionsCategoriesIds !== '') {
      arrayParameters.categories_position = strPromotionsCategoriesIds;
      arrayParameters.sortfield = `position,${arrayParameters.sortfield}`;
      arrayParameters.sortorder = `DESC,${arrayParameters.sortorder}`;
    }

    if (strCategoryIds && strCategoryIds !== 0) {
      arrayParameters.categories = strCategoryIds;
    }
    if (onlyIds === true) {
      arrayParameters.onlyids = 1;
    }
    if (withVirtualStock === true) {
      arrayParameters.with_virtual_stock = 1;
    }

    if (
      paramPage &&
      !Number.isNaN(paramPage) &&
      paramLimit &&
      !Number.isNaN(paramLimit)
    ) {
      arrayParameters.page = paramPage;
    }

    if (paramLimit && !Number.isNaN(paramLimit)) {
      arrayParameters.limit = paramLimit;
    }

    let strSqlfilters = '';
    const strParameters = querystring.stringify(arrayParameters);
    let url = `products/search_by_categories_prices?${strParameters}`;

    let sqlfilters = '';
    if (paramOnlyToSell === true) {
      sqlfilters = ' t.tosell=1 AND t.stock>0 ';
      strSqlfilters = encodeURIComponent(sqlfilters);
      url += `&sqlfilters=${strSqlfilters}`;
    } else {
      strSqlfilters = encodeURIComponent(sqlfilters);
      url += `&sqlfilters=${strSqlfilters}`;
    }

    if (codeProduct) {
      const queryId = `t.ref like '%${codeProduct}%'`;
      url += encodeURIComponent(queryId);
    }

    if (textSearch) {
      const queryLabel = `${
        codeProduct ? ' and ' : ''
      } t.label like '%${textSearch}%'`;
      url += encodeURIComponent(queryLabel);
    }

    // dolibarrProducts = await Request.getDolibarr(url);
    console.log('url busqueda de precios ', url);
    dolibarrProducts = await getProductsByCategoryPricesDolibars(url);
  } catch (error) {
    console.log('No se recupero productos ', error);
  }
  return dolibarrProducts;
};


module.exports = {
  getCategories,
  detailListProductStock,
  generateProductReport
};
