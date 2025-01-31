const {
  REACT_APP_API_KEY_DEV,
  REACT_APP_API_KEY_PROD
} = process.env

const defineApiHeaders = (
  api
) => {
  const headers = {}

  if (api === 'dev') {
    headers['authorization'] = `Bearer ${REACT_APP_API_KEY_DEV}`
  } else {
    headers['authorization'] = `Bearer ${REACT_APP_API_KEY_PROD}`
  }

  return headers
}

export default defineApiHeaders