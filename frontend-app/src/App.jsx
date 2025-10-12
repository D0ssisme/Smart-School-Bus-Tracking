import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Myaccount from "./pages/Myaccount";
import AccountManager from "./pages/AccountManager";
import Notifications from "./pages/Notifications";
import NotificationFormPage from "./pages/NotificationFormPage";
import AccountFormPage from "./pages/AccountFormPage";
import StudentManager from "./pages/StudentManager";
import StudentFormPage from "./pages/StudentFormPage";

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
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Các trang public */}
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />

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

          {/* Quản lý người dùng */}
          <Route
            path="/accounts"
            element={
              <Layout>
                <Page><AccountManager /></Page>
              </Layout>
            }
          />
          <Route
            path="/accounts/create"
            element={
              <Layout>
                <Page><AccountFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/accounts/edit/:id"
            element={
              <Layout>
                <Page><AccountFormPage /></Page>
              </Layout>
            }
          />

          {/* Thông báo */}
          <Route
            path="/notifications"
            element={
              <Layout>
                <Page><Notifications /></Page>
              </Layout>
            }
          />
          <Route
            path="/notifications/create"
            element={
              <Layout>
                <Page><NotificationFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/notifications/edit/:id"
            element={
              <Layout>
                <Page><NotificationFormPage /></Page>
              </Layout>
            }
          />

          <Route
            path="/students"
            element={
              <Layout>
                <Page><StudentManager /></Page>
              </Layout>
            }
          />
          <Route
            path="/students/create"
            element={
              <Layout>
                <Page><StudentFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <Layout>
                <Page><StudentFormPage /></Page>
              </Layout>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "12px 20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}