import moment from 'moment'
import { authUser, refreshToken, getMe } from '../../apis/main'
import { Flow } from '../Flow'
import { ValidationException } from '../../exceptions'
import { LOGIN, LOGOUT, IS_LOGGED, REFRESH_TOKEN } from './actions'
import jwt_decode from 'jwt-decode'

export const STORAGE_KEY = 'datcomio-auth'

export default class AuthFlow extends Flow {
    initialState = {
        accessToken: undefined, 
        refreshToken: undefined,
        tokenTimestamp: undefined,
        keepSession: undefined,
        isLogged: undefined,
        me: undefined,
    }

    constructor(rootPath) {
        super(rootPath)
        this.actions = {
            [LOGIN]: {
                actionPath: 'login',
                run: this.login,
                onError: this.clearSession,
                onDone: this.onLoginDone,
                reduceDone: this.reduceLogged,
            },
            [IS_LOGGED]: {
                actionPath: 'isLoggedAction',
                run: this.isLogged,
                onError: this.clearSession,
                reduceDone: this.reduceLogged,
                reduceError: this.reduceNotLogged
            },
            [LOGOUT]: {
                actionPath: 'logout',
                run: this.clearSession,
                reduceDone: this.reduceNotLogged,
                reduceError: this.reduceNotLogged
            },
            [REFRESH_TOKEN]: {
                actionPath: 'refresh',
                run: this.tokenRefresh,
                onError: this.clearSession,
                reduceDone: this.reduceLogged,
                reduceError: this.reduceNotLogged,
            }

        }
    }

    loadSession = async () => {
        let results = await window.sessionStorage.getItem(STORAGE_KEY)
        results = results?JSON.parse(results):undefined
        if (!results) {
            results = await window.localStorage.getItem(STORAGE_KEY)
            results = results?JSON.parse(results):undefined
        }
        return results
    }

    saveSession = async (session, local=false) => {
        const strSession =JSON.stringify(session)
        await window.sessionStorage.setItem(STORAGE_KEY, strSession)
        if (local) {
            window.localStorage.setItem(STORAGE_KEY, strSession)
        }
        return session 
    } 

    clearSession = async (action) => {
        window.sessionStorage.removeItem(STORAGE_KEY)
        window.localStorage.removeItem(STORAGE_KEY)
        return {}
    }

    login = async (action) => {
        const tokens = await authUser(action.email, action.password)
        const session = await this.saveSession({
                accessToken: tokens.access,
                refreshToken: tokens.refresh,
                tokenTimestamp: moment().valueOf(),
                keepSession: action.keepSession,
            }, 
            action.keepSession
        )
        return session
    }

    onLoginDone(action) {
    }


    isLogged = async (action) => {
        const session = await this.loadSession()
        if (!session) {
            throw new ValidationException("No session")
        }

        if (!session.accessToken || !session.refreshToken) {
            throw new ValidationException("No Tokens")
        }

        if (this.hasTokenExpired(session.tokenTimestamp)) {
            throw new ValidationException("Session Expired")
        }

        return session
    }

    isTokenForRefresh(timestamp) {
        return moment(timestamp).isBefore(moment().add(-15, 'minutes'))
    }

    hasTokenExpired(timestamp) {
        return moment(timestamp).isBefore(moment().add(-7, 'days'))
    }

    tokenRefresh = async (action, state) => {
        if (!state.isLogged) {
            throw new ValidationException("User not logged")
        }

        if (!state.tokenTimestamp) {
            throw new ValidationException("No token to refresh")
        }
        
        if ( this.isTokenForRefresh(state.tokenTimestamp) ) {
            if (this.hasTokenExpired(state.tokenTimestamp)) {
                throw new ValidationException("Session expired")
            }
            const tokens = await refreshToken(state.refreshToken)
            const newSession = {
                accessToken:tokens.access,
                refreshToken:tokens.refresh,
                tokenTimestamp: moment().valueOf(),
                keepSession: state.keepSession,
                isLogged: true
            }
            await this.saveSession(newSession, state.keepSession)
            return newSession
        }
        return {
            accessToken:state.accessToken,
            refreshToken:state.refreshToken,
            tokenTimestamp:state.tokenTimestamp,
            keepSession:state.keepSession,
            isLogged:state.isLogged
        }
    }

    me = async (action, state) => {
        const session = await this.tokenRefresh(action, state)
        const body = await getMe(session? session.accessToken:state.accessToken)
        return body 
    }

    reduceLogged = (state, action) => {
        let decoded = undefined;
        try {
            decoded = jwt_decode(action.results.refreshToken);
        } catch (error) {}
        return Object.assign({}, state, { 
            accessToken: action.results.accessToken,
            refreshToken: action.results.refreshToken,
            tokenTimestamp: action.results.tokenTimestamp,
            keepSession: action.results.keepSession,
            isLogged: true,
            me: decoded ? decoded.user:undefined,
        })
    }

    reduceNotLogged = (state, action) => {
        return Object.assign({}, state, { 
            accessToken: undefined,
            refreshToken: undefined,
            tokenTimestamp: undefined,
            keepSession: undefined,
            isLogged: false,
        })
    }
}

