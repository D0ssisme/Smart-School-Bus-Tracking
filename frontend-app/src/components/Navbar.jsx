import React from "react";

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
        height: "60px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/icon/bus.png" alt="Bus Icon" style={{ width: "30px", height: "30px" }} />
        <h3 style={{ margin: 0 }}>
          <a 
            href="/" 
            style={{ textDecoration: "none", color: "white" }}
          >
            Smart School Bus
          </a>
        </h3>

      </div>

      <div>
        <a href="#" style={{ margin: "0 10px", color: "white" }}>Trang chủ</a>
        <a href="#" style={{ margin: "0 10px", color: "white" }}>Tính năng</a>
        <a href="#" style={{ margin: "0 10px", color: "white" }}>Liên hệ</a>
        <button
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            background: "white",
            color: "#1e3a8a",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Đăng nhập
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
