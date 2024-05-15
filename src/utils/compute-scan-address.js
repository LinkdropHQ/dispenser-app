
import { ethers } from 'ethers'

export default async function computeScanAddress(
  qrSecret,
  qrEncCode,
  api,
  callback
) {
  try {
    const linkKey = ethers.utils.id(qrSecret)
    const qrKeysPair = new ethers.Wallet(linkKey)
    const MULTISCAN_QR_ID = qrKeysPair.address.toLowerCase()

    let redirectURL = ''
    const SCAN_ID = String(Math.random()).slice(2)
    
    const SCAN_ID_SIG = await qrKeysPair.signMessage(`Dispenser Scan Id: ${SCAN_ID}`)
    window.localStorage && window.localStorage.setItem(MULTISCAN_QR_ID, JSON.stringify({
      scanID: SCAN_ID,
      scanIDSig: SCAN_ID_SIG
    }))
    redirectURL = `/scan/${MULTISCAN_QR_ID}/${SCAN_ID}/${SCAN_ID_SIG}/${qrEncCode}?api=${api}`
    callback(redirectURL)
  } catch (err) {
    alert('Some error occured. Please check console for info!')
    console.error(err)
  }
}