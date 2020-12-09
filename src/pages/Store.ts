import { combineReducers } from 'redux'
import axios from 'axios'


export async function getData(method, params, POST = false){
    let res
    if(!POST){
        res = await axios.get(
            "https://mfu24.ru/lombard/hs/MyAPI/V1/" + method
            ,{
            auth: {
                username: unescape(encodeURIComponent("МФО_Админ")),
                password: unescape(encodeURIComponent("1234"))
            },
            params
            } 
        ).then(response => response.data)
        .then((data) => {
            return data
        }).catch(error => {
            return {Код: 200, msg: error}
        })
    } else {
        res = await axios.post(
            "https://mfu24.ru/lombard/hs/MyAPI/V1/" + method
            ,params
            ,{
                auth: {
                    username: unescape(encodeURIComponent("МФО_Админ")),
                    password: unescape(encodeURIComponent("1234"))
                }
            }
        ).then(response => response.data)
        .then((data) => {
            return data
        }).catch(error => {
            return {Код: 200, msg: error}
        })       
    }

    return res;
}

function age_count(date) {
    // now
    let now = new Date();
    let s_now = now.toISOString().substr(0, 10);
    // calculate
    let age = parseInt(s_now.substr(0, 4)) - parseInt(date.substr(0, 4));
    if((parseInt(s_now.substr(5, 2)) * 100 + parseInt(s_now.substr(8, 2))) 
        < (parseInt(date.substr(5, 2)) * 100 + parseInt(date.substr(8, 2)))) --age;
    // output
    return age;
}

function compute(state, action){
    if(action.Пол !== undefined || action.ДатаРождения !== undefined){
        let date = action.ДатаРождения === undefined ? state.ДатаРождения : action.ДатаРождения
        let sex = action.Пол === undefined ? state.Пол : action.Пол
        if(date !== ""){
            let age = age_count(date);
            if(sex === "Муж"){
                if(age >= 65) Dec.dispatch({type: "dec", Процент: 0.9})
                else Dec.dispatch({type: "dec", Процент: 1})
            } else {
                if(age >= 60) Dec.dispatch({type: "dec", Процент: 0.9})
                else Dec.dispatch({type: "dec", Процент: 1})
            }     
        }
    }
}

interface fam_type {
    НомерСтроки: number
    ЧленСемьи: string
    СтепеньРодства: string
    Иждивенец: boolean
}
interface wp_type {
    НомерСтроки: number
    МестоРаботы: string
    Должность: string
    Телефон: string
    Адрес: string
}
interface ed_type {
    НомерСтроки: number
    УчебноеЗаведение: string
    ГодЗавершения: number
}
interface doc_type {
    НомерСтроки: number,
    Серия: string,
    Номер: string,
    КемВыдан: string,
    ДатаВыдачи: string
}
interface adr_type {
    Тип: string
    Адрес: string
}
interface fot_type {
    Тип: string
    Фото: string
}
interface anc_type {
    НомерСтроки: number

    Фамилия:  string
    Имя: string
    Отчество: string
    
    ДатаРождения: string
    МестоРождения: string

    Пол: string
    Права: boolean

    Статус: string
    ДатаРег: string

    Дети: number
    ДетиВО: number
    Иждивенцы: number

    Супруг: string
    ДатаРожденияСупруга: string
    МестоРаботыСупруга: string
    ТелефонСупруга: string

    МестоРаботы: string
    ФактАдресРаботы: string
    СтажРаботы: number
    Должность: string
    Зарплата: number
    ПрочиеДоходы: number

}
//Анкета
interface user_type {

    auth: boolean

    Телефон: string

    элПочта: string

    СведенияОСемье:Array<fam_type>

    СведенияОРаботе:Array<wp_type>

    Образование:Array<ed_type>

    Адреса: Array<adr_type>

    Фото: Array<fot_type>

    Паспорт: Array<doc_type>

    Анкета: Array<anc_type>
    
}

