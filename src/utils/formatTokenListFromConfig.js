import { utils } from 'ethers';
import { allNetworks } from './networks';

const formatTokenListFromConfig = (tokens) =>
  Object.values(tokens).reduce((list, token) => {
    const ambTokenEntity = {
      ...token,
      chainId: allNetworks.amb.chainId,
      address: token.addresses.amb,
      primaryNets: formatPrimaryNets(token.primaryNets),
      balance: '',
    };
    const ethTokenEntity = {
      ...token,
      chainId: allNetworks.eth.chainId,
      address: token.addresses.eth,
      primaryNets: formatPrimaryNets(token.primaryNets),
      balance: '',
    };
    const bscTokenEntity = {
      ...token,
      chainId: allNetworks.bsc.chainId,
      address: token.addresses.bsc,
      primaryNets: formatPrimaryNets(token.primaryNets),
      balance: '',
    };

    return [
      ...list,
      ...(utils.isAddress(token.addresses.amb) ? [ambTokenEntity] : []),
      ...(utils.isAddress(token.addresses.eth) ? [ethTokenEntity] : []),
      ...(utils.isAddress(token.addresses.bsc) ? [bscTokenEntity] : []),
    ];
  }, []);

const formatPrimaryNets = (primaryNets) =>
  primaryNets.map((net) => allNetworks[net].chainId);

export default formatTokenListFromConfig;
