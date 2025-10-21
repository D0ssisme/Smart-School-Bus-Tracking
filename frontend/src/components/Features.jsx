import React from "react";

function Features() {
  const features = [
    { icon: "👨‍👩‍👧", title: "Phụ huynh", desc: "Theo dõi vị trí xe theo thời gian thực." },
    { icon: "👨‍✈️", title: "Tài xế", desc: "Quản lý lịch trình, báo cáo nhanh chóng." },
    { icon: "🏫", title: "Nhà trường", desc: "Phân công tuyến, gửi thông báo dễ dàng." },
  ];

  return (
    <section
      style={{
        padding: "40px 20px",
        textAlign: "center",
        backgroundColor: "white",
        color: "black", // 👈 chữ mặc định màu đen
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "30px", color: "black" }}>
        Tính năng nổi bật
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              width: "200px",
              color: "black", // 👈 chữ trong card cũng đen
            }}
          >
            <div style={{ fontSize: "2rem" }}>{f.icon}</div>
            <h3 style={{ margin: "10px 0", color: "black" }}>{f.title}</h3>
            <p style={{ color: "black" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
