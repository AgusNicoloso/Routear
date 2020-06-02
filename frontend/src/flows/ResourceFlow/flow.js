import moment from 'moment'
import { take, select, put } from 'redux-saga/effects'
import * as api from '../../apis/main'
import immutable from '../../libs/object-path-immutable'
import { requestRefreshToken, REFRESH_TOKEN } from '../AuthFlow'
import objectPath from '../../libs/object-path'
import { getActionStepType, ACTION_FINISH, Flow } from '../Flow'
import { ValidationException } from '../../exceptions'
import { GET, CLEAN, CREATE, CLONE, UPDATE, PATCH, DELETE, FETCH, SEARCH, SELECT } from './actions'

export default class ResourceFlow extends Flow {
    useParser = false

    constructor(rootPath, resource) {
        super(rootPath)
        this.resource = resource
        this.actions = {
            [GET]: {
                actionPath: this.actionPathGet,
                run: this.runGet,
                onError: this.onErrorGet,
                onAbort: this.onAbortGet,
                onFinish: this.onFinishGet,
                onDone: this.onDoneGet,
                reduceStart: this.reduceStartGet,
                reduceError: this.reduceErrorGet,
                reduceDone: this.reduceDoneGet,
                reduceAbort: this.reduceAbortGet,
                reduceFinish: this.reduceFinishGet,
                reduceActionDone: this.reduceActionDoneGet,
            },
            [SELECT]: {
                actionPath: this.actionPathSelect,
                run: this.runSelect,
                onError: this.onErrorSelect,
                onAbort: this.onAbortSelect,
                onFinish: this.onFinishSelect,
                onDone: this.onDoneSelect,
                reduceStart: this.reduceStartSelect,
                reduceError: this.reduceErrorSelect,
                reduceDone: this.reduceDoneSelect,
                reduceAbort: this.reduceAbortSelect,
                reduceFinish: this.reduceFinishSelect,
                reduceActionDone: this.reduceActionDoneSelect,
            },
            [CLEAN]: {
                actionPath: this.actionPathClean,
                run: this.runClean,
                onError: this.onErrorClean,
                onAbort: this.onAbortClean,
                onFinish: this.onFinishClean,
                onDone: this.onDoneClean,
                reduceStart: this.reduceStartClean,
                reduceError: this.reduceErrorClean,
                reduceDone: this.reduceDoneClean,
                reduceAbort: this.reduceAbortClean,
                reduceFinish: this.reduceFinishClean,
                reduceActionDone: this.reduceActionDoneClean,
            },
            [CREATE]: {
                actionPath: this.actionPathCreate,
                run: this.runCreate,
                onError: this.onErrorCreate,
                onAbort: this.onAbortCreate,
                onFinish: this.onFinishCreate,
                onDone: this.onDoneCreate,
                reduceStart: this.reduceStartCreate,
                reduceError: this.reduceErrorCreate,
                reduceDone: this.reduceDoneCreate,
                reduceAbort: this.reduceAbortCreate,
                reduceFinish: this.reduceFinishCreate,
                reduceActionDone: this.reduceActionDoneCreate,
            },
            [CLONE]: {
                actionPath: this.actionPathClone,
                run: this.runClone,
                onError: this.onErrorClone,
                onAbort: this.onAbortClone,
                onFinish: this.onFinishClone,
                onDone: this.onDoneClone,
                reduceStart: this.reduceStartClone,
                reduceError: this.reduceErrorClone,
                reduceDone: this.reduceDoneClone,
                reduceAbort: this.reduceAbortClone,
                reduceFinish: this.reduceFinishClone,
                reduceActionDone: this.reduceActionDoneClone,
            },
            [UPDATE]: {
                actionPath: this.actionPathUpdate,
                run: this.runUpdate,
                onError: this.onErrorUpdate,
                onAbort: this.onAbortUpdate,
                onFinish: this.onFinishUpdate,
                onDone: this.onDoneUpdate,
                reduceStart: this.reduceStartUpdate,
                reduceError: this.reduceErrorUpdate,
                reduceDone: this.reduceDoneUpdate,
                reduceAbort: this.reduceAbortUpdate,
                reduceFinish: this.reduceFinishUpdate,
                reduceActionDone: this.reduceActionDoneUpdate,
            },
            [PATCH]: {
                actionPath: this.actionPathPatch,
                run: this.runPatch,
                onError: this.onErrorPatch,
                onAbort: this.onAbortPatch,
                onFinish: this.onFinishPatch,
                onDone: this.onDonePatch,
                reduceStart: this.reduceStartPatch,
                reduceError: this.reduceErrorPatch,
                reduceDone: this.reduceDonePatch,
                reduceAbort: this.reduceAbortPatch,
                reduceFinish: this.reduceFinishPatch,
                reduceActionDone: this.reduceActionDonePatch,
            },
            [DELETE]: {
                actionPath: this.actionPathDelete,
                run: this.runDelete,
                onError: this.onErrorDelete,
                onAbort: this.onAbortDelete,
                onFinish: this.onFinishDelete,
                onDone: this.onDoneDelete,
                reduceStart: this.reduceStartDelete,
                reduceError: this.reduceErrorDelete,
                reduceDone: this.reduceDoneDelete,
                reduceAbort: this.reduceAbortDelete,
                reduceFinish: this.reduceFinishDelete,
                reduceActionDone: this.reduceActionDoneDelete,
            },
            [FETCH]: {
                actionPath: this.actionPathFetch,
                run: this.runFetch,
                onError: this.onErrorFetch,
                onAbort: this.onAbortFetch,
                onFinish: this.onFinishFetch,
                onDone: this.onDoneFetch,
                reduceStart: this.reduceStartFetch,
                reduceError: this.reduceErrorFetch,
                reduceDone: this.reduceDoneFetch,
                reduceAbort: this.reduceAbortFetch,
                reduceFinish: this.reduceFinishFetch,
                reduceActionDone: this.reduceActionDoneFetch,
            },
            [SEARCH]: {
                actionPath: this.actionPathSearch,
                run: this.runSearch,
                onError: this.onErrorSearch,
                onAbort: this.onAbortSearch,
                onFinish: this.onFinishSearch,
                onDone: this.onDoneSearch,
                reduceStart: this.reduceStartSearch,
                reduceError: this.reduceErrorSearch,
                reduceDone: this.reduceDoneSearch,
                reduceAbort: this.reduceAbortSearch,
                reduceFinish: this.reduceFinishSearch,
                reduceActionDone: this.reduceActionDoneSearch,
            },

        }
    }

