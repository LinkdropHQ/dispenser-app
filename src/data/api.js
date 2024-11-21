import axios from 'axios'
import { createQueryString, defineApiURL, defineApiHeaders  } from '../helpers'

const getDispenserLink = (
  multiscanQRId,
  scanId,
  scanIdSig,
  api,
  socketId
) => {
  const serverUrl = defineApiURL(api)
  const queryParams = createQueryString({
    socket_id: socketId
  })

  const headers = defineApiHeaders(api)

  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop/multiscan-qrs/${multiscanQRId}?${queryParams}`, {
    scan_id: scanId,
    scan_id_sig: scanIdSig
  }, { headers })
}

const getDispenserCampaignData = (
  multiscanQRId,
  api
) => {
  const headers = defineApiHeaders(api)
  const serverUrl = defineApiURL(api)
  return axios.get(`${serverUrl}/api/v2/dashboard/dispensers/multiscan-qrs/${multiscanQRId}/campaign`, { headers })
}

const getDispenserData = (
  multiscanQRId,
  api
) => {
  const headers = defineApiHeaders(api)

  const serverUrl = defineApiURL(api)
  return axios.get(`${serverUrl}/api/v2/dashboard/dispensers/multiscan-qrs/${multiscanQRId}/settings`, { headers })
}

export {
  getDispenserLink,
  getDispenserData,
  getDispenserCampaignData
}
