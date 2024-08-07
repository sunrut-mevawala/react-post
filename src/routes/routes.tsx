import { Routes, Route } from "react-router-dom";
import UserComponent from "../packages/component/userComponent/userComponent";
import PostComponent from "../packages/component/postComponent/postComponent";
import HomeComponent from "../packages/component/homeComponent/home";
import UserLogin from "../packages/component/authentication/userLogin";

const AppRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/user" element={<UserComponent />} />
          <Route path="/post" element={(<PostComponent/>)} />
          <Route path="/auth/login" element={<UserLogin />} />
      </Routes>
  );
};

export default AppRoutes;