const initState: user_type | any = {

    auth: false,

    Телефон: "",
    
    элПочта: "",

    СведенияОСемье: [],

    СведенияОРаботе: [],

    Образование: [],

    Адреса: [
         {Тип:"ФактАдрес", Адрес: ""}        
        ,{Тип:"АдресПоПрописке", Адрес: ""}
    ],

    Фото: [
        {Тип: "Фотография", Фото: ""},
        {Тип: "ФотоСПаспортом", Фото: ""},
        {Тип: "ФотоПаспорта", Фото: ""},
    ],

    Паспорт: {
        Серия: "",
        Номер: "",
        КемВыдан: "",
        ДатаВыдачи: ""       
    },

    Анкета: {

        Фамилия:  "",
        Имя: "",
        Отчество: "",
        
        ДатаРождения: "",
        МестоРождения: "",
    
        Пол: "",
        Права: false,
    
        Статус: "",
        ДатаРег: "",
    
        Дети: 0,
        ДетиВО: 0,
        Иждивенцы: 0,
    
        Супруг: "",
        ДатаРожденияСупруга: "",
        МестоРаботыСупруга: "",
        ТелефонСупруга: "",
    
        МестоРаботы: "",
        ФактАдресРаботы: "",
        СтажРаботы: 0,
        Должность: "",
        Зарплата: 0,
        ПрочиеДоходы: 0,
            
    },

}

