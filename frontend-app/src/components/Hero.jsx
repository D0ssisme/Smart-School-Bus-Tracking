import React from "react";

function Hero() {
  return (
    <section
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 80px",
    background: "#f3f4f6"
  }}
>
  {/* Text bên trái */}
  <div style={{ flex: 1, paddingRight: "40px" ,color: "black"}}>
    <h1>Theo dõi xe buýt học sinh an toàn</h1>
    <p>Hệ thống giúp phụ huynh, nhà trường và tài xế quản lý minh bạch & tiện lợi.</p>
    <button
      style={{
        padding: "10px 20px",
        background: "#1e3a8a",
        color: "white",
        border: "none",
        borderRadius: "5px"
      }}
    >
      Bắt đầu ngay
    </button>
  </div>

  {/* Ảnh bên phải */}
  <div style={{ flex: 1, textAlign: "center" }}>
    <img
      src="/bus_home.png"
      alt="School Bus Tracking"
      style={{ width: "100%", maxWidth: "700px",borderRadius: "10px" }}
    />
  </div>
</section>

  );
}

export default Hero;
