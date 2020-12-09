import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonCard, IonButton, IonCardHeader
  , IonCardContent, IonInput, IonList, IonItem, IonLabel, IonRadioGroup, IonRadio, IonCol, IonRow, IonHeader, IonToolbar, 
  IonTitle, IonAlert, IonLoading, IonFab, IonFabButton, IonRange, IonText, IonCheckbox, IonGrid } from '@ionic/react';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import './Main.css';
import { addOutline, cameraOutline } from 'ionicons/icons';
import axios from 'axios';
import { Store, Dec, getData } from './Store';

import MaskedInput  from '../mask/reactTextMask'


const t_color = "medium";

interface i_type{
    Дата:         string,
    Номер:        string,
    Документ:     string,
    Сумма:        number,    
    Срок:         number,
    Процент:      number,
    Остаток:      number,
    Проценты:     number,
    Статус:       string
}

const src1 = 'https://wiki.webmoney.ru/files/2018/10/181006152055_PhotoID.png';
const src2 = 'http://psdmania.ru/uploads/posts/2011-10/thumbs/1318563233_1.jpg'
const src3 = 'https://docplayer.ru/docs-images/89/97613011/images/1-3.jpg'

const { Camera }  = Plugins

async function takePicture() {
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

function send(uri, params){

  if(!Store.getState().auth) return

  if(uri){

    axios.get(
      "https://mfu24.ru/lombard/hs/MyAPI/V1/РегДанные"
      ,{
        auth: {
          username: unescape(encodeURIComponent("МФО_Админ")),
          password: unescape(encodeURIComponent("1234"))
        },
        params
      } 
    ).then(response => response.data)
    .then((data) => {

    }).catch(error => {

    })
  } else {
    axios.post(
      "https://mfu24.ru/lombard/hs/MyAPI/V1/МФО_РегДанные"
      ,params
      ,{
        auth: {
          username: unescape(encodeURIComponent("МФО_Админ")),
          password: unescape(encodeURIComponent("1234"))
        }
      } 
    ).then(response => response.data)
    .then((data) => {

    }).catch(error => {

    })    
  }

}

function sendData(arg: number){
  switch(arg){
    case 0:{
      let params = {
        Телефон: Store.getState().Телефон,
        Анкета: Store.getState().Анкета
      }
      send(false, params);break;
    }
    case 1:{
      let params = {
        Телефон: Store.getState().Телефон,
        Паспорт: Store.getState().Паспорт
      }
      send(false, params);break;
    }
    case 2:{
      let params = {
        Телефон: Store.getState().Телефон,        
        Адреса: Store.getState().Адреса
      }
      send(false, params);break;
    }
  }
}

const Tab3: React.FC = () => {

  const [loading,   setLoading] =   useState(false)
  const [e_reg,     setEReg] =      useState(false)
  const [upd,       setUpd] =       useState(0)

  const [FABhidden, setFABhidden] = useState(false);

  const [group,     setGroup] =     useState(0);
  const [supr,      setSupr] =      useState(false);
  
  const [foto,      setFoto] =      useState("")
  const [fsp,       setFSP] =       useState("")
  const [psp,       setPSP] =       useState("")

  const [sum,       setSum] =       useState(1000)
  const [srok,      setSrok] =      useState(3)
  const [onCard,    setOnCard] =    useState(false); 
  const [onTel,     setOnTel] =     useState(false); 

  const [s_dec,     setSDec] =      useState(false)
  const [e_dec,     setEDec] =      useState(false)
  const [info,      setInfo] =      useState<Array<i_type>>()

  const [sogl1,     setSogl1] =     useState(false)
  const [sogl2,     setSogl2] =     useState(false)


  defineCustomElements(window)

  useEffect(()=>{

    async function loadData(){
      let params = {
        params:{
          Телефон: Store.getState().Телефон
        }
      }
      let res = await getData("МФО_Кредиты", params)
      if(res.Код === 100) setInfo(res.Данные)
    }

    loadData()

  }, [upd])

  function sendDec(){
    let params = {
      Заявление: Dec.getState(),
      Данные: Store.getState(),
    }
    setLoading(true)
    axios.post(
      "https://mfu24.ru/lombard/hs/MyAPI/V1/МФО_Заявление"
      ,params
      ,{
        auth: {
          username: unescape(encodeURIComponent("МФО_Админ")),
          password: unescape(encodeURIComponent("1234"))
        }
      } 
    ).then(response => response.data)
    .then((getData) => {
      setFABhidden(false)
      if(getData.Код === 100){
        setSDec(true)
      } else {
        setEDec(true);
      }
      setLoading(false)
      setUpd(upd + 1);

    }).catch(error => {
      setLoading(true)
      setFABhidden(false)
      setEReg(true)
    })
   
  }

  async function Clicked(ind: number){

    const imageUrl = await takePicture()
  
    switch(ind){
      case 1: {
          setFoto(imageUrl)
          Store.dispatch({type: "fot", НомерСтроки: 1, Тип: "Фотография", Фото: imageUrl});
          let params = {
            Телефон: Store.getState().Телефон,
            Фото: [{
                Тип: "Фотография", Фото: imageUrl 
            }]
          }; send(false, params);
          break
      } 
      case 2: {
          setFSP(imageUrl)
          Store.dispatch({type: "fot", НомерСтроки: 2, Тип: "ФотоСПаспортом", Фото: imageUrl});
          let params = {
              Телефон: Store.getState().Телефон,
              Фото: [{
                Тип: "ФотоСПаспортом", Фото: imageUrl 
            }]
          }; send(false, params);            
          break
      }      
      case 3: {
          setPSP(imageUrl) 
          Store.dispatch({type: "fot", НомерСтроки: 3, Тип: "ФотоПаспорта", Фото: imageUrl});
          let params = {
            Телефон: Store.getState().Телефон,              
            Фото: [{
                Тип: "ФотоПаспорта", Фото: imageUrl 
            }]
          }; send(false, params);              
          break
      }
    }
  }
  
  function Photo(props: {src: string}): JSX.Element{
    let elem = <></>
    let fot;
    if(props.src === undefined || props.src === ""){
      fot = Store.getState().Фото[0].Фото;
    } else {
      fot = props.src
    }
  
    if(fot === ""){
      elem = <img src={ src2 } alt = ""/>
    } else {
      elem = <img src={ fot } alt=""/>
    }
    return elem
  }    
  
  function PhotoID(props: {src: string}): JSX.Element{
    let elem = <></>
    let fot;
    if(props.src === undefined || props.src === ""){
      fot = Store.getState().Фото[1].Фото;
    } else {
      fot = props.src
    }
    if(fot === ""){
      elem = <img src={ src1 } alt = ""/>
    } else {
      elem = <img src={ fot } alt=""/>
    }
    return elem
  }
  
  function ID(props: {src: string}): JSX.Element{
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
  
  function Suprug(props:{value: boolean}):JSX.Element{
    let elem = <></>
    if(props.value)
      elem = <>
                <IonItem>
                  <IonLabel position="stacked">Дата регистрации брака</IonLabel>
                   <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                    className="m-input"
                    id='1'
                    value = { Store.getState().Анкета.ДатаРег }
                    autoComplete="off"
                    placeholder = "2001-01-01"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "anc", ДатаРег: (e.target.value as string)})

                    }}
                />
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
  
  function getStr(num: number){
    if(num !== undefined)
      return "₽" + num.toFixed().toString() 
    else return ""

  }

  function IButton1():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={()=>{
                setFABhidden(false);
            }}>
              Отменить
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() => {
              if(  Store.getState().Анкета.Фамилия !== "" 
                && Store.getState().Анкета.Имя !== ""
                && Store.getState().Анкета.Отчество !== ""
                && Store.getState().Анкета.ДатаРождения !== ""
                && Store.getState().Анкета.МестоРождения !== ""
                && Store.getState().Анкета.Статус !== ""
                && Store.getState().Анкета.МестоРаботы !== ""
                && Store.getState().Анкета.СтажРаботы !== 0
                && Store.getState().Анкета.Зарплата !== 0
              ){
                setGroup(1)
                sendData(0);
              }
            }}> Далее </IonButton>
          </IonCol>
        </IonRow>
      </>
    return elem
  }
  
  function IButton2():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(0)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() => {
              if(Store.getState().Паспорт.Серия !== "" 
                && Store.getState().Паспорт.Номер !== ""
                && Store.getState().Паспорт.КемВыдан !== ""
                && Store.getState().Паспорт.ДатаВыдачи !== ""
                && Store.getState().Паспорт.КодПодразделения !== ""
              ) setGroup(2)
              sendData(1)
            }}> Далее </IonButton>
          </IonCol>
        </IonRow>
        </>
    return elem
  }
  
  function IButton3():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(1)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() => {
              if(Store.getState().Адреса[0].Адрес !== "" 
                && Store.getState().Адреса[1].Адрес !== ""
              ) setGroup(3)
              sendData(2)
            }}> Далее </IonButton>
          </IonCol>
        </IonRow>
        </>
    return elem
  }
  
  function IButton4():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(2)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
                if(  Store.getState().Фото[0].Фото !== ""
                  && Store.getState().Фото[1].Фото !== ""
                  && Store.getState().Фото[2].Фото !== ""){

                    Store.dispatch({type: "anc", Пол: Store.getState().Анкета.Пол})
                    setGroup(4)

                }
              }}>Далее</IonButton>
          </IonCol>
        </IonRow>
        </>
    return elem
  }
  
  function IButton5():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(3)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              if(sogl1) setGroup(5)
              }}>Далее</IonButton>
          </IonCol>          
        </IonRow>
        </>
    return elem
  }

  function IButton6():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(4)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
                if(sogl2) setGroup(6)
              }}>Далее</IonButton>
          </IonCol>          
        </IonRow>
        </>
    return elem
  }

  function IButton7():JSX.Element{
    let elem = <></>
      elem = <>
        <IonRow>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
              setGroup(5)
            }}>Назад</IonButton>
          </IonCol>
          <IonCol>
            <IonButton color="medium" expand="block" onClick={() =>{
                setFABhidden(false);
              }}>Отказаться</IonButton>
          </IonCol>          
          <IonCol>
            <IonButton color="success" expand="block" onClick={() =>{
              if(
                  ((Dec.getState().НаКарту && (Dec.getState().Карта !== "")) || (Dec.getState().поТелефону && (Dec.getState().Телефон !== "")))
               && Dec.getState().Сумма !== 0 
               && Dec.getState().Срок !== 0               
              )
                sendDec()
              }}>Получить деньги</IonButton>
          </IonCol>
        </IonRow>
        </>
    return elem
  }
  
  function Page1():JSX.Element{
    return (
      <IonCard class="card">
      <IonCardHeader class="a-center">Анкета</IonCardHeader>
      <IonCardContent>
        <IonList>
            <IonItem>
              <IonLabel position="stacked">Фамилия:</IonLabel>
              <IonInput clearInput type="text"
                autocomplete="off"
                onIonChange={e => {
                    Store.dispatch({type: "anc", Фамилия: e.detail.value!});}}
                value={Store.getState().Анкета.Фамилия} ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Имя:</IonLabel>
              <IonInput clearInput type="text"
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", Имя: e.detail.value!});}}
              value={Store.getState().Анкета.Имя} ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Отчество:</IonLabel>
              <IonInput clearInput type="text"
                autocomplete="off"
                 onIonChange={e => {
                  Store.dispatch({type: "anc", Отчество: e.detail.value!});}}
              value={Store.getState().Анкета.Отчество} ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Дата рождения</IonLabel>

               <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='2'
                    value = { Store.getState().Анкета.ДатаРождения }
                    placeholder = "2000-01-01"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "anc", ДатаРождения: (e.target.value as string)})
     
                    }}
                />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Место рождения</IonLabel>
              <IonInput type="text" 
                autocomplete="off"
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
                     setSupr(e.detail.value! === "Женат" || e.detail.value! === "Замужем")
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
            <Suprug value={ supr }/>
            <IonItem>
              <IonLabel position="stacked">Количество детей</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", Дети: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.Дети} ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Дети в вашем обеспечении</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", ДетиВО: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.ДетиВО} ></IonInput>
            </IonItem>                 
            <IonItem>
              <IonLabel position="stacked">Иные иждивенцы</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", Иждивенцы: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.Иждивенцы} ></IonInput>
            </IonItem>   
            <IonItem>
              <IonLabel position="stacked">Место работы</IonLabel>
              <IonInput type="text" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", МестоРаботы: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.МестоРаботы} ></IonInput>
            </IonItem>   
            <IonItem>
              <IonLabel position="stacked">Адрес работы</IonLabel>
              <IonInput type="text" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", ФактАдресРаботы: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.ФактАдресРаботы} ></IonInput>
            </IonItem>   
            <IonItem>
              <IonLabel position="stacked">Стаж работы</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", СтажРаботы: parseInt(e.detail.value as string)});
                  }
              }
              value={Store.getState().Анкета.СтажРаботы} ></IonInput>
            </IonItem>   
            <IonItem>
              <IonLabel position="stacked">Должность</IonLabel>
              <IonInput type="text" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", Должность: e.detail.value!});
                  }
              }
              value={Store.getState().Анкета.Должность} ></IonInput>
            </IonItem>                
            <IonItem>
              <IonLabel position="stacked">Зарплата</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", Зарплата: parseInt(e.detail.value! as string)});
                  }
              }
              value={Store.getState().Анкета.Зарплата} ></IonInput>
            </IonItem>     
            <IonItem>
              <IonLabel position="stacked">ПрочиеДоходы</IonLabel>
              <IonInput type="number" 
                autocomplete="off"
                onIonChange={e => {
                  Store.dispatch({type: "anc", ПрочиеДоходы: parseInt(e.detail.value as string)});
                  }
              }
              value={Store.getState().Анкета.ПрочиеДоходы} ></IonInput>
            </IonItem>     
          </IonList>
      </IonCardContent>
      <IButton1 />
    </IonCard>
  
  ) 
  }
  
  function Page2():JSX.Element{
    return (
      <IonCard class="card">
      <IonCardHeader class="a-center">Паспорт</IonCardHeader>
      <IonCardContent>
        <IonList>
            <IonItem>
              <IonLabel position="stacked">Серия:</IonLabel>
               <MaskedInput
                    mask={[/[1-9]/, /\d/, ' ', /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='3'
                    value = { Store.getState().Паспорт.Серия }
                    placeholder = "00 00"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "doc", Серия: (e.target.value as string)})

                    }}
                />
            </IonItem>

 
            <IonItem>
              <IonLabel position="stacked">Номер:</IonLabel>
              <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='4'
                    value = { Store.getState().Паспорт.Номер }
                    placeholder = "000000"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "doc", Номер: (e.target.value as string)})
         
                    }}
                />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Кем выдан:</IonLabel>
              <IonInput clearInput 
                autocomplete="off"
                onIonChange={e => {
                    Store.dispatch({type: "doc", КемВыдан: e.detail.value!});
                  }
                }
                value={Store.getState().Паспорт.КемВыдан} ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Дата выдачи:</IonLabel>
              <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='5'
                    value = { Store.getState().Паспорт.ДатаВыдачи }
                    placeholder = "2015-01-01"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "doc", ДатаВыдачи: (e.target.value as string)})
    
                    }}
                />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Код подразделения:</IonLabel>
              <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    id='6'
                    value = { Store.getState().Паспорт.КодПодразделения }
                    placeholder = "100-001"
                    type='text'
                    onChange={(e) => {
                      Store.dispatch({type: "doc", КодПодразделения: (e.target.value as string)})
            
                    }}
                />
            </IonItem>
          </IonList>
        </IonCardContent>
        <IButton2 />
      </IonCard>
    )
  }
  
  function Page3():JSX.Element{
    return (
      <>
        <IonCard>
          <IonCardHeader class="a-center">Адреса</IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Фактический адрес</IonLabel>
                <IonInput clearInput 
                  autocomplete="off"
                  onIonChange={e => {
                      Store.dispatch({type: "adr", НомерСтроки: 1, Тип: "ФактАдрес", Адрес: e.detail.value!});}}
                  value={Store.getState().Адреса[0].Адрес} ></IonInput>
              </IonItem>
            </IonList>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Адрес по прописке</IonLabel>
                <IonInput clearInput 
                  autocomplete="off"
                  onIonChange={e => {
                      Store.dispatch({type: "adr", НомерСтроки: 2, Тип: "АдресПоПрописке", Адрес: e.detail.value!});}}
                  value={Store.getState().Адреса[1].Адрес} ></IonInput>
              </IonItem>
            </IonList>            
          </IonCardContent>
          <IButton3 />
        </IonCard>
      </>
    )
  }
  
  function Page4():JSX.Element{
    return (
      <>
        <IonCard class= "card-1">
          <IonCardHeader class="a-center">Фотография</IonCardHeader>
          <IonCardContent>
            <Photo src={foto}/>
            <IonButton color="medium" expand="block" onClick={() => {Clicked(1)}}>
              <IonIcon slot="icon-only"  icon={cameraOutline}/>
            </IonButton>
          </IonCardContent>
        </IonCard>   
  
        <IonCard class= "card-1">
          <IonCardHeader class="a-center">Фотография с паспортом</IonCardHeader>
          <IonCardContent>
            <PhotoID src={fsp}/>
            <IonButton color="medium" expand="block" onClick={() => {Clicked(2)}}>
              <IonIcon slot="icon-only"  icon={cameraOutline}/>
            </IonButton>
          </IonCardContent>
        </IonCard>
  
        <IonCard class= "card-1">
          <IonCardHeader class="a-center">Паспорт</IonCardHeader>
          <IonCardContent>
            <ID src={psp}/>
            <IonButton color="medium" expand="block" onClick={() => {Clicked(3)}}>
              <IonIcon slot="icon-only"  icon={cameraOutline}/>
            </IonButton>
          </IonCardContent>      
        </IonCard> 
        <IonCard>
          <IButton4 />
        </IonCard>
      </>   
    )
  }
  
  function Page5():JSX.Element{
    return (
      <IonCard class="card">
      <IonCardHeader class="a-center">Общие условия договора потребительского займа</IonCardHeader>
        <IonCardContent>
          <IonRow><IonCol class="a-right p-0"><IonText>Приложение № 1</IonText></IonCol></IonRow>
          <IonRow><IonCol class="a-right p-0"><IonText>к Приказу Генерального директора</IonText></IonCol></IonRow>
          <IonRow><IonCol class="a-right p-0"><IonText>ООО «Микрокредитная компания Аванс-РеКи-плюс»</IonText></IonCol></IonRow>
          <IonRow><IonCol class="a-right p-0"><IonText>от 26.05.2020 г. № АР-12</IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>1. ОПРЕДЕЛЕНИЯ</b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
1.1. Акцепт — согласие Кредитора с Офертой, выраженное путем совершения конклюдентных действий — выдачи займа на установленных Офертой условиях. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.2. Анкета — Заявление (Заявка) — документ, содержащий данные о Клиенте, предоставленные Клиентом самостоятельно при регистрации в мобильном приложении отражающий желание Клиента получить Заём на определенный срок и на определенную сумму; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.3. График платежей — предоставляемая Клиенту при заключении Договора Займа информация о суммах и датах платежей Клиента по Договору с указанием отдельно сумм, направляемых на погашение основного долга, сумм, направляемых на погашение процентов, а также общей суммы выплат Клиента в течение срока действия Договора; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.4. Денежный перевод — перевод денежных средств Кредитором Клиенту на его Счет/банковскую карту; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.5. День погашения Задолженности / части Задолженности — день поступления денежных средств, уплаченных в счет погашения Задолженности на расчетный счет Кредитора.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.6. Договор Займа (далее по тексту — Договор) — договор займа (микрозайма) между Кредитором и Клиентом, заключенный путем Акцепта Кредитором Оферты Клиента. Договор включает в себя в качестве составных и неотъемлемых частей настоящие Общие условия и Индивидуальные условия потребительского займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.7. Задолженность — все денежные суммы, подлежащие уплате Клиентом Кредитору по Договору, включая сумму Основного долга, сумму начисленных, но неуплаченных процентов за пользование денежными средствами, сумму начисленной неустойки; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.8. Заём (потребительский заём) — денежные средства в валюте Российской Федерации, предоставляемые Кредитором Клиенту в соответствии с Договором займа в сумме, не превышающей 30000 (тридцать тысяч) рублей. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.9. Индивидуальные условия договора потребительского займа (Индивидуальные условия Договора) — часть условий Договора, индивидуально согласованных Кредитором и Клиентом, представленная в виде таблицы по форме, установленной нормативным актом Банка России, и являющаяся частью Оферты.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.10. Личный Кабинет Клиента — персональный раздел Клиента в мобильном приложении, доступ к которому осуществляется с аутентификацией по логину и паролю.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.11. Клиент (заемщик) — физическое лицо, обратившееся к Кредитору с намерением получить, получающее или получившее потребительский заем. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.12. Кредитор — Общество с ограниченной ответственностью «Микрокредитная компания Аванс-РеКи-плюс», ОГРН 1181447007851, регистрационный номер записи в государственном реестре микрофинансовых организаций 180369800889, адрес места нахождения: Российская Федерация, 677013, Республика Саха (Якутия), город Якутск, улица Сергеляхская, дом 2/4, квартира 14; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.13. Общие условия — настоящие Общие условия договора потребительского займа ООО «Микрокредитная компания Аванс-РеКи-плюс». 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.14. Основной Долг — сумма предоставленного Кредитором Клиенту Займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.15. Оферта (оферта на предоставление займа / заключение договора потребительского займа) — документ, содержащий Индивидуальные условия договора потребительского займа, выражающий предложение Клиента Кредитору о заключении Договора Займа (договора потребительского займа) в соответствии настоящими Общими условиями договора потребительского займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.16. Оферта на изменение условий Договора — документ, содержащий предложение Кредитора Клиенту о продлении срока возврата Займа, о реструктуризации задолженности по договору займа; формируется на основании заявления Клиента об изменении условий Договора. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.17. Политика Конфиденциальности — политика конфиденциальности, которая описывает хранение и обработку персональных данных Клиентов и Потенциальных Клиентов.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.18. Реструктуризация — изменение условий Договора Займа, в частности: срока предоставления Займа (его продление), размера процентов за пользование Займом, размера имеющейся Задолженности Клиента, срока уплаты платежа (платежей). 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
1.19. Счёт — банковский счет, на который Клиенту перечисляется сумма Займа в соответствии с акцептованной Клиентом Офертой и настоящими Общими условиями, в т.ч. счет банковской карты, принадлежащей Клиенту. 
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>2. ЗАКЛЮЧЕНИЕ ДОГОВОРА ЗАЙМА </b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
2.1. Клиент, имеющий намерение получить Заём, заходит на Сайт или обращается к Организации-Партнеру Кредитора, и направляет Кредитору Анкету-Заявление путём заполнения формы, размещенной на Сайте.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.2. При заполнении Анкеты-Заявления Клиент знакомится с документами «Согласие на обработку персональных данных» и «Согласия и обязательства Заемщика», размещенными на Сайте/ предоставленными Организацией-Партнером Кредитора.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.3. По завершении заполнения Анкеты-Заявления Клиент путем проставления кода, полученного посредством SMS-сообщение от Кредитора (простой электронной подписи), подписывает Анкету-Заявление и дает согласие на обработку персональных данных, а также принимает на себя обязательства, содержащиеся в документе «Согласия и обязательства Заемщика». 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.4. Если при заполнении Анкеты-Заявления Клиент указал индивидуальный номер налогоплательщика (ИНН) или страховой номер индивидуального лицевого счета застрахованного лица в системе персонифицированного учета Пенсионного фонда Российской Федерации (СНИЛС), то Клиент проходит упрощенную идентификацию в соответствии с законодательством Российской Федерации. При этом упрощенная идентификация считается пройденной в случае проставления Клиентом кода, полученного посредством SMS-сообщения от Кредитора. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.5. В случае несогласия Клиента с условиями документов «Согласие на обработку персональных данных» и «Согласия и обязательства Заемщика», а также в случае, если Клиент не соответствует требованиям, указанным в документе «Согласия и обязательства Заемщика», Договор займа не заключается.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.6. На основании полученной Анкеты-Заявления программным обеспечением Кредитора в личном кабинете заемщика на сайте Кредитора формируется Оферта, содержащая Индивидуальные условия договора потребительского займа.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.7. После ознакомления с условиями Оферты Клиент подписывает Оферту, принимая на себя обязательство возвратить сумму займа и начисленные на нее проценты за пользование займом в размере и сроки, предусмотренные Офертой, а также предоставить Кредитору возможность осуществления контроля за целевым использованием Займа, если заем выдан на определенные договором цели.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.8. Клиент вправе не подписывать Оферту. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.9. Оферта признается подписанной Клиентом и направленной Кредитору в случае, если течение 5 (пяти) рабочих дней со дня предоставления ему Оферты Клиент: 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.9.1. подпишет размещенную в Личном кабинете Оферту специальным кодом (простой электронной подписью), полученным в SMS-сообщении от Кредитора. Стороны согласовали, что в соответствии с положениями п. 2 статьи 160 Гражданского кодекса Российской Федерации Оферта с указанной в ней идентифицирующей Клиента информацией (данные паспорта гражданина Российской Федерации, место регистрации Клиента, номер мобильного телефона, адрес электронной почты), также специального кода (п. 2.4), считается надлежаще подписанной Клиентом аналогом собственноручной подписи (совокупностью идентифицирующей информации); или 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.9.2. подпишет Оферту путем направления ответного SMS-сообщения Кредитору, признаваемого Сторонами простой электронной подписью. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.10. После подписания Оферты Клиент самостоятельно выбирает из предложенных вариантов способ получения Займа, заполняя необходимые поля (реквизиты банковской карты, номер банковского счета и реквизиты банка).
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.11. Кредитор акцептует подписанную Клиентом Оферту путем совершения конклюдентных действий — выдачи займа на установленных Офертой условиях — или в соответствии с Правилами предоставления и обслуживания займов ООО «Микрокредитная компания Аванс-РеКи-плюс» отказывает в заключении Договора, направляя Клиенту соответствующее сообщение. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.12. В случае акцепта Кредитором Оферты Кредитор в течение 5 (пяти) рабочих дней перечисляет сумму займа, на банковский счет/банковскую карту Клиента, указанный в Анкете-заявлении. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
2.13. Договор займа считается заключенным со дня передачи Клиенту денежных средств (дня получения займа), которым признается день зачисления суммы Займа на Счёт/банковскую карту, а именно: день получения от оператора по переводу денежных средств сообщения об осуществлении перевода суммы займа в адрес Клиента, при условии, что Клиент не докажет более позднюю дату фактического получения денежных средств. 
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>3. РАСЧЕТ ПРОЦЕНТОВ  </b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
3.1. Проценты за пользование Займом будут начисляться на остаток суммы Займа со дня, следующего за днём получения Займа, до даты погашения полной суммы Займа, если иное не установлено настоящими Общими условиями. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
3.2. При расчёте процентов за пользование Займом, количество дней в году принимается равным 365/366.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
3.3. Процентная ставка по займу в процентах годовых указывается в индивидуальных условиях договора потребительского займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
3.4. В случае невозврата суммы Займа в установленный срок, на эту сумму будут начисляться и подлежат уплате проценты за пользование заемными средствами в размере, предусмотренном п. 19 Индивидуальных условий договора потребительского займа, со дня, когда сумма Займа должна была быть возвращена, до дня ее возврата Кредитору.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
3.5. Проценты за пользование Займом не начисляются со дня смерти Заемщика, при условии получения Кредитором документов, подтверждающих факт смерти Заемщика.
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>4. ВОЗВРАТ СУММЫ ЗАЙМА</b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
4.1. Возврат Займа производится в соответствии с Графиком платежей внесением единовременного платежа, состоящего из суммы Основного долга и процентов за весь срок пользования займом.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.2. Заём может быть погашен досрочно, полностью или частично, без предварительного уведомления Кредитора в любой день, если иное не указано в Оферте. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.3. Досрочное погашение Займа, График платежей которого предусматривает один платеж, осуществляется платежом/платежами, включающим/включающими в себя проценты за время пользования займом и основную сумму долга. Оставшаяся сумма основного долга и начисленные на нее проценты за период со дня, следующего за днем частичного досрочного погашения, по День возврата займа должна быть уплачена в День возврата займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.4. Днем возврата займа будет считаться день зачисления суммы задолженности на расчетный счет Кредитора. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5. Кредитор направляет денежные средства на погашение задолженности по Договору Займа в следующей очередности: 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.1. задолженность по процентам; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.2. задолженность по основному долгу; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.3. неустойка (пеня) в размере, определенном в соответствии с п.12 Индивидуальных условий договора потребительского займа; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.4. проценты, начисленные за текущий период платежей;
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.5. сумма основного долга за текущий период платежей; 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.5.7. иные платежи, предусмотренные законодательством Российской Федерации о потребительском кредите (займе) или договором потребительского кредита (займа). 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.6. Клиент принимает на себя обязательства в соответствии с действующим налоговым законодательством осуществлять уплату налога на доходы физических лиц с дохода в виде выгоды, полученной при получении каких-либо бонусов (призов, подарков, прощения задолженности Кредитором). 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
4.7. Соглашаясь с настоящими Общими условиями, Клиент заявляет, что излишне перечисленные Кредитору в счет погашения задолженности денежные средства передаются Кредитору в дар в случае, если Клиент не потребовал возврата излишне перечисленных денежных средств до пятнадцатого числа месяца, следующего за месяцем, в котором произошло зачисление денежных средств на счет Кредитора.
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>5. ИЗМЕНЕНИЕ УСЛОВИЙ ДОГОВОРА </b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
5.1. Индивидуальные условия Договора могут быть изменены по соглашению Сторон путем совершения действий по подтверждению новых условий Договора с использованием Личного кабинета. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
5.2. Договор считается измененным с момента получения Кредитором согласия Клиента с Офертой на изменение условий Договора, выражающегося в совершении Клиентом следующих конклюдентных действий: 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
5.2.1. при продлении срока возврата Займа — в уплате суммы, равной сумме процентов за пользование Займом, начисленных за период, на который продлевается срок возврата Займа по Договору. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
5.2.2. при реструктуризации (изменение условий договора, за исключением случаев изменения только одного условия — срока действия Договора (п.5.1)) — в уплате согласованной Сторонами суммы, которую Кредитор при получении направляет на погашение Задолженности по Договору в установленной п.4.5 настоящих Общих условий очередности. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
5.3. Оплата Клиентом платежей, предусмотренных п.5.2 настоящих Общих условий, должна быть осуществлена единовременным платежом в срок, не превышающий один рабочий день с даты получения Клиентом Оферты на изменение условий Договора. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
5.4. О дате поступления платежей, предусмотренных п.5.2 настоящих Общих условий, кредитор уведомляет Клиента посредством СМС. 
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>6. ОТВЕТСТВЕННОСТЬ</b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
6.1. В случае нарушения Клиентом установленного срока платежа по Займу, Кредитор вправе потребовать уплаты неустойки, начисляемой на просроченную сумму потребительского займа (основного долга) за соответствующий период нарушения обязательств в размере, установленном Индивидуальными условиями Договора.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
6.2. Уплата неустойки не освобождает Клиента от исполнения обязательств по возврату Займа и процентов за пользование Займом. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
6.3. В случае задержки при погашении Займа Кредитор имеет право привлечь третье лицо для взыскания задолженности в досудебном порядке или обратиться в суд за защитой своих нарушенных прав и законных интересов. Кредитор уведомляет Клиента о привлечении иного лица для осуществления с Клиентом взаимодействия, направленного на возврат просроченной задолженности путем направления сообщений через Личный кабинет Клиента в мобильном приложении, логин и пароль для доступа в который предоставляется Кредитором Клиенту после регистрации Клиента на сайте. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
6.4. В случае нарушения Клиентом принятых на себя обязательств по погашению Займа, Кредитор в соответствии с Федеральным законом от 30.12.2004 г. № 218-ФЗ «О кредитных историях» передает данные о просрочке возврата Займа в бюро кредитных историй. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
6.5. Заемщик обязуется информировать Общество об изменении сведений (перемене фамилии, имени, отчества, места жительства, данных документа, удостоверяющего личность, номеров телефонов и иных реквизитов), и предоставлять в Общество документы и сведения, подтверждающие такие изменения, не позднее 7 (Семи) календарных дней со дня вступления изменений в силу. Общество вправе требовать от Заемщика или его представителя представления документов и сведений в соответствии с законодательством Российской Федерации и нормативными актами Банка России. Общество вправе отказать в установлении деловых отношений с Клиентом, а также отказать в выполнении распоряжения Клиента о совершении операции по основаниям, указанным в законодательстве Российской Федерации и нормативными правовыми актами Банка России. 
          </IonText></IonCol></IonRow>
          <IonRow><IonCol><IonText><b>7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ </b></IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
7.1. Разъяснение порядка оформления заявления о том, что непосредственное взаимодействие Кредитора с Клиентом и взаимодействие с использованием телеграфных сообщений, текстовых, голосовых и иных сообщений, передаваемых по сетям электросвязи, в том числе подвижной радиотелефонной связи, а также порядка оформления заявления об отказе от взаимодействия указанными способами направляется Клиенту Кредитором по почте заказным письмом с уведомлением о вручении. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.2. Кредитор вправе уступить полностью или частично свои права (требования) по Договору только юридическому лицу, осуществляющему профессиональную деятельность по предоставлению потребительских займов, юридическому лицу, осуществляющему деятельность по возврату просроченной задолженности физических лиц в качестве основного вида деятельности, специализированному финансовому обществу или физическому лицу, указанному в письменном согласии заемщика (Клиента), полученном кредитором после возникновения у заемщика просроченной задолженности по договору потребительского займа. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.3. Все споры и разногласия, которые могут возникнуть между Кредитором и Клиентом, передаются на рассмотрение суда.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.4. В случае неисполнения или ненадлежащего исполнения обязательств по Договору Займа, Кредитор вправе обратиться в суд согласно действующему процессуальному законодательству Российской Федерации.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.5. Требования к Кредитору могут быть направлены в суд по правилам подсудности, установленным законодательством Российской Федерации о защите прав потребителей.
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.6. Претензионный порядок рассмотрения спора не предусмотрен. 
          </IonText></IonCol></IonRow><IonRow><IonCol class="p-0"><IonText>
7.7. В случае неисполнения Клиентом обязательств и обращения Кредитором в судебные органы, может быть использована процедура взыскания Задолженности (суммы основного долга, процентов и неустойки) в порядке выдачи судебного приказа.           
          </IonText></IonCol></IonRow>

          <IonRow class="i-row">
              <IonCol size="2">
                  <IonCheckbox checked={onCard} onIonChange={e => {
                      setSogl1(e.detail.checked);
                    }} 
                    color="success"
                  />
              </IonCol>
              <IonCol>
                <IonText>Согласен с условиями договора</IonText>
              </IonCol>         
            </IonRow>

        </IonCardContent>
        <IButton5 />
      </IonCard>
    )
  }

  function Page6():JSX.Element{
    return (
      <IonCard class="card">
        <IonCardHeader class="a-center">Согласие на обработку персональных данных</IonCardHeader>
        <IonCardContent>
          {/* <IonRow><IonCol class="a-center p-0"><IonText>Согласие на обработку персональных данных</IonText></IonCol></IonRow> */}
          <IonRow><IonCol class="p-0"><IonText>
            Я, {Store.getState().Анкета.Фамилия} {Store.getState().Анкета.Имя}  {Store.getState().Анкета.Отчество} далее Субъект), зарегистрирован {Store.getState().Адреса[1].Адрес}, {Store.getState().Паспорт.Серия} {Store.getState().Паспорт.Номер} выдан {Store.getState().Паспорт.КемВыдан} {Store.getState().Паспорт.ДатаВыдачи} не возражаю против обработки  ООО «Микрокредитная компания Аванс-РеКи-Плюс» (далее Оператор), расположенным по адресу: _г.Якутск, кул.Сергеляхская, д.2/4. кв.14__, моих персональных данных на следующих условиях:
          </IonText></IonCol></IonRow>
          <IonRow><IonCol class="p-0"><IonText>
            2. Перечень персональных данных Субъекта, передаваемых Оператору на обработку:
          </IonText></IonCol></IonRow>   
          <IonRow><IonCol size="2"/><IonCol class="p-0"><IonText>
            1) ФИО
          </IonText></IonCol></IonRow>    
          <IonRow><IonCol size="2"/><IonCol class="p-0"><IonText>
            2) Паспортные данные
          </IonText></IonCol></IonRow>   
          <IonRow><IonCol size="2"/><IonCol class="p-0"><IonText>
            3) Дата рождения
          </IonText></IonCol></IonRow>   
          <IonRow><IonCol size="2"/><IonCol class="p-0"><IonText>
            4) Место рождения
          </IonText></IonCol></IonRow>   
          <IonRow><IonCol size="2"/><IonCol class="p-0"><IonText>
            5) Адрес регистрации
          </IonText></IonCol></IonRow> 
          <IonRow><IonCol class="p-0"><IonText>
            3. Согласие даётся Субъектом с целью проверки корректности предоставленных субъектом сведений, принятия решения о предоставлении Субъекту услуг, для заключения с Оператором любых договоров и их дальнейшего исполнения, принятия решений или совершения иных действий, порождающих юридические последствия в отношении Субъекта и иных лиц.
          </IonText></IonCol></IonRow>    
          <IonRow><IonCol class="p-0"><IonText>
            4. Обработка персональных данных (за исключением хранения) прекращается по достижению цели обработки или прекращения обязательств по заключённым договорам и соглашениям или исходя из документов Оператора, регламентирующих вопросы обработки персональных данных.
          </IonText></IonCol></IonRow>  
          <IonRow><IonCol class="p-0"><IonText>
            5. Настоящее согласие действует до даты его отзыва мною путем направления в ООО «Микрокредитная компания Аванс-РеКи-Плюс» письменного сообщения об указанном отзыве в произвольной форме, если иное не установлено законодательством Российской Федерации. В этом случае оператор прекращает обработку персональных данных Субъекта, а персональные данные подлежат уничтожению, если отсутствуют иные правовые основания для обработки, установленные законодательством Российской Федерации или документами Оператора, регламентирующих вопросы обработки персональных данных.
          </IonText></IonCol></IonRow>  
          <IonRow><IonCol class="p-0"><IonText>
            6. Данное согласие действует в течение всего срока обработки персональных данных до момента, указанного в п.4 или п.5 данного согласия.
          </IonText></IonCol></IonRow>  

          <IonRow class="i-row">
            <IonCol size="2">
              <IonCheckbox checked={onCard} onIonChange={e => {
                setSogl2(e.detail.checked);
              }} 
                color="success"
            />
            </IonCol>
            <IonCol>
                <IonText>Согласен на обработку моих персональных данных</IonText>
            </IonCol>         
          </IonRow>

        </IonCardContent>
        <IButton6 />
      </IonCard>
    )
  }

  function  Page7():JSX.Element{
    return (
      <IonCard class="card">
      <IonCardHeader class="a-center">Заявление</IonCardHeader>
      <IonCardContent>
          <IonGrid>
            <IonRow color="dark">
              <IonCol class="col-1">
                Сумма
              </IonCol>
              <IonCol size="8">
                
              </IonCol>
              <IonCol class="a-right">
                {Dec.getState().Сумма}
              </IonCol>
            </IonRow>
            <IonRow color="dark">
                <IonRange min={1000} max={25000} step={1000} value={sum} 
                    ticks snaps pin debounce={500}
                    onIonChange = {e =>{
                          Dec.dispatch({type: "dec", Сумма: e.detail.value as number})
                          setSum(e.detail.value as number)              
                        }} />
            </IonRow>
            <IonRow class="i-row" color="dark">
              <IonCol class="col-1">
                Срок
              </IonCol>
              <IonCol size="8">
                
              </IonCol>
              <IonCol class="a-right">
                {Dec.getState().Срок}
              </IonCol>
            </IonRow>
            <IonRow>
                <IonRange min={3} max={25} step={1} value={srok} 
                    ticks snaps pin debounce={500}
                    onIonChange = {e =>{
                           Dec.dispatch({type: "dec", Срок: e.detail.value as number})
                          setSrok(e.detail.value as number)              
                        }} />

            </IonRow>
            <IonRow class="i-row">
              <IonCol size="10" class="col-1">
                Итого сумма + проценты ({Dec.getState().Процент}% в день)
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="a-right f-1">
                <IonText> {getStr(Dec.getState().Сумма)} + {getStr(Dec.getState().Проценты)} = <b>{getStr(Dec.getState().Итого)}</b> </IonText>
              </IonCol>
            </IonRow>
            <IonRow class="i-row">
              <IonCol size="2">
                  <IonCheckbox checked={onCard} onIonChange={e => {
                      setOnCard(e.detail.checked);
                      Dec.dispatch({type: "dec", НаКарту: e.detail.checked as boolean})
                      setOnTel(!e.detail.checked);
                      Dec.dispatch({type: "dec", поТелефону: !(e.detail.checked as boolean)})
                    }} 
                    color="success"
                  />
              </IonCol>
              <IonCol>
                <IonText>на карту</IonText>
              </IonCol>         
            </IonRow>
            <IonRow>
              <IonCol>
                <PlatCard />
              </IonCol>
            </IonRow>

            <IonRow class="i-row">
              <IonCol size="2">
                  <IonCheckbox checked={onTel} onIonChange={e => {
                      setOnTel(e.detail.checked);
                      Dec.dispatch({type: "dec", поТелефону: e.detail.checked as boolean})
                      setOnCard(!e.detail.checked);
                      Dec.dispatch({type: "dec", НаКарту: !(e.detail.checked as boolean)})
                    }} 
                    color="success"
                  />
              </IonCol>
              <IonCol>
                <IonText>по телефону</IonText>
              </IonCol>         
            </IonRow>
            <PlatPhone />
          </IonGrid>
        </IonCardContent>
        <IButton7 />
      </IonCard>
    )
  }
  
  function  PlatCard():JSX.Element{
    let elem = <></>
    if(onCard)
     elem =
         <IonItem>
           <IonLabel position="stacked"> Платежная карта </IonLabel>
  
           <MaskedInput
                    mask={[/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className="m-input"
                    id='7'
                    placeholder = "0000-0000-0000-0000"
                    autoComplete="off"
                    type='text'
                    onChange={(e) => {
                      Dec.dispatch({type: "dec", Карта: (e.target.value as string)})
                    }}
                />
         </IonItem>

    return elem
 }

  function  PlatPhone():JSX.Element{
  let elem = <></>
  if(onTel)
   elem = <IonRow>
     <IonCol>
       <IonItem>
         <IonLabel position="stacked"> Телефон </IonLabel>
         <IonInput  type="text"
           onIonChange={(e)=>{ 
              Dec.dispatch({type: "dec", Телефон: e.detail.value})
           }}
         >
         </IonInput>
         <MaskedInput
                    mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                    className="m-input"
                    autoComplete="off"
                    placeholder="+7 (914) 000-00-00"
                    id='1'
                    type='text'
                    onChange={(e) => {
                      Dec.dispatch({type: "dec", Телефон: (e.target.value as string)})
                    }}
                />
       </IonItem>
     </IonCol>
   </IonRow>
  return elem
}

  function  Groups():JSX.Element{
    let elem = <></>
    switch(group){
      case 0: return <Page1 />
      case 1: return <Page2 />
      case 2: return <Page3 />        
      case 3: return <Page4 />      
      case 4: return <Page5 />      
      case 5: return <Page6 />        
      case 6: return <Page7 />      
    }
    return elem
  }
  
  function Declaration(): JSX.Element{

    let elem = <></>
    if(FABhidden) 
      elem = <Groups />
      
    return elem
  }

  function Declares(): JSX.Element {
    let elem = <></>

    if(!FABhidden)
      if(info !== undefined)
        for(let i = 0; i < info.length;i++){
          elem = <>
            {elem}
            <IonCard>
              <IonCardHeader>{info[i].Документ} {info[i].Номер} </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>{info[i].Документ === "Кредит" ? "Выдан:" : "Дата:"}</IonCol>
                    <IonCol class="a-right"> {info[i].Дата}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>Сумма:</IonCol><IonCol class="a-right"> {info[i].Сумма}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>Срок:</IonCol><IonCol class="a-right">{info[i].Срок}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>Процент:</IonCol><IonCol class="a-right">{info[i].Процент}</IonCol>
                  </IonRow>     
                  {info[i].Документ === "Кредит" ? <></> :
                  <IonRow>
                    <IonCol>Статус:</IonCol><IonCol class="a-right">{info[i].Статус}</IonCol>
                  </IonRow>}       
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {info[i].Документ === "Кредит" ?
            <IonCard>
              <IonCardHeader>К оплате </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                   <IonRow>
                    <IonCol>Остаток:</IonCol><IonCol class="a-right"> {info[i].Остаток}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>Проценты:</IonCol><IonCol class="a-right"> {info[i].Проценты}</IonCol>
                  </IonRow>              
                  <IonRow>
                    <IonCol>Всего:</IonCol><IonCol class="a-right"> {info[i].Проценты + info[i].Остаток}</IonCol>
                  </IonRow>              
                </IonGrid>
              </IonCardContent>
            </IonCard>
            : <></> }
          </>
        }
    
    return elem
  }

  return (
    <IonPage>
       <IonLoading
        isOpen={loading}
        message={'Подождите...'}
      />

      <IonHeader color={t_color}>
        <IonToolbar class="a-center" color={t_color}>
          <IonTitle>МФО</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
 
        <Declaration />

        <Declares />

        <IonFab color="primary" vertical="bottom" horizontal="end" slot="fixed"
            hidden = {FABhidden}
          >
            <IonFabButton color="primary" onClick={() => {
                  setFABhidden(true);
            }}>
              <IonIcon icon={addOutline}/>
            </IonFabButton>
        </IonFab> 

      </IonContent>

      {/* Регистрация ошибка связи */}
      <IonAlert
          isOpen={e_reg}
          onDidDismiss={() => setEReg(false)}
          header={'Ошибка'}
          message={'Не удалось связаться с сервером'}
          buttons={['Ok'
          ]} />   

      {/* Документ создан */}
      <IonAlert
          isOpen={s_dec}
          onDidDismiss={() => setSDec(false)}
          header={'Успех'}
          message={'Заявление создано'}
          buttons={['Ok'
          ]} />   
               
      {/* Документ ошибка создания */}
      <IonAlert
          isOpen={e_dec}
          onDidDismiss={() => setEDec(false)}
          header={'Ошибка'}
          message={'Документ не может быть создан, попробуйте еще раз завтра'}
          buttons={['Ok'
          ]} />   
               
    </IonPage>
  );
};

export default Tab3;
