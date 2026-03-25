import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from './RootLayout.jsx'
import App from "./App.jsx"
import Contact from "./components/Contact.jsx"
import Login from './components/LogIn.jsx'
import SignUp from './components/SignUp.jsx'
import Profile from './components/Profile.jsx'
import AboutUs from './components/AboutUs.jsx'
import Products from './components/Products.jsx'
import ProductPage from './components/ProductPage.jsx'
import Reports from './components/Reports.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import AddProduct from './components/admin/AddProduct.jsx'
import EditPage from './components/admin/EditPage.jsx'
import { BasketProvider } from "./BasketContext";
import Basket from './components/Basket.jsx'
import BasketSuccess from "./components/BasketSuccess";
import ProfileSettings from './components/ProfileSettings.jsx'

// Links
export const routeConfig = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App />, name: "Home" },
      { path: "basket", element: <Basket /> },
      { path: "profile", element: <Profile />, name: "Profile" },
      { path: "settings", element: <ProfileSettings />, name: "Settings" },
      { path: "contact", element: <Contact />, name: "Contact Page" },
      { path: "aboutus", element: <AboutUs />, name: "About Us" },
      { path: "basket-success", element: <BasketSuccess />, searchable: false,},

      { path: "admin", children: [
        {index: true, element: <AdminPage />, searchable: false,},
        {path: "add-product", element: <AddProduct />, searchable: false,},
        {path: "edit/:type", element: <EditPage />, searchable: false},
        {path: "reports", element: <Reports />, searchable: false},
      ]},

      {
        path: "products",
        children: [
          { index: true, element: <Products />, name: "Products" },
          { path: ":productId", element: <ProductPage /> }
        ]
      }
    ]
  }
];
const Router = createBrowserRouter(routeConfig);

export function getSearchPages(routes, basePath = "") {
  let pages = [];

  routes.forEach((route) => {
    const fullPath = route.path
      ? basePath + route.path
      : basePath;

    if (
      route.name &&
      route.path &&
      route.searchable !== false &&
      !route.path.includes(":")
    ) {
      pages.push({
        id: fullPath,
        name: route.name,
        path: fullPath
      });
    }

    if (route.children) {
      pages = pages.concat(
        getSearchPages(route.children, fullPath === "/" ? "" : fullPath)
      );
    }
  });

  return pages;
}

export const searchPages = getSearchPages(routeConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BasketProvider>
      <RouterProvider router={Router}/>
    </BasketProvider>
  </StrictMode>
)