    isTokenForRefresh = (timestamp) => {
        return moment(timestamp).isBefore(moment().add(-15, 'minutes'))
    }
    
    * runAction(action, info, state) {
        const auth = yield select((st) => st.auth)
        let token = auth.accessToken

        if (this.isTokenForRefresh(auth.tokenTimestamp)) {
            yield put(requestRefreshToken())
            const refreshAction = yield take(getActionStepType(REFRESH_TOKEN, ACTION_FINISH))

            if (refreshAction.error) {
                throw refreshAction.error
            }
            token = yield select((st) => st.auth.accessToken)
        }

        if (!token) {
            throw new ValidationException("no token")
        }

        const results = yield info.run(action, state, token)
        return results
    }

    isFlowAction = (action) => {
        return Object.keys(this.actions).indexOf(action.action) >= 0 && action.resource === this.resource
    }

    resolvePattern = (step=undefined) => {
        let answer = function (action) {
            return action.type !== SEARCH && this.rootPath && this.isFlowAction(action) && step === action.step && action.resource === this.resource
        }
        return answer.bind(this)
    }

    resolvePatternLatest = (step=undefined) => {
        let answer = function (action) {
            return action.type === SEARCH && this.rootPath && this.isFlowAction(action) && step === action.step && action.resource === this.resource
        }
        return answer.bind(this)
    }

    reduceClean = (state, action) => {
        if (action.path) {
            return immutable.del(state, action.path)
        }
        return state
    }

    reduceExists = (state, action) => {
        const path = action.path?action.path:action.id
        return immutable.merge(
            state,
            `objects.${path}.body`,
            this.useParser? this.parseResource(action.results):action.results 
        )
    }

