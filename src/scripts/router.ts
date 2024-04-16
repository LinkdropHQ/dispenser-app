import { HashRoute, routeLocation, Router } from 'vanilla-routing'
import computeScanAddress from './compute-scan-address'
import getRedirectLink from './get-redirect-link'
const templateLoading = document.getElementById("loader")
const templateRedirect = document.getElementById("redirect")
const content = document.querySelector(".content")

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
          // @ts-ignore
          const templateClone = templateRedirect.content.cloneNode(true).querySelector('.redirect')
          content.innerHTML = ''
          const link = templateClone.querySelector('.redirect__link')
          link.setAttribute('href', location)
          content.append(templateClone)
          console.log({ location })
        }
      )
      // @ts-ignore
      const templateClone = templateLoading.content.cloneNode(true).querySelector('.loader')
      return templateClone

    }
  },
]

HashRoute(routes)
