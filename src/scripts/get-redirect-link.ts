
import { ethers } from 'ethers'
import { getMultiQRData } from './api'
import * as wccrypto from '@walletconnect/utils/dist/esm'

export default async function getLinkByMultiQR(
  multiscanQRId: string,
  scanId: string,
  scanIdSig: string,
  multiscanQREncCode: string,
  linkRedirectCallback?: (location: string) => void
) {
  try {

    console.log({
      multiscanQRId,
      scanId,
      scanIdSig,
      multiscanQREncCode,
    })
    const { data } = await getMultiQRData(
      multiscanQRId,
      scanId,
      scanIdSig,
    )

    const { encrypted_claim_link, success }: { encrypted_claim_link: string, success: boolean } = data
    if (success && encrypted_claim_link) {
      const decryptKey = ethers.utils.id(multiscanQREncCode)
      const linkDecrypted = wccrypto.decrypt({ encoded: encrypted_claim_link, symKey: decryptKey.replace('0x', '') })
      linkRedirectCallback && linkRedirectCallback(linkDecrypted)
      setTimeout(() => {
        window.location.href = linkDecrypted
      }, 2000)
    }
  } catch (err: any ) {
    alert('Some error occured. Please check console for info!')
    console.error(err)
  }
} 