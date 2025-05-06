
import { ethers } from 'ethers'
import { createQueryString } from '../helpers'
import { getDispenserData, getDispenserCampaignData } from '../data/api'
import * as wccrypto from '@walletconnect/utils/dist/esm'

export default async function computeScanAddress(
  qrSecret,
  qrEncCode,
  api,
  socketId,
  callback
) {
  try {


    const linkKey = ethers.utils.id(qrSecret)
    const qrKeysPair = new ethers.Wallet(linkKey)
    const MULTISCAN_QR_ID = qrKeysPair.address.toLowerCase()


    const { data } = await getDispenserData(
      MULTISCAN_QR_ID,
      api
    )

    const { dispenser } = data

    if (dispenser) {
      const { app_title, app_title_on } = dispenser

      if (app_title && app_title_on) {
        window.appTitle = app_title
      }
    }

    const { data: campaignData } = await getDispenserCampaignData(
      MULTISCAN_QR_ID,
      api
    )

    console.log({ campaignData })

    const {
      campaign,
    } = campaignData

    const {
      redirect_url,
      redirect_on,
      wallet
    } = campaign

    if (redirect_on && redirect_url) {
      const decryptKey = ethers.utils.id(qrEncCode)
      const linkDecrypted = wccrypto.decrypt({ encoded: redirect_url, symKey: decryptKey.replace('0x', '') })
      window.location.href = linkDecrypted
      return
    }

    let redirectURL = ''
    const SCAN_ID = String(Math.random()).slice(2)
    
    const SCAN_ID_SIG = await qrKeysPair.signMessage(`Dispenser Scan Id: ${SCAN_ID}`)
    window.localStorage && window.localStorage.setItem(MULTISCAN_QR_ID, JSON.stringify({
      scanID: SCAN_ID,
      scanIDSig: SCAN_ID_SIG
    }))
    const queryParams = createQueryString({
      api, socket_id: socketId 
    })
    redirectURL = `/scan/${MULTISCAN_QR_ID}/${SCAN_ID}/${SCAN_ID_SIG}/${qrEncCode}?${queryParams}`
    callback(
      redirectURL,
      wallet
    )
  } catch (err) {
    alert('Some error occured. Please check console for info!')
    console.error(err)
  }
}