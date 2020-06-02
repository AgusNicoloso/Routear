export const IS_LOGGED = 'IS_LOGGED'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'

export function requestLogin(email, password, keepSession, next){
    return  {
        type: LOGIN,
        action: LOGIN,
        email,
        password,
        keepSession,
        next
    }
} 

export function requestLogout() {
    return {
        type: LOGOUT,
        action: LOGOUT,
    }
}

export function requestIsLogged() {
    return {
        type: IS_LOGGED,
        action: IS_LOGGED,
    }
}

export function requestRefreshToken() {
    return {
        type: REFRESH_TOKEN,
        action: REFRESH_TOKEN,
    }
}

