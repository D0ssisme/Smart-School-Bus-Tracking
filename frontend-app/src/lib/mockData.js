// Mock Users Data du lieu test
export const mockUsers = [
    {
        id: 1,
        msdd: "3118410001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@student.sgu.edu.vn",
        gender: "Nam",
        birthday: "2000-05-15",
        role: "parent",
        joinDate: "2023-04-24",
        status: "active"
    },
    {
        id: 2,
        msdd: "3118410002",
        name: "Trần Thị B",
        email: "tranthib@student.sgu.edu.vn",
        gender: "Nữ",
        birthday: "2001-08-20",
        role: "parent",
        joinDate: "2023-04-24",
        status: "active"
    },
    {
        id: 3,
        msdd: "TX001",
        name: "Lê Văn C",
        email: "levanc@driver.sgu.edu.vn",
        gender: "Nam",
        birthday: "1985-03-12",
        role: "driver",
        joinDate: "2023-04-03",
        status: "active"
    },
    {
        id: 4,
        msdd: "TX002",
        name: "Phạm Thị D",
        email: "phamthid@driver.sgu.edu.vn",
        gender: "Nữ",
        birthday: "1990-11-25",
        role: "driver",
        joinDate: "2023-04-03",
        status: "inactive"
    },
    {
        id: 5,
        msdd: "ADMIN001",
        name: "Hoàng Văn E",
        email: "admin@sgu.edu.vn",
        gender: "Nam",
        birthday: "1980-01-01",
        role: "admin",
        joinDate: "2023-04-01",
        status: "active"
    }
];

// Mock Notifications Data
export const mockNotifications = [
    {
        id: 1,
        title: "Xe buýt đang đến",
        content: "Xe buýt tuyến 01 sẽ đến điểm đón trong 5 phút nữa.",
        recipientType: "parent",
        sentAt: "16:53 08/05/2023",
        status: "sent"
    },
    {
        id: 3,
        title: "Thông báo điều chỉnh lộ trình",
        content: "Tuyến 03 có điều chỉnh lộ trình từ ngày mai, vui lòng chú ý.",
        recipientType: "driver",
        sentAt: "08:53 08/05/2023",
        status: "sent"
    },
    {
        id: 4,
        title: "Xe buýt trễ giờ",
        content: "Xe buýt tuyến 02 bị trễ 15 phút do tắc đường.",
        recipientType: "parent",
        sentAt: "14:20 07/05/2023",
        status: "sent"
    },
    {
        id: 5,
        title: "Bảo trì hệ thống",
        content: "Hệ thống sẽ bảo trì vào tối nay từ 22:00 - 23:00.",
        recipientType: "all",
        sentAt: "09:30 06/05/2023",
        status: "sent"
    }
];

// Role mapping
export const roleLabels = {
    parent: "Phụ huynh",
    driver: "Tài xế",
    admin: "Quản trị viên",
};

// Status mapping
export const statusLabels = {
    active: "Hoạt động",
    inactive: "Vô hiệu hóa"
};

// Gender mapping
export const genderLabels = {
    "Nam": "Nam",
    "Nữ": "Nữ"
};