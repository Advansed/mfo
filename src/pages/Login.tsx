import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonAlert, IonLoading
    , IonCol, IonInput, IonItem, IonLabel, IonRow, IonText, IonModal
    , IonFooter, IonList, IonCard, IonCardContent, IonCardHeader } from '@ionic/react';

import './Main.css';
import { useHistory } from 'react-router-dom';

import { Store, getData } from './Store'
import MaskedInput  from '../mask/reactTextMask'


interface reg_type{
    Телефон: string
    элПочта: string
    Пароль: string
    Пароль1: string
  }
  
  const I_Reg = {
    Телефон: "",
    элПочта: "",
    Пароль: "",
    Пароль1: "",
  }

  
const Tab2: React.FC = () => {

  let history = useHistory();

    const [reg,       setReg] =       useState(false)
    const [regi,      setRegi] =      useState(false)
    const [s_reg,     setSReg] =      useState(false)  
    const [e_reg,     setEReg] =      useState(false)
    const [e_pass,    setEPass] =     useState(false)
    const [regData,   setRegData] =   useState<reg_type>(I_Reg)
    const [s_auth,    setSAuth] =     useState(false)
    const [e_auth,    setEAuth] =     useState(false)
    const [loading,   setLoading] =   useState(false)
    const [e_sms,     setESMS] =      useState(false)
    const [login,     setLogin] =     useState("")
    const [password,  setPassword] =  useState("")

    // async function SMSAuth(){

    // }

    async function  Auth(log = "", pass = ""){
      
      let params = {
        params: {
          Логин: log === "" ? login : log,
          Пароль: pass === "" ? password : pass
        }
      }
      setLoading(true)
    
      let res = await getData("МФО_Авторизация", params)
      console.log(res)
      if(res.Код === 100) {
        setSAuth(true)
  
        Store.dispatch({type: "auth", data: true})
        Store.dispatch({type: "tel", data: res.Данные.Телефон})          
        Store.dispatch({type: "em", data: res.Данные.элПочта})
  
        let Анкета = res.Данные.Анкета; Анкета.type = "anc"; Store.dispatch(Анкета)          
        let Паспорт = res.Данные.Паспорт; Паспорт.type = "doc"; Store.dispatch(Паспорт)
        let Адреса = res.Данные.Адреса;Адреса.forEach(Адрес => {Адрес.type = "adr";Store.dispatch(Адрес)});

        history.push("/tab1")
           
      } else {
        setEAuth(true)
      }
  
      setLoading(false)
      
      console.log(params);
      res = await getData("МФО_Документы", params)
      if(res.Код === 100) {
        let Фото = res.Данные.Фото;
        Фото.forEach(Док => {Док.type = "fot";Store.dispatch(Док)});        
      }
    }

    async function  Reg(data){
  
      let params = {
          params: data
        }
    
      setLoading(true)
        
      console.log(params)
      let res = await getData("МФО_Регистрация", params)
      if(res.Код === 100){
          setSReg(true)
          setLoading(false);     
      } else {
          setEReg(true)
          setLoading(false)     
      }
      console.log(res);
    }
  
  return (
    <IonPage>
       <IonLoading
        isOpen={loading}
        message={'Please wait...'}
      />
      <IonHeader>
        <IonToolbar color="medium">
            <IonTitle class = "a-center">Логин</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonCol>

        </IonCol>
      <IonContent>
          <IonRow>
            <IonCol size="2"/>
            <IonCol size="8">
              <IonItem>
                <IonLabel position="stacked"> Телефон </IonLabel>
                {/* <IonInput onIonChange={(e)=>{setLogin(e.detail.value as string)}}></IonInput> */}
                
                <MaskedInput
                    mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                    className="m-input"
                    placeholder="+7 (914) 000-00-00"
                    autoComplete="off"
                    id='1'
                    type='text'
                    onChange={(e) => {
                      setLogin(e.target.value as string)
                    }}
                />

              </IonItem>
            </IonCol>
            <IonCol size="2" />
          </IonRow>
          <IonRow>
            <IonCol size="2"/>
            <IonCol size="8">
              <IonItem>
                <IonLabel position="stacked"> Пароль </IonLabel>
                <IonInput 
                  type="password" 
                  onIonChange={(e)=>{
                  setPassword(e.detail.value as string)

                }}> 
                </IonInput>
              </IonItem>
            </IonCol>
            <IonCol size="2" />
          </IonRow>
          <IonRow>
            <IonCol size="2"/>
            <IonCol size="4">
              {/* <IonButton expand="block" onClick={()=> {
                SMSAuth()
                //setReg(true)
              }}> СМС </IonButton> */}
            </IonCol><IonCol size="4">
              <IonButton expand="block" onClick={()=> Auth()}> Вход </IonButton>
            </IonCol>
            <IonCol size="2" />
          </IonRow>
          <IonRow>
            <IonCol size="2"/>
            <IonCol size="8" class="ion-text-end">
              <IonText color="blue" class="a-link" onClick={()=>{
                setRegi(true)
              }}>
                Регистрация
              </IonText>
            </IonCol>
            <IonCol size="2" />
          </IonRow>
      </IonContent>

      {/* Авторизация не удалось */}
        <IonAlert
          isOpen={e_auth}
          onDidDismiss={() => setEAuth(false)}
          header={'Ошибка'}
          message={'Не удалось авторизироваться'}
          buttons={['Ok'
          ]} /> 

      {/* Авторизация успех */}
        <IonAlert
          isOpen={s_auth}
          onDidDismiss={() => setSAuth(false)}
          header={'Поздравляем'}
          message={'Вы успешо авторизировались'}
          buttons={['Ok'
          ]} /> 

      {/* Регистрация */}
      <IonAlert
          isOpen={reg}
          onDidDismiss={() => setReg(false)}
          header={'Регистрация'}
          message={''}
          inputs={[
            {
              name: 'Телефон',
              type: 'text',
              value: regData.Телефон,
              placeholder: '79140000000'
            },             
            {
              name: 'элПочта',
              type: 'email',
              value: regData.элПочта,
              placeholder: 'эл. почта'
            },          
            {
              name: 'Пароль',
              type: 'password',
              value: regData.Пароль,
              placeholder: 'Пароль'
            },          
            {
              name: 'Пароль1',
              type: 'password',
              value: regData.Пароль1,
              placeholder: 'Подтверждение пароля'
            }

          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {}
            },           
            {
              text: 'Ok',
              handler: (data) => {
                if(data.Пароль === data.Пароль1){
                  Reg(data);
                } else {
                  setRegData({Телефон: data.Телефон, элПочта: data.элПочта, Пароль: data.Пароль, Пароль1: data.Пароль1})
                  setEPass(true)
                }
              }
            }
          ]} /> 


      {/* Регистрация успех */}
        <IonAlert
          isOpen={s_reg}
          onDidDismiss={() => setSReg(false)}
          header={'Поздравляем'}
          message={'Вы успешо зарегистрировались'}
          buttons={['Ok'
          ]} /> 

      {/* Регистрация ошибка связи */}
        <IonAlert
          isOpen={e_reg}
          onDidDismiss={() => setEReg(false)}
          header={'Ошибка'}
          message={'Не удалось связаться с сервером'}
          buttons={['Ok'
          ]} />   

      {/* Регистрация пароли не совпадают */}
        <IonAlert
          isOpen={e_pass}
          onDidDismiss={() => setEPass(false)}
          header={'Ошибка'}
          message={'Пароли не совпадают'}
          buttons={[
            {
              text: 'Ok',
              handler: (data) => {
                setRegi(reg)
              }
            }
          ]} />  

      {/* Неверный код СМС */}
        <IonAlert
          isOpen={e_sms}
          onDidDismiss={() => setESMS(false)}
          header={'Ошибка'}
          message={'СМС код неверный'}
          buttons={[
            {
              text: 'Ok',
              handler: (data) => {
              }
            }
          ]} />   


      <IonModal 
          isOpen={ regi } 
          onDidDismiss={()=>setRegi(false)}
      >
        <IonCard className="i-modal">
          <IonCardHeader class="a-center">
            {/* <IonToolbar class="a-center"> */}
            <IonText class="m-text-title">
              Регистрация
            </IonText>
            {/* </IonToolbar> */}
          </IonCardHeader>

          <IonCardContent>
           <IonList>
            <IonItem>
               <MaskedInput
                    mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                    className="m-input"
                    placeholder="+7 (914) 000-00-00"
                    autoComplete="off"
                    value={ regData.Телефон }
                    id='5'
                    type='text'
                    onChange={(e) => {
                      setRegData({
                          Телефон:  (e.target.value), 
                          элПочта:  regData.элПочта,
                          Пароль:   regData.Пароль,
                          Пароль1:  regData.Пароль1,
                      })
                    }}
                />
             </IonItem>
             <IonItem>
               <IonInput placeholder="эл. почта"
                type="email"
                autocomplete="off"
                onIonChange={(e)=>{
                  setRegData({
                    Телефон:  regData.Телефон, 
                    элПочта:  (e.detail.value as string),
                    Пароль:   regData.Пароль,
                    Пароль1:  regData.Пароль1,
                })
                }}
               >

               </IonInput>
             </IonItem>
             <IonItem>
               <IonInput placeholder="Пароль"
                  type="password"
                  onIonChange={(e)=>{
                    setRegData({
                      Телефон:  regData.Телефон, 
                      элПочта:  regData.элПочта,
                      Пароль:   (e.detail.value as string),
                      Пароль1:  regData.Пароль1,
                  })
                  }}
               >
               </IonInput>
             </IonItem>
             <IonItem>
               <IonInput placeholder="Подтверждение пароля"
                  type="password"
                  onIonChange={(e)=>{
                    setRegData({
                      Телефон:  regData.Телефон, 
                      элПочта:  regData.элПочта,
                      Пароль:   regData.Пароль,
                      Пароль1:  (e.detail.value as string)
                  })
                  }}
               >

               </IonInput>
             </IonItem>
           </IonList>
          </IonCardContent>

          <IonFooter>
            <IonRow>
              <IonCol>
              <IonButton class="m-but" expand="block"  fill="clear" onClick={()=>{
                setRegi(false)
              }}> Отмена
              </IonButton>
              </IonCol>
              <IonCol>
              <IonButton class="m-but" expand="block" fill="clear" onClick={()=>{
                if(regData.Пароль === regData.Пароль1){
                  Reg({Телефон: regData.Телефон, Пароль: regData.Пароль});
                  setRegi(false)
                } else {
                  setEPass(true)
                  setRegi(false)

                }

              }}> Ок 
              </IonButton>
              </IonCol>
            </IonRow>
          </IonFooter>
        </IonCard>
      </IonModal>

    </IonPage>
  );
};

export default Tab2;
