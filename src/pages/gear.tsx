import React from 'react';
import { IonContent, IonPage, IonIcon, IonCard, IonButton, IonCardHeader
  , IonCardContent, IonInput, IonList, IonItem, IonLabel, IonRadioGroup, IonRadio, IonCol, IonRow, IonHeader, IonToolbar, IonTitle, IonDatetime } from '@ionic/react';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import './gear.css';
import { cameraOutline } from 'ionicons/icons';
import { Store, getData } from './Store'

const src1 = 'https://wiki.webmoney.ru/files/2018/10/181006152055_PhotoID.png';
const src2 = 'http://psdmania.ru/uploads/posts/2011-10/thumbs/1318563233_1.jpg'
const src3 = 'https://docplayer.ru/docs-images/89/97613011/images/1-3.jpg'

const { Camera }  = Plugins

async function  takePicture() {
  const image = await Camera.getPhoto({
  quality: 90,
  allowEditing: false,
  resultType: CameraResultType.Base64,
  source: CameraSource.Camera
  });
  var imageUrl = "data:image/jpeg;base64," + image.base64String;
  
  return imageUrl
  // Can be set to the src of an image no

}

async function  Clicked(ind: number, compo: React.Component){
  compo.setState({index: ind});
  const imageUrl = await takePicture()

  switch(ind){
    case 1: {
        compo.setState({foto: imageUrl}); 
        Store.dispatch({type: "fot", НомерСтроки: 1, Тип: "Фотография", Фото: imageUrl});
        let params = {
          Телефон: Store.getState().Телефон,
          Фото: [{
              НомерСтроки: 1, Тип: "Фотография", Фото: imageUrl 
          }]
        }; getData("МФО_РегДанные", params, true);
        break
    } 
    case 2: {
        compo.setState({fsp : imageUrl}); 
        Store.dispatch({type: "fot", НомерСтроки: 2, Тип: "ФотоСПаспортом", Фото: imageUrl});
        let params = {
            Телефон: Store.getState().Телефон,
            Фото: [{
              НомерСтроки: 2, Тип: "ФотоСПаспортом", Фото: imageUrl 
          }]
        }; getData("МФО_РегДанные", params, true);            
        break
    }      
    case 3: {
        compo.setState({psp : imageUrl}); 
        Store.dispatch({type: "fot", НомерСтроки: 3, Тип: "ФотоПаспорта", Фото: imageUrl});
        let params = {
          Телефон: Store.getState().Телефон,              
          Фото: [{
              НомерСтроки: 3, Тип: "ФотоПаспорта", Фото: imageUrl 
          }]
        }; getData("МФО_РегДанные", params, true);              
        break
    }
  }
}

function        Photo(props: {src: string}): JSX.Element{
  let elem = <></>
  let fot;
  if(props.src === undefined || props.src === ""){
    fot = Store.getState().Фото[0].Фото;
  } else {
    fot = props.src
  }

  if(fot === ""){
    elem = <img src={src2} alt = ""/>
  } else {
    elem = <img src={fot} alt=""/>
  }
  return elem
}    

function        PhotoID(props: {src: string}): JSX.Element{
  let elem = <></>
  let fot;
  if(props.src === undefined || props.src === ""){
    fot = Store.getState().Фото[1].Фото;
  } else {
    fot = props.src
  }
  if(fot === ""){
    elem = <img src={src1} alt = ""/>
  } else {
    elem = <img src={fot} alt=""/>
  }
  return elem
}

function        ID(props: {src: string}): JSX.Element{
  let elem = <></>

  let fot;
  if(props.src === undefined || props.src === ""){
    fot = Store.getState().Фото[2].Фото;
  } else {
    fot = props.src
  }

  if(fot === ""){
    elem = <img src={src3} alt = ""/>
  } else {
    elem = <img src={fot} alt=""/>
  }
  return elem
}

