import { utils } from 'ethers';

const getEventSignatureByName = (contract, name) => {
  const {
    interface: { events },
  } = contract;

  let signature = '';

  Object.keys(events).forEach((eventSignature) => {
    if (events[eventSignature].name === name) {
      signature = utils.id(eventSignature);
    }
  });
  return signature;
};

export default getEventSignatureByName;
