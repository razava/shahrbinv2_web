import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  constants,
  getFromLocalStorage,
  checkLoginState,
  logout,
  appRoutes,
} from "../../helperFuncs";

const useMakeRequest = (
  caller = (f) => f,
  statusCode,
  condition,
  payload = null,
  callback = (f) => f,
  ...rest
) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  useEffect(() => {
    let source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();
    if (condition) {
      init(source);
    }

    return () => source.cancel("");
  }, [condition]);

  const init = async (source) => {
    const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
    const instance =
      getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE) || {};
    setLoading(true);
    caller(token, payload, source, instance, ...rest)
      .then((res) => {
        setLoading(false);
        if (res.isAxiosError) {
          setError(true);
          setSuccess(false);
          callback(res);
        }
        if (res.status === statusCode) {
          console.log(res);
          setData(res.data.data);
          setError(true);
          setSuccess(true);
          callback({ ...res, data: res.data.data, message: res.data.message });
        }
        if (res.status === 401) {
          setError(true);
          if (token) {
            logout(() => {
              history.push(appRoutes.login);
            });
          }
        }
        if ([400, 500].some((errCode) => errCode === res.status)) {
          setError(true);
          callback(res);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        }
        setError(true);
        setLoading(false);
        callback(err.response ? err.response : err);
      });
  };

  return [data, loading, setLoading, error, setError, success, setSuccess];
};

export default useMakeRequest;
