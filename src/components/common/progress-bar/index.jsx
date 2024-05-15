import './styles.css'

const ProgressBar = ({
  maxValue,
  value,
  className
}) => {
  const width = (value / maxValue) * 100
  console.log({ width })
  return <div className="progress-bar">
    <div className='progress-bar__wrapper'>
      <div className='progress-bar__value' style={{ width: `${width}%` }}>
        
      </div>
    </div>
  </div>
}

export default ProgressBar