import React, { useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";

const useSignalR = (callBack = (f) => f) => {
  useEffect(() => {
    let connection;

    connection = new HubConnectionBuilder()
      .withUrl(
        `${
          process.env.NODE_ENV === "development"
            ? "https://shahrbin.yazd.ir:6790"
            : process.env.REACT_APP_API_URL
        }/eventhub`
      )
      .withAutomaticReconnect()
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("connection started");
      })
      .catch((err) => {
        console.log("connection failed " + err);
      });

    connection.onclose((error) => {
      console.assert(connection.state === HubConnectionState.Disconnected);
      console.log(
        "Connection closed due to error. Try refreshing this page to restart the connection",
        error
      );
    });

    connection.onreconnecting((error) => {
      console.assert(connection.state === HubConnectionState.Reconnecting);
      console.log("Connection lost due to error. Reconnecting.", error);
    });

    connection.onreconnected((connectionId) => {
      console.assert(connection.state === HubConnectionState.Connected);
      console.log(
        "Connection reestablished. Connected with connectionId",
        connectionId
      );
    });

    connection.serverTimeoutInMilliseconds = 60000;

    connection.on("Update", (data) => {
      callBack(data);
    });

    return () => {
      if (connection) {
        connection.stop().then(() => console.log("connection stopped"));
      }
    };
  }, []);

  return null;
};

export default useSignalR;
