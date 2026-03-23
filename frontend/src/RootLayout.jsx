import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%"
      }}
    >
      <Header />

      <div style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}