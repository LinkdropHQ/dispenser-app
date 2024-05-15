import './styles.css'
import LinkdropLogo from '../../../images/linkdrop.png'

const Footer = () => {
  return <div className="footer">
    <span className="footer__text">Powered by</span>
    <img className='footer__logo' src={LinkdropLogo} alt="Linkdrop" />
  </div>
}

export default Footer