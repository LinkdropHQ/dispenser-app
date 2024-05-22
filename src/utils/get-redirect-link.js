
import { ethers } from 'ethers'
import { getMultiQRData } from '../data/api'
import * as wccrypto from '@walletconnect/utils/dist/esm'
import axios from 'axios'

import { checkIfMultiscanIsPresented } from '../helpers'


export default async function getRedirectLink(
  multiscanQRId,
  scanId,
  scanIdSig,
  multiscanQREncCode,
  api,
  socketId, 
  linkRedirectCallback,
  errorCallback,
) {
  try {
    const inLocalStorage = checkIfMultiscanIsPresented(multiscanQRId)
    if (inLocalStorage) {
      linkRedirectCallback && linkRedirectCallback(inLocalStorage)
      window.location.href = inLocalStorage
      return 
    }

    
    const { data } = await getMultiQRData(
      multiscanQRId,
      scanId,
      scanIdSig,
      api,
      socketId
    )

    const { encrypted_claim_link, success } = data
    if (success && encrypted_claim_link) {
      const decryptKey = ethers.utils.id(multiscanQREncCode)
      const linkDecrypted = wccrypto.decrypt({ encoded: encrypted_claim_link, symKey: decryptKey.replace('0x', '') })

      const scans = window.localStorage.getItem('scans')
      const scansData = scans ? JSON.parse(scans) : {}
      scansData[multiscanQRId.toLowerCase()] = linkDecrypted
      window.localStorage.setItem('scans', JSON.stringify(scansData))

      linkRedirectCallback && linkRedirectCallback(linkDecrypted)
      window.location.href = linkDecrypted
    }
  } catch (err ) {
    if (axios.isAxiosError(err)) {
      if (err.message === 'Network Error') {
        if (!window.navigator.onLine) {
          errorCallback('qr_no_connection')
        } else {
          errorCallback('qr_error')
        }
      } else if (err.response?.status === 404) {
        errorCallback('qr_not_found')
      } else if (err.response?.status === 500) {
        errorCallback('qr_error')
      } else if (err.response?.status === 403) {

        const { data } = err.response

        if (data.error.includes("Claim is over.")) {
          errorCallback('qr_campaign_finished')
        } else if (data.error.includes("Claim has not started yet.")) {
          errorCallback('qr_campaign_not_started')
        } else if (data.error.includes("No more claims available.")) {
          errorCallback('qr_no_links_to_share')
        } else if (data.error.includes("Dispenser is not active")) {
          errorCallback('qr_campaign_not_active')
        } else if (data.errors.includes("RECEIVER_NOT_WHITELISTED")) {
          errorCallback('qr_campaign_not_eligible')
        } else {
          errorCallback('qr_error')
        }
      }
    } else {
      if (err && err.code === "INVALID_ARGUMENT") {
        errorCallback('qr_incorrect_parameter')
        return
      }
      errorCallback('qr_error')
    }
    console.error(err)
  }
} 