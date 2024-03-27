import { BrowserRouter } from "react-router-dom";
import Routers from "./Routers";
import { Notifications } from "react-push-notification";

function App() {
  return (
    <>
      <Notifications />
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
}

export default App;
