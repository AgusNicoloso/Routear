import moment from 'moment'
import { combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import { LOGIN, LOGOUT, IS_LOGGED, REFRESH_TOKEN, ME, 
    requestLogin, requestLogout, requestIsLogged, requestRefreshToken
} from './actions'
import AuthFlow, { STORAGE_KEY } from './flow'
import SagaTester from '../../redux-saga-tester'

const ACCESS_TOKEN = 'access-token'
const REFRESH_TOKEN_VALUE = 'refresh-token'
const ACCESS_TOKEN_NEW = 'access-token-new'
const REFRESH_TOKEN_VALUE_NEW = 'refresh-token-new'
const NEXT = 'accounts'
const ME_OBJ = {
    id: 1,
    username: "username",
    first_name: "first_name",
    last_name: "last_name",
}

function getSagaTester(initialState={}, log=false){
    const authFlow = new AuthFlow('auth')

    const mainReducer = combineReducers({
      auth: authFlow.reducer,
    })

    const config = {
        initialState: initialState,
        reducers: mainReducer,

    }
    if (log) {
        config['middlewares'] = [createLogger()]
    }
    const sagaTester = new SagaTester(config)
    sagaTester.start(authFlow.saga)
    return sagaTester
}

async function runLogin(keepSession) {
    const sagaTester = getSagaTester()
    sagaTester.dispatch(requestLogin('email@email.com', 'password', keepSession, NEXT))
    await sagaTester.waitFor(`${LOGIN}_FINISH`)
    return sagaTester.getState()
}

describe('Test: Login', () => {

    beforeEach(() => {
        fetch.resetMocks()
        localStorage.clear()
        sessionStorage.clear()
        localStorage.setItem.mockClear()
        sessionStorage.setItem.mockClear()
    })

    it('debería guardar en el estado los valoes de la sesión', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            access: ACCESS_TOKEN,
            refresh: REFRESH_TOKEN_VALUE,
        }))
        const state = await runLogin(true)
        expect(state.auth.accessToken).toEqual(ACCESS_TOKEN)
        expect(state.auth.refreshToken).toEqual(REFRESH_TOKEN_VALUE)
        expect(state.auth.tokenTimestamp).toBeDefined()
        expect(state.auth.keepSession).toBeTruthy()
        expect(state.auth.isLogged).toBeTruthy()
    })

    it('debería guardar en local storage si ponemos keepSession', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            access: ACCESS_TOKEN,
            refresh: REFRESH_TOKEN_VALUE,
        }))
        const state = await runLogin(true)
        expect(sessionStorage.setItem).toHaveBeenCalledTimes(1)
        expect(sessionStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN_VALUE,
            tokenTimestamp: moment(state.auth.tokenTimestamp).valueOf(),
            keepSession: true
        }));
        expect(localStorage.setItem).toHaveBeenCalledTimes(1)
        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN_VALUE,
            tokenTimestamp: moment(state.auth.tokenTimestamp).valueOf(),
            keepSession: true
        }));
    })

    it('debería no guardar en local storage si no ponemos keepSession', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            access: ACCESS_TOKEN,
            refresh: REFRESH_TOKEN_VALUE,
        }))
        const state = await runLogin(false)
        expect(sessionStorage.setItem).toHaveBeenCalledTimes(1)
        expect(sessionStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN_VALUE,
            tokenTimestamp: moment(state.auth.tokenTimestamp).valueOf(),
            keepSession: false
        }));
        expect(localStorage.setItem).toHaveBeenCalledTimes(0)
    })

    it('debería redirigir a la url de next si el login da bien', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            access: ACCESS_TOKEN,
            refresh: REFRESH_TOKEN_VALUE,
        }))
        await runLogin(false)
    })

    it('debería dejar isLogged false si no puede autenticar', async () => {
        fetch.mockRejectOnce('No debería ejecutar un fetch')
        const state = await runLogin(true)
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })
    
    it('no debería redirigir a la url si el login no es correcto', async () => {
        fetch.mockRejectOnce('No debería ejecutar un fetch')
        await runLogin(true)
    })
})


async function runLogout(keepSession) {
    const sagaTester = getSagaTester({
        auth:{
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN_VALUE,
            tokenTimestamp: moment().valueOf(),
            keepSession: true,
            isLogged: true
        }
    })
    sagaTester.dispatch(requestLogout())
    await sagaTester.waitFor(`${LOGOUT}_FINISH`)
    return sagaTester.getState()
}

describe('Test: Logout', () => {
    beforeEach(() => {
        fetch.resetMocks()
        localStorage.clear()
        sessionStorage.clear()
    })

    it('debería borrar toda la session y dejar el estado isLogged en false', async () => {
        const state = await runLogout()
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })

    it('debería dejar el estado isLogged false aunque no haya limpiar el storage', async () => {
        sessionStorage.removeItem.mockImplementation(() => {throw new Error()})
        const state = await runLogout()
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })
})