    reduceNew = (state, action) => {
        return immutable.merge(
            state,
            `objects.${action.results.id}.body`,
            this.useParser? this.parseResource(action.results):action.results
        )
    }

    reduceDelete = (state, action) => {
        return immutable.del(state, `objects.${action.id}.body` )
    }

    reduceFetch = (state, action) => {
        const results = action.results.results || action.results
        return immutable.merge(
            state, 
            'objects',
            results.reduce((result, elem) => {
                result[elem.id] = {body: this.useParser? this.parseResource(elem):elem}
                return result
            }, {})
        )
    }

    parseResource = (obj) => {
        return obj
    }

    reduceSearch = (state, action) => {
        const results = action.results.results || action.results
        let newState = immutable.set(state, `searches.${action.id}.result`, this.useParser? results.map(e => this.parseResource(e)):results )
        newState = immutable.set(newState, `searches.${action.id}.count`, action.results.count )
        return immutable.set(newState, `searches.${action.id}.total_count`, action.results.total_count )
    }

    reduceSelect = (state, action) => {
        if (action.path) {
            let actual = action.defaultObj
            if (actual === undefined) {
                actual = objectPath.get(state, `objects.${action.id}.body`)
            }
            if (actual) {
                return immutable.set(
                    state,
                    `objects.${action.path}.body`,
                    actual
                )
            }
        }
        return state
    }

    clearSearch = (state, action) => {
        return immutable.set(state, `searches.${action.id}.result`, [])
    }

