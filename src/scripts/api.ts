import axios from 'axios'
import { dashboardServerUrl, devDashboardServerUrl } from '../config'
const { NODE_ENV = 'production' } = process.env
console.log({ NODE_ENV })
const serverUrl = NODE_ENV === 'production' ? dashboardServerUrl : devDashboardServerUrl
const getMultiQRData = (
  multiscanQRId: string,
  scanId: string,
  scanIdSig: string
) => {
  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop/multiscan-qrs/${multiscanQRId}`, {
    scan_id: scanId,
    scan_id_sig: scanIdSig
  })
}

export {
  getMultiQRData
}
