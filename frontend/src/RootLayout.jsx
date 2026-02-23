import Header from "./components/Header";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}