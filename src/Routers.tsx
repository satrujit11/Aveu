import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import Posts from "./Pages/Posts";

const Routers = () => {
  return (
    <Routes>
      <Route path="/:userId" element={<Home />} />
      <Route path="/" element={<Create />} />
      <Route path="/posts" element={<Posts />} />
    </Routes>
  );
};

export default Routers;

