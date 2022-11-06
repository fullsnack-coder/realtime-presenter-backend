import { createServer, Server as HTTPServer } from "http"
import { Server as SocketServer } from "socket.io"

interface ClientToServerEvents {
  client_prev_slide: () => void
  client_next_slide: () => void
  client_set_slide: (args: { slideIndex: number }) => void
}

interface ServerToClientEvents {
  server_set_slide: (args: { slideIndex: number }) => void
  server_prev_slide: () => void
  server_next_slide: () => void
}

class AppServer {
  public readonly server: HTTPServer
  public readonly io: SocketServer<ClientToServerEvents, ServerToClientEvents>

  constructor() {
    this.server = createServer()
    this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(
      this.server,
      {
        cors: { origin: "*" }
      }
    )

    this.configureSockets()
  }

  private configureSockets() {
    this.io.on("connection", socket => {
      console.log(`user connected ${socket.id}`)

      socket.on("client_next_slide", () => {
        socket.broadcast.emit("server_next_slide")
      })

      socket.on("client_prev_slide", () => {
        socket.broadcast.emit("server_prev_slide")
      })

      socket.on("client_set_slide", ({ slideIndex }) => {
        socket.broadcast.emit("server_set_slide", { slideIndex })
      })
    })
  }

  initialize(onStartHandler: () => void) {
    this.server.listen(4000, onStartHandler)
  }
}

export default AppServer