    actionPathGet = (action, state) => action.path?`objects.${action.path}.get`:`objects.${action.id}.get`
    actionPathSelect = (action, state) => `objects.${action.path}.get`
    actionPathClean = (action, state) => 'clean'
    actionPathCreate = (action, state) => action.path?`objects.${action.path}.create`:`create`
    actionPathClone = (action, state) => `objects.${action.id}.clone`
    actionPathUpdate = (action, state) => `objects.${action.id}.update`
    actionPathPatch = (action, state) => `objects.${action.id}.patch`
    actionPathDelete = (action, state) => `objects.${action.id}.delete`
    actionPathFetch = (action, state) => 'fetch'
    actionPathSearch = (action, state) => `searches.${action.id}.status`
    runGet = (action, state, token) => api.getResource(token, action.resource, action.id)
    runSelect = (action, state, token) => null
    runClean = (action, state, token) => null
    runCreate = (action, state, token) => api.createResource(token, action.resource, action.body)
    runClone = (action, state, token) => api.createResource(token, action.resource, action.body)
    runUpdate = (action, state, token) => api.updateResource(token, action.resource, action.id, action.body)
    runPatch = (action, state, token) => api.patchResource(token, action.resource, action.id, action.body)
    runDelete = (action, state, token) => api.deleteResource(token, action.resource, action.id)
    runFetch = (action, state, token) => api.fetchResources(token, action.resource, Object.assign({}, action.tempFilters, {limit: 2000}))  
    runSearch = (action, state, token) => api.fetchResources(token, action.resource, Object.assign({}, action.tempFilters, {
        q:action.q,
        offset: action.offset,
        limit: action.limit,
        o: action.order,
    }))
    onErrorGet = (action, state, token) => {}
    onErrorSelect = (action, state, token) => {}
    onErrorClean = (action, state, token) => {}
    onErrorCreate = (action, state, token) => {}
    onErrorClone = (action, state, token) => {}
    onErrorUpdate = (action, state, token) => {}
    onErrorPatch = (action, state, token) => {}
    onErrorDelete = (action, state, token) => {}
    onErrorFetch = (action, state, token) => {}
    onErrorSearch = (action, state, token) => {}
    onAbortGet = (action, state, token) => {}
    onAbortSelect = (action, state, token) => {}
    onAbortClean = (action, state, token) => {}
    onAbortCreate = (action, state, token) => {}
    onAbortClone = (action, state, token) => {}
    onAbortUpdate = (action, state, token) => {}
    onAbortPatch = (action, state, token) => {}
    onAbortDelete = (action, state, token) => {}
    onAbortFetch = (action, state, token) => {}
    onAbortSearch = (action, state, token) => {}
    onFinishGet = (action, state, token) => {}
    onFinishSelect = (action, state, token) => {}
    onFinishClean = (action, state, token) => {}
    onFinishCreate = (action, state, token) => {}
    onFinishClone = (action, state, token) => {}
    onFinishUpdate = (action, state, token) => {}
    onFinishPatch = (action, state, token) => {}
    onFinishDelete = (action, state, token) => {}
    onFinishFetch = (action, state, token) => {}
    onFinishSearch = (action, state, token) => {}
    onDoneGet = (action, state, token) => {}
    onDoneSelect = (action, state, token) => {}
    onDoneClean = (action, state, token) => {}
    onDoneCreate = (action, state, token) => {}
    onDoneClone = (action, state, token) => {}
    onDoneUpdate = (action, state, token) => {}
    onDonePatch = (action, state, token) => {}
    onDoneDelete = (action, state, token) => {}
    onDoneFetch = (action, state, token) => {}
    onDoneSearch = (action, state, token) => {}
    reduceStartGet = (state, action) => this.reduceSelect(state, action)
    reduceStartSelect = (state, action) => state
    reduceStartClean = (state, action) => state
    reduceStartCreate = (state, action) => state
    reduceStartClone = (state, action) => state
    reduceStartUpdate = (state, action) => state
    reduceStartPatch = (state, action) => state
    reduceStartDelete = (state, action) => state
    reduceStartFetch = (state, action) => state
    reduceStartSearch = (state, action) => state //this.clearSearch(state, action)
    reduceErrorGet = (state, action) => state
    reduceErrorSelect = (state, action) => state
    reduceErrorClean = (state, action) => state
    reduceErrorCreate = (state, action) => state
    reduceErrorClone = (state, action) => state
    reduceErrorUpdate = (state, action) => state
    reduceErrorPatch = (state, action) => state
    reduceErrorDelete = (state, action) => state
    reduceErrorFetch = (state, action) => state
    reduceErrorSearch = (state, action) => state
    reduceDoneGet = (state, action) => this.reduceExists(state, action)
    reduceDoneSelect = (state, action) => this.reduceSelect(state, action)
    reduceDoneClean = (state, action) => this.reduceClean(state, action)
    reduceDoneCreate = (state, action) => this.reduceNew(state, action)
    reduceDoneClone = (state, action) => this.reduceNew(state, action)
    reduceDoneUpdate = (state, action) => this.reduceExists(state, action)
    reduceDonePatch = (state, action) => this.reduceExists(state, action)
    reduceDoneDelete = (state, action) => this.reduceDelete(state, action)
    reduceDoneFetch = (state, action) => this.reduceFetch(state, action)
    reduceDoneSearch = (state, action) => this.reduceSearch(state, action)
    reduceAbortGet = (state, action) => state
    reduceAbortSelect = (state, action) => state
    reduceAbortClean = (state, action) => state
    reduceAbortCreate = (state, action) => state
    reduceAbortClone = (state, action) => state
    reduceAbortUpdate = (state, action) => state
    reduceAbortPatch = (state, action) => state
    reduceAbortDelete = (state, action) => state
    reduceAbortFetch = (state, action) => state
    reduceAbortSearch = (state, action) => state
    reduceFinishGet = (state, action) => state
    reduceFinishSelect = (state, action) => state
    reduceFinishClean = (state, action) => state
    reduceFinishCreate = (state, action) => state
    reduceFinishClone = (state, action) => state
    reduceFinishUpdate = (state, action) => state
    reduceFinishPatch = (state, action) => state
    reduceFinishDelete = (state, action) => state
    reduceFinishFetch = (state, action) => state
    reduceFinishSearch = (state, action) => state
    reduceActionDoneSelect = (state, action) => state
    reduceActionDoneGet = (state, action) => state
    reduceActionDoneClean = (state, action) => state
    reduceActionDoneCreate = (state, action) => Object.assign({}, state, { id:action.results.id })
    reduceActionDoneClone = (state, action) => state
    reduceActionDoneUpdate = (state, action) => state
    reduceActionDonePatch = (state, action) => state
    reduceActionDoneDelete = (state, action) => state
    reduceActionDoneFetch = (state, action) => state
    reduceActionDoneSearch = (state, action) => state
} 

