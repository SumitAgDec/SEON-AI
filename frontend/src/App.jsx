import { useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/user.context";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </>
  );
}

export default App;
