import { combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import SagaTester from '../../redux-saga-tester'

import  Flow from './flow'


const TEST_ACTION = 'TEST_ACTION'
const TEST_PATH = 'testpath'
const TEST_ANSWER = {
    foo: 'bar'
}

class TestFlow extends Flow {
    constructor(rootPath) {
        super(rootPath)
        this.actions = {
            [TEST_ACTION]: {
                actionPath: (action, state) => TEST_PATH,
                run: this.runMethod,
                reduceDone: (state, action) => {
                    return {
                        answer: Object.assign({}, state.answer, action.results)
                    } 
                }
            }
        }
    }

    runMethod = async (action, state) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return TEST_ANSWER
    } 
}

function testAction() {
    return {
        type: TEST_ACTION,
        action: TEST_ACTION,
    }
}

function getSagaTester(initialState={}, log=false){
    const flow = new TestFlow('root')

    const mainReducer = combineReducers({
      [flow.rootPath]: flow.reducer,
    })

    const config = {
        initialState: initialState,
        reducers: mainReducer,

    }
    if (log) {
        config['middlewares'] = [createLogger()]
    }
    const sagaTester = new SagaTester(config)
    sagaTester.start(flow.saga)
    return sagaTester
}

describe('Test: Login', () => {

    it('Debería correr el método async', async () => {
        const sagaTester = getSagaTester()
        sagaTester.dispatch(testAction())
        await sagaTester.waitFor(`${TEST_ACTION}_FINISH`)
        const state = sagaTester.getState()
        expect(state.root[TEST_PATH].done).toBeTruthy()
        expect(state.root.answer).toEqual(TEST_ANSWER)
    })
})
