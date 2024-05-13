import './styles.css'
import RedirectImage from './redirect-image.png'

const RedirectPage = ({
  redirectLink
}) => {
  return <div className="redirect">
    <img className="redirect__image" src={RedirectImage} />
    <h1 className="redirect__title">
      You are about to claim tokens with Linkdrop. If you are not automatically redirected, please go <a class="redirect__link" href={redirectLink}>here</a>
    </h1>
  </div>
}

export default RedirectPage