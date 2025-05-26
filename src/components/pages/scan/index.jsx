
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { getRedirectLink } from '../../../utils'
import { RedirectPage, LoaderPage } from './components'
import { defineApiParam, defineSocketIdParam } from '../../../helpers'
import { ErrorPage } from '../common'

const defineErrorScreenTitle = (error) => {
  switch (error) {
    case 'qr_campaign_finished':
      return 'Campaign is finished'
    case 'qr_campaign_not_active':
      return 'QR campaign is paused'
    case 'qr_campaign_not_started':
      return 'Campaign has not started yet'
    case 'qr_error':
      return 'Something went wrong'
    case 'qr_incorrect_parameter':
      return 'Wrong request'
    case 'qr_no_connection':
      return 'Seems you\'re offline'
    case 'qr_no_links_to_share':
      return 'No links to share'
    case 'qr_not_found':
      return 'Asset does not exist'
    case 'qr_already_claimed':
      return 'The link has been claimed'
    default:
      return 'Something went wrong'
  }
}

const ScanPage = () => {
  const location = useLocation()
  const [ error, setError ] = useState()
  const [ page, setPage ] = useState()
  const [ redirectLink, setRedirectLink ] = useState()

  const {
    multiscanQRId,
    scanId,
    scanIdSig,
    multiscanQREncCode
  }= useParams()


  useEffect(() => {
    getRedirectLink(
      multiscanQRId,
      scanId,
      scanIdSig,
      multiscanQREncCode,
      defineApiParam(location.search),
      defineSocketIdParam(location.search),
      (location) => {
        setRedirectLink(location)
        setPage('redirect')
        // show redirect component
      },
      (error) => {
        setError(error)
        // show error screen
      }
    )
  }, [])

  if (error) {
    const title = defineErrorScreenTitle(error)
    return <ErrorPage title={title} />
  }

  if (page === 'redirect') {
    return <RedirectPage redirectLink={redirectLink} />
  }
      
  return <LoaderPage />
}

export default ScanPage