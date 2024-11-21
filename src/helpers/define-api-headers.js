import { TApi } from '../types'
import {
  devApiKey,
  apiKey
} from '../configs'


const defineApiHeaders = (
  api
) => {
  const headers = {}

  if (api === 'dev') {
    headers['authorization'] = `Bearer ${devApiKey}`
  } else {
    headers['authorization'] = `Bearer ${apiKey}`
  }

  return headers
}

export default defineApiHeaders