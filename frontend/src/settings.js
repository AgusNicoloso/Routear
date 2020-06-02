// import dev from './settings/dev'
// import prod from './settings/prod'

const dev = {
    API_URL: process.env.REACT_APP_API_URL,
    SENTRY_DSN: ""
}

//const settings = Object.assign({}, dev, (process.env.NODE_ENV === 'production' || !__DEV__)?prod:dev)
const settings = Object.assign({}, dev)

export default settings
