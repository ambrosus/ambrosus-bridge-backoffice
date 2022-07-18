import { BigNumber } from 'ethers';

const handleTransferredTokens = (withDrawArgs, tokens) => {
  const transTokens = { from: '', to: '' };

  if (BigNumber.from(0).eq(withDrawArgs.tokenFrom)) {
    transTokens.from = findTokenByAddress(
      withDrawArgs.tokenTo,
      tokens,
    ).nativeAnalog;
  } else {
    transTokens.from = findTokenByAddress(
      withDrawArgs.tokenFrom,
      tokens,
    ).symbol;
  }
  if (BigNumber.from(0).eq(withDrawArgs.tokenTo)) {
    transTokens.to = findTokenByAddress(
      withDrawArgs.tokenFrom,
      tokens,
    ).nativeAnalog;
  } else {
    transTokens.to = findTokenByAddress(withDrawArgs.tokenTo, tokens).symbol;
  }
  return transTokens;
};

const findTokenByAddress = (address, tokens) =>
  tokens.find((el) => el.address === address);

export default handleTransferredTokens;