async function runIsLogged(storage, timestamp=moment().valueOf()) {
    storage.__STORE__[STORAGE_KEY] = JSON.stringify({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN_VALUE,
        tokenTimestamp: timestamp,
        keepSession: true
    })
    const sagaTester = getSagaTester()
    sagaTester.dispatch(requestIsLogged())
    await sagaTester.waitFor(`${IS_LOGGED}_FINISH`)
    return sagaTester.getState()
}

describe('Test: isLogged', () => {
    beforeEach(() => {
        fetch.resetMocks()
        localStorage.clear()
        sessionStorage.clear()
    })

    it('debería levantar la session del storage y dejar los valores en el estado de redux', async () => {
        const state = await runIsLogged(sessionStorage)
        expect(state.auth.accessToken).toEqual(ACCESS_TOKEN)
        expect(state.auth.refreshToken).toEqual(REFRESH_TOKEN_VALUE)
        expect(state.auth.tokenTimestamp).toBeDefined()
        expect(state.auth.keepSession).toBeTruthy()
        expect(state.auth.isLogged).toBeTruthy()
    })

    it('debería levantar la session del local storage y dejar los valores en el estado de redux si no están en sesion', async () => {
        const state = await runIsLogged(localStorage)
        expect(state.auth.accessToken).toEqual(ACCESS_TOKEN)
        expect(state.auth.refreshToken).toEqual(REFRESH_TOKEN_VALUE)
        expect(state.auth.tokenTimestamp).toBeDefined()
        expect(state.auth.keepSession).toBeTruthy()
        expect(state.auth.isLogged).toBeTruthy()
    })

    it('debería poner el estado islogged en False y no cargar la sessión si tiene mas de 7 días', async () => {
        const state = await runIsLogged(sessionStorage, moment().add(-8, 'days').valueOf())
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })

    it('debería dejar en el etado isLogged false si no puede levantar lso valores del storage', async () => {
        sessionStorage.getItem.mockImplementation(() => {throw new Error()})
        const state = await runIsLogged(sessionStorage)
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })
})

async function runRefreshToken(timestamp) {
    const sagaTester = getSagaTester({
        auth:{
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN_VALUE,
            tokenTimestamp: timestamp,
            keepSession: true,
            isLogged: true
        }
    })
    sagaTester.dispatch(requestRefreshToken())
    await sagaTester.waitFor(`${REFRESH_TOKEN}_FINISH`)
    return sagaTester.getState()
}

async function runEmptyRefreshToken() {
    const sagaTester = getSagaTester({
        auth:{
            accessToken: undefined,
            refreshToken: undefined,
            tokenTimestamp: undefined,
            keepSession: false,
            isLogged: false
        }
    })
    sagaTester.dispatch(requestRefreshToken())
    await sagaTester.waitFor(`${REFRESH_TOKEN}_FINISH`)
    return sagaTester.getState()
}

describe('Test: RefreshToken', () => {
    beforeEach(() => {
        fetch.resetMocks()
        localStorage.clear()
        sessionStorage.clear()
    })

    it('no debería hacer nada cuando el token está guardado en el estado y pasaron menos de 15 minutos', async () => {
        const originalTimestamp = moment().valueOf()
        const state = await runRefreshToken(originalTimestamp)
        expect(state.auth.tokenTimestamp).toEqual(originalTimestamp)
    })

    it('debería refrescar el token cuando está guardado en el estado y pasaron entre 15 mins y 7 días', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            access: ACCESS_TOKEN_NEW,
            refresh: REFRESH_TOKEN_VALUE_NEW,
        }))
        const originalTimestamp = moment().add(-30, 'minutes').valueOf()
        const state = await runRefreshToken(originalTimestamp)
        expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify({refresh:REFRESH_TOKEN_VALUE}))
        expect(state.auth.accessToken).toEqual(ACCESS_TOKEN_NEW)
        expect(state.auth.refreshToken).toEqual(REFRESH_TOKEN_VALUE_NEW)
        expect(state.auth.tokenTimestamp).toBeGreaterThan(originalTimestamp)
        expect(state.auth.isLogged).toBeTruthy()
    })

    it('debería poner el estado en isLogged false y no correr el loop si el token tiene mas de 7 días', async () => {
        const originalTimestamp = moment().add(-8, 'days').valueOf()
        const state = await runRefreshToken(originalTimestamp)
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.tokenTimestamp).toBeUndefined()
        expect(state.auth.keepSession).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })

    it('debería no tocar las valores del estdo si hay un error en la llamada', async () => {
        fetch.mockRejectOnce('No debería ejecutar un fetch')
        const originalTimestamp = moment().valueOf()
        const state = await runRefreshToken(originalTimestamp)
        expect(state.auth.accessToken).toEqual(ACCESS_TOKEN)
        expect(state.auth.refreshToken).toEqual(REFRESH_TOKEN_VALUE)
        expect(state.auth.tokenTimestamp).toEqual(originalTimestamp)
        expect(state.auth.isLogged).toBeTruthy()
    })

    it('debería dejar sin logueo si se corre un refreshtoken sin sesión', async () => {
        const state = await runEmptyRefreshToken()
        expect(state.auth.accessToken).toBeUndefined()
        expect(state.auth.refreshToken).toBeUndefined()
        expect(state.auth.isLogged).toBeFalsy()
    })
});