function        Suprug(props:{value: boolean}):JSX.Element{
  let elem = <></>
  if(props.value)
    elem = <>
              <IonItem>
                <IonLabel position="stacked">Дата регистрации брака</IonLabel>
                <IonInput class="a-right" clearInput type="date"
                  onIonChange={e => {
                    Store.dispatch({type: "anc", ДатаРег: e.detail.value!});
                    }
                }
                value={Store.getState().Анкета.ДатаРег} ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Супруг</IonLabel>
                <IonInput clearInput 
                  onIonChange={e => {
                    Store.dispatch({type: "anc", Супруг: e.detail.value!});
                    }
                }
                value={Store.getState().Анкета.Супруг} ></IonInput>
              </IonItem>

              <IonItem>
              <IonLabel position="stacked">Место работы супруга</IonLabel>
              <IonInput clearInput 
                onIonChange={e => {
                  Store.dispatch({type: "anc", МестоРаботыСупруга: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.МестоРаботыСупруга} ></IonInput>
            </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Телефон супруга</IonLabel>
                <IonInput clearInput 
                  onIonChange={e => {
                    Store.dispatch({type: "anc", ТелефонСупруга: e.detail.value!});
                    }
                  }
                value={Store.getState().Анкета.ТелефонСупруга} ></IonInput>
              </IonItem>
          
          </>
              
  return elem
}

function        IButton1(props:{compo}):JSX.Element{
  let elem = <></>
    elem = <>
      <IonRow>
        <IonCol>
        </IonCol>
        <IonCol>
          <IonButton  fill="clear" color="medium" expand="block" onClick={() => {
            if(Store.getState().Анкета.Фамилия !== "" 
              && Store.getState().Анкета.Имя !== ""
              && Store.getState().Анкета.Отчество !== ""
              && Store.getState().Анкета.ДатаРождения !== ""
              && Store.getState().Анкета.МестоРождения !== ""
              && Store.getState().Анкета.Статус !== ""
              && Store.getState().Анкета.МестоРаботы !== ""
              && Store.getState().Анкета.СтажРаботы !== 0
              && Store.getState().Анкета.Зарплата !== 0
            ){
                props.compo.setState({group: 1})
                let params = {
                  params: {
                    Телефон: Store.getState().Телефон,
                    Анкета: Store.getState().Анкета
                  }
                }
                getData("МФО_РегДанные", params, true)
            }
          }}> Далее </IonButton>
        </IonCol>
      </IonRow>
    </>
  return elem
}

function        IButton2(props:{compo}):JSX.Element{
  let elem = <></>
    elem = <>
      <IonRow>
        <IonCol>
          <IonButton color="medium" expand="block" onClick={() =>{
            props.compo.setState({group: 0})
          }}>Назад</IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="medium" expand="block" onClick={() => {
            props.compo.setState({anc: false}) 
            if(Store.getState().Паспорт.Серия !== "" 
              && Store.getState().Паспорт.Номер !== ""
              && Store.getState().Паспорт.КемВыдан !== ""
              && Store.getState().Паспорт.ДатаВыдачи !== ""
              && Store.getState().Паспорт.КодПодразделения !== ""
            ) props.compo.setState({group: 2})
              getData("МФО_РегДанные", {
                Телефон: Store.getState().Телефон,
                Паспорт: Store.getState().Паспорт
              })
          }}> Далее </IonButton>
        </IonCol>
      </IonRow>
      </>
  return elem
}

function        IButton3(props:{compo}):JSX.Element{
  let elem = <></>
    elem = <>
      <IonRow>
        <IonCol>
          <IonButton color="medium" expand="block" onClick={() =>{
            props.compo.setState({group: 1})
          }}>Назад</IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="medium" expand="block" onClick={() => {
            props.compo.setState({anc: false}) 
            if(Store.getState().Адреса[0].Адрес !== "" 
              && Store.getState().Адреса[1].Адрес !== ""
            ) props.compo.setState({group: 3})
              getData("МФО_РегДанные", {
                Телефон: Store.getState().Телефон,        
                Адреса: Store.getState().Адреса  
              })
          }}> Далее </IonButton>
        </IonCol>
      </IonRow>
      </>
  return elem
}

function        IButton4(props:{compo}):JSX.Element{
  let elem = <></>
    elem = <>
      <IonRow>
        <IonCol>
          <IonButton color="medium" expand="block" onClick={() =>{
            props.compo.setState({group: 2})
          }}>Назад</IonButton>
        </IonCol>
        <IonCol>
        </IonCol>
      </IonRow>
      </>
  return elem
}

function        Page1(props:{compo, supr}):JSX.Element{
  return (
    <IonCard class="card">
    <IonCardHeader class="a-center">Анкета</IonCardHeader>
    <IonCardContent>
      <IonList>
          <IonItem>
            <IonLabel position="stacked">Фамилия:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                  Store.dispatch({type: "anc", Фамилия: e.detail.value!});}}
              value={Store.getState().Анкета.Фамилия} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Имя:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                Store.dispatch({type: "anc", Имя: e.detail.value!});}}
            value={Store.getState().Анкета.Имя} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Отчество:</IonLabel>
            <IonInput clearInput 
               onIonChange={e => {
                Store.dispatch({type: "anc", Отчество: e.detail.value!});}}
            value={Store.getState().Анкета.Отчество} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Дата рождения</IonLabel>
            <IonDatetime value={Store.getState().Анкета.ДатаРождения} placeholder="Дата рождения" 
                displayFormat="YYYY-MM-DD"
                onIonChange={e =>{
                  Store.dispatch({type: "anc", ДатаРождения: (e.detail.value as string).substr(0, 10)})

                }}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Место рождения</IonLabel>
            <IonInput type="text" 
              onIonChange={e => {
                Store.dispatch({type: "anc", МестоРождения: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.МестоРождения} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Пол</IonLabel>
              <IonRadioGroup 
                value={Store.getState().Анкета.Пол} 
                onIonChange={e => {
                  Store.dispatch({type: "anc", Пол: e.detail.value!})
                }}>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel>Муж</IonLabel>
                    <IonRadio slot="start" value="Муж" />
                  </IonItem>
                </IonCol>
                <IonCol>
                <IonItem>
                  <IonLabel>Жен</IonLabel>
                  <IonRadio slot="start" value="Жен" />
                </IonItem>
                </IonCol>
              </IonRow>
            </IonRadioGroup>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Права</IonLabel>
            <IonRadioGroup 
                value={Store.getState().Анкета.Права} 
                onIonChange={e => {
                  Store.dispatch({type: "anc", Права: e.detail.value!})
                }}>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel>Есть</IonLabel>
                    <IonRadio slot="start" value="Есть" />
                  </IonItem>
                </IonCol>
                <IonCol>
                <IonItem>
                  <IonLabel>Нет</IonLabel>
                  <IonRadio slot="start" value="Нет" />
                </IonItem>
                </IonCol>
              </IonRow>
            </IonRadioGroup>  
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Статус</IonLabel>
            <IonRadioGroup 
                value={Store.getState().Анкета.Статус} 
                onIonChange={e => {
                  Store.dispatch({type: "anc", Статус: e.detail.value!})
                  props.compo.setState({supr: Store.getState().Анкета.Статус === "Женат"
                        || Store.getState().Анкета.Статус === "Замужем"})
                }}>
              <IonRow>
                <IonCol>
                  <IonItem> 
                    <IonLabel>Женат</IonLabel>
                    <IonRadio slot="start" value="Женат" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem> 
                    <IonLabel>Замужем</IonLabel>
                    <IonRadio slot="start" value="Замужем" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem> 
                    <IonLabel>Холост</IonLabel>
                    <IonRadio slot="start" value="Холост" />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem> 
                    <IonLabel>Холостая</IonLabel>
                    <IonRadio slot="start" value="Холостая" />
                  </IonItem>
                </IonCol>
              </IonRow>

            </IonRadioGroup>  
          </IonItem>
          <Suprug value={ props.supr }/>
          <IonItem>
            <IonLabel position="stacked">Количество детей</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", Дети: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.Дети} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Дети в вашем обеспечении</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", ДетиВО: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.ДетиВО} ></IonInput>
          </IonItem>                 
          <IonItem>
            <IonLabel position="stacked">Иные иждивенцы</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", Иждивенцы: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.Иждивенцы} ></IonInput>
          </IonItem>   
          <IonItem>
            <IonLabel position="stacked">Место работы</IonLabel>
            <IonInput type="text" 
              onIonChange={e => {
                Store.dispatch({type: "anc", МестоРаботы: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.МестоРаботы} ></IonInput>
          </IonItem>   
          <IonItem>
            <IonLabel position="stacked">Адрес работы</IonLabel>
            <IonInput type="text" 
              onIonChange={e => {
                Store.dispatch({type: "anc", ФактАдресРаботы: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.ФактАдресРаботы} ></IonInput>
          </IonItem>   
          <IonItem>
            <IonLabel position="stacked">Стаж работы</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", СтажРаботы: parseInt(e.detail.value as string)});
                }
            }
            value={Store.getState().Анкета.СтажРаботы} ></IonInput>
          </IonItem>   
          <IonItem>
            <IonLabel position="stacked">Должность</IonLabel>
            <IonInput type="text" 
              onIonChange={e => {
                Store.dispatch({type: "anc", Должность: e.detail.value!});
                }
            }
            value={Store.getState().Анкета.Должность} ></IonInput>
          </IonItem>                
          <IonItem>
            <IonLabel position="stacked">Зарплата</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", Зарплата: parseInt(e.detail.value! as string)});
                }
            }
            value={Store.getState().Анкета.Зарплата} ></IonInput>
          </IonItem>     
          <IonItem>
            <IonLabel position="stacked">ПрочиеДоходы</IonLabel>
            <IonInput type="number" 
              onIonChange={e => {
                Store.dispatch({type: "anc", ПрочиеДоходы: parseInt(e.detail.value as string)});
                }
            }
            value={Store.getState().Анкета.ПрочиеДоходы} ></IonInput>
          </IonItem>     
        </IonList>
    </IonCardContent>
    <IButton1 compo = {props.compo} />
  </IonCard>

) 
}

function        Page2(props:{compo}):JSX.Element{
  return (
    <IonCard class="card">
    <IonCardHeader class="a-center">Паспорт</IonCardHeader>
    <IonCardContent>
      <IonList>
          <IonItem>
            <IonLabel position="stacked">Серия:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                  Store.dispatch({type: "doc", Серия: e.detail.value!});
              }}
              value={Store.getState().Паспорт.Серия} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Номер:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                  Store.dispatch({type: "doc", Номер: e.detail.value!});
              }}
              value={Store.getState().Паспорт.Номер} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Кем выдан:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                  Store.dispatch({type: "doc", КемВыдан: e.detail.value!});
                }
              }
              value={Store.getState().Паспорт.КемВыдан} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Дата выдачи:</IonLabel>
            <IonDatetime value={Store.getState().Паспорт.ДатаВыдачи} placeholder="2015-01-01" 
                displayFormat="YYYY-MM-DD"
                onIonChange={e =>{
                  Store.dispatch({type: "doc", ДатаВыдачи: (e.detail.value as string).substr(0, 10)})
 
                }}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Код подразделения:</IonLabel>
            <IonInput clearInput 
              onIonChange={e => {
                  Store.dispatch({type: "doc", КодПодразделения: e.detail.value!});
                  }
              }
              value={Store.getState().Паспорт.КодПодразделения} ></IonInput>
          </IonItem>
        </IonList>
      </IonCardContent>
      <IButton2 compo = {props.compo}/>
    </IonCard>
  )
}

