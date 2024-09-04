import { Routes, Route } from "react-router-dom";
import UserComponent from "../packages/component/userComponent/userComponent";
import PostComponent from "../packages/component/postComponent/postComponent";
import ProductComponent from "../packages/component/productComponent/productComponent";
import HomeComponent from "../packages/component/homeComponent/home";
import UserLogin from "../packages/component/authentication/userLogin";
import ManageProdCatOperations from "../packages/component/Operations/ManageProdCat";
const AppRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/product" element={<ProductComponent />} />
          <Route path="/user" element={<UserComponent />} />
          <Route path="/post" element={(<PostComponent/>)} />
          <Route path="/auth/login" element={<UserLogin />} />
          <Route path="/operations" element={<ManageProdCatOperations />} />
      </Routes>
  );
};

export default AppRoutes;