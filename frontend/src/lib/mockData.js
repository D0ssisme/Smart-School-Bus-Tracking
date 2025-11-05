// Mock Users Data du lieu test
export const mockUsers = [
    {
        id: 1,
        uid: "3118410001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@student.sgu.edu.vn",
        phone: "0901234567",
        password: "*********",
        role: "parent",
    },
    {
        id: 2,
        uid: "3118410002",
        name: "Trần Thị B",
        email: "tranthib@student.sgu.edu.vn",
        phone: "0912345678",
        password: "***********",
        role: "parent",
    },
    {
        id: 3,
        uid: "001",
        name: "Lê Văn C",
        email: "levanc@driver.sgu.edu.vn",
        phone: "0923456789",
        password: "*********",
        role: "driver",
    },
    {
        id: 4,
        uid: "002",
        name: "Phạm Thị D",
        email: "phamthid@driver.sgu.edu.vn",
        phone: "0934567890",
        password: "***********",
        role: "driver",
    }
];

// Mock Notifications Data
export const mockNotifications = [
    {
        id: 1,
        type: "Info",
        content: "Xe buýt tuyến 01 sẽ đến điểm đón trong 5 phút nữa.",
        recipientType: "parent",
        sentAt: "16:53 08/05/2023",
        status: "sent"
    },
    {
        id: 3,
        type: "Reminder",
        content: "Tuyến 03 có điều chỉnh lộ trình từ ngày mai, vui lòng chú ý.",
        recipientType: "driver",
        sentAt: "08:53 08/05/2023",
        status: "sent"
    },
    {
        id: 4,
        type: "Alert",
        content: "Xe buýt tuyến 02 bị trễ 15 phút do tắc đường.",
        recipientType: "parent",
        sentAt: "14:20 07/05/2023",
        status: "sent"
    },
    {
        id: 5,
        type: "Reminder",
        content: "Hệ thống sẽ bảo trì vào tối nay từ 22:00 - 23:00.",
        recipientType: "all",
        sentAt: "09:30 06/05/2023",
        status: "sent"
    }
];

export const typeLabels = {
    info: "THÔNG BÁO",
    reminder: "LỜI NHẮC",
    alert: "CẢNH BÁO",
};
// Role mapping
export const roleLabels = {
    parent: "Phụ huynh",
    driver: "Tài xế",
    admin: "Quản trị viên",
};

//student
export const mockStudents = [
    { id: 1, MaHS: "31001", HoTen: "Nguyễn Văn A", Lop: "10A1", MaPhuHuynh: "22001", Diemdon: "###", Diemtra: "###" },
    { id: 2, MaHS: "31002", HoTen: "Trần Thị B", Lop: "10A2", MaPhuHuynh: "22002", Diemdon: "###", Diemtra: "###" },
];
export const mockRoutes = [
    { id: 1, name: "Tuyến 1 - Quận 1" },
    { id: 2, name: "Tuyến 2 - Quận 2" },
];