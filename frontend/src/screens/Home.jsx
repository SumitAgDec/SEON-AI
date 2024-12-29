import React, { useContext } from "react";
import { UserContext, useUser } from "../context/user.context";
function Home() {
  const { user } = useUser();
  return <div>{JSON.stringify(user)}</div>;
}

export default Home;
