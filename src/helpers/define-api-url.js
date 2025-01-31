const {
  REACT_APP_API_URL_PROD,
  REACT_APP_API_URL_DEV,
  REACT_APP_API_URL_TESTNETS
} = process.env

const defineApiURL = (apiType) => {
  switch (apiType) {
    case 'dev':
      return REACT_APP_API_URL_DEV
    case 'testnets':
      return REACT_APP_API_URL_TESTNETS
    default:
      return REACT_APP_API_URL_PROD
  }
}

export default defineApiURL