function    authReducer(    state = initState.auth,    action){
    switch(action.type){
        case "auth": {return action.data}
        default: return state
    }
}
function    telReducer(     state = initState.Телефон,  action){
    switch(action.type){
        case "tel": {return action.data}
        default: return state
    }
}
function    emReducer(      state = initState.элПочта,   action){
    switch(action.type){
        case "em": {return action.data}
        default: return state
    }
}
function    famReducer(     state = initState.СведенияОСемье, action){
    switch(action.type){
        case "add_fam": 
            return [ ...state, {
              НомерСтроки: action.НомерСтроки === undefined ? "" : action.НомерСтроки,
              ЧленСемьи: action.ЧленСемьи === undefined ? "" : action.ЧленСемьи,
              СтепеньРодства: action.СтепеньРодства === undefined ? "" : action.СтепеньРодства,
              Иждивенец: action.Иждивенец === undefined ? "" : action.Иждивенец
            }
          ]

        case "upd_fam":
            return state.map(todo => {
                if (todo.НомерСтроки === action.НомерСтроки) {
                    return { ...todo
                        ,ЧленСемьи: action.ЧленСемьи === undefined ? todo.ЧленСемьи : action.ЧленСемьи
                        ,СтепеньРодства: action.ЧленСемьи === undefined ? todo.СтепеньРодства : action.СтепеньРодства                        
                        ,Иждивенец: action.Иждивенец === undefined ? todo.Иждивенец : action.Иждивенец                   
                    }
                }
                return todo
              })

        default: return state
    }
}
function    wpReducer(      state = initState.СведенияОРаботе, action){
    switch(action.type){
        case "add_wp": 
            return [ ...state, {
              НомерСтроки: action.НомерСтроки === undefined ? "" : action.НомерСтроки,
              МестоРаботы: action.МестоРаботы === undefined ? "" : action.МестоРаботы,
              Должность: action.Должность === undefined ? "" : action.Должность,              
              Телефон: action.Телефон === undefined ? "" : action.Телефон,
              Адрес: action.Адрес === undefined ? "" : action.Адрес
            }
          ]

        case "upd_wp":
            return state.map(todo => {
                if (todo.НомерСтроки === action.НомерСтроки) {
                    return { ...todo,
                        МестоРаботы: action.МестоРаботы === undefined ? todo.МестоРаботы : action.МестоРаботы,
                        Должность: action.Должность === undefined ? todo.Должность : action.Должность,              
                        Телефон: action.Телефон === undefined ? todo.Телефон : action.Телефон,
                        Адрес: action.Адрес === undefined ? todo.Адрес : action.Адрес                    
                    }
                }
                return todo
              })

        default: return state
    }
}
function    edReducer(      state = initState.Образование, action){
    switch(action.type){
        case "add_edu": 
            return [ ...state, {
              НомерСтроки: action.НомерСтроки === undefined ? "" : action.НомерСтроки,
              УчебноеЗаведение: action.УчебноеЗаведение === undefined ? "" : action.УчебноеЗаведение,
              ГодЗавершения: action.ГодЗавершения === undefined ? "" : action.ГодЗавершения,              
            }
          ]

        case "upd_edu":
            return state.map(todo => {
                if (todo.НомерСтроки === action.НомерСтроки) {
                    return { ...todo,
                        УчебноеЗаведение: action.УчебноеЗаведение === undefined ? todo.УчебноеЗаведение : action.УчебноеЗаведение,
                        ГодЗавершения: action.ГодЗавершения === undefined ? todo.ГодЗавершения : action.ГодЗавершения   
                    }          
                }
                return todo
              })

        default: return state
    }
}
function    adrReducer(     state = initState.Адреса, action){

    switch(action.type){
        case "adr":
            return state.map(todo => {
                if (todo.Тип === action.Тип) {
                    return { ...todo,
                        Адрес: action.Адрес === undefined ? todo.Адрес : action.Адрес   
                    }          
                }
                return todo
              })
        case "cl_adr": return initState.Адреса

        default: return state
    }
}
function    docReducer(     state = initState.Паспорт, action){
    switch(action.type){
        case "doc": 
            return {
              НомерСтроки: action.НомерСтроки === undefined ? state.НомерСтроки : action.НомерСтроки,
              Серия: action.Серия === undefined ? state.Серия : action.Серия,
              Номер: action.Номер === undefined ? state.Номер : action.Номер,
              КемВыдан: action.КемВыдан === undefined ? state.КемВыдан : action.КемВыдан,              
              ДатаВыдачи: action.ДатаВыдачи === undefined ? state.ДатаВыдачи : action.ДатаВыдачи,              
              КодПодразделения: action.КодПодразделения === undefined ? state.КодПодразделения : action.КодПодразделения,              
            }
        case "cl_doc": return initState.Паспорт

        default: return state
    }
}
function    fotReducer(     state = initState.Фото, action){
    switch(action.type){
        case "fot":
            return state.map(todo => {
                if (todo.Тип === action.Тип) {
                    return { ...todo,
                        Тип: action.Тип,
                        Фото: action.Фото   
                    }          
                }
                return todo
              })
        case "cl_fot": return initState.Фото

        default: return state
    }
}
function    ancReducer(     state = initState.Анкета, action){

    switch(action.type){
        case "anc":{ compute(state, action)
            return {
              НомерСтроки: action.НомерСтроки === undefined ? state.НомерСтроки : action.НомерСтроки,
              Фамилия:  action.Фамилия === undefined ? state.Фамилия : action.Фамилия,
              Имя: action.Имя === undefined ? state.Имя : action.Имя,
              Отчество: action.Отчество === undefined ? state.Отчество : action.Отчество,
              
              ДатаРождения: action.ДатаРождения === undefined ? state.ДатаРождения : action.ДатаРождения,
              МестоРождения: action.МестоРождения === undefined ? state.МестоРождения : action.МестоРождения,
          
              Пол: action.Пол === undefined ? state.Пол : action.Пол,
              Права: action.Права === undefined ? state.Права : action.Права,          
              Статус: action.Статус === undefined ? state.Статус : action.Статус,
              ДатаРег: action.ДатаРег === undefined ? state.ДатаРег : action.ДатаРег,
          
              Дети: action.Дети === undefined ? state.Дети : action.Дети,
              ДетиВО: action.ДетиВО === undefined ? state.ДетиВО : action.ДетиВО,
              Иждивенцы: action.Иждивенцы === undefined ? state.Иждивенцы : action.Иждивенцы,
          
              Супруг: action.Супруг === undefined ? state.Супруг : action.Супруг,
              ДатаРожденияСупруга: action.ДатаРожденияСупруга === undefined ? state.ДатаРожденияСупруга : action.ДатаРожденияСупруга,
              МестоРаботыСупруга: action.МестоРаботыСупруга === undefined ? state.МестоРаботыСупруга : action.МестоРаботыСупруга,
              ТелефонСупруга: action.ТелефонСупруга === undefined ? state.ТелефонСупруга : action.ТелефонСупруга,
          
              МестоРаботы: action.МестоРаботы === undefined ? state.МестоРаботы : action.МестоРаботы,              
              ФактАдресРаботы: action.ФактАдресРаботы === undefined ? state.ФактАдресРаботы : action.ФактАдресРаботы,
              СтажРаботы: action.СтажРаботы === undefined ? state.СтажРаботы : action.СтажРаботы,
              Должность: action.Должность === undefined ? state.Должность : action.Должность,
              Зарплата: action.Зарплата === undefined ? state.Зарплата : action.Зарплата as number,
              ПрочиеДоходы: action.ПрочиеДоходы === undefined ? state.ПрочиеДоходы : (action.ПрочиеДоходы as number),
                  
            }}
        
        case "cl_anc": {
            return initState.Анкета;
        }

        default: return state
    }
}
const       rootReducer =   combineReducers({

    auth:               authReducer,
    
    Телефон:            telReducer,
    элПочта:            emReducer,

    СведенияОСемье:     famReducer,

    СведенияОРаботе:    wpReducer,

    Образование:        edReducer,

    Адреса:             adrReducer,

    Фото:          fotReducer, 

    Паспорт:            docReducer,

    Анкета:             ancReducer

})