function        Page3(props:{compo}):JSX.Element{
  return (
    <>
      <IonCard>
        <IonCardHeader class="a-center">Адреса</IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Фактический адрес</IonLabel>
              <IonInput clearInput 
                onIonChange={e => {
                    Store.dispatch({type: "adr", НомерСтроки: 1, Тип: "ФактАдрес", Адрес: e.detail.value!});}}
                value={Store.getState().Адреса[0].Адрес} ></IonInput>
            </IonItem>
          </IonList>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Адрес по прописке</IonLabel>
              <IonInput clearInput 
                onIonChange={e => {
                    Store.dispatch({type: "adr", НомерСтроки: 2, Тип: "АдресПоПрописке", Адрес: e.detail.value!});}}
                value={Store.getState().Адреса[1].Адрес} ></IonInput>
            </IonItem>
          </IonList>            
        </IonCardContent>
        <IButton3 compo = {props.compo}/>
      </IonCard>
    </>
  )
}

function        Page4(props:{compo: React.Component, foto: string, fsp: string, psp: string}):JSX.Element{
  return (
    <>
      <IonCard class= "card-1">
        <IonCardHeader class="a-center">Фотография</IonCardHeader>
        <IonCardContent>
          <Photo src={props.foto}/>
          <IonButton color="medium" expand="block" onClick={() => {Clicked(1, props.compo)}}>
            <IonIcon slot="icon-only"  icon={cameraOutline}/>
          </IonButton>
        </IonCardContent>
      </IonCard>   

      <IonCard class= "card-1">
        <IonCardHeader class="a-center">Фотография с паспортом</IonCardHeader>
        <IonCardContent>
          <PhotoID src={props.fsp}/>
          <IonButton color="medium" expand="block" onClick={() => {Clicked(2, props.compo)}}>
            <IonIcon slot="icon-only"  icon={cameraOutline}/>
          </IonButton>
        </IonCardContent>
      </IonCard>

      <IonCard class= "card-1">
        <IonCardHeader class="a-center">Паспорт</IonCardHeader>
        <IonCardContent>
          <ID src={props.psp}/>
          <IonButton color="medium" expand="block" onClick={() => {Clicked(3, props.compo)}}>
            <IonIcon slot="icon-only"  icon={cameraOutline}/>
          </IonButton>
        </IonCardContent>      
      </IonCard> 
      <IonCard>
        <IButton4 compo={props.compo}/>
      </IonCard>
    </>   
  )
}

