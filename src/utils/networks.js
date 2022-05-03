import networksMock from './networks.json';

const {
  REACT_APP_ETH_CHAIN_ID,
  REACT_APP_AMB_CHAIN_ID,
  REACT_APP_ETH_RPC_URL,
  REACT_APP_AMB_RPC_URL,
} = process.env;

export const getAllNetworks = () => {
  let networks;
  if (process.env.REACT_APP_ENV === 'production') {
    // ...
    // fetching
    // ...
  } else {
    networks = networksMock;
  }

  const [amb, eth] = Object.values(networks).map((network) => {
    const formattedTokens = network.tokens.map((token) => {
      const {
        name,
        symbol: code,
        logo,
        denomination,
        address: nativeContractAddress,
        addressesOnOtherNetworks: { eth: linkedContractAddress },
      } = token;
      return {
        name,
        code,
        logo,
        denomination,
        nativeContractAddress,
        linkedContractAddress,
      };
    });

    return { ...network, tokens: formattedTokens };
  });

  amb.tokens.unshift({
    name: 'Ambrosus',
    code: 'AMB',
    logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
    denomination: 18,
    nativeContractAddress: '',
    linkedContractAddress: '0xD45698dA44D8Dda5c80911617FA57fd5e39099c4',
  });

  eth.tokens.unshift({
    name: 'Ethereum',
    code: 'ETH',
    logo: 'http://dummyimage.com/100x100.png/dddddd/000000',
    denomination: 18,
    nativeContractAddress: '',
    linkedContractAddress: '0x55252974F0277023C6ad296D33c4FDB4ABF971f3',
  });

  amb.chainId = +REACT_APP_AMB_CHAIN_ID;
  eth.chainId = +REACT_APP_ETH_CHAIN_ID;

  amb.rpcUrl = REACT_APP_AMB_RPC_URL;
  eth.rpcUrl = REACT_APP_ETH_RPC_URL;

  return [amb, eth];
};
