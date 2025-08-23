import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Checkout from "../pages/Checkout";
import Guard from "../components/Guard";
import Login from "../pages/Login";
import AdminLayout from "../pages/AdminPanel";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";
import AdminProducts from "../pages/AdminProducts";


function AppRoutes(){
    return(

    <Routes>
        <Route path="/" element={
            <Guard>
            <Home/>
            </Guard>
            }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin" element={
            <Guard requiredRole="admin">
            <AdminLayout />
            </Guard>
            }>
            
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
        <Route path="/checkout" element={
            <Guard>
            <Checkout/>
            </Guard>
            }/>
    </Routes>
    )
}
export default AppRoutes