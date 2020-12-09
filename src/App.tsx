import React, { useState} from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline } from 'ionicons/icons';
import Gear from './pages/gear';
import Tab2 from './pages/Tab2';
import Main from './pages/Main';
import Login from './pages/Login'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css'
import { Store } from './pages/Store';

const App: React.FC = () => {
  
  const [auth, setAuth] = useState(true)
  
  Store.subscribe_auth(()=>{
    setAuth(!Store.getState().auth);
  })

  return(
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1" component={Main} exact={true} />
          <Route path="/tab2" component={Tab2} exact={true} />
          <Route path="/tab3" component={Gear} />          
          <Route path="/login" component={Login} />
          <Route path="/" render={() => <Redirect to="/login" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1" disabled = { auth }>
            <IonIcon icon={cashOutline}/>
            <IonLabel>МФО</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2">
            {/* <IonIcon icon={listOutline} /> */}
            <IonLabel></IonLabel>
          </IonTabButton> 
          <IonTabButton tab="tab3">
            {/* <IonIcon icon={settingsOutline} /> */}
            <IonLabel></IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
}

export default App;
