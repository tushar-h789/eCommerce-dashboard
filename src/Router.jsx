import Login from "./pages/Login";
import {
  createBrowserRouter,
} from "react-router-dom";
import Registration from "./pages/Registration";
import Otp from "./pages/Otp";
import Dashboard from "./pages/Dashboard/DashboardHome/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Gmail from "./pages/Gmail";
import UserList from "./pages/Dashboard/UserList/UserList";
import Merchant from "./pages/Dashboard/Merchant/Merchant";
import Admin from "./pages/Dashboard/Admin/Admin";
import ViewCategory from "./pages/Dashboard/ViewCategory/ViewCategory";
import AddCategory from "./pages/Dashboard/AddCategory/AddCategory";
import ViewSubCategory from "./pages/Dashboard/ViewSubCategory/ViewSubCategory";
import AddSubCategory from "./pages/Dashboard/AddSubCategory/AddSubCategory";
import AddProduct from "./pages/Dashboard/AddProduct/AddProduct";
import AddStore from "./pages/Dashboard/AddStore/AddStore";
import AddVariant from "./pages/Dashboard/AddVariant/AddVariant";
import ViewProduct from "./pages/Dashboard/ViewProduct/ViewProduct";
import ViewStore from "./pages/Dashboard/ViewStore/ViewStore";
import AddDiscount from "./pages/Dashboard/AddDiscount/AddDiscount";
import ViewDiscount from "./pages/Dashboard/ViewDiscount/ViewDiscount";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    // children: [
    //   {
    //     path: "/registration",
    //     element: <Registration/>
    //   }
    // ]
  },
  {
    path: 'registration',
    element: <Registration/>
  },
  {
    path: '/otp/:email',
    element: <Otp/>
  },
  {
    path: 'forgotpassword',
    element: <ForgotPassword/>
  },
  {
    path: 'gmail',
    element: <Gmail/>
  },
  {
    path: '/changepassword/:email',
    element: <ChangePassword/>
  },
  {
    path: 'dashboard',
    element: <Dashboard/>,
    children: [
      {
        path: 'userlist',
        element: <UserList/>
      },
      {
        path: 'merchant',
        element: <Merchant/>
      },
      {
        path: 'admin',
        element: <Admin/>
      },
      {
        path: 'viewcategory',
        element: <ViewCategory/>
      },
      {
        path: 'addcategory',
        element: <AddCategory/>
      },
      {
        path: 'addsubcategory',
        element: <AddSubCategory/>
      },
      {
        path: 'viewsubcategory',
        element: <ViewSubCategory/>
      },
      {
        path: 'addproduct',
        element: <AddProduct/>
      },
      {
        path: 'viewproduct',
        element: <ViewProduct/>
      },
      {
        path: 'addvariant',
        element:<AddVariant/>
      },
      {
        path: 'addstore',
        element: <AddStore/>
      },
      {
        path: 'viewstore',
        element: <ViewStore/>
      },
      {
        path: 'adddiscount',
        element: <AddDiscount/>
      },
      {
        path: 'viewdiscount',
        element: <ViewDiscount/>
      }
    ]
  }
]);
