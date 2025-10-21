import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "0 20px",
        background: "#1e3a8a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/icon/bus.png"
          alt="Bus Icon"
          style={{ width: "30px", height: "30px" }}
        />
        <h3 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{ textDecoration: "none", color: "white" }}
          >
            Smart School Bus
          </Link>
        </h3>
      </div>

      {/* Menu */}
      <div>
        <Link to="/" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>
          Trang chủ
        </Link>
        <Link to="/dashboard" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>
          Tính năng
        </Link>
        <Link to="/*" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>
          Liên hệ
        </Link>
        <Link
          to="/login"
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            background: "white",
            color: "#1e3a8a",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
