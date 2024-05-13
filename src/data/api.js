import axios from 'axios'
import { defineApiURL  } from '../helpers'

const getMultiQRData = (
  multiscanQRId,
  scanId,
  scanIdSig,
  api
) => {
  const serverUrl = defineApiURL(api)

  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop/multiscan-qrs/${multiscanQRId}`, {
    scan_id: scanId,
    scan_id_sig: scanIdSig
  })
}

export {
  getMultiQRData
}
