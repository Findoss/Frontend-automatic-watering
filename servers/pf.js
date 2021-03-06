/* eslint array-element-newline: ["error", "never"] */

const WebSocketServer = require("websocket").server;
const http = require("http");

const initData = {
  feedingCount: 2,
  maxFeedingCount: 10,
  countPortion: 1,
  mode: 1,
  feedingInterval: 3,
  lastFeedingTime: (() => Date.now() - 1000000)(),
  type: "pf",
  microcontroller: `Pet feeder 
  ${Math.floor(Math.random() * (10 - 1) + 1)}`
};

const wsServer = new WebSocketServer({
  httpServer: http
    .createServer()
    .listen(process.argv[2] ? process.argv[2] : 3000)
});

wsServer.on("request", request => {
  const connection = request.accept(null, request.origin);

  setTimeout(() => {
    console.log("← send init");
    connection.send(
      JSON.stringify({
        event: "init",
        data: initData
      })
    );
  }, 1000);

  // setInterval(() => {
  //   console.log("← send feeding");
  //   connection.send(
  //     JSON.stringify({
  //       event: "feeding"
  //     })
  //   );
  // }, 2000);

  connection.on("message", message => {
    if (message.type === "utf8") {
      console.log(`→ ${message.utf8Data}`);
      const data = JSON.parse(message.utf8Data);

      switch (data.event) {
        case "startFeeding":
          console.log("← send feeding");
          connection.send(
            JSON.stringify({
              event: "feeding"
            })
          );
          break;

        default:
          break;
      }
    }
  });

  connection.on("close", () => {
    console.log("→ close");
  });
});
