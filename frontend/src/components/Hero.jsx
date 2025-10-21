import React from "react";

function Hero() {
  const styles = {
    section: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "40px 80px",
      background: "#f3f4f6",
      textAlign: "center",  
    },
    text: {
      flex: 1,
      paddingRight: "40px",
      color: "black",
      
    },
    title: {
      fontSize: "3.2em",
      lineHeight: "1.1",
      marginBottom: "20px",
       fontWeight: "bold",
    },
    desc: {
      marginBottom: "20px",
    },
    button: {
      borderRadius: "8px",
      border: "1px solid transparent",
      padding: "10px 20px",
      fontSize: "1em",
      fontWeight: 500,
      fontFamily: "inherit",
      backgroundColor: "#1e3a8a",
      color: "white",
      cursor: "pointer",
      transition: "border-color 0.25s",
    },
    buttonHover: {
      borderColor: "#646cff",
    },
    imageWrapper: {
      flex: 1,
      textAlign: "center",
    },
    image: {
      width: "100%",
      maxWidth: "700px",
      borderRadius: "10px",
    },
  };

  return (
    <section style={styles.section}>
      {/* Text bên trái */}
      <div style={styles.text}>
        <h1 style={styles.title}>Theo dõi xe buýt học sinh an toàn</h1>
        <p style={styles.desc}>
          Hệ thống giúp phụ huynh, nhà trường và tài xế quản lý minh bạch & tiện
          lợi.
        </p>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.borderColor = "#646cff")}
          onMouseOut={(e) => (e.target.style.borderColor = "transparent")}
        >
          Bắt đầu ngay
        </button>
      </div>

      {/* Ảnh bên phải */}
      <div style={styles.imageWrapper}>
        <img
          src="/bus_home.png"
          alt="School Bus Tracking"
          style={styles.image}
        />
      </div>
    </section>
  );
}

export default Hero;
