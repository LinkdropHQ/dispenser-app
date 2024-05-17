import qrError from './qr-error.png'
import './styles.css'

const ErrorPage = ({
  title
}) => {
  return <div class="error">
    <img class="error__image" src={qrError} />
    <h2 class="error__title">{title}</h2>
  </div>
}

export default ErrorPage