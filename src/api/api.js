import axios from 'axios';

const tokenApiUrl = process.env.REACT_APP_TOKEN_API_URL;

const baseApiUrl = process.env.REACT_APP_API_ENDPOINT;

const API = () => {
  const api = axios.create({
    baseURL: baseApiUrl,
  });

  function handleNotFound(err) {
    if (err) {
      console.log(err);
    }
  }

  api.interceptors.response.use(
    (response) => {
      if (response.data) {
        return response.data;
      }

      return response;
    },
    (error) => {
      handleNotFound(error);
    },
  );

  return api;
};

const getBlocks = async (params = {}) => {
  return await API().get('blocks', {
    params,
  });
};

const getBlock = (hashOrNumber) => {
  return API().get(`blocks/${hashOrNumber}`);
};

const getBlockTransactions = (hashOrNumber, params = {}) => {
  return API().get(`blocks/${hashOrNumber}/transactions`, {
    params,
  });
};

const getAccount = (address) => {
  return API().get(`accounts/${address}`);
};

const getAtlas = (address) => {
  return API().get(`atlases/${address}`);
};

const getAtlasBundles = (address, params) => {
  return API().get(`atlases/${address}/bundles`, {
    params,
  });
};

const getApollo = (address) => {
  return API().get(`apollos/${address}`);
};

const getApolloRewards = (address, params) => {
  const url = `apollos/${address}/rewards`;
  const parameterFrom = params?.from?.split('/') || null;
  const parameterTo = params?.to?.split('/') || null;
  const newParams =
    parameterTo !== null
      ? {
          from: `${parameterFrom[1]}/${parameterFrom[0]}/${parameterFrom[2]}`,
          to: `${parameterTo[1]}/${parameterTo[0]}/${parameterTo[2]}`,
        }
      : {
          from: `${parameterFrom[1]}/${parameterFrom[0]}/${parameterFrom[2]}`,
        };
  return API().get(url, { params: newParams });
};

const getTransaction = (hash) => {
  return API().get(`transactions/${hash}`);
};

const getTransactions = (params = {}) => {
  const { type } = params;
  if (type) {
    delete params?.type;
  }
  const url = `transactions${type ? `/types/${type}` : ''}`;
  return API().get(url, {
    params,
  });
};

const getTransactionEvent = (hash) => {
  return API().get(`transactions/${hash}/event`);
};

const getSupTransaction = (address) => {
  return API().get(`transactions/?parent=${address}`);
};

const getAccounts = (params = {}) => {
  return API().get(`accounts`, {
    params,
  });
};

const getApollos = (params = {}) => {
  return API().get(`apollos`, {
    params,
  });
};

const getAtlases = (params = {}) => {
  return API().get(`atlases`, {
    params,
  });
};

export const getAccountTx = (params = {}) => {
  return API().get(`accounts/${params.address}/transactions`, {
    params,
  });
};

const getBundle = (bundleId) => {
  return API().get(`bundles/${bundleId}`);
};

const getBundleAssets = (bundleId, params = {}) => {
  return API().get(`bundles/${bundleId}/assets`, {
    params,
  });
};

const getBundleEvents = (bundleId, params = {}) => {
  return API().get(`bundles/${bundleId}/events`, {
    params,
  });
};

const getBundleWithEntries = (bundleId) => {
  return axios
    .all([
      getBundle(bundleId),
      getBundleAssets(bundleId),
      getBundleEvents(bundleId),
    ])
    .then(
      axios.spread((bundle, assets, events) => {
        return {
          bundle,
          assets,
          events,
        };
      }),
    );
};

const searchItem = (term) => {
  return API().get(`search/${term}`);
};

const getBundles = (params = {}) => {
  return API().get(`bundles?cursor`, {
    params,
  });
};

const getInfo = () => {
  return API().get(`info/`);
};

const getToken = () => {
  return axios.get(tokenApiUrl).then(({ data }) => data.data);
};

const getTokenHistory = () => {
  return axios.get(tokenApiUrl + '/history').then(({ data }) => data.data);
};

const getTokenMountPrice = () => {
  return axios.get(tokenApiUrl + '/price').then(({ data }) => data.data);
};

const getTokenTotalSupply = () => {
  return axios
    .get(`${process.env.REACT_APP_API_ENDPOINT}/blocks/total_supply`)
    .then((response) => {
      return response.data;
    });
};

const followTheLinkRange = async (fromDate, toDate, address) => {
  const link = `${baseApiUrl}/transactions/csv/address/${address}`;
  const from = fromDate / 1000;
  const to = toDate / 1000;
  window.open(`${link}/dateFrom/${from}/dateTo/${to}`, '_self');
  const data = await fetch(`${link}/dateFrom/${from}/dateTo/${to}`);
  return data;
};

export const getSymbolPriceTickerBinance = () => {
  return fetch('http://example.com/movies.json').then((response) =>
    response.json(),
  );
};

const api = {
  API: API(),
  getBlocks,
  getBlockTransactions,
  getTransactions,
  getSupTransaction,
  getAccounts,
  getApollos,
  getApollo,
  getAtlas,
  getAtlases,
  getApolloRewards,
  getInfo,
  getToken,
  getAccountTx,
  getBlock,
  getAccount,
  getTransaction,
  getTransactionEvent,
  getBundles,
  getBundle,
  getBundleAssets,
  getBundleEvents,
  getBundleWithEntries,
  searchItem,
  getTokenHistory,
  getTokenMountPrice,
  getTokenTotalSupply,
  getAtlasBundles,
  followTheLinkRange,
};

export default api;
