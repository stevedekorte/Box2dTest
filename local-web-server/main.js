

require("./StrvctHttpsServer.js")

const server = new StrvctHttpsServer()
server.setIsSecure(false)
server.run()

