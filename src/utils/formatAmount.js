const formatValue = (value) => {
  const splited = value.split('.');
  return `${splited[0]}.${splited[1].slice(0, 6)}`;
};

export default formatValue;
