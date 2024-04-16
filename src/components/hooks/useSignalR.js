import React, { useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  JsonHubProtocol,
  LogLevel,
} from "@microsoft/signalr";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { constants, getFromLocalStorage } from "../../helperFuncs";
import { postConnectionId } from "../../api/commonApi";

const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
const connection = new HubConnectionBuilder()
  .withUrl(`${process.env.REACT_APP_SIGNALR_URL}/notifhub`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .withAutomaticReconnect()
  .withHubProtocol(new JsonHubProtocol())
  .configureLogging(LogLevel.Debug)
  .build();

const useSignalR = (callBack = (f) => f) => {
  const postConnectionIdMutation = useMutation({
    mutationKey: ["connectionId"],
    mutationFn: postConnectionId,
    onSuccess: (res) => {},
    onError: (err) => {},
  });

  useEffect(() => {
    // let connection;

    // connection = new HubConnectionBuilder()
    //   .withUrl(`${process.env.REACT_APP_API_URL}/notifhub`)
    //   .withAutomaticReconnect()
    //   .withHubProtocol(new JsonHubProtocol())
    //   .configureLogging(LogLevel.Information)
    //   .build();

    // connection
    //   .start()
    //   .then(() => {
    //     console.log("connection started");
    //   })
    //   .catch((err) => {
    //     console.log("connection failed " + err);
    //   });

    // connection.onclose((error) => {
    //   console.assert(connection.state === HubConnectionState.Disconnected);
    //   console.log(
    //     "Connection closed due to error. Try refreshing this page to restart the connection",
    //     error
    //   );
    // });

    // connection.onreconnecting((error) => {
    //   console.assert(connection.state === HubConnectionState.Reconnecting);
    //   console.log("Connection lost due to error. Reconnecting.", error);
    // });

    // connection.onreconnected((connectionId) => {
    //   console.assert(connection.state === HubConnectionState.Connected);
    //   console.log(
    //     "Connection reestablished. Connected with connectionId",
    //     connectionId
    //   );
    // });

    // connection.serverTimeoutInMilliseconds = 60000;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR connected");
        console.log(connection.connectionId);

        postConnectionIdMutation.mutate(connection.connectionId);
        connection.on("Update", (data) => {
          callBack(data);
        });
      } catch (err) {
        console.error("SignalR connection failed: ", err);
      }
    };

    startConnection();

    // connection.on("Update", (data) => {
    //   callBack(data);
    // });

    // return () => {
    //   if (connection) {
    //     connection.stop().then(() => console.log("connection stopped"));
    //   }
    // };
  }, []);

  return null;
};

export default useSignalR;
