import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast"; // ✅ đúng cú pháp import

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Myaccount from "./pages/Myaccount";


const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.4 }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Các trang public */}
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />

          {/* Các trang quản trị */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Page><Dashboard /></Page>
              </Layout>
            }
          />
          <Route
            path="/myaccount"
            element={
              <Layout>
                <Page><Myaccount /></Page>
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: "#white",
            color: "black",
            borderRadius: "8px",
            fontSize: "16px",
            padding: "10px 20px",
          },
        }}
      />
    </>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
