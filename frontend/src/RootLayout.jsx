import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router";
export default function RootLayout() {
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        height: "100vh",
        width: "100%"
      }}
    >
      <div>
        <Header />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            alignItems: "center",
            flex: 1,
            maxWidth: "66vw",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
      <div style={{marginTop: 10}}>
        <Footer />
      </div>
      
    </div>
  );
}
