import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import Posts from "./Pages/Posts";

const Routers = () => {
  return (
    <Routes>
      <Route path="/:userId" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/" element={<Posts />} />
    </Routes>
  );
};

export default Routers;
