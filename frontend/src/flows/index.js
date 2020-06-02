import { combineReducers } from 'redux' 
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'

import { AuthFlow, requestIsLogged} from './AuthFlow'
import { AttributeFlow } from './AttributeFlow'
import { AttributeChoiceFlow } from './AttributeChoiceFlow'
import { BlockFlow } from './BlockFlow'
import { CodeFlow } from './CodeFlow'
import { DimensionFlow } from './DimensionFlow'
import { LotFlow } from './LotFlow'
import { LotTypeFlow } from './LotTypeFlow'
import { VariantFlow } from './VariantFlow'
import { VariantTypeFlow } from './VariantTypeFlow'
import { WareFlow } from './WareFlow'
import { WarehouseFlow } from './WarehouseFlow'
import { WareTypeFlow } from './WareTypeFlow'
import { MagnitudeFlow } from './MagnitudeFlow'
import { PositionFlow } from './PositionFlow'
import { OperationFlow } from './OperationFlow'
import { RoleFlow } from './RoleFlow'
import { UserFlow } from './UserFlow'
import { BusinessUnitFlow } from "./BusinessUnitFlow";
import { BlockTypeFlow } from "./BlockTypeFlow";
import { EstablishmentFlow } from "./EstablishmentFlow";
import { PermissionFlow } from "./PermissionFlow";
import { PositionReducerFlow } from "./PositionReducerFlow";
import { PositionPrioritizerFlow } from "./PositionPrioritizerFlow";
import { BlockReducerFlow } from "./BlockReducerFlow";
import { BlockPrioritizerFlow } from "./BlockPrioritizerFlow";
import { PositionTypeFlow } from "./PositionTypeFlow";
import { CompanyFlow } from "./CompanyFlow";
import { ClientFlow } from './ClientFlow'
import { ClientTypeFlow } from './ClientTypeFlow'

const flows = [
    new AuthFlow('auth'),
    new AttributeFlow('attributes'),
    new BlockFlow('blocks'),
    new CodeFlow('codes'),
    new DimensionFlow('dimensions'),
    new MagnitudeFlow('magnitudes'),
    new LotFlow('lots'),
    new LotTypeFlow('lot_types'),
    new VariantFlow('variants'),
    new VariantTypeFlow('variant_type'),
    new WareFlow('wares'),
    new WareTypeFlow('ware_types'),
    new WarehouseFlow('warehouses'),
    new PositionFlow('positions'),
    new OperationFlow('operations'),
    new RoleFlow('roles'),
    new UserFlow('users'),
    new BusinessUnitFlow('business_units'),
    new BlockTypeFlow('block_types'),
    new PermissionFlow('permissions'),
    new EstablishmentFlow('establishments'),
    new AttributeChoiceFlow('attribute_choices'),
    new PositionReducerFlow('position_reducers'),
    new PositionPrioritizerFlow('position_prioritizers'),
    new BlockReducerFlow('block_reducers'),
    new BlockPrioritizerFlow('block_prioritizers'),
    new PositionTypeFlow('position_types'),
    new CompanyFlow('companies'),
    new ClientFlow('clients'),
    new ClientTypeFlow('client_types'),
]

const mainReducer = combineReducers(
    flows.reduce((answer, flow) => { answer[flow.rootPath]=flow.reducer; return answer }, {})
)

const sagasMiddleware = createSagaMiddleware()

let store = createStore(
  mainReducer, 
  applyMiddleware(sagasMiddleware)
)

if (process.env.NODE_ENV !== 'production')  {
    const reduxLogger = createLogger({});
    store = createStore(
      mainReducer, 
      applyMiddleware(sagasMiddleware, reduxLogger)
      // applyMiddleware(sagasMiddleware)
    )
}


flows.forEach(flow => sagasMiddleware.run(flow.saga))

store.dispatch(requestIsLogged())

export { store }
