import { useEffect, useState, useRef } from "react"
import { useLocation, useParams } from "react-router-dom"
import { computeScanAddress } from '../../../utils'
import QRCodeStyling from 'qr-code-styling'
import { ProgressBar, Footer } from '../../common'
import './styles.css'
import CoinbaseIcon from '../../../images/coinbase-qr.png'

const INTERVAL_TIME = 10000

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
  const location = useLocation()

  const [ link, setLink ] = useState()
  const [ timer, setTimer ] = useState(0)

  const qrRef = useRef(null)
  useEffect(() => {

    const createScan  = () => {
      computeScanAddress(
        qrSecret,
        qrEncCode,
        (location.search.api) || 'dev',
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
  }, [])

  useEffect(() => {
    qrCode.append(qrRef.current);
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

    console.log({ link })
    
    qrCode.update({ data: link } );

  }, [ link ])

  return <div className='dispenser'>
    <div className="dispenser__content">
      <div className="dispenser__qr" ref={qrRef}></div>
      <ProgressBar value={timer} maxValue={INTERVAL_TIME} />
      <h1 className="dispenser__title">Scan to Claim Funds</h1>
      <a href={`/#${link}`} target="_blank">LINK</a>
      <Footer />
    </div>
  </div>
}

export default DispenserPage