import AppServer from './server'

const appServer = new AppServer()

appServer.initialize(() => {
    console.log(`server running at port 4000`)
})