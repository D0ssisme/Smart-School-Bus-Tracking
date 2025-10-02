import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AccountManager from "./pages/AccountManager";
import Notifications from "./pages/Notifications";
import Layout from "./components/Layout";

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

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Các trang public không dùng layout */}
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />

        {/* Các trang quản trị: bọc bằng Layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Page><Dashboard /></Page>
            </Layout>
          }
        />
        <Route
          path="/accounts"
          element={
            <Layout>
              <Page><AccountManager /></Page>
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout>
              <Page><Notifications /></Page>
            </Layout>
          }
        />

        {/* 404 - phải đặt cuối cùng */}
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}