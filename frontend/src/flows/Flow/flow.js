import { put, call, takeEvery, cancelled, 
         all, select, takeLatest }  from 'redux-saga/effects'
import * as Sentry from '@sentry/browser';
import moment from 'moment'

import { UnknownException } from '../../exceptions'
import immutable from '../../libs/object-path-immutable'
import objectPath from '../../libs/object-path'

export function getActionStepType(action, step) {
    return `${action.toUpperCase()}_${step.toUpperCase()}`
}

export const ACTION_DONE = 'DONE';
export const ACTION_ERROR = 'ERROR';
export const ACTION_ABORT = 'ABORT';
export const ACTION_FINISH = 'FINISH';

/*
Flow es una clase que facilita el trabajo de correr n acciones que operan todas 
juntas en un mismo path del estado.

### Acciones
En flow se manejan dos tipos de acciones como concepto. 

Públicas: Las acciones públicas que se escriben generalmente en un archivo 
actions.js que son las acciones que se van a llamar de diferenes partes del 
proyecto
Privadas: Acciones que son llamadas por otras acciones y que nunca se van a 
utilizar afuera de los Flow. Para etsas acciones no hay definiciones explicitas

Esta diferencia conceptual ayuda de gran manera a no llenar el código de 
boilerplate

### Paths

En flow hay dos paths a tener en cuenta. 

Path Root: Es el path donde este flow corre y por ende sería imposible 
modificar cualquier parte del estado qie este por arriba del path root.
Acttion Path: Es el path donde se va a ir actualizando el estado de la acción
mientras corre. Cada acción debe configurar su path de accion.

La clase Flow se maneja en su totailidad seteando la variable actions, la cual
permite definir los métodos que se corren en cada situación 

 - **actionPath**: un string o un método que recibe (*action*, *state*)
 - **run**: un método que recibe (*action*, *state*)
 - **onError**: un método que recibe (*action*, *state*)
 - **onAbort**: un método que recibe (*action*, *state*)
 - **onFinish**: un método que recibe (*action*, *state*)
 - **onDone**: un método que recibe (*action*, *state*)
 - **reduceStart**: un método que recibe (*state*, *state*)
 - **reduceError**: un método que recibe (*state*, *state*)
 - **reduceDone**: un método que recibe (*state*, *state*)
 - **reduceAbort**: un método que recibe (*state*, *state*)
 - **reduceFinish**: un método que recibe (*state*, *state*)

constructor(rootPath) {
    super(rootPath)
    actions = {
        ACTION_KEY: {
            actionPath,
            run,        // debe  
            onError,
            onAbort,
            onFinish,
            onDone,
            reduceStart,
            reduceError,
            reduceDone,
            reduceAbort,
            reduceFinish
        },
    }
}

Hay una variable de clase que se usa para inicializar el path en caso de que el
estado sea undefined `initialState`

Se pueden sobreescribir los siguientes métodos para cambiar su funcionamiento

*isFlowAction*: Recibe una acción y determina si la acción corresponde al Flow
*resolvePattern*: Recibe un step *undefined*, *ACTION_ERROR*, *ACTION_DONE*, 
   *ACTION_ABORT*, *ACTION_FINISH* y tiene que devolver un método que recibiendo
   una accion determina si hay que correr la saga para ese step o no. Se usa
   para el takeEvery de sagas
*runAction*: El método que se usa para correr lo que sea que haga casa acción
   hoy en día simplemente llama al método. 


*/
export default class Flow {

    actionInitialState = {
        error: undefined,
        working: 0,
        done: false,
        abort: false,
        requested: undefined,
        failed: undefined,
        completed: undefined,
        aborted: undefined,
    }
    actions = {}
    initialState = {}
    rootPath = ""

    constructor(rootPath) {
        this.rootPath = rootPath
        this.isFlowAction = this.isFlowAction.bind(this);
        this.resolvePattern = this.resolvePattern.bind(this);
        this.resolvePatternLatest = this.resolvePatternLatest.bind(this);
        this.stepAction = this.stepAction.bind(this)
        this.onStart = this.onStart.bind(this);
        this.onError = this.onError.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onAbort = this.onAbort.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.reduceStart = this.reduceStart.bind(this);
        this.reduceError = this.reduceError.bind(this);
        this.reduceDone = this.reduceDone.bind(this);
        this.reduceAbort = this.reduceAbort.bind(this);
        this.reduceFinish = this.reduceFinish.bind(this);
        this.reduceActionDone = this.reduceActionDone.bind(this);
        this.reduceAction = this.reduceAction.bind(this);
        this.reducer = this.reducer.bind(this);
        this.sagas = this.sagas.bind(this);
        this.saga = this.saga.bind(this);
        this.runAction = this.runAction.bind(this);
    }

    isFlowAction(action) {
        return Object.keys(this.actions).indexOf(action.action) >= 0
    }

    resolvePattern(step=undefined) {
        let answer = function (action) {
            return this.rootPath && this.isFlowAction(action) && step === action.step
        }
        return answer.bind(this)
    }

    resolvePatternLatest(step=undefined) {
        let answer = function (action) {
            return false 
        }
        return answer.bind(this)
    }

    stepAction(action, step, extra = {}){
        return Object.assign({}, action, extra,
            {
                type: getActionStepType(action.action, step),
                step: step,
            }
        )
    }

