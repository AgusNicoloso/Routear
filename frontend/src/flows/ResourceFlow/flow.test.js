import { combineReducers } from 'redux'
import moment from 'moment'
import logger from '../../logger'
import SagaTester from '../../redux-saga-tester'
import { AuthFlow } from '../AuthFlow'
import ResourceFlow from './flow'
import { 
    GET, 
    requestResource,
    fetchResources,
    FETCH,
    createResource,
    CREATE,
    updateResource,
    UPDATE,
    patchResource,
    PATCH,
    deleteResource,
    DELETE,
    SEARCH,
    searchResources,
} from './actions'

const RESOURCE_BODY = {
    id: 4,
    foo: "foo",
    bar: "bar",
}
const RESOURCE_BODY2 = {
    id: 5,
    foo: "foo",
    bar: "bar",
}
const RESOURCE_BODY_NEW = {
    id: 4,
    foo: "foo_new",
    bar: "bar_new",
}
const PARTIAL_BODY_NEW = {
    foo: "foo_new",
}
const ACCESS_TOKEN = 'access-token'
const REFRESH_TOKEN_VALUE = 'refresh-token'

function getSagaTester(initialState={}, log=false){
    const resourceFlow = new ResourceFlow('test', 'resource')
    const authFlow = new AuthFlow('auth')
    const mainReducer = combineReducers({
      auth: authFlow.reducer,
      test: resourceFlow.reducer,
    })

    const config = {
        initialState: Object.assign({
            auth:{
                accessToken: ACCESS_TOKEN,
                refreshToken: REFRESH_TOKEN_VALUE,
                tokenTimestamp: moment().valueOf(),
                keepSession: true,
                isLogged: true
            },
            test: {}}, initialState),
        reducers: mainReducer,

    }
    if (log) {
        config['middlewares'] = [logger]
    }
    const sagaTester = new SagaTester(config)
    sagaTester.start(resourceFlow.saga)
    sagaTester.start(authFlow.saga)
    return sagaTester
}

async function runGet() {
    const sagaTester = getSagaTester()
    sagaTester.dispatch(requestResource('resource', 4))
    await sagaTester.waitFor(`${GET}_FINISH`)
    return sagaTester.getState()
}

describe('Test: get Resource', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería buscar un recurso y guardo en body y form', async () => {
        fetch.mockResponseOnce(JSON.stringify(RESOURCE_BODY))
        const state = await runGet()
        expect(state.test.objects["4"].body).toEqual(RESOURCE_BODY)
    })
})

async function runFetch() {
    const sagaTester = getSagaTester()
    sagaTester.dispatch(fetchResources('resource'))
    await sagaTester.waitFor(`${FETCH}_FINISH`)
    return [sagaTester, sagaTester.getState()]
}

describe('Test: fetch Resources', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería buscar un recurso y guardo en body y form', async () => {
        fetch.mockResponseOnce(JSON.stringify({results:[RESOURCE_BODY, RESOURCE_BODY2]}))
        const [sagaTester, state] = await runFetch()
        expect(state.test.objects["4"].body).toEqual(RESOURCE_BODY)
        expect(state.test.objects["5"].body).toEqual(RESOURCE_BODY2)
    })

    it('debería buscar un listado y actualizar un solo valor y mantener el otro', async () => {
        fetch.mockResponseOnce(JSON.stringify({results:[RESOURCE_BODY, RESOURCE_BODY2]}))
        const [sagaTester, state] = await runFetch()
        expect(state.test.objects["4"].body).toEqual(RESOURCE_BODY)
        expect(state.test.objects["5"].body).toEqual(RESOURCE_BODY2)
        const updateObject = Object.assign({}, RESOURCE_BODY, { new:'new' })
        fetch.mockResponseOnce(JSON.stringify(updateObject))
        sagaTester.dispatch(requestResource('resource', 4))
        await sagaTester.waitFor(`${GET}_FINISH`)
        const newState = sagaTester.getState()
        expect(newState.test.objects["4"].body).toEqual(updateObject)
        expect(newState.test.objects["5"].body).toEqual(RESOURCE_BODY2)
    })
})

async function runCreate() {
    const sagaTester = getSagaTester()
    sagaTester.dispatch(createResource('resource', RESOURCE_BODY))
    await sagaTester.waitFor(`${CREATE}_FINISH`)
    return sagaTester.getState()
}

describe('Test: create Resource', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería crear un recurso y guardarlo en body y form', async () => {
        fetch.mockResponseOnce(JSON.stringify(RESOURCE_BODY), {status:201})
        const state = await runCreate()
        expect(state.test.objects[4].body).toEqual(RESOURCE_BODY)
        expect(state.test.create).not.toBeUndefined()
    })

})


async function runUpdate() {
    const sagaTester = getSagaTester({ test: {RESOURCE_BODY}})
    sagaTester.dispatch(updateResource('resource', 4, RESOURCE_BODY_NEW))
    await sagaTester.waitFor(`${UPDATE}_FINISH`)
    return sagaTester.getState()
}

describe('Test: update resource', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería actualizar un recurso y guardarlo en body y form', async () => {
        fetch.mockResponseOnce(JSON.stringify(RESOURCE_BODY_NEW), {status:200})
        const state = await runUpdate()
        expect(state.test.objects[4].body).toEqual(RESOURCE_BODY_NEW)
    })
})

async function runPartial() {
    const sagaTester = getSagaTester({ test: { objects: {
        4: {
            body:RESOURCE_BODY,
        }}
    }})
    sagaTester.dispatch(patchResource('resource', 4, PARTIAL_BODY_NEW ))
    await sagaTester.waitFor(`${PATCH}_FINISH`)
    return sagaTester.getState()
}

describe('Test: update resource', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería actualizar parcialmente un recurso y guardarlo en body y form', async () => {
        fetch.mockResponseOnce(JSON.stringify(PARTIAL_BODY_NEW), {status:200})
        const state = await runPartial()
        expect(state.test.objects[4].body.foo).toEqual(RESOURCE_BODY_NEW.foo)
        expect(state.test.objects[4].body.bar).toEqual(RESOURCE_BODY.bar)
    })
})

async function runDelete() {
    const sagaTester = getSagaTester({ test: { objects: {
        4: {
            body:RESOURCE_BODY,
        }}}
    })
    sagaTester.dispatch(deleteResource('resource', 4 ))
    await sagaTester.waitFor(`${DELETE}_FINISH`)
    return sagaTester.getState()
}

describe('Test: remove resource', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería borrar un recurso y sacar el resurco del listado', async () => {
        fetch.mockResponseOnce(JSON.stringify(PARTIAL_BODY_NEW), {status:204})
        const state = await runDelete()
        expect(state.test.objects[4].body).toBeUndefined()
    })
})


async function runSearch() {
    const sagaTester = getSagaTester()
    sagaTester.dispatch(searchResources('resource', 'id_slug', 'busquedaa'))
    await sagaTester.waitFor(`${SEARCH}_FINISH`)
    return [sagaTester, sagaTester.getState()]
}

describe('Test: search Resources', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('debería buscar un listado de recursos', async () => {
        fetch.mockResponseOnce(JSON.stringify({results:[RESOURCE_BODY, RESOURCE_BODY2]}))
        const [sagaTester, state] = await runSearch()
        expect(fetch.mock.calls[0][0].endsWith('busquedaa')).toBeTruthy()
        expect(state.test.searches.id_slug.result[0]).toEqual(RESOURCE_BODY)
        expect(state.test.searches.id_slug.result[1]).toEqual(RESOURCE_BODY2)
    })
})