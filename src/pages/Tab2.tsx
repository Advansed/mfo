import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="medium">
          <IonTitle class = "a-center">Suretly</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">В разработке..</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="В разработке" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
