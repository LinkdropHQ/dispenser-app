import { Route, Switch, HashRouter } from 'react-router-dom'
import {
  NotFound,
  DispenserPage,
  ScanPage
} from '../../pages'

const AppRouter = () => {
  return <HashRouter>
    <Switch>
      <Route path='/mqr/:qrSecret/:qrEncCode'>
        <DispenserPage />
      </Route>

      <Route path='/scan/:multiscanQRId/:scanId/:scanIdSig/:multiscanQREncCode'>
        <ScanPage />
      </Route>

      
      <Route path='*'><NotFound /></Route>
    </Switch>
  </HashRouter>
}

export default AppRouter