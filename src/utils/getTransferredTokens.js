import { BigNumber } from 'ethers';
import config from './bridge-config.json';

const handleTransferredTokens = (withDrawArgs) => {
  const transTokens = { from: '', to: '' };

  if (BigNumber.from(0).eq(withDrawArgs.tokenFrom)) {
    transTokens.from = findTokenByAddress(withDrawArgs.tokenTo).nativeAnalog;
  } else {
    transTokens.from = findTokenByAddress(withDrawArgs.tokenFrom).symbol;
  }
  if (BigNumber.from(0).eq(withDrawArgs.tokenTo)) {
    transTokens.to = findTokenByAddress(withDrawArgs.tokenFrom).nativeAnalog;
  } else {
    transTokens.to = findTokenByAddress(withDrawArgs.tokenTo).symbol;
  }
  return transTokens;
};

const findTokenByAddress = (address) => {
  let token;
  const { tokens } = config;

  Object.keys(tokens).forEach((el) => {
    Object.values(tokens[el].addresses).forEach((addr) => {
      if (addr === address) {
        token = tokens[el];
      }
    });
  });
  return token;
};

export default handleTransferredTokens;
