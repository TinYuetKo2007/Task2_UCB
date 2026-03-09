import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from './RootLayout.jsx'
import App from "./App.jsx"
import Contact from "./Contact.jsx"
import Login from './components/LogIn.jsx'
import SignUp from './components/SignUp.jsx'
import Profile from './components/Profile.jsx'
import SongUploader from "./components/SongUploader.jsx"
import AboutUs from './components/AboutUs.jsx'
import Products from './Products.jsx'
import ProductPage from './components/ProductPage.jsx'
import Notes from './components/Notes.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import SongPage from './components/SongPage.jsx'
import Songs from './components/Songs.jsx'

// Links
const Router = createBrowserRouter([
  {path: "/login", element: <Login/>},
  {path: "/signup", element: <SignUp/>},
    {
    path: "/",
    Component: RootLayout,
    children: [
  {path: "/", element: <App/>},
  {path: "/profile", element: <Profile/>},
  {path: "/add-song", element: <SongUploader/>},
  {path: "/contact", element: <Contact/>},
  {path: "/aboutus", element: <AboutUs/>},
  {path: "/admin", element: <AdminPage/>},
  {path: "/notes", element: <Notes/>},
  {path: "/songs", 
    children: [
    {index: true, element: <Songs/>},
    {path: ":songId", element: <SongPage/>},
  ]},
  {path: "/products",
  children: [
    {index: true, element: <Products/>},
    {path: ":productId", element: <ProductPage/>},
  ]
}]}
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router}/>
  </StrictMode>,
)