export function Groups(props:{group: number, comp: React.Component, foto : string
    , fsp : string, psp: string, supr}):JSX.Element{
  let elem = <></>
  switch(props.group){
    case 0: return <Page1 compo= {props.comp} supr = {props.supr}/>
    case 1: return <Page2 compo = {props.comp}/>
    case 2: return <Page3 compo ={props.comp}/>        
    case 3: return <Page4 compo = {props.comp} foto = {props.foto} 
      fsp = {props.fsp} psp = {props.psp}
  />
  }
  return elem
}

export class    Tab1 extends React.Component {

  state = {
    index: 0,
    foto: "",
    fsp: "",
    psp: "",
    anc: false,
    supr: false,
    group: 0,
  }

  setFoto(f){
    this.setState({foto: f})
  }

  constructor(props: any) {
    super(props);
    defineCustomElements(window);
  }



  render() {

    return (
      <IonPage>
       <IonHeader>
        <IonToolbar color="medium">
          <IonTitle class="a-center">Настройки</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent className="ion-padding">

          <Groups group={this.state.group} comp = {this} foto = {this.state.foto} 
              fsp = {this.state.fsp} psp = {this.state.psp} supr ={this.state.supr} />

        </IonContent>
      </IonPage >
    );

  }
};

export default Tab1;