// Заявка
interface dec_type{
    Сумма: number,
    Срок: number,
    Процент: number,
    Проценты: number,
    Итого: number,
    НаКарту: boolean,
    Карта: string,
    поТелефону: boolean,
    Телефон: string
}

const initDec:dec_type | any = {
    Сумма: 1000,
    Срок: 3,
    Процент: 1,
    Проценты: 30,
    Итого: 1030,
    НаКарту: false,
    Карта: "",
    поТелефону: false,
    Телефон: ""

}

function decReducer(state = initDec, action){  
    switch(action.type){
        case "dec": {return {
        
                Сумма: action.Сумма === undefined ? state.Сумма : action.Сумма, 

                Срок: action.Срок === undefined ? state.Срок : action.Срок,

                Процент: action.Процент === undefined ? state.Процент : action.Процент,

                Проценты: (action.Сумма === undefined ? state.Сумма : action.Сумма) 
                        * ((action.Срок === undefined ? state.Срок : action.Срок) 
                        * (action.Процент === undefined ? state.Процент : action.Процент) / 100),

                Итого: ((action.Сумма === undefined ? state.Сумма : action.Сумма) ) 
                        * (1 + (action.Срок === undefined ? state.Срок : action.Срок) 
                        * (action.Процент === undefined ? state.Процент : action.Процент) / 100),
    
                НаКарту: action.НаКарту === undefined ? state.НаКарту : action.НаКарту,

                Карта: action.Карта === undefined ? state.Карта : action.Карта,

                поТелефону: action.поТелефону === undefined ? state.поТелефону : action.поТелефону,

                Телефон: action.Телефон === undefined ? state.Телефон : action.Телефон
                    
                }}

        default: return state
    }   
}

//Разные

function create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var auth_list = () => {};
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            switch(action.type){
                case "auth" : auth_list();break
            }
            return action;
        },
        subscribe_auth(newListener) {
            auth_list = newListener;
        }
    };
}

export const Store = create_Store(rootReducer, initState)
export const Dec = create_Store(decReducer, initDec)