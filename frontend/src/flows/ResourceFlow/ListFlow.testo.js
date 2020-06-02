// import { 
//     SEARCH,
// } from './flows'
// import { ListFlow } from './ListFlow'
// import { combineReducers } from 'redux'
// import { createLogger } from 'redux-logger'
// import { loopsReducer, allLoops } from '../loops/'
// import { getLoopType } from '../loops/AbstractLoop'
// import { LOOP_START } from '../loops/steps'
// import { FETCH_RESOURCES } from '../loops/loops'
// import { 
//     searchResources, 
// } from './actions'
// import SagaTester from '../redux-saga-tester'
// import { AuthFlowOld } from './AuthFlowOld'
// import moment from 'moment'

// const ACCESS_TOKEN = 'access-token'
// const REFRESH_TOKEN_VALUE = 'refresh-token'
// const RESPONSE_LIST = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

// function getSagaTester(initialState={}, log=false){
//     const listFlow = new ListFlow('test')
//     const authFlow = new AuthFlowOld('auth')
//     const mainReducer = reduceReducers({}, loopsReducer, combineReducers({
//       auth: authFlow.reducer,
//       test: listFlow.reducer,
//     }))

//     const config = {
//         initialState: Object.assign({
//             auth:{
//                 accessToken: ACCESS_TOKEN,
//                 refreshToken: REFRESH_TOKEN_VALUE,
//                 tokenTimestamp: moment().valueOf(),
//                 keepSession: true,
//                 isLogged: true
//             },
//             test: {}}, initialState),
//         reducers: mainReducer,

//     }
//     if (log) {
//         config['middlewares'] = [createLogger()]
//     }
//     const sagaTester = new SagaTester(config)
//     sagaTester.start(listFlow.saga)
//     sagaTester.start(authFlow.saga)
//     allLoops.forEach(flow => {sagaTester.start(flow.saga)});
//     return sagaTester
// }

// describe('Test: append', () => {
//     beforeEach(() => {
//         fetch.resetMocks()
//     })

//     it('debería listar correctamente un recurso', async () => {
//         fetch.mockResponseOnce(JSON.stringify({
//             count: 24,
//             results: RESPONSE_LIST.slice(0,10)
//         }))
//         fetch.mockResponseOnce(JSON.stringify({
//             count: 24,
//             results: RESPONSE_LIST.slice(10,20)
//         }))
//         fetch.mockResponseOnce(JSON.stringify({
//             count: 24,
//             results: RESPONSE_LIST.slice(20,30)
//         }))
//         const LOOP_START_TYPE = getLoopType(FETCH_RESOURCES, LOOP_START)
//         const sagaTester = getSagaTester()
//         sagaTester.dispatch(searchResources('resource', 'lista'))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         let state =  sagaTester.getState()
//         expect(state.test.resource.lista.list.length).toEqual(10)
//         expect(state.test.resource.lista.endReached).toBeFalsy()
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(1)
//         sagaTester.dispatch(searchResources('resource', 'lista'))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         state =  sagaTester.getState()
//         expect(state.test.resource.lista.list.length).toEqual(20)
//         expect(state.test.resource.lista.endReached).toBeFalsy()
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(2)
//         sagaTester.dispatch(searchResources('resource', 'lista'))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         state =  sagaTester.getState()
//         expect(state.test.resource.lista.list.length).toEqual(24)
//         expect(state.test.resource.lista.endReached).toBeTruthy()
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(3)
//         sagaTester.dispatch(searchResources('resource', 'lista'))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(3)

//     })

// })

// describe('Test: sin append', () => {
//     beforeEach(() => {
//         fetch.resetMocks()
//     })

//     it('debería listar correctamente un recurso', async () => {
//         fetch.mockResponseOnce(JSON.stringify({
//             count: 24,
//             results: RESPONSE_LIST.slice(0,10)
//         }))
//         fetch.mockResponseOnce(JSON.stringify({
//             count: 24,
//             results: RESPONSE_LIST.slice(10,20)
//         }))
//         const LOOP_START_TYPE = getLoopType(FETCH_RESOURCES, LOOP_START)
//         const sagaTester = getSagaTester()
//         sagaTester.dispatch(searchResources('resource', 'lista', false))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         let state =  sagaTester.getState()
//         expect(state.test.resource.lista.list.length).toEqual(10)
//         expect(state.test.resource.lista.endReached).toBeFalsy()
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(1)
//         sagaTester.dispatch(searchResources('resource', 'lista', false))
//         await sagaTester.waitFor(`${SEARCH}_END`)
//         state =  sagaTester.getState()
//         expect(state.test.resource.lista.list.length).toEqual(10)
//         expect(state.test.resource.lista.endReached).toBeFalsy()
//         expect(sagaTester.numCalled(LOOP_START_TYPE)).toEqual(2)
//     })

// })