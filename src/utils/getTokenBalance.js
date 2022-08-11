import { ethers } from 'ethers';

const getTokenBalance = async (
  provider,
  tokenContractAddress,
) => {
  const minABI = [
    {
      constant: true,
      name: 'totalSupply',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    },
  ];
  console.log(tokenContractAddress, provider._network);
  const contract = new ethers.Contract(tokenContractAddress, minABI, provider);

  return contract.totalSupply();
};

export default getTokenBalance;
