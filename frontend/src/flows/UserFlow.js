import { ResourceFlow } from './ResourceFlow'

export class UserFlow extends ResourceFlow {
    constructor(rootPath) {
        super(rootPath, 'users')
    }
}