
import { ethers } from 'ethers'
import { checkIfMultiscanIsPresented } from './helpers'

export default async function computeScanAddress(
  qrSecret: string,
  qrEncCode: string,
  callback: (location: string) => void
) {
  console.log({ qrSecret, qrEncCode })
  try {
    const linkKey = ethers.utils.id(qrSecret)
    const qrKeysPair = new ethers.Wallet(linkKey)
    const MULTISCAN_QR_ID = qrKeysPair.address.toLowerCase()
    const inLocalStorage = checkIfMultiscanIsPresented(MULTISCAN_QR_ID)

    let redirectURL = ''

    if (!inLocalStorage) {
      const SCAN_ID = String(Math.random()).slice(2)
      
      const SCAN_ID_SIG = await qrKeysPair.signMessage(`Dispenser Scan Id: ${SCAN_ID}`)
      window.localStorage && window.localStorage.setItem(MULTISCAN_QR_ID, JSON.stringify({
        scanID: SCAN_ID,
        scanIDSig: SCAN_ID_SIG
      }))
      redirectURL = `/scan/${MULTISCAN_QR_ID}/${SCAN_ID}/${SCAN_ID_SIG}/${qrEncCode}`
      callback(redirectURL)
    } else {
      const { scanID: SCAN_ID, scanIDSig: SCAN_ID_SIG } = inLocalStorage
      redirectURL = `/scan/${MULTISCAN_QR_ID}/${SCAN_ID}/${SCAN_ID_SIG}/${qrEncCode}`
      callback(redirectURL)
    }
  } catch (err: any) {
    alert('Some error occured. Please check console for info!')
    console.error(err)
  }
}