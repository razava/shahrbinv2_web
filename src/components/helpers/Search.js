import React, { useState } from "react";
import TextInput from "./TextInput";

const Search = () => {
  // states
  const [searchText, setSearchText] = useState("");

  //   functions
  const handleChange = (name) => (e) => {
    setSearchText(e.target.value);
  };
  return (
    <>
      <TextInput
        placeholder={"جستجو..."}
        value={searchText}
        required={false}
        onChange={handleChange}
        name="query"
        wrapperClassName="w100 px0"
        inputClassName="no-border"
        focusonSelect={true}
      />
    </>
  );
};

export default Search;
