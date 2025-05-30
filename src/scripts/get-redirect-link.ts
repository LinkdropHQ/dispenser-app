
import { ethers } from 'ethers'
import {
  getMultiQRData,
  getMultiQRCampaignData
} from './api'
import * as wccrypto from '@walletconnect/utils/dist/esm'
import axios from 'axios'
import { TError } from './types'
import { TApi } from './types'
import { devClaimAppUrl, customClaimAppsForToken, claimAppUrl } from '../config'

export default async function getLinkByMultiQR(
  multiscanQRId: string,
  scanId: string,
  scanIdSig: string,
  multiscanQREncCode: string,
  api: TApi,
  linkRedirectCallback?: (location: string) => void,
  errorCallback?: (error_name: TError) => void,
) {
  let customDomain
  let redirectUrl
  let redirectOn
  
  try {
    
    const { data: campaignData } = await getMultiQRCampaignData(
      multiscanQRId,
      api
    )

    const {
      campaign,
    } = campaignData

    const {
      redirect_url,
      redirect_on,
      whitelist_on
    } = campaign

    redirectOn = redirect_on
    redirectUrl = redirect_url

    if (whitelist_on) {
      const claimAppUrlRedirect = api === 'dev' ? devClaimAppUrl : claimAppUrl
      const hash = window.localStorage.getItem('initial_url')

      window.location.href = `${claimAppUrlRedirect}/${hash}`
    }
  

    const tokenAddress = campaign.token_address
    const campaignConfig = customClaimAppsForToken[tokenAddress.toLowerCase()]
    customDomain = campaignConfig

    const { data } = await getMultiQRData(
      multiscanQRId,
      scanId,
      scanIdSig,
      api
    )

    const { encrypted_claim_link, success }: { encrypted_claim_link: string, success: boolean } = data
    if (success && encrypted_claim_link) {
      const decryptKey = ethers.utils.id(multiscanQREncCode)
      const linkDecrypted = wccrypto.decrypt({ encoded: encrypted_claim_link, symKey: decryptKey.replace('0x', '') })

      if (customDomain) {
        if (linkDecrypted.includes('https://wallet.coinbase.com')) {
          const originalLink = new URL(linkDecrypted)
          const linkParams = originalLink.searchParams
          const code = linkParams.get('k')
          const finalLink = `${customDomain}/#/redeem/${code}`
          linkRedirectCallback && linkRedirectCallback(finalLink)
          window.location.href = finalLink
          return
        } else {
          const finalLink = `${customDomain}/${(new URL(linkDecrypted)).hash}`
          linkRedirectCallback && linkRedirectCallback(finalLink)
          window.location.href = finalLink
          return
        }
      }
      linkRedirectCallback && linkRedirectCallback(linkDecrypted)
      window.location.href = linkDecrypted
    }
  } catch (err: any ) {
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
          if (redirectOn && redirectUrl) {
            const decryptKey = ethers.utils.id(multiscanQREncCode)
            const linkDecrypted = wccrypto.decrypt({ encoded: redirectUrl, symKey: decryptKey.replace('0x', '') })
            window.location.href = linkDecrypted
            return
          }
          errorCallback('qr_no_links_to_share')
        } else if (data.error.includes("Dispenser is not active")) {
          errorCallback('qr_campaign_not_active')
        } else if (data.errors.includes("RECEIVER_NOT_WHITELISTED")) {
          errorCallback('qr_campaign_not_eligible')
        } else if (data.errors.includes("RECEIVER_ALREADY_CLAIMED")) {
          errorCallback('qr_already_claimed')
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