export const GET = 'GET'
export const CLEAN = 'CLEAN'
export const CREATE = 'CREATE'
export const CLONE = 'CLONE'
export const UPDATE = 'UPDATE'
export const PATCH = 'PATCH'
export const DELETE = 'DELETE'
export const FETCH = 'FETCH'
export const SEARCH = 'SEARCH'
export const FILTER = 'FILTER'
export const SELECT = 'SELECT'

export function requestResource(resource, id, path, defaultObj) {
    return {
        type: GET,
        action: GET,
        resource,
        id,
        path,
        defaultObj,
    }
}

export function selectResource(resource, id, path, defaultObj) {
    return {
        type: SELECT,
        action: SELECT,
        resource,
        id,
        path,
        defaultObj,
    }
}

export function cleanResource(resource, path) {
    return {
        type: CLEAN,
        action: CLEAN,
        resource,
        path,
    }
}

export function createResource(resource, body, path) {
    console.log(resource, body, path)
    return {
        type: CREATE,
        action: CREATE,
        resource,
        body,
        path,
    }
}

export function cloneResource(resource, body, id) {
    return {
        type: CLONE,
        action: CLONE,
        resource,
        body,
        id,
    }
}

export function updateResource(resource, id, body) {
    return {
        type: UPDATE,
        action: UPDATE,
        resource,
        id,
        body
    }
}

export function patchResource(resource, id, body) {
    return {
        type: PATCH,
        action: PATCH,
        resource,
        id,
        body
    }
}

export function deleteResource(resource, id) {
    return {
        type: DELETE,
        action: DELETE,
        resource,
        id,
    }
}

export function searchResources(resource, id, q, offset, limit, order, tempFilters={}) {
    return {
        type: SEARCH,
        action: SEARCH,
        resource,
        id,
        q,
        offset,
        limit,
        order,
        tempFilters
    }
}

export function fetchResources(resource, tempFilters={}) {
    return {
        type: FETCH,
        action: FETCH,
        resource,
        tempFilters
    }
}

export function updateFilters(resource, id, newFilters) {
    return {
        type: FILTER,
        action: FILTER,
        resource,
        id,
        newFilters,
    }
}
