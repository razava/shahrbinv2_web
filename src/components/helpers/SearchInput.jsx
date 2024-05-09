import React, { useContext } from "react";
import { AppStore } from "../../store/AppContext";

export default function SearchInput({
  isQuery,
  query,
  setQuery,
  filters,
  setIsQuery,
  mode = "server",
}) {
  const [store, dispatch] = useContext(AppStore);
  const handleKeyPress = (event) => {
    if (mode == "client") return;
    setIsQuery(false);
    if (event.key === "Enter") {
      dispatch({
        type: "setFilters",
        payload: { ...filters, query: query },
      });
    }
  };
  return (
    <div className=" flex items-center !border border-solid border-gray-300 rounded-lg px-1 w-80 gap-1 p-2 ml-5">
      {isQuery && (
        <span
          onClick={() => {
            setIsQuery(false);
            dispatch({
              type: "setFilters",
              payload: { ...filters, query: query },
            });
          }}
          className="w-8 cursor-pointer"
        >
          <i className="far fa-search text-primary !text-[16px]"></i>
        </span>
      )}
      {!isQuery && (
        <span
          onClick={() => {
            setIsQuery(true);
            if (mode == "client") {
              setQuery("");
            } else {
              dispatch({
                type: "setFilters",
                payload: { ...filters, query: "" },
              });
            }
          }}
          className="w-8 cursor-pointer"
        >
          <i className="fas fa-times text-primary !text-[16px]"></i>
        </span>
      )}
      <input
        value={query}
        className=" h-full rounded-lg border-none flex-1 bg text-xl focus:outline-none ring-offset-white  bg--200 py-[0.2em]"
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={"جستجو..."}
      ></input>
    </div>
  );
}