    * onError(action) {
        try {
            const actionInfo = this.actions[action.action]
            const flowState = yield select((state) => objectPath.get(state, this.rootPath ))
            if (actionInfo && actionInfo.onError) {
                yield call([this, actionInfo.onError], action, flowState)
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }
    * onDone(action) {
        try {
            const actionInfo = this.actions[action.action]
            const flowState = yield select((state) => objectPath.get(state, this.rootPath ))
            if (actionInfo && actionInfo.onDone) {
                yield call([this, actionInfo.onDone], action, flowState)
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }
    * onAbort(action) {
        try {
            const actionInfo = this.actions[action.action]
            const flowState = yield select((state) => objectPath.get(state, this.rootPath ))
            if (actionInfo && actionInfo.onAbort) {
                yield call([this, actionInfo.onAbort], action, flowState)
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }
    * onFinish(action) {
        try {
            const actionInfo = this.actions[action.action]
            const flowState = yield select((state) => objectPath.get(state, this.rootPath ))
            if (actionInfo && actionInfo.onFinish) {
                yield call([this, actionInfo.onFinish], action, flowState)
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    * runAction(action, info, state) {
        const results = yield info.run(action, state)
        return results
    }

    * onStart(action) {
        let results = undefined
        let error = undefined
        const actionInfo = this.actions[action.action]
        if (actionInfo && actionInfo.run) {
            const flowState = yield select((state) => objectPath.get(state, this.rootPath ))
            try {
                results = yield call(this.runAction, action, actionInfo, flowState)
                if (results === undefined) {
                    yield put(this.stepAction(action, ACTION_ABORT))
                } else {
                    yield put(this.stepAction(action, ACTION_DONE, { results }))
                }
            } catch (raiseError) {
                error = raiseError
                if (error instanceof UnknownException) {
                    Sentry.captureException(error);
                }
                yield put(this.stepAction(action, ACTION_ERROR, { error }))
            } finally {
                let wasCancelled = yield cancelled()
                if (wasCancelled) {
                    yield put(this.stepAction(action, ACTION_ABORT))
                }
                yield put(this.stepAction(action, ACTION_FINISH, { results, error }))
            }
        }
    }
    
    reduceStart(state, action, info) { 
        if (info.reduceStart) {
            return info.reduceStart(state, action)
        }
        return state 
    }

    reduceError(state, action, info) { 
        if (info.reduceError) {
            return info.reduceError(state, action)
        }
        return state 
    }

    reduceDone(state, action, info) { 
        if (info.reduceDone) {
            return info.reduceDone(state, action)
        }
        return state 
    }

    reduceAbort(state, action, info) { 
        if (info.reduceAbort) {
            return info.reduceAbort(state, action)
        }
        return state 
    }

    reduceFinish(state, action, info) { 
        if (info.reduceFinish) {
            return info.reduceFinish(state, action)
        }
        return state 
    }

    reduceActionDone(state, action, info) {
        if (info.reduceActionDone) {
            return info.reduceActionDone(state, action)
        }
        return state
    }


    reduceAction(state, action) {
        if (state === undefined) {
            state = this.actionInitialState
        }
        if (action.loop === this.slug) {
            const actionInfo = this.actions[action.action]
            switch (action.step) {
                case undefined:
                    return Object.assign({}, state,
                        {
                            working: state.working + 1,
                            requested: moment().valueOf(),
                            done: false,
                            error: undefined,
                            abort: false,
                        }
                    )
                case ACTION_ERROR:
                    return Object.assign({}, state,
                        {
                            error: action.error,
                            failed: moment().valueOf(),
                            done: false,
                            abort: false,
                        }
                    )
                case ACTION_DONE:
                    return Object.assign({},
                        this.reduceActionDone(state, action, actionInfo),
                        {
                            error: undefined,
                            completed: moment().valueOf(),
                            done: true,
                            abort: false
                        }
                    )
                case ACTION_ABORT:
                    return Object.assign({}, state,
                        {
                            error: undefined,
                            done: false,
                            abort: true,
                            aborted: moment().valueOf()
                        }
                    )
                case ACTION_FINISH:
                    return Object.assign({}, state,
                        {
                            working: state.working - 1,
                        }
                    )
                default:
                    break
            }
        }
        return state
    }

    reducer(state, action) {
        if (this.isFlowAction(action) && this.actions[action.action]) {
            const actionInfo = this.actions[action.action]
            if (state === undefined || Object.keys(state).length === 0) {
                state = this.initialState || {}
            }
            let newState = undefined
            switch(action.step){
                case undefined:
                    newState = this.reduceStart(state, action, actionInfo)
                    break;
                case ACTION_ERROR:
                    newState = this.reduceError(state, action, actionInfo)
                    break;
                case ACTION_DONE:
                    newState = this.reduceDone(state, action, actionInfo)
                    break;
                case ACTION_ABORT:
                    newState = this.reduceAbort(state, action, actionInfo)
                    break;
                case ACTION_FINISH:
                    newState = this.reduceFinish(state, action, actionInfo)
                    break;
                default:
                    newState = state

            }
            const path = typeof actionInfo.actionPath === 'string'?actionInfo.actionPath:actionInfo.actionPath(action, state)
            return immutable.merge(newState, path, this.reduceAction(objectPath.get(state, path), action) )
        } 
        return state || {}
    }

    sagas() {
        return []
    }

    * saga() {
        yield all([
            takeLatest(this.resolvePatternLatest(), this.onStart),
            takeEvery(this.resolvePattern(), this.onStart),
            takeEvery(this.resolvePattern(ACTION_ERROR), this.onError),
            takeEvery(this.resolvePattern(ACTION_DONE), this.onDone),
            takeEvery(this.resolvePattern(ACTION_ABORT), this.onAbort),
            takeEvery(this.resolvePattern(ACTION_FINISH), this.onFinish),
            ...this.sagas(),
        ])
    }
}