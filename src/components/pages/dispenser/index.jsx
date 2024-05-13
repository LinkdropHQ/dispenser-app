import { useEffect, useState } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { computeScanAddress } from '../../../utils'

const DispenserPage = () => {
  const { qrEncCode, qrSecret }  = useParams()
  const location = useLocation()
  const history = useHistory()

  const [ link, setLink ] = useState()
  useEffect(() => {

    const interval = setInterval(() => {
      computeScanAddress(
        qrSecret,
        qrEncCode,
        (location.search.api) || 'dev',
        (redirectURL) => {
          // history.push(redirectURL)
          setLink(redirectURL)
        }
      )
    }, 2000)

    return () => clearInterval(interval)
    
  }, [])

  return <h1>
    {link}
  </h1>
}

export default DispenserPage