import axios, from "axios"

/* Хранение данных об пользователе ====================================================================== */
const SET_USER = "SET_USER"
const LOGOUT = "LOGOUT"

const defaultState = {
    currentUser: {},
    isAuth: false
}
// Пародия на redux
export default function useReducer (state = defaultState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload.user,
                isAuth: true
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }
        default:
            return state
    }
}
const setUser = user => ({type: SET_USER, payload: user})

/* Регистрация ====================================================================================== */
export const registration = async () => {
    const email = document.getElementById('reg-email').value
    const password = document.getElementById('reg-pass').value

    try {
        const response = await axios.post(`http://localhost:5000/api/auth/registration/`, {
            email,
            password
        })
        useReducer(setUser(response.data.user))
        localStorage.setItem('token', response.data.token)
    } catch (e) {
        alert(e.response.data.message)
    }
}
const registrationBtn = document.querySelector('.registration-btn')
registrationBtn.addEventListener('click', registration)

/* Login ========================================================================================== */
export const login = async () => {
    const email = document.getElementById('log-email').value
    const password = document.getElementById('log-pass').value

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/login/`, {
                email,
                password
            })
            console.log(response.data)
            auth.login.classList.remove('active')
            auth.registration.classList.remove('active')
            window.location.href = 'http://localhost:1234/index.html'
            //auth.logout.classList.add('active')
        } catch (e) {
            alert(e.response.data.message)
        }
}
const loginBtn = document.querySelector('.login-btn')
loginBtn.addEventListener('click', login)

/* Выход ================================================================================================= */
//const logout = () => ({type: LOGOUT})
//const logoutBtn = document.querySelector('.navbar__logout')
//logoutBtn.addEventListener ('click', () => {useReducer(logout)})

/* auth ================================================================================================== */
export const authorization = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/auth/auth/`,
            {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
        )
        useReducer(setUser(response.data.user))
        localStorage.setItem('token', response.data.token)
    } catch (e) {
        alert(e.response.data.message)
        localStorage.removeItem('token')
    }
}



const auth = {
    navbar__login: document.getElementById("navbar__login"),
    navbar__registration: document.getElementById("navbar__registration"),
    registration: document.getElementById("registration"),
    login: document.getElementById("login"),
    logout: document.getElementById("navbar__logout")
}

/* Функция для изменения адресной строки без перезагрузки,
* для того, чтобы адекватно работала ф-я authToggle
* (добавляла класс active) */
function setLocation(curLoc){
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch(e) {}
    location.hash = '#' + curLoc;
}

const logToggle = function() {
    if(!auth.login.querySelector('.active')) {
        auth.registration.classList.remove('active')
        auth.login.classList.add('active')
        //setLocation('http://localhost:1234/api/auth/login/')
    }
}
const navbarLogin = document.querySelector(".navbar__login")
navbarLogin.addEventListener('click', logToggle)

const regToggle = function() {
    if(!auth.registration.querySelector('.active')) {
        auth.login.classList.remove('active')
        auth.registration.classList.add('active')
        //setLocation('http://localhost:1234/api/auth/registration/')
    }
}
const navbarRegistration = document.querySelector(".navbar__registration")
navbarRegistration.addEventListener('click', regToggle)