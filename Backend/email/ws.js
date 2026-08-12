import {WebSocketServer} from 'ws';

 

const wss= new WebSocketServer({noServer: true, path: "/ws", maxPayload: 1024*1024});

const attachWss=async(server)=>{

  server.on("upgrade", (req, socket, head)=>{

    wss.handleUpgrade(req, socket, head, (ws)=>{
      wss.emit("connection", ws, req)
    })
  })

  wss.on("connection", (socket, req)=>{

    socket.on('error', ()=>{
      socket.terminate();
    })


    socket.on('close', ()=>{
      console.log("connection closed")
    })

    console.log(wss.clients);


  })

}


export  {attachWss, wss}