import axios from 'axios'
import { createQueryString, defineApiURL  } from '../helpers'

const getMultiQRData = (
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

export {
  getMultiQRData
}
