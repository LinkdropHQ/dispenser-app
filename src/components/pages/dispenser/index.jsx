import { useEffect, useState, useRef } from "react"
import { useLocation, useParams } from "react-router-dom"
import { computeScanAddress } from '../../../utils'
import QRCodeStyling from 'qr-code-styling'
import { ProgressBar, Footer } from '../../common'
import { defineApiParam } from '../../../helpers'
import './styles.css'
import CoinbaseIcon from '../../../images/coinbase-qr.png'
import classname from "classname"
import { io, Socket } from "socket.io-client"
const { REACT_APP_SOCKET_URL } = process.env

const INTERVAL_TIME = 100000

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image: CoinbaseIcon, 
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
});

const DispenserPage = () => {
  const { qrEncCode, qrSecret }  = useParams()
  let qrEncCodeInitial = qrEncCode
  let qrSecretInitial = qrSecret

  const location = useLocation()

  const [ link, setLink ] = useState()
  const [ timer, setTimer ] = useState(0)
  const [ fade, setFade ] = useState(false)
  const [ socketObject, setSocketObject ] = useState(null)
  const [ socketLastScan, setSocketLastScan ] = useState(null)

  const qrRef = useRef(null)

  useEffect(() => {
    window.history.pushState({}, "", '/')
  }, [])

  useEffect(() => {
    const createScan  = () => {
      computeScanAddress(
        qrSecretInitial,
        qrEncCodeInitial,
        defineApiParam(location.search),
        socketObject ? socketObject.id : null,
        (redirectURL) => {
          // history.push(redirectURL)
          setLink(redirectURL)
          setTimer(INTERVAL_TIME)
        }
      )
    }

    createScan()
    const interval = setInterval(createScan, INTERVAL_TIME)

    return () => clearInterval(interval)
  }, [socketLastScan])

  useEffect(() => {
    qrCode.append(qrRef.current);
  }, [])

  useEffect(() => {
    const socket = io(REACT_APP_SOCKET_URL, {
      reconnectionDelayMax: 10000
    })

    socket.on("connect", () => {
      console.log(socket.id);
    })

    socket.on("successful_scan", (socketId) => {
      if (socketObject && socketId === socketObject.id) {
        setSocketLastScan(+new Date())
      }
    })

    setSocketObject(socket)
  }, [])

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
    const fullLink = `${window.location.origin}/#${link}`
    console.log({ fullLink })
    setTimeout(() => {
      qrCode.update({ data: fullLink } );
      setFade(false)
    }, 1000)
    
  }, [ link ])

  return <div className='dispenser'>
    <div className="dispenser__content">
      <div
        ref={qrRef}
        className={
          classname("dispenser__qr", {
            ['dispenser__qr_fade']: fade
          })
        }
      ></div>
      <ProgressBar value={timer} maxValue={INTERVAL_TIME} />
      <h1 className="dispenser__title">Scan to Claim Funds</h1>
      <Footer />
    </div>
  </div>
}

export default DispenserPage