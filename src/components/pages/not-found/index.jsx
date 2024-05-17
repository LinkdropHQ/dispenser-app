import { ErrorPage } from '../common'
const ERROR_TEXT = 'Please use dynamic dispenser URL from the Dashboard'

const NotFound = () => {
  return <ErrorPage title={ERROR_TEXT} />
}

export default NotFound