import { HashRoute, routeLocation, Router } from 'vanilla-routing'
import computeScanAddress from './compute-scan-address'
import getRedirectLink from './get-redirect-link'
import { TError } from './types'
const templateLoading = document.getElementById("loader")
const templateRedirect = document.getElementById("redirect")
const templateError = document.getElementById("error")
const content = document.querySelector(".content")



const createErrorScreen = (
  error: TError
) => {
  // @ts-ignore
  const errorScreen = templateError.content.cloneNode(true).querySelector('.error')
  const titleElement = errorScreen.querySelector('.error__title')

  switch (error) {
    case 'qr_campaign_finished':
      titleElement.innerText = 'Campaign is finished'
    case 'qr_campaign_not_active':
      titleElement.innerText = 'QR campaign is paused'
    case 'qr_campaign_not_started':
      titleElement.innerText = 'Campaign has not started yet'
    case 'qr_error':
      titleElement.innerText = 'Something went wrong'
    case 'qr_incorrect_parameter':
      titleElement.innerText = 'Wrong request'
    case 'qr_no_connection':
      titleElement.innerText = 'Seems you\'re offline'
    case 'qr_no_links_to_share':
      titleElement.innerText = 'No links to share'
    case 'qr_not_found':
      titleElement.innerText = 'Asset does not exist'
  }

  return errorScreen
}


const routes = [
  {
    pathname: '/mqr/:qrSecret/:qrEncCode',
    element: () => {
      const location = routeLocation()

      const { params: { qrEncCode, qrSecret } }  = location
      computeScanAddress(
        qrSecret,
        qrEncCode,
        (redirectURL) => {
          // content.innerHTML = ''
          Router.go(redirectURL)
        }
      )

      // @ts-ignore
      const templateClone = templateLoading.content.cloneNode(true).querySelector('.loader')
      return templateClone
    }
  },
  {
    pathname: '/scan/:multiscanQRId/:scanId/:scanIdSig/:multiscanQREncCode',
    element: () => {
      const location = routeLocation()
      const { params: {
        multiscanQRId,
        scanId,
        scanIdSig,
        multiscanQREncCode
      }}  = location

      getRedirectLink(
        multiscanQRId,
        scanId,
        scanIdSig,
        multiscanQREncCode,
        (location) => {
          content.innerHTML = ''
          // @ts-ignore          
          const templateClone = templateRedirect.content.cloneNode(true).querySelector('.redirect')
          const link = templateClone.querySelector('.redirect__link')
          link.setAttribute('href', location)
          content.append(templateClone)
          console.log({ location })
        },
        (error) => {
          content.innerHTML = ''
          const errorElement = createErrorScreen(
            error
          )
          content.append(errorElement)
        }
      )

      content.innerHTML = ''
      // @ts-ignore
      const templateClone = templateLoading.content.cloneNode(true).querySelector('.loader')
      return templateClone
    }
  }
]

HashRoute(routes)
