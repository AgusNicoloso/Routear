// import { AbstractApiFlow } from './AbstractApiFlow'
// import immutable from '../libs/object-path-immutable'
// import { FETCH_RESOURCES } from '../loops/loops'
// import { SEARCH, FILTER } from './flows'
// import { takeLatest } from 'redux-saga/effects'
// import { searchResources } from './actions'
// import { put } from 'redux-saga/effects'

// const initialState = {
//     filters: {},
//     offset: 0,
//     count: undefined,
//     endReached: false,
//     list: [],
// }

// export class ListFlow extends AbstractApiFlow {

//     loops = [FETCH_RESOURCES]
//     actions = [SEARCH, FILTER]
//     initialState = {}

//     constructor(path) {
//         super(path)
//         this.fetch = this.fetch.bind(this)
//     }

//     * fetch(action, token) {
//         const path = this.getPath(action)
//         const state = yield this.getState(action)
//         const filters = {
//             limit: action.limit,
//             offset: action.append && state? state.offset: 0,
//             ...action.tempFilters,
//         }

//         if ( !state || !action.append || (!state.endReached && action.append) ) {   
//             const finish = yield this.waitLoop(action.type, FETCH_RESOURCES,
//                 path, action.resource, token, action.id, filters, action.append)
//             return finish
//         }
//         return action
//     }

//     isNew(state, action) {
//         return action.append === false || state === undefined || state.list === undefined
//     }

//     reduceLoopsStart(state = {}, action) {
//         switch(action.loop) {
//             case FETCH_RESOURCES:
//                 if (this.isNew(state, action)) {
//                     return initialState
//                 } 
//                 return state  
//             default:
//                 return state
//         }
//     }

//     reduceLoopsDone(state = {}, action) {
//         switch(action.loop) {
//             case FETCH_RESOURCES:
//                 let count = action.results.count === undefined? state.count:action.results.count
//                 let offset = action.append? state.offset + action.results.results.length: action.results.results.length
//                 let endReached = offset >= count
//                 let actualList = action.append? state.list || []:[];
//                 let appendList = action.results.results
//                 return {
//                     list: this.isNew(state, action)? appendList:[ ...actualList, ...appendList],
//                     offset: offset,
//                     count: count,
//                     endReached: endReached
//                 }
//             default:
//                 return state

//         }
//     }

//     reduce(state = {}, action) {
//         switch(action.type) {
//             case FILTER:
//                 return immutable.merge(state, this.getInnerPath(action), {
//                     filters: action.newFilters
//                 })
//             default:
//                 return state
//         }
//     }

//     * onFlowEnd(action) {
//         switch(action.type) {
//             case FILTER:
//                 yield put(searchResources(action.resource, action.id, false))
//                 break
//             default:
//                 break
//         }
//     }

//     sagas() {
//         return [
//             takeLatest(SEARCH, (action) => this.run(action, this.fetch)),
//             takeLatest(FILTER, (action) => this.run(action, this.filter)),
//         ]
//     }
// } 

