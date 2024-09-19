import axios from 'axios'
import { createQueryString, defineApiURL  } from '../helpers'

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

  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop/multiscan-qrs/${multiscanQRId}?${queryParams}`, {
    scan_id: scanId,
    scan_id_sig: scanIdSig
  })
}

const getDispenserData = (
  multiscanQRId,
  api
) => {
  const serverUrl = defineApiURL(api)
  return axios.get(`${serverUrl}/api/v2/dashboard/dispensers/multiscan-qrs/${multiscanQRId}/settings`)
}

export {
  getDispenserLink,
  getDispenserData
}
