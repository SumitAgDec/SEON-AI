import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context.jsx";
import { useNavigate } from "react-router-dom";

function UserAuth({ children }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    if (!token) {
      navigate("/login");
    }

    if (!user) {
      navigate("/login");
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default UserAuth;