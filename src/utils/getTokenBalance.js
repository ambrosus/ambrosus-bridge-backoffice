import { ethers } from 'ethers';

const getTokenBalance = async (
  provider,
  tokenContractAddress,
  ownerAddress,
) => {
  const minABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    },
  ];
  const contract = new ethers.Contract(tokenContractAddress, minABI, provider);

  return contract.balanceOf(ownerAddress);
};

export default getTokenBalance;
