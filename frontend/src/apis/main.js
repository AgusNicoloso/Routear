
import { ValidationException, UnknownException, AuthorizationException 
       } from '../exceptions'
import settings from '../settings'

const getTokenHeaders = (token) => {
    return {
        "Authorization": "Bearer " + token
    }
}

const fetchMain = async (url, method, status, extraHeaders={}, body={},  params={} ) => {
    let hasFile = body.attributes && body.attributes.some(a => a.attr.slug === "archivo")
    if (!hasFile) {
        extraHeaders = Object.assign({}, extraHeaders, {
            "Content-Type": "application/json",
        })
    }
    const config = {
        method: method,
        headers: Object.assign({"Accept": "application/json"}, extraHeaders),
    }
    if (body && Object.keys(body).length > 0) {
        config.body = JSON.stringify(body)
    }
    if (params && Object.keys(params).length > 0) {
        url = url + "?" + Object.keys(params).filter(k=> params[k]).map(
                k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) 
            ).join('&');
    }
    const response = await fetch(url, config)
    let results = await response.text();
    try {
         results = JSON.parse(results)
    } catch (error) { }
    if (response.status === 500) {
        throw new UnknownException(results)
    } else if (response.status === 400) {
        throw new ValidationException(results)
    } else if (response.status === 401) {
        throw new AuthorizationException(results)
    } else if (response.status !== status) {
        throw response
    }
    return results
}


export const authUser = async (email, password) => {
    return fetchMain(
        settings.API_URL  + "/auth/token/",
        'POST',
        200, {}, {
            email,
            password
        }
    )
}

export const refreshToken = async (token) => {
    return fetchMain(
        settings.API_URL + "/auth/refresh/",
        'POST',
        200, {}, {
            refresh: token
        }

    )
}

export const getResource = async (token, resource, id ) => {
    console.log("ENTROOO ACAAAA GETRESOURCE", settings.API_URL)
    return fetchMain(
        settings.API_URL + `/api/${resource}/${id}/`,
        'GET',
        200,
        getTokenHeaders(token)
    )
}

export const getMe = async (token) => {
    return fetchMain(
        settings.API_URL + `/api/me/`,
        'GET',
        200,
        getTokenHeaders(token)
    )
}

export const fetchResources = async (token, resource, filters ) => {
    return fetchMain(
        settings.API_URL + `/api/${resource}/`,
        'GET',
        200,
        getTokenHeaders(token),
        {},
        filters
    )
}

export const createResource = async (token, resource, body) => {
    return fetchMain(
        settings.API_URL + `/api/${resource}/`,
        'POST',
        201,
        getTokenHeaders(token),
        body
    )
}

export const updateResource = async (token, resource, id, body) => {
    return fetchMain(
        settings.API_URL + `/api/${resource}/${id}/`,
        'PUT',
        200,
        getTokenHeaders(token),
        body
    )
}

export const patchResource = async (token, resource, id, body) => {
    return fetchMain(
        settings.API_URL + `/api/${resource}/${id}/`,
        'PATCH',
        200,
        getTokenHeaders(token),
        body
    )
}

export const deleteResource = async (token, resource, id) => {
    return fetchMain(
        settings.API_URL + `/api/${resource}/${id}/`,
        'DELETE',
        204,
        getTokenHeaders(token)
    )
}
