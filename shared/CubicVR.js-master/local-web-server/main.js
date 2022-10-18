

require("./StrvctHttpsServer.js")

const server = new StrvctHttpsServer()
server.setIsSecure(true)
server.run()

