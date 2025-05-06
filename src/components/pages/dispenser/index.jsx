import {
  useEffect,
  useState,
  useRef,
  useMemo
} from "react"
import { useLocation, useParams } from "react-router-dom"
import { computeScanAddress } from '../../../utils'
import QRCodeStyling from 'qr-code-styling'
import { useQuery } from '../../../hooks'
import { ProgressBar, Footer } from '../../common'
import {
  defineApiParam,
  isIframe
} from '../../../helpers'
import './styles.css'
import LinkdropIcon from '../../../images/linkdrop-qr.png'
import CoinbaseIcon from '../../../images/coinbase-qr.png'
import classname from "classname"
import { io } from "socket.io-client"

const isInIframe = isIframe()
const { REACT_APP_SOCKET_URL } = process.env

const INTERVAL_TIME = 5000

const defineQrOptions = (
  client,
  qrWidth
) => {
  let qrIcon = LinkdropIcon
  if (client === 'coinbase') {
    qrIcon = CoinbaseIcon
  }

  const size =  qrWidth && qrWidth <= 350 ? qrWidth : 350

  return new QRCodeStyling({
    width: size,
    height: size,
    image: qrIcon, 
    cornersSquareOptions: {
      color: "#0C5EFF",
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: "#0C5EFF",
      type: 'square'
    },
    dotsOptions: {
      color: "#9D9D9D",
      type: "dots"
    },
    backgroundOptions: {
      color: "#FFF"
    },
    imageOptions: {
      margin: 5,
      imageSize: 0.5,
      crossOrigin: 'anonymous',
    }
  })
}

const DispenserPage = () => {
  const { qrEncCode, qrSecret }  = useParams()

  const query = useQuery()
  const client = query.get('client')

  let qrEncCodeInitial = qrEncCode
  let qrSecretInitial = qrSecret

  const location = useLocation()

  const [ link, setLink ] = useState()
  const [ timer, setTimer ] = useState(0)
  const [ fade, setFade ] = useState(false)
  const [ socketObject, setSocketObject ] = useState(null)
  const [ socketLastScan, setSocketLastScan ] = useState(null)

  const qrRef = useRef(null)

  const qrCode = useMemo(() => defineQrOptions(client, window.innerWidth), client)

  useEffect(() => {
    window.history.pushState({}, "", '/')
  }, [])

  useEffect(() => {
    console.log({ REACT_APP_SOCKET_URL })
    const socket = io(REACT_APP_SOCKET_URL, {
      reconnectionDelayMax: 10000
    })

    setSocketObject(socket)
  }, [])

  useEffect(() => {
    if (!socketObject) { return }
    socketObject.on("connect", () => {
      console.log(socketObject.id)
    })

    socketObject.on("successful_scan", (socketId) => {
      console.log({ socketId })
      if (socketObject && socketId === socketObject.id) {
        setSocketLastScan(+new Date())
      }
    })
  }, [socketObject])

  useEffect(() => {
    if (!socketObject) { return }
    const createScan  = () => {
      computeScanAddress(
        qrSecretInitial,
        qrEncCodeInitial,
        defineApiParam(location.search),
        socketObject ? socketObject.id : null,
        (
          redirectURL,
          wallet
        ) => {
          const fullLink = `${window.location.origin}/#${redirectURL}`
          if (wallet === 'coinbase_wallet') {
            // const fullLink = `https://dynamic-qr.linkdrop.io${redirectURL}`
            const encodedLink = encodeURIComponent(fullLink)
            const deeplink = `https://go.cb-w.com/dapp?cb_url=${encodedLink}`
            setLink(deeplink)
          } else {
            setLink(fullLink)
          }
          setTimer(INTERVAL_TIME)
        }
      )
    }

    createScan()
    const interval = setInterval(createScan, INTERVAL_TIME)

    return () => clearInterval(interval)
  }, [socketLastScan, socketObject])

  useEffect(() => {
    qrCode.append(qrRef.current);
  }, [qrCode])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const timerNew = timer - 1000
      setTimer(timerNew)
      if (timerNew === 0) {
        clearTimeout(timeOut)
      }
    }, 1000)

    return () => clearTimeout(timeOut)
  }, [timer])

  useEffect(() => {
    if (!link) {
      return
    }
    
    if (!qrRef.current) {
      return
    }

    setFade(true)
    setTimeout(() => {
      console.log({ link })
      qrCode.update({ data: link } )
      setFade(false)
    }, 1000)
    
  }, [ link ])

  if (isInIframe) {
    return <div className="dispenser-iframe">
      <div
        ref={qrRef}
        className={
          classname("qr-code", {
            ['qr-code_fade']: fade
          })
        }
      ></div>
      <ProgressBar value={timer} maxValue={INTERVAL_TIME} />
      <h1 className="dispenser__title">{window.appTitle || 'Scan to Claim'}</h1>
      <Footer />
    </div>
  }

  return <div className='dispenser'>
    <div className="dispenser__content">
      <div
        ref={qrRef}
        className={
          classname("qr-code", {
            ['qr-code_fade']: fade
          })
        }
      ></div>
      <ProgressBar value={timer} maxValue={INTERVAL_TIME} />
      <h1 className="dispenser__title">{window.appTitle || 'Scan to Claim'}</h1>
      <Footer />
    </div>
  </div>
}

export default DispenserPage