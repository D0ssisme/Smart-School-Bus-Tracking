// src/i18n/translations.ts
export const translations = {
  vi: {
    // Navigation
    nav: {
      home: "Trang chủ",
      features: "Tính năng",
      contact: "Liên hệ",
      login: "Đăng nhập"
    },

    // Sidebar
    sidebar: {
      title: "SSB Tracking",
      subtitle: "SCHOOL BUS SYSTEM",
      dashboard: "Trang chủ",
      schedule: "Lịch trình xe",
      buses: "Xe bus",
      users: "Người dùng",
      students: "Học sinh",
      routes: "Tuyến đường",
      notifications: "Thông báo",
      reports: "Báo cáo, cảnh báo"
    },

    // Dashboard
    dashboard: {
      title: "Hệ thống quản lý xe bus",
      subtitle: "Giám sát và điều hành hoạt động vận chuyển học sinh",
      today: "Hôm nay",
      totalBuses: "Tổng số xe bus",
      active: "Đang hoạt động",
      totalDrivers: "Tổng tài xế",
      assigned: "Đã được phân công",
      totalRoutes: "Tuyến đường",
      inUse: "Đang được sử dụng",
      todaySchedule: "Lịch trình hôm nay",
      waiting: "Chuyến đang chờ",
      scheduleStatus: "Tình trạng lịch trình",
      pending: "Đang chờ",
      pendingTrips: "Chuyến xe",
      completed: "Hoàn thành",
      completedTrips: "Chuyến xe",
      cancelled: "Đã hủy",
      cancelledTrips: "Chuyến xe",
      completionRate: "Tiến độ hoàn thành",
      quickInfo: "Thông tin nhanh",
      activeBuses: "Xe đang hoạt động",
      availableDrivers: "Tài xế sẵn sàng",
      activeRoutes: "Tuyến hoạt động",
      tips: "Mẹo hữu ích",
      tipsContent: "Kiểm tra lịch trình định kỳ để đảm bảo xe bus hoạt động ổn định"
    },

    // Hero Section
    hero: {
      title: "Hệ Thống Quản Lý Xe Bus",
      subtitle: "Hệ thống giúp phụ huynh, nhà trường và tài xế quản lý minh bạch & tiện lợi.",
      getStarted: "Bắt đầu ngay",
      learnMore: "Tìm hiểu thêm",
      activeBuses: "25 Xe bus",
      activeBusesStatus: "Đang hoạt động",
      totalStudents: "500+ Học sinh",
      studentsStatus: "Sử dụng mỗi ngày"
    },

    // Features
    features: {
      title: "Tính năng nổi bật",
      security: "An toàn tuyệt đối",
      timeManagement: "Quản lý thời gian",
      notifications: "Thông báo tức thì",
      location: "Định vị chính xác"
    },

    // User Sections
    sections: {
      parents: "Phụ huynh",
      parentsDesc: "Theo dõi vị trí xe theo thời gian thực, nhận thông báo khi xe đến gần và xem lịch sử di chuyển.",
      drivers: "Tài xế",
      driversDesc: "Quản lý lịch trình chạy xe, báo cáo nhanh chóng và cập nhật tình trạng xe buýt.",
      school: "Nhà trường",
      schoolDesc: "Phân công tuyến đường, gửi thông báo đến phụ huynh và giám sát toàn bộ hệ thống."
    },

    // Footer
    footer: {
      title: "Smart School Bus",
      description: "Hệ thống theo dõi xe buýt học sinh thông minh, an toàn và tiện lợi.",
      quickLinks: "Liên kết nhanh",
      homePage: "Trang chủ",
      features: "Tính năng",
      contact: "Liên hệ",
      support: "Hỗ trợ",
      faq: "Câu hỏi thường gặp",
      userGuide: "Hướng dẫn sử dụng",
      privacyPolicy: "Chính sách bảo mật",
      contactInfo: "Liên hệ",
      location: "Đại học Sài Gòn, TP. Hồ Chí Minh",
      phone: "0912 345 678",
      email: "support@smartschoolbus.vn",
      copyright: "© 2025 SGU Smart School Bus Tracking System"
    },
    // Bus Management Page
    busManagement: {
      title: "Quản lý lịch trình xe bus",
      subtitle: "Theo dõi và điều phối xe bus trường học",
      loading: "Đang tải dữ liệu xe bus...",
      stats: {
        total: "Tổng số xe",
        waiting: "Đang chờ",
        completed: "Hoàn thành"
      },
      filter: {
        all: "Tất cả trạng thái",
        scheduled: "Đang chờ",
        completed: "Hoàn thành",
        cancelled: "Hủy",
        searchPlaceholder: "🔍 Tìm theo biển số hoặc tên tài xế...",
        addBtn: "Thêm lịch trình"
      },
      status: {
        scheduled: "Đang chờ",
        completed: "Hoàn thành",
        cancelled: "Hủy",
        unassigned: "Chưa phân công"
      },
      card: {
        activeBuses: "xe đang hoạt động"
      },
      empty: {
        title: "Không tìm thấy xe bus",
        subtitle: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      },
      swal: {
        confirmTitle: "Xác nhận xóa lịch trình",
        plate: "Biển số xe",
        scheduleCode: "Mã lịch trình",
        route: "Tuyến đường",
        driver: "Tài xế",
        time: "Thời gian",
        capacity: "Sức chứa",
        status: "Trạng thái",
        seat: "chỗ",
        warningAction: "⚠️ Hành động này sẽ không thể hoàn tác!",
        btnDelete: "Xóa lịch trình",
        btnCancel: "Hủy",
        btnUnderstood: "Đã hiểu",
        deleteLoading: "Đang xóa lịch trình...",
        deleteSuccess: "Đã xóa lịch trình",
        errorTitle: "Không thể xóa lịch trình!",
        errorHasStudents: "⚠️ Lịch trình này đang có học sinh đăng ký!",
        errorHasStudentsDesc: "Bạn cần hủy đăng ký của các học sinh trước khi xóa lịch trình.",
        guideTitle: "Hướng dẫn",
        guideStep1: "1. Vào trang Danh sách học sinh của xe này",
        guideStep2: "2. Xóa hoặc chuyển học sinh sang xe khác",
        guideStep3: "3. Quay lại xóa lịch trình"
      },
      messages: {
        loadError: "Không thể tải dữ liệu. Vui lòng thử lại!",
        notFound: "Không tìm thấy thông tin lịch trình!",
        processing: "Đang xử lý...",
        createSuccess: "Tạo lịch trình thành công!",
        actionSuccess: "Thao tác thành công!",
        saveError: "Không thể lưu thông tin. Vui lòng thử lại!",
        deleteGenericError: "Không thể xóa lịch trình. Vui lòng thử lại!"
      }
    },
    // Bus Manager Page (Quản lý đội xe vật lý)
    busManager: {
      title: "Quản lý xe bus",
      subtitle: "Theo dõi và quản lý đội xe trường học",
      loading: "Đang tải dữ liệu xe bus...",
      errorTitle: "Lỗi tải dữ liệu",
      retry: "Thử lại",
      stats: {
        total: "Tổng số xe",
        active: "Đang hoạt động",
        repair: "Đang sửa chữa",
        inactive: "Ngừng hoạt động"
      },
      filter: {
        all: "Tất cả trạng thái",
        active: "Đang hoạt động",
        repair: "Đang sửa chữa",
        inactive: "Ngừng hoạt động",
        searchPlaceholder: "Tìm theo biển số hoặc mã xe...",
        addBtn: "Thêm xe bus"
      },
      card: {
        code: "Mã xe",
        plateHeader: "BIỂN SỐ XE",
        capacity: "Sức chứa",
        seat: "chỗ",
        status: "Trạng thái",
        edit: "Sửa",
        delete: "Xóa"
      },
      status: {
        active: "Đang hoạt động",
        inactive: "Ngừng hoạt động",
        repair: "Đang sửa chữa"
      },
      modal: {
        addTitle: "Thêm xe bus mới",
        editTitle: "Chỉnh sửa xe bus",
        plateLabel: "Biển số xe",
        platePlaceholder: "VD: 51B-12345",
        capacityLabel: "Sức chứa (số chỗ ngồi)",
        capacityPlaceholder: "VD: 45",
        statusLabel: "Trạng thái",
        cancel: "Hủy",
        create: "Thêm xe",
        update: "Cập nhật",
        processing: "Đang xử lý..."
      },
      messages: {
        validationMissing: "⚠️ Vui lòng điền đầy đủ thông tin!",
        validationCapacity: "⚠️ Sức chứa phải lớn hơn 0!",
        createSuccess: "✅ Thêm xe bus thành công!",
        updateSuccess: "✅ Cập nhật xe bus thành công!",
        deleteConfirm: "⚠️ Bạn có chắc muốn xóa xe {plate} ({id})?\n\nHành động này không thể hoàn tác!",
        deleteSuccess: "✅ Đã xóa xe bus thành công!",
        deleteConstraint: "❌ Không thể xóa xe bus này!\n\nXe đang được sử dụng trong lịch trình. Vui lòng xóa lịch trình trước.",
        genericError: "❌ Có lỗi xảy ra! "
      },
      swal: {
        deleteTitle: "Xác nhận xóa xe bus",
        plate: "Biển số",
        busId: "Mã xe",
        capacity: "Sức chứa",
        warning: "Hành động này không thể hoàn tác!",
        confirmDelete: "Xóa xe bus",
        cancel: "Hủy",
        deleting: "Đang xóa xe bus...",
        constraintError: "Xe đang được sử dụng trong lịch trình!",
        cannotDelete: "Không thể xóa!",
        busInUse: "Xe đang được sử dụng trong lịch trình.",
        instructionTitle: "Hướng dẫn",
        instruction1: "Vào trang Quản lý lịch trình",
        instruction2: "Xóa các lịch trình của xe này",
        instruction3: "Quay lại xóa xe bus",
        understood: "Đã hiểu"
      },
      empty: {
        title: "Không tìm thấy xe bus",
        start: "Chưa có xe bus nào. Nhấn nút \"Thêm xe bus\" để bắt đầu!",
        search: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      }
    },
    // Account Manager Page
    accountManager: {
      title: "Quản lý tài khoản",
      subtitle: "Quản lý phụ huynh, tài xế và người dùng hệ thống",
      loading: "Đang tải danh sách người dùng...",
      stats: {
        total: "Tổng số",
        totalAccounts: "Tổng tài khoản",
        active: "Đang hoạt động",
        parents: "Phụ huynh",
        tracking: "Đang theo dõi học sinh",
        drivers: "Tài xế",
        assigned: "Đã được phân công",
        managers: "Quản lý",
        adminRights: "Quyền quản trị"
      },
      filter: {
        allRole: "Tất cả vai trò",
        parent: "Phụ huynh",
        driver: "Tài xế",
        manager: "Quản lý",
        searchPlaceholder: "Tìm theo tên, số điện thoại hoặc ID...",
        addBtn: "Thêm người dùng",
        clearFilter: "Xóa bộ lọc"
      },
      roles: {
        parent: "Phụ huynh",
        driver: "Tài xế",
        admin: "Quản trị viên",
        manager: "Quản lý",
        unknown: "N/A"
      },
      empty: {
        title: "Không tìm thấy người dùng",
        subtitle: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      },
      swal: {
        deleteTitle: "Xác nhận xóa người dùng",
        name: "Họ tên",
        userId: "Mã người dùng",
        phone: "Số điện thoại",
        role: "Vai trò",
        warningAction: "⚠️ Hành động này sẽ không thể hoàn tác!",
        btnDelete: "Xóa",
        btnCancel: "Hủy",
        btnUnderstood: "Đã hiểu",
        deleteLoading: "Đang xóa người dùng...",
        deleteSuccess: "Đã xóa người dùng",

        // Error Modal - Parent
        errParentTitle: "Không thể xóa phụ huynh!",
        errParentHasStudent: "⚠️ Phụ huynh này đang liên kết với học sinh!",
        errParentDesc: "Bạn cần xóa các học sinh liên kết trước khi xóa phụ huynh này.",
        guideTitle: "Hướng dẫn",
        guideStepParent1: "1. Vào trang Quản lý học sinh",
        guideStepParent2: "2. Tìm các học sinh của phụ huynh",
        guideStepParent3: "3. Xóa hoặc chuyển học sinh sang phụ huynh khác",
        guideStepParent4: "4. Quay lại xóa phụ huynh",

        // Error Modal - Driver
        errDriverTitle: "Không thể xóa tài xế!",
        errDriverHasSchedule: "⚠️ Tài xế này đang được phân công trong lịch trình!",
        errDriverDesc: "Bạn cần hủy hoặc chuyển lịch trình trước khi xóa tài xế này.",
        guideStepDriver1: "1. Vào trang Quản lý xe bus hoặc Lịch trình",
        guideStepDriver2: "2. Tìm các lịch trình của tài xế",
        guideStepDriver3: "3. Hủy lịch hoặc phân công tài xế khác",
        guideStepDriver4: "4. Quay lại xóa tài xế"
      },
      messages: {
        loadSuccess: "Tải dữ liệu thành công!",
        loadError: "Không thể tải dữ liệu người dùng. Vui lòng thử lại!",
        creating: "Đang tạo người dùng...",
        createSuccess: "Tạo người dùng thành công!",
        createError: "Không thể tạo người dùng. Vui lòng thử lại!",
        deleteError: "Không thể xóa người dùng. Vui lòng thử lại!"
      }
    },
    // Student Manager Page
    studentManager: {
      title: "Quản lý học sinh",
      subtitle: "Theo dõi và quản lý thông tin học sinh toàn trường",
      loading: "Đang tải danh sách học sinh...",
      stats: {
        totalStudents: "Tổng học sinh",
        schoolWide: "Toàn trường",
        studying: "Đang học tập",
        activeStudents: "Học sinh hoạt động",
        classes: "Số lớp học",
        activeClasses: "Đang hoạt động",
        avgPerClass: "Trung bình/Lớp",
        studentPerClass: "Học sinh mỗi lớp",
        total: "Tổng số",
        studyingShort: "Đang học",
        classCount: "Số lớp"
      },
      filter: {
        allClasses: "Tất cả lớp",
        searchPlaceholder: "Tìm theo tên, mã học sinh hoặc lớp...",
        addBtn: "Thêm học sinh",
        clearFilter: "Xóa bộ lọc"
      },
      data: {
        noInfo: "Chưa có",
        noRoute: "Chưa phân tuyến"
      },
      swal: {
        deleteTitle: "Bạn có chắc muốn xóa?",
        student: "Học sinh",
        class: "Lớp",
        studentCode: "Mã HS",
        warningAction: "⚠️ Không thể hoàn tác!",
        btnDelete: "Xóa",
        btnCancel: "Hủy",
        deleteLoading: "Đang xóa học sinh..."
      },
      messages: {
        fetchError: "Không thể tải danh sách học sinh",
        fetchMetaError: "Không thể tải dữ liệu phụ huynh và tuyến đường",
        adding: "Đang thêm học sinh...",
        addSuccess: "Thêm học sinh thành công!",
        addError: "Không thể thêm học sinh. Vui lòng thử lại!",
        updating: "Đang cập nhật thông tin...",
        updateSuccess: "Cập nhật thông tin học sinh thành công!",
        updateError: "Không thể cập nhật thông tin. Vui lòng thử lại!",
        deleteSuccess: "Xóa học sinh và các liên kết thành công!",
        deleteError: "Xóa học sinh thất bại!"
      },
      empty: {
        notFoundTitle: "Không tìm thấy học sinh",
        noDataTitle: "Chưa có học sinh nào",
        notFoundDesc: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm",
        noDataDesc: "Bắt đầu thêm học sinh vào hệ thống"
      }
    },
    // Route Manager Page
    routeManager: {
      title: "Quản lý tuyến đường",
      subtitle: "Danh sách và thông tin các tuyến xe buýt",
      loading: "Đang tải dữ liệu tuyến đường...",
      stats: {
        totalRoutes: "Tổng tuyến đường",
        created: "Đã tạo trong hệ thống",
        active: "Đang hoạt động",
        operating: "Tuyến đang vận hành",
        totalStops: "Tổng điểm dừng",
        allRoutes: "Trên tất cả tuyến",
        avgStops: "TB điểm dừng",
        stopPerRoute: "Điểm dừng/tuyến",
        total: "Tổng số",
        activeShort: "Hoạt động",
        avg: "TB điểm dừng"
      },
      filter: {
        allStatus: "Tất cả trạng thái",
        active: "Hoạt động",
        inactive: "Không hoạt động",
        searchPlaceholder: "Tìm theo tên tuyến, mã, điểm đầu/cuối...",
        addBtn: "Tạo tuyến mới",
        clearFilter: "Xóa bộ lọc"
      },
      table: {
        code: "Mã tuyến",
        name: "Tên tuyến",
        start: "Điểm khởi đầu",
        end: "Điểm kết thúc",
        stops: "Điểm dừng",
        status: "Trạng thái",
        action: "Hành động",
        actions: {
          detail: "Chi tiết",
          edit: "Sửa",
          delete: "Xóa"
        }
      },
      status: {
        active: "Hoạt động",
        inactive: "Không hoạt động"
      },
      modal: {
        detailTitle: "Chi tiết tuyến xe",
        editTitle: "Sửa thông tin tuyến",
        code: "Mã tuyến",
        name: "Tên tuyến",
        start: "Điểm bắt đầu",
        end: "Điểm kết thúc",
        stopsCount: "Số điểm dừng",
        status: "Trạng thái",
        stopsList: "Danh sách điểm dừng:",
        close: "Đóng",
        save: "Lưu thay đổi",
        cancel: "Hủy",
        placeholders: {
          name: "Nhập tên tuyến",
          start: "Nhập điểm bắt đầu",
          end: "Nhập điểm kết thúc",
          stops: "Nhập số điểm dừng"
        },
        unitStop: "điểm"
      },
      messages: {
        fetchError: "Không thể tải danh sách tuyến xe. Vui lòng thử lại sau.",
        deleteConfirm: "Bạn có chắc muốn xóa tuyến này?",
        errorTitle: "Lỗi tải dữ liệu"
      },
      empty: {
        notFoundTitle: "Không tìm thấy tuyến đường",
        noDataTitle: "Chưa có tuyến đường nào",
        notFoundDesc: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm",
        noDataDesc: "Bắt đầu tạo tuyến đường mới cho hệ thống"
      }
    },

    // Notification Manager Page
    notificationManager: {
      title: "Quản lý thông báo",
      subtitle: "Gửi và theo dõi thông báo đến phụ huynh và tài xế",
      loading: "Đang tải thông báo...",
      stats: {
        total: "Tổng số",
        totalNotifications: "Tổng thông báo",
        sent: "Đã gửi đi",
        alert: "Cảnh báo",
        emergency: "Thông báo khẩn cấp",
        info: "Thông tin",
        normal: "Thông báo thông thường",
        success: "Thành công",
        completed: "Hoàn thành tốt"
      },
      filter: {
        all: "Tất cả loại",
        alert: "Cảnh báo",
        info: "Thông tin",
        success: "Thành công",
        announcement: "Thông báo chung",
        searchPlaceholder: "Tìm kiếm thông báo...",
        addBtn: "Tạo thông báo",
        clearFilter: "Xóa bộ lọc"
      },
      card: {
        receiver: "Người nhận:",
        sentTo: "Gửi đến {count} người",
        role: {
          parent: "👨‍👩‍👧 Phụ huynh",
          driver: "🚗 Tài xế",
          admin: "👔 Quản trị viên"
        },
        type: {
          alert: "Cảnh báo",
          info: "Thông tin",
          success: "Thành công",
          announcement: "Thông báo chung",
          other: "Khác"
        },
        actions: {
          edit: "Chỉnh sửa",
          delete: "Xóa"
        }
      },
      list: {
        title: "Danh sách thông báo"
      },
      messages: {
        loadSuccess: "Tải thông báo thành công!",
        loadError: "Không thể tải thông báo. Vui lòng thử lại!",
        deleteConfirm: "Bạn có chắc muốn xóa thông báo này?",
        deleting: "Đang xóa thông báo...",
        deleteSuccess: "Xóa thông báo thành công!",
        deleteError: "Không thể xóa thông báo. Vui lòng thử lại!"
      },
      empty: {
        title: "Không tìm thấy thông báo",
        subtitle: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      }
    },
    // Report Manager Page
    reportManager: {
      title: "Quản lý báo cáo sự cố",
      subtitle: "Theo dõi và xử lý các báo cáo sự cố từ phụ huynh và tài xế",
      loading: "Đang tải báo cáo...",
      stats: {
        total: "Tổng số",
        totalReports: "Tổng báo cáo",
        received: "Đã nhận được",
        urgent: "Khẩn cấp",
        urgentAction: "Cần xử lý ngay",
        pending: "Đang xử lý",
        reviewing: "Đang được xem xét",
        resolved: "Đã giải quyết",
        completed: "Hoàn thành"
      },
      filter: {
        allStatus: "Tất cả trạng thái",
        urgent: "Khẩn cấp",
        pending: "Đang xử lý",
        resolved: "Đã giải quyết",
        searchPlaceholder: "Tìm kiếm báo cáo...",
        clearFilter: "Xóa bộ lọc"
      },
      card: {
        driver: "Tài xế:",
        titleLabel: "Tiêu đề:",
        location: "Vị trí:",
        bus: "Xe bus:",
        schedule: "Lịch trình:",
        noDescription: "Không có mô tả",
        na: "N/A",
        actions: {
          edit: "Chỉnh sửa",
          delete: "Xóa"
        }
      },
      status: {
        resolved: "Đã giải quyết",
        pending: "Đang xử lý",
        urgent: "Khẩn cấp",
        unknown: "Chưa xác định"
      },
      list: {
        title: "Danh sách báo cáo sự cố"
      },
      messages: {
        loadSuccess: "Tải báo cáo thành công!",
        loadError: "Không thể tải báo cáo. Vui lòng thử lại!",
        deleteConfirm: "Bạn có chắc muốn xóa báo cáo này?",
        deleting: "Đang xóa báo cáo...",
        deleteSuccess: "Xóa báo cáo thành công!",
        deleteError: "Không thể xóa báo cáo. Vui lòng thử lại!"
      },
      empty: {
        title: "Không tìm thấy báo cáo",
        subtitle: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      }
    },

    // Parent Notification Page
    parentNotifications: {
      title: "Thông báo của tôi",
      subtitle: "Cập nhật mới nhất về lịch trình và trạng thái học sinh",
      loading: "Đang tải thông báo...",
      stats: {
        total: "Tổng thông báo",
        received: "Đã nhận",
        unread: "Chưa đọc",
        attention: "Cần chú ý",
        read: "Đã đọc",
        history: "Lịch sử",
        alert: "Cảnh báo",
        emergency: "Khẩn cấp"
      },
      filter: {
        all: "Tất cả thông báo",
        alert: "Cảnh báo",
        info: "Thông tin",
        reminder: "Nhắc nhở",
        searchPlaceholder: "Tìm kiếm thông báo...",
        markAllRead: "Đánh dấu tất cả đã đọc"
      },
      card: {
        justNow: "Vừa xong",
        markRead: "Đánh dấu đã đọc",
        minutesAgo: "{min} phút trước",
        hoursAgo: "{hour} giờ trước",
        yesterday: "Hôm qua",
        type: {
          alert: "Cảnh báo quan trọng",
          reminder: "Lời nhắc",
          info: "Thông tin",
          default: "Thông báo"
        }
      },
      empty: {
        title: "Không có thông báo",
        subtitle: "Bạn chưa có thông báo nào hoặc không tìm thấy kết quả phù hợp"
      },
      messages: {
        fetchError: "Không thể tải thông báo",
        markAllSuccess: "Đã đánh dấu tất cả là đã đọc"
      }
    },
    // Parent Tracking Page
    parentTracking: {
      title: "Theo dõi xe buýt học sinh",
      loading: "Đang tải thông tin...",
      live: "LIVE - Đang theo dõi realtime",
      selectStudent: "Chọn học sinh theo dõi:",
      studentInfo: "Thông tin học sinh",
      busInfo: "Xe buýt",
      emergency: "Khẩn cấp",
      call: "Gọi",
      labels: {
        student: "Học sinh",
        grade: "Lớp",
        route: "Tuyến",
        pickup: "Điểm đón",
        dropoff: "Điểm trả",
        distance: "Khoảng cách",
        estTime: "Thời gian dự kiến",
        status: "Trạng thái",
        pickupStatus: "Đón",
        dropoffStatus: "Trả"
      },
      status: {
        picked: "✅ Đã đón",
        completed: "✅ Hoàn thành",
        pending: "🚌 Đang đi",
        unknown: "⏸️ Chưa rõ"
      },
      alerts: {
        pickupTitle: "⚡ Xe sắp đến điểm đón!",
        pickupDesc: "Xe buýt đang rất gần điểm đón. Vui lòng chuẩn bị sẵn sàng.",
        dropoffTitle: "🏫 Con sắp về đến!",
        dropoffDesc: "Xe buýt sắp đến điểm trả. Con sắp về đến nhà."
      },
      defaults: {
        unknown: "Không rõ",
        unassigned: "Chưa phân công",
        undefined: "Chưa xác định",
        na: "N/A"
      },
      empty: {
        title: "Chưa có học sinh nào",
        desc: "Bạn chưa có học sinh nào được đăng ký trong hệ thống"
      },
      messages: {
        errorFetch: "Không thể tải danh sách học sinh"
      }
    },
    // Driver Dashboard
    driverDashboard: {
      loading: "Đang tải thông tin...",
      greeting: {
        morning: "sáng",
        afternoon: "chiều",
        evening: "tối",
        hello: "Chào buổi {time}, {name}! 👋",
        subtext: "Chúc bạn một ngày lái xe an toàn và vui vẻ"
      },
      time: {
        current: "Giờ hiện tại",
        today: "Hôm nay"
      },
      info: {
        title: "Thông tin tài xế",
        name: "Họ tên",
        id: "Mã tài xế",
        license: "Số GPLX"
      },
      stats: {
        todayTrips: "Chuyến hôm nay",
        totalTrips: "Tổng số chuyến",
        completed: "Hoàn thành",
        tripsDone: "Chuyến đã chạy",
        upcoming: "Sắp tới",
        tripsPending: "Chuyến chưa chạy",
        students: "Học sinh",
        totalStudents: "Tổng số HS hôm nay"
      },
      schedule: {
        title: "Lịch trình hôm nay",
        emptyTitle: "Không có lịch trình hôm nay",
        emptyDesc: "Hôm nay bạn được nghỉ ngơi. Hãy thư giãn! 🎉",
        tripPrefix: "Chuyến",
        bus: "Xe",
        students: "Học sinh",
        studentUnit: "em",
        departure: "Giờ đi",
        arrival: "Giờ về",
        stops: "Điểm dừng",
        btnStart: "Bắt đầu chuyến",
        btnDetail: "Chi tiết"
      },
      status: {
        scheduled: "Sắp tới",
        in_progress: "Đang chạy",
        completed: "Hoàn thành",
        cancelled: "Đã hủy"
      },
      tips: {
        title: "Lời nhắc nhở",
        tip1: "Kiểm tra xe trước khi khởi hành (nhiên liệu, lốp, đèn, phanh)",
        tip2: "Luôn chú ý an toàn khi đón trả học sinh",
        tip3: "Tuân thủ giờ giấc và điểm dừng theo lịch trình",
        tip4: "Báo cáo ngay nếu có sự cố hoặc học sinh vắng mặt"
      }
    },
    // Driver Schedule Page
    driverSchedule: {
      loading: "Đang tải lịch trình...",
      header: {
        title: "Lịch trình làm việc",
        subtitle: "Xem và quản lý lịch trình của bạn",
        currentTime: "Giờ hiện tại",
        driver: "Tài xế"
      },
      filter: {
        dateLabel: "Chọn ngày xem lịch trình:",
        showing: "Hiển thị",
        unit: "lịch trình"
      },
      stats: {
        total: "Tổng lịch trình",
        allDays: "Tất cả các ngày",
        today: "Hôm nay",
        todayDesc: "Lịch trình hôm nay",
        vehicle: "Xe phụ trách",
        plate: "Biển số xe"
      },
      list: {
        title: "Danh sách lịch trình",
        emptyDateTitle: "Không có lịch trình",
        emptyDateDesc: "Không có lịch trình nào cho ngày đã chọn",
        emptyAllTitle: "Chưa có lịch trình nào",
        emptyAllDesc: "Bạn chưa được phân công lịch trình làm việc"
      },
      card: {
        tripPrefix: "Chuyến",
        code: "Mã",
        startTime: "Giờ bắt đầu",
        endTime: "Giờ kết thúc",
        bus: "Xe bus",
        capacity: "Sức chứa",
        students: "học sinh",
        route: "Tuyến đường",
        startPoint: "Điểm bắt đầu",
        endPoint: "Điểm kết thúc",
        unknownRoute: "Tuyến không xác định",
        na: "N/A"
      },
      status: {
        upcoming: "Sắp tới",
        running: "Đang chạy",
        completed: "Hoàn thành"
      },
      buttons: {
        detail: "Chi tiết tuyến",
        map: "Xem bản đồ"
      },
      tips: {
        title: "Lời nhắc nhở",
        tip1: "Kiểm tra xe trước khi khởi hành (nhiên liệu, lốp, đèn, phanh)",
        tip2: "Luôn chú ý an toàn khi đón trả học sinh",
        tip3: "Tuân thủ giờ giấc và điểm dừng theo lịch trình",
        tip4: "Báo cáo ngay nếu có sự cố hoặc học sinh vắng mặt"
      },
      messages: {
        error: "Không thể tải lịch trình"
      }
    },
    // Driver Report Page
    driverReport: {
      header: {
        title: "Báo cáo sự cố của tôi",
        subtitle: "Quản lý các sự cố bạn đã báo cáo"
      },
      stats: {
        total: "Tổng sự cố",
        pending: "Chờ xử lý",
        resolved: "Đã giải quyết"
      },
      filter: {
        allStatus: "Tất cả trạng thái",
        pending: "Chờ xử lý",
        resolved: "Đã giải quyết",
        ignored: "Bỏ qua",
        searchPlaceholder: "Tìm theo tiêu đề, xe...",
        addBtn: "Thêm báo cáo"
      },
      card: {
        code: "Mã sự cố",
        driver: "Tài xế",
        bus: "Xe",
        status: "Trạng thái",
        actions: {
          edit: "Sửa",
          delete: "Xóa"
        },
        unknownDriver: "Chưa xác định"
      },
      status: {
        pending: "Chờ xử lý",
        resolved: "Đã giải quyết",
        ignored: "Bỏ qua"
      },
      modal: {
        addTitle: "Thêm báo cáo sự cố mới",
        editTitle: "Chỉnh sửa báo cáo sự cố",
        busLabel: "Xe bus",
        scheduleLabel: "Lịch trình",
        titleLabel: "Tiêu đề sự cố",
        descLabel: "Mô tả chi tiết",
        latLabel: "Vĩ độ (Latitude)",
        longLabel: "Kinh độ (Longitude)",
        statusLabel: "Trạng thái",
        selectBus: "Chọn xe bus",
        selectSchedule: "Chọn lịch trình",
        placeholders: {
          title: "VD: Xe hỏng động cơ",
          desc: "Mô tả chi tiết về sự cố...",
          lat: "VD: 10.762622",
          long: "VD: 106.660172"
        },
        btnCancel: "Hủy",
        btnProcess: "Đang xử lý...",
        btnUpdate: "Cập nhật",
        btnAdd: "Thêm báo cáo"
      },
      messages: {
        validation: "⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!",
        validationLocation: "⚠️ Vui lòng nhập tọa độ vị trí!",
        updateSuccess: "✅ Cập nhật báo cáo sự cố thành công!",
        addSuccess: "✅ Thêm báo cáo sự cố thành công!",
        deleteConfirm: "⚠️ Bạn có chắc muốn xóa báo cáo sự cố \"{title}\"?\n\nHành động này không thể hoàn tác!",
        deleteSuccess: "✅ Đã xóa báo cáo sự cố thành công!",
        error: "❌ Có lỗi xảy ra! ",
        noDriver: "Không tìm thấy thông tin tài xế. Vui lòng đăng nhập lại!",
        loadError: "Không thể tải dữ liệu. Vui lòng thử lại!"
      },
      empty: {
        title: "Không tìm thấy báo cáo sự cố",
        start: "Bạn chưa có báo cáo nào. Nhấn \"Thêm báo cáo\" để bắt đầu!",
        search: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      }
    },
    // Driver Sidebar
    driverSidebar: {
      dashboard: "Trang chủ",
      schedule: "Lịch làm việc",
      report: "Gửi báo cáo sự cố"
    },
    // Parent Sidebar
    parentSidebar: {
      tracking: "Theo dõi học sinh",
      notifications: "Thông báo",
      support: "Hỗ trợ 24/7",
      hotline: "Hotline: 1900-xxxx",
      role: "Phụ Huynh"
    },

    // Common translations (used across multiple components)
    common: {
      back: "Quay lại",
      cancel: "Hủy",
      close: "Đóng",
      save: "Lưu",
      saveChanges: "Lưu thay đổi",
      delete: "Xóa",
      edit: "Sửa",
      add: "Thêm mới",
      update: "Cập nhật",
      create: "Tạo",
      search: "Tìm kiếm",
      filter: "Lọc",
      actions: "Hành động",
      status: "Trạng thái",
      loading: "Đang tải...",
      loadingData: "Đang tải dữ liệu...",
      processing: "Đang xử lý...",
      success: "Thành công",
      error: "Lỗi",
      warning: "Cảnh báo",
      confirm: "Xác nhận",
      yes: "Có",
      no: "Không",
      ok: "Đồng ý",
      retry: "Thử lại",
      refresh: "Làm mới",
      export: "Xuất",
      import: "Nhập",
      clear: "Xóa",
      clearFilter: "Xóa bộ lọc",
      selectAll: "Chọn tất cả",
      deselectAll: "Bỏ chọn tất cả",
      noData: "Không có dữ liệu",
      noResults: "Không có kết quả",
      notSet: "Chưa có",
      notDefined: "Chưa xác định",
      notUpdated: "Chưa cập nhật",
      unknown: "Không rõ",
      na: "N/A",
      optional: "Tùy chọn",
      required: "Bắt buộc",
      characters: "ký tự",
      items: "mục",
      selected: "đã chọn",
      showMore: "Xem thêm",
      showLess: "Thu gọn",
      viewDetails: "Xem chi tiết",
      details: "Chi tiết",
      info: "Thông tin",
      note: "Ghi chú",
      description: "Mô tả",
      address: "Địa chỉ",
      noAddress: "Không có địa chỉ",
      phone: "Số điện thoại",
      email: "Email",
      name: "Tên",
      fullName: "Họ và tên",
      date: "Ngày",
      time: "Giờ",
      startTime: "Giờ bắt đầu",
      endTime: "Giờ kết thúc",
      all: "Tất cả",
      active: "Hoạt động",
      inactive: "Không hoạt động",
      enabled: "Đã bật",
      disabled: "Đã tắt",
      uploading: "Đang tải lên...",
      downloading: "Đang tải xuống...",
      saving: "Đang lưu...",
      deleting: "Đang xóa...",
      updating: "Đang cập nhật...",
      creating: "Đang tạo...",
      sending: "Đang gửi...",
      received: "Đã nhận",
      sent: "Đã gửi",
      draft: "Nháp",
      published: "Đã xuất bản",
      archived: "Đã lưu trữ",
      stt: "STT",
      grade: "Lớp",
      pickup: "Điểm đón",
      dropoff: "Điểm trả",
      picked: "Đã đón",
      dropped: "Đã trả",
      waiting: "Chờ",
      loadError: "Không thể tải dữ liệu",
      daysAgo: "ngày trước"
    },

    // Login Page
    login: {
      title: "Đăng nhập",
      subtitle: "Đăng nhập vào hệ thống",
      phoneLabel: "Số điện thoại",
      phonePlaceholder: "Nhập số điện thoại",
      passwordLabel: "Mật khẩu",
      passwordPlaceholder: "Nhập mật khẩu",
      loginButton: "Đăng nhập",
      loggingIn: "Đang đăng nhập...",
      loginSuccess: "Đăng nhập thành công!",
      loginFailed: "Đăng nhập thất bại",
      invalidCredentials: "Số điện thoại hoặc mật khẩu không đúng",
      forgotPassword: "Quên mật khẩu?",
      noAccount: "Chưa có tài khoản?",
      signUp: "Đăng ký ngay"
    },

    // Register Page
    register: {
      title: "Đăng ký",
      subtitle: "Tạo tài khoản mới",
      success: "Đăng ký thành công!",
      failed: "Đăng ký thất bại"
    },

    // My Account Page
    myAccount: {
      title: "Tài khoản của tôi",
      tabs: {
        profile: "Hồ sơ",
        security: "Bảo mật"
      },
      fullName: "Họ và tên",
      phone: "Số điện thoại",
      email: "Email",
      address: "Địa chỉ",
      currentPassword: "Mật khẩu hiện tại",
      newPassword: "Mật khẩu mới",
      confirmPassword: "Xác nhận mật khẩu",
      updateProfile: "Cập nhật hồ sơ",
      changePassword: "Đổi mật khẩu",
      updating: "Đang cập nhật...",
      updateSuccess: "Hồ sơ đã được cập nhật!",
      updateFailed: "Cập nhật thất bại!",
      loginRequired: "Bạn cần đăng nhập để xem thông tin tài khoản."
    },

    // Not Found Page
    notFound: {
      title: "404",
      message: "Oops! Trang không tồn tại.",
      description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      backHome: "Quay về trang chủ"
    },

    // Create Route Page
    createRoute: {
      pageTitle: "Tạo tuyến xe buýt mới",
      nameLabel: "Tên tuyến",
      namePlaceholder: "Tên tuyến (VD: Tuyến Sài Thành)",
      startLabel: "Điểm khởi đầu: *",
      startPoint: "🚩 Điểm khởi đầu",
      endLabel: "Điểm kết thúc: *",
      endPoint: "🏁 Điểm kết thúc",
      stopsLabel: "Các điểm dừng (tùy chọn):",
      stopPoint: "📍 Điểm dừng",
      addStop: "Thêm điểm dừng",
      stopPlaceholder: "Click trên bản đồ để chọn điểm dừng",
      clickMap: "Click trên bản đồ để chọn vị trí",
      selectInputFirst: "Hãy chọn ô input trước khi chọn vị trí trên bản đồ",
      instructions: "Hướng dẫn:",
      instructionsDetail: "Click vào ô input (điểm đầu/dừng/cuối) trước, sau đó click lên bản đồ để chọn vị trí. Tuyến đường sẽ được vẽ tự động.",
      creating: "Đang tạo...",
      createButton: "+ Tạo tuyến đường",
      createSuccess: "✅ Tuyến đường đã được tạo thành công!",
      error: {
        nameRequired: "Vui lòng nhập tên tuyến",
        startRequired: "Vui lòng chọn điểm khởi đầu",
        endRequired: "Vui lòng chọn điểm kết thúc",
        stopsIncomplete: "Vui lòng chọn đầy đủ các điểm dừng hoặc xóa những điểm chưa chọn",
        failed: "Không thể tạo tuyến đường. Vui lòng thử lại."
      }
    },

    // Route Management Page
    routePage: {
      title: "Quản lý tuyến đường",
      subtitle: "Danh sách và thông tin các tuyến xe buýt",
      loading: "Đang tải dữ liệu tuyến đường...",
      processing: "Đang xử lý...",
      loadError: "Lỗi tải dữ liệu",
      loadErrorDesc: "Không thể tải danh sách tuyến xe. Vui lòng thử lại sau.",
      filterAll: "Tất cả trạng thái",
      filterActive: "Hoạt động",
      filterInactive: "Không hoạt động",
      searchPlaceholder: "Tìm theo tên tuyến, mã, điểm đầu/cuối...",
      createNew: "Tạo tuyến mới",
      stats: {
        total: "Tổng số",
        totalDesc: "Đã tạo trong hệ thống",
        active: "Đang hoạt động",
        activeDesc: "Tuyến đang vận hành",
        totalStops: "Tổng điểm dừng",
        totalStopsDesc: "Trên tất cả tuyến",
        avgStops: "TB điểm dừng",
        avgStopsDesc: "Điểm dừng/tuyến"
      },
      table: {
        code: "Mã tuyến",
        name: "Tên tuyến",
        start: "Điểm khởi đầu",
        end: "Điểm kết thúc",
        stops: "Điểm dừng",
        status: "Trạng thái",
        actions: "Hành động"
      },
      statusActive: "Hoạt động",
      statusInactive: "Không hoạt động",
      noRoutes: "Chưa có tuyến đường nào",
      noRoutesDesc: "Bắt đầu tạo tuyến đường mới cho hệ thống",
      noResults: "Không tìm thấy tuyến đường",
      noResultsDesc: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm",
      clearFilter: "Xóa bộ lọc",
      actions: {
        view: "Chi tiết",
        edit: "Sửa",
        delete: "Xóa"
      },
      delete: {
        title: "Xác nhận xóa tuyến đường",
        routeName: "🛣️ Tên tuyến:",
        routeCode: "🆔 Mã tuyến:",
        startPoint: "📍 Điểm đầu:",
        endPoint: "🏁 Điểm cuối:",
        stopsCount: "📍 Số điểm dừng:",
        stopsUnit: "điểm",
        warning: "⚠️ Hành động này không thể hoàn tác!",
        confirmButton: "Xóa tuyến đường",
        cancelButton: "Hủy",
        deleting: "Đang xóa tuyến đường...",
        deleteSuccess: "Xóa tuyến đường thành công!",
        deleteError: "Không thể xóa tuyến đường!",
        notFoundError: "Không tìm thấy ID tuyến đường!"
      },
      detail: {
        loadError: "Không thể tải thông tin chi tiết. Vui lòng thử lại!"
      },
      edit: {
        loadError: "Không thể tải thông tin tuyến đường. Vui lòng thử lại!",
        updateSuccess: "Cập nhật tuyến đường thành công!",
        updateError: "Không thể cập nhật tuyến đường!"
      }
    },

    // Student Checkin Page
    checkin: {
      title: "Điểm danh học sinh lên/xuống xe",
      subtitle: "Điểm danh học sinh lên/xuống xe",
      backToBusManagement: "Quay lại Quản lý xe bus",
      sessionMorning: "Buổi sáng",
      sessionAfternoon: "Buổi chiều",
      checkinAt: "đã check-in lúc",
      checkoutAt: "đã check-out lúc",
      status: {
        present: "Đã lên xe",
        absent: "Đã xuống xe",
        pending: "Chưa điểm danh"
      },
      table: {
        name: "Họ tên",
        status: "Trạng thái",
        action: "Hành động",
        studentCode: "Mã HS:"
      },
      loading: "Đang tải thông tin...",
      checkIn: "Check-in",
      checkOut: "Check-out"
    },

    // Add User Modal
    addUser: {
      title: "Thêm người dùng mới",
      name: "Họ và tên",
      namePlaceholder: "Nhập họ tên",
      phoneNumber: "Số điện thoại",
      phonePlaceholder: "0912345678",
      password: "Mật khẩu",
      passwordPlaceholder: "Tối thiểu 6 ký tự",
      role: "Vai trò",
      roleParent: "Phụ huynh",
      roleDriver: "Tài xế",
      roleAdmin: "Quản trị viên",
      licenseNumber: "Số giấy phép lái xe",
      licensePlaceholder: "VD: B2-12345678",
      address: "Địa chỉ",
      addressPlaceholder: "Nhập địa chỉ",
      creating: "Đang tạo...",
      createButton: "Tạo người dùng",
      error: {
        createFailed: "Không thể tạo người dùng. Vui lòng thử lại."
      }
    },

    // Edit User Modal
    editUser: {
      title: "Chỉnh sửa người dùng",
      loadingInfo: "Đang tải thông tin...",
      subtitle: "Cập nhật thông tin người dùng",
      fullName: "Họ và tên *",
      fullNamePlaceholder: "Nhập họ tên",
      phone: "Số điện thoại *",
      phonePlaceholder: "Nhập số điện thoại",
      newPassword: "Mật khẩu mới",
      passwordPlaceholder: "Nhập mật khẩu mới",
      passwordHint: "Để trống nếu không đổi",
      passwordNote: "Chỉ nhập nếu muốn thay đổi mật khẩu",
      role: "Vai trò *",
      roleParent: "Phụ huynh",
      roleDriver: "Tài xế",
      roleAdmin: "Quản trị viên",
      licenseNumber: "Số giấy phép lái xe",
      licensePlaceholder: "Nhập số GPLX",
      address: "Địa chỉ",
      addressPlaceholder: "Nhập địa chỉ",
      loading: "Đang tải thông tin...",
      updating: "Đang cập nhật...",
      error: {
        loadFailed: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
        updateFailed: "Không thể cập nhật người dùng. Vui lòng thử lại."
      }
    },

    // Student Table Component
    studentTable: {
      headers: {
        code: "Mã HS",
        name: "Họ và tên",
        grade: "Lớp",
        parentCode: "Mã Phụ huynh",
        parentName: "Tên phụ huynh",
        pickup: "Điểm đón",
        dropoff: "Điểm trả",
        actions: "Hành động"
      },
      noStudents: "Không tìm thấy học sinh nào",
      notSet: "Chưa có"
    },

    // Edit Student Modal
    editStudent: {
      title: "Chỉnh sửa thông tin học sinh",
      subtitle: "Cập nhật thông tin học sinh",
      currentInfo: "📋 Thông tin hiện tại",
      studentCode: "Mã học sinh",
      parentCode: "Mã phụ huynh",
      name: "Họ và tên *",
      namePlaceholder: "Nhập họ và tên học sinh",
      grade: "Lớp *",
      gradePlaceholder: "VD: Lớp 1A, 2B, 3C...",
      parent: "Phụ huynh *",
      selectParent: "-- Chọn phụ huynh --",
      route: "Tuyến đường *",
      selectRoute: "-- Chọn tuyến đường --",
      pickup: "📍 Điểm đón *",
      selectPickup: "-- Chọn điểm đón --",
      dropoff: "📍 Điểm trả *",
      selectDropoff: "-- Chọn điểm trả --",
      compareChanges: "🔄 So sánh thay đổi:",
      changes: {
        from: "Từ",
        to: "Sang"
      },
      validation: {
        parentRequired: "Vui lòng chọn phụ huynh",
        routeRequired: "Vui lòng chọn tuyến đường",
        pickupRequired: "Vui lòng chọn điểm đón",
        dropoffRequired: "Vui lòng chọn điểm trả"
      }
    },

    // Route Detail Modal
    routeDetail: {
      title: "Chi tiết tuyến xe",
      code: "Mã tuyến",
      name: "Tên tuyến",
      start: "Điểm bắt đầu",
      end: "Điểm kết thúc",
      stopsCount: "Số điểm dừng",
      stopsList: "Danh sách điểm dừng:",
      stops: "điểm",
      statusActive: "Hoạt động",
      statusInactive: "Không hoạt động"
    },

    // Route Edit Modal
    routeEdit: {
      title: "Sửa thông tin tuyến",
      code: "Mã tuyến:",
      start: "Điểm đầu:",
      end: "Điểm cuối:",
      stopsCount: "Số điểm dừng:",
      note: "💡 Không thể thay đổi điểm dừng và vị trí. Chỉ có thể sửa tên và trạng thái.",
      name: "Tên tuyến *",
      namePlaceholder: "Nhập tên tuyến",
      status: "Trạng thái",
      statusActive: "Hoạt động",
      statusInactive: "Không hoạt động",
      validation: {
        nameRequired: "Vui lòng nhập tên tuyến"
      }
    },

    // Create Notification Modal
    createNotification: {
      titleCreate: "Tạo thông báo mới",
      titleEdit: "Chỉnh sửa thông báo",
      subtitleCreate: "Gửi thông báo đến người dùng",
      subtitleEdit: "Cập nhật thông tin thông báo",
      receiver: "Người nhận *",
      selectReceiver: "-- Chọn người nhận --",
      loading: "Đang tải...",
      roleParent: "👨‍👩‍👧 Phụ huynh",
      roleDriver: "🚗 Tài xế",
      roleAdmin: "👔 Quản trị viên",
      type: "Loại thông báo *",
      typeInfo: "📘 Thông tin",
      typeAlert: "⚠️ Cảnh báo",
      typeSuccess: "✅ Thành công",
      typeAnnouncement: "📢 Thông báo chung",
      message: "Nội dung thông báo *",
      messagePlaceholder: "Nhập nội dung thông báo...",
      characterCount: "ký tự",
      preview: "Xem trước thông báo",
      creating: "Đang tạo...",
      updating: "Đang cập nhật...",
      createButton: "Tạo thông báo",
      updateButton: "Cập nhật",
      createSuccess: "Tạo thông báo thành công!",
      updateSuccess: "Cập nhật thông báo thành công!",
      validation: {
        receiverRequired: "Vui lòng chọn người nhận",
        messageRequired: "Vui lòng nhập nội dung",
        typeRequired: "Vui lòng chọn loại thông báo"
      },
      error: {
        loadUsers: "Không thể tải danh sách người dùng",
        createFailed: "Không thể tạo thông báo",
        updateFailed: "Không thể cập nhật thông báo"
      }
    },

    // Bus Tracking Map
    tracking: {
      loadingMap: "Đang tải bản đồ...",
      legend: "Chú thích",
      pickup: "Điểm đón",
      dropoff: "Điểm trả",
      otherStop: "Điểm khác",
      route: "Tuyến đường",
      yourPickup: "🏫 Điểm đón của bạn",
      yourDropoff: "🏠 Điểm trả của bạn",
      stopPoint: "📍 Điểm dừng",
      estimated: "⏰ Dự kiến:",
      order: "Thứ tự:",
      driver: "👨‍✈️ Tài xế:",
      stopsCount: "📊 {count} điểm dừng",
      routeStops: "🗺️ Tuyến đường ({count} điểm)",
      hoverHint: "💡 Di chuột qua marker để nổi bật"
    },

    // Bus Card Component
    busCard: {
      editSchedule: "Sửa lịch trình",
      deleteSchedule: "Xoá lịch trình",
      studentList: "Danh sách học sinh",
      driver: "Tài xế:",
      capacity: "Sức chứa",
      seats: "chỗ",
      driverLabel: "Tài xế *",
      selectDriver: "Chọn tài xế",
      busLabel: "Xe bus *",
      selectBus: "Chọn xe bus",
      busCapacity: "{plate} - {capacity} chỗ",
      routeLabel: "Tuyến đường",
      routeLocked: "🔒 Không thể thay đổi tuyến đường",
      startTime: "Giờ bắt đầu *",
      endTime: "Giờ kết thúc *",
      date: "Ngày",
      status: "Trạng thái",
      statusScheduled: "Đang chờ",
      statusCompleted: "Hoàn thành",
      statusCancelled: "Hủy",
      saving: "Đang lưu...",
      error: {
        fillAll: "⚠️ Vui lòng điền đầy đủ thông tin!"
      }
    },

    // Add Bus Modal
    addBus: {
      titleCreate: "Tạo xe bus mới",
      titleEdit: "✏️ Sửa lịch trình xe",
      titleSchedule: "Phân bổ lịch trình xe",
      selectFunction: "🚌 Chọn chức năng",
      modeCreate: "Tạo xe bus mới",
      modeSchedule: "Phân bổ lịch trình",
      plate: "Biển số xe *",
      platePlaceholder: "VD: 51B-12345",
      capacity: "Sức chứa (số chỗ) *",
      capacityPlaceholder: "VD: 45",
      busStatus: "Trạng thái xe",
      statusActive: "Hoạt động",
      statusRepair: "Đang sửa chữa",
      statusInactive: "Không hoạt động",
      selectBus: "Chọn xe bus *",
      selectBusPlaceholder: "-- Chọn xe bus --",
      selectDriver: "Chọn tài xế *",
      selectDriverPlaceholder: "-- Chọn tài xế --",
      selectRoute: "Chọn tuyến đường *",
      selectRoutePlaceholder: "-- Chọn tuyến đường --",
      routeNote: "🔒 Không thể thay đổi tuyến khi sửa lịch",
      startTime: "Giờ bắt đầu *",
      endTime: "Giờ kết thúc *",
      date: "Ngày",
      scheduleStatus: "Trạng thái lịch trình",
      creating: "Đang tạo...",
      createButton: "Tạo xe bus",
      scheduleButton: "Phân bổ lịch trình",
      updateButton: "Cập nhật lịch trình",
      createBusSuccess: "✅ Tạo xe bus thành công!",
      createScheduleSuccess: "Phân bổ lịch trình xe bus thành công",
      updateScheduleSuccess: "Cập nhật lịch trình thành công",
      successTitle: "Thành công!",
      errorTitle: "Lỗi!",
      validation: {
        fillAll: "Vui lòng điền đầy đủ thông tin",
        selectBus: "Vui lòng chọn xe bus",
        selectDriver: "Vui lòng chọn tài xế",
        selectRoute: "Vui lòng chọn tuyến đường"
      }
    },

    // Account Table Component
    accountTable: {
      loading: "Đang tải dữ liệu...",
      noUsers: "Không có người dùng nào",
      noUsersFiltered: "Không tìm thấy người dùng phù hợp với bộ lọc",
      headers: {
        code: "Mã",
        name: "Họ tên",
        phone: "Số điện thoại",
        role: "Vai trò",
        license: "GPLX",
        address: "Địa chỉ",
        actions: "Hành động"
      },
      plateNumber: "Biển số:"
    },

    // Add Student Modal
    addStudent: {
      title: "Thêm học sinh mới",
      subtitle: "Điền thông tin học sinh vào form bên dưới",
      name: "Tên học sinh *",
      namePlaceholder: "Nhập tên học sinh...",
      grade: "Lớp *",
      gradePlaceholder: "Ví dụ: 10A1, 11B2...",
      parent: "Phụ huynh *",
      selectParent: "-- Chọn phụ huynh --",
      route: "Tuyến đường *",
      selectRoute: "-- Chọn tuyến đường --",
      pickup: "Điểm đón *",
      selectPickup: "-- Chọn điểm đón --",
      dropoff: "Điểm trả *",
      selectDropoff: "-- Chọn điểm trả --",
      loadingStops: "Đang tải điểm dừng...",
      noStops: "Không có điểm dừng",
      noteTitle: "Lưu ý về điểm đón/trả",
      noteContent: "Tuyến này có {count} điểm dừng. Vui lòng chọn điểm đón và điểm trả phù hợp.",
      noteSelect: "Vui lòng chọn tuyến đường trước để xem các điểm dừng",
      submit: "Thêm học sinh",
      validation: {
        nameRequired: "Vui lòng nhập tên học sinh",
        gradeRequired: "Vui lòng nhập lớp",
        parentRequired: "Vui lòng chọn phụ huynh",
        routeRequired: "Vui lòng chọn tuyến đường",
        pickupRequired: "Vui lòng chọn điểm đón",
        dropoffRequired: "Vui lòng chọn điểm trả"
      }
    },

    // Add Student to Schedule Modal
    addStudentSchedule: {
      title: "Thêm học sinh vào lịch trình",
      searchPlaceholder: "Tìm theo tên, mã học sinh, lớp...",
      selectAll: "Chọn tất cả ({count} học sinh)",
      selected: "Đã chọn: {count}",
      noStudents: "Không có học sinh khả dụng",
      noResults: "Không tìm thấy học sinh",
      noStudentsHelp: "Tất cả học sinh trong tuyến này đã được thêm vào lịch trình",
      searchHelp: "Thử thay đổi từ khóa tìm kiếm",
      pickupLabel: "Đón:",
      dropoffLabel: "Trả:",
      loadingStudents: "Đang tải danh sách học sinh...",
      adding: "Đang thêm {count} học sinh...",
      addSuccess: "Đã thêm {count} học sinh vào lịch trình!",
      addStudents: "Thêm {count} học sinh",
      error: {
        noRoute: "Lịch trình chưa có thông tin tuyến đường",
        loadFailed: "Không thể tải danh sách học sinh",
        selectAtLeast: "Vui lòng chọn ít nhất một học sinh",
        failed: "Không thể thêm học sinh. Vui lòng thử lại!"
      }
    },

    // Schedule Detail Modal
    scheduleDetail: {
      title: "Chi tiết lịch trình",
      tripInfo: "Thông tin chuyến đi",
      route: "Tuyến đường",
      departure: "Giờ đi",
      arrival: "Giờ về",
      stops: "Các điểm dừng ({count})",
      noAddress: "Không có địa chỉ",
      estimated: "⏰ Dự kiến:",
      students: "Học sinh",
      studentsCount: "học sinh trong chuyến này",
      studentList: "Danh sách học sinh",
      noStudents: "Chưa có học sinh nào",
      emergency: "Liên hệ khẩn cấp",
      emergencyCall: "📞 Gọi: 1900-1412",
      startTrip: "Bắt đầu chuyến",
      loading: "Đang tải thông tin...",
      loadError: "Không thể tải thông tin chi tiết"
    },

    // Confirm Delete Modal
    confirmDelete: {
      title: "Xác nhận xóa lịch trình",
      subtitle: "Hành động này không thể hoàn tác",
      warningTitle: "Cảnh báo quan trọng!",
      warningText: "Bạn đang thực hiện xóa lịch trình xe bus. Sau khi xóa, mọi thông tin liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.",
      scheduleInfo: "Thông tin lịch trình",
      scheduleId: "Mã lịch trình",
      plate: "Biển số xe",
      route: "Tuyến đường",
      driver: "Tài xế",
      time: "Thời gian",
      status: "Trạng thái",
      confirmQuestion: "Bạn có chắc chắn muốn xóa lịch trình này không?",
      cancelButton: "Hủy bỏ",
      deleteButton: "Xóa lịch trình"
    },

    // Notification Bell Component
    notificationBell: {
      title: "Thông báo",
      markAllRead: "Đánh dấu tất cả đã đọc",
      markAllReadShort: "Đọc hết",
      markRead: "Đánh dấu đã đọc",
      deleteNotification: "Xóa",
      viewAll: "Xem tất cả thông báo",
      noNotifications: "Không có thông báo",
      noNotificationsDesc: "Bạn sẽ nhận được thông báo tại đây",
      justNow: "Vừa xong",
      minutesAgo: "{min} phút trước",
      hoursAgo: "{hour} giờ trước",
      yesterday: "Hôm qua",
      typeAlert: "Cảnh báo quan trọng",
      typeReminder: "Lời nhắc",
      typeInfo: "Thông tin",
      typeDefault: "Thông báo",
      deleteSuccess: "Đã xóa thông báo",
      deleteError: "Không thể xóa thông báo",
      markAllSuccess: "Đã đánh dấu tất cả là đã đọc",
      markAllError: "Không thể đánh dấu tất cả",
      markReadError: "Không thể đánh dấu đã đọc"
    },

    // User Dropdown Component
    userDropdown: {
      account: "Tài khoản",
      logout: "Đăng xuất",
      logoutConfirm: "Bạn có chắc muốn đăng xuất?",
      logoutDesc: "Phiên đăng nhập hiện tại sẽ kết thúc.",
      logoutSuccess: "Đã đăng xuất!"
    },

    // Pagination Component
    pagination: {
      previous: "← Trước",
      next: "Sau →",
      page: "Trang"
    },

    // Student Form Page
    studentForm: {
      editTitle: "Chỉnh sửa học sinh",
      addTitle: "Thêm học sinh mới",
      editSubtitle: "Cập nhật thông tin học sinh",
      addSubtitle: "Điền thông tin để thêm học sinh mới",
      adding: "Đang thêm học sinh...",
      updating: "Đang cập nhật học sinh...",
      addSuccess: "Thêm học sinh thành công!",
      updateSuccess: "Cập nhật học sinh thành công!",
      confirmCancel: "Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.",
      error: {
        notFound: "Không tìm thấy học sinh!",
        fillAll: "Vui lòng điền đầy đủ thông tin!"
      }
    },

    // Student List Page
    studentList: {
      title: "Danh sách học sinh",
      backButton: "Quay lại Quản lý xe bus",
      driverInfo: "Tài xế: {name} | {time}",
      capacity: "Sĩ số",
      students: "học sinh",
      searchPlaceholder: "Tìm theo tên hoặc lớp...",
      exportButton: "Xuất danh sách",
      addButton: "Thêm học sinh",
      noSchedule: "Không tìm thấy thông tin lịch trình.",
      backToManagement: "Quay lại trang quản lý",
      loading: "Đang tải danh sách học sinh...",
      noStudents: "Không có học sinh nào",
      noStudentsHelp: "Thêm học sinh vào lịch trình này",
      searchHelp: "Thử thay đổi từ khóa tìm kiếm",
      deleteConfirm: "Xóa học sinh khỏi lịch trình?",
      deleteDesc: "Học sinh <strong>{name}</strong> (Lớp {grade}) sẽ bị xóa khỏi lịch trình này.",
      deleteButton: "Xóa luôn",
      deleting: "Đang xóa...",
      deleteSuccess: "Đã xóa!",
      deleteSuccessDesc: "Học sinh {name} đã được xóa khỏi lịch trình.",
      deleteError: "Lỗi",
      deleteErrorDesc: "Không thể xóa học sinh. Vui lòng thử lại sau!",
      removeFromSchedule: "Xóa khỏi lịch trình",
      studentNotFound: "Không tìm thấy học sinh",
      studentNotFoundDesc: "Học sinh không tồn tại trong danh sách hiện tại."
    },

    // Notification Form Page
    notificationForm: {
      back: "Quay lại",
      editTitle: "Chỉnh sửa thông báo",
      createTitle: "Tạo thông báo mới",
      editSubtitle: "Cập nhật thông tin thông báo",
      createSubtitle: "Gửi thông báo đến tài xế và phụ huynh",
      typeLabel: "Loại thông báo",
      typeAlert: "Cảnh báo",
      typeInfo: "Thông tin",
      typeReminder: "Nhắc nhở",
      contentLabel: "Nội dung thông báo",
      contentPlaceholder: "Nhập nội dung thông báo...",
      routeLabel: "Thông báo cho tuyến",
      selectRoute: "-- Chọn tuyến xe bus --",
      recipientsLabel: "Đối tượng nhận thông báo",
      selectAll: "Chọn tất cả",
      driver: "Tài xế",
      parent: "Phụ huynh",
      selectRouteFirst: "* Vui lòng chọn tuyến đường trước",
      update: "Cập nhật",
      send: "Gửi thông báo",
      sending: "Đang gửi thông báo...",
      updating: "Đang cập nhật thông báo...",
      sendSuccess: "Gửi thông báo thành công!",
      updateSuccess: "Cập nhật thông báo thành công!",
      confirmCancel: "Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.",
      validation: {
        routeRequired: "Vui lòng chọn tuyến đường!",
        recipientRequired: "Vui lòng chọn ít nhất một đối tượng nhận thông báo!"
      }
    }

  },

  en: {
    // Navigation
    nav: {
      home: "Home",
      features: "Features",
      contact: "Contact",
      login: "Login"
    },

    // Sidebar
    sidebar: {
      title: "SSB Tracking",
      subtitle: "SCHOOL BUS SYSTEM",
      dashboard: "Dashboard",
      schedule: "Schedule",
      buses: "Buses",
      users: "Users",
      students: "Students",
      routes: "Routes",
      notifications: "Notifications",
      reports: "Reports & Alerts"
    },

    // Dashboard
    dashboard: {
      title: "Bus Management System",
      subtitle: "Monitor and manage student transportation operations",
      today: "Today",
      totalBuses: "Total Buses",
      active: "Active",
      totalDrivers: "Total Drivers",
      assigned: "Assigned",
      totalRoutes: "Routes",
      inUse: "In Use",
      todaySchedule: "Today's Schedule",
      waiting: "Waiting Trips",
      scheduleStatus: "Schedule Status",
      pending: "Pending",
      pendingTrips: "Trips",
      completed: "Completed",
      completedTrips: "Trips",
      cancelled: "Cancelled",
      cancelledTrips: "Trips",
      completionRate: "Completion Rate",
      quickInfo: "Quick Info",
      activeBuses: "Active Buses",
      availableDrivers: "Available Drivers",
      activeRoutes: "Active Routes",
      tips: "Helpful Tips",
      tipsContent: "Check schedule regularly to ensure buses operate smoothly"
    },

    // Hero Section
    hero: {
      title: "School Bus Management System",
      subtitle: "A system that helps parents, schools and drivers manage transparently & conveniently.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      activeBuses: "25 Buses",
      activeBusesStatus: "Active",
      totalStudents: "500+ Students",
      studentsStatus: "Using daily"
    },

    // Features
    features: {
      title: "Key Features",
      security: "Absolute Safety",
      timeManagement: "Time Management",
      notifications: "Instant Notifications",
      location: "Precise Location"
    },

    // User Sections
    sections: {
      parents: "Parents",
      parentsDesc: "Track bus location in real-time, receive notifications when the bus is nearby and view travel history.",
      drivers: "Drivers",
      driversDesc: "Manage driving schedules, report quickly and update bus status.",
      school: "School",
      schoolDesc: "Assign routes, send notifications to parents and monitor the entire system."
    },

    // Footer
    footer: {
      title: "Smart School Bus",
      description: "Smart, safe and convenient school bus tracking system.",
      quickLinks: "Quick Links",
      homePage: "Home",
      features: "Features",
      contact: "Contact",
      support: "Support",
      faq: "FAQ",
      userGuide: "User Guide",
      privacyPolicy: "Privacy Policy",
      contactInfo: "Contact",
      location: "Saigon University, Ho Chi Minh City",
      phone: "0912 345 678",
      email: "support@smartschoolbus.vn",
      copyright: "© 2025 SGU Smart School Bus Tracking System"
    },
    // Bus Management Page
    busManagement: {
      title: "Bus Schedule Management",
      subtitle: "Monitor and coordinate school buses",
      loading: "Loading bus data...",
      stats: {
        total: "Total Buses",
        waiting: "Waiting",
        completed: "Completed"
      },
      filter: {
        all: "All Statuses",
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
        searchPlaceholder: "🔍 Search by plate or driver...",
        addBtn: "Add Schedule"
      },
      status: {
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
        unassigned: "Unassigned"
      },
      card: {
        activeBuses: "active buses"
      },
      empty: {
        title: "No buses found",
        subtitle: "Try changing filters or search keywords"
      },
      swal: {
        confirmTitle: "Delete Schedule Confirmation",
        plate: "License Plate",
        scheduleCode: "Schedule ID",
        route: "Route",
        driver: "Driver",
        time: "Time",
        capacity: "Capacity",
        status: "Status",
        seat: "seats",
        warningAction: "⚠️ This action cannot be undone!",
        btnDelete: "Delete Schedule",
        btnCancel: "Cancel",
        btnUnderstood: "Understood",
        deleteLoading: "Deleting schedule...",
        deleteSuccess: "Schedule deleted",
        errorTitle: "Cannot delete schedule!",
        errorHasStudents: "⚠️ There are students registered for this schedule!",
        errorHasStudentsDesc: "You need to unregister students before deleting the schedule.",
        guideTitle: "Instructions",
        guideStep1: "1. Go to the Student List of this bus",
        guideStep2: "2. Remove or transfer students to another bus",
        guideStep3: "3. Return to delete schedule"
      },
      messages: {
        loadError: "Could not load data. Please try again!",
        notFound: "Schedule information not found!",
        processing: "Processing...",
        createSuccess: "Schedule created successfully!",
        actionSuccess: "Action successful!",
        saveError: "Could not save information. Please try again!",
        deleteGenericError: "Could not delete schedule. Please try again!"
      }
    },

    // Bus Manager Page (Physical Fleet)
    busManager: {
      title: "Bus Fleet Management",
      subtitle: "Monitor and manage school bus fleet",
      loading: "Loading bus data...",
      errorTitle: "Data Load Error",
      retry: "Retry",
      stats: {
        total: "Total Buses",
        active: "Active",
        repair: "Under Maintenance",
        inactive: "Inactive"
      },
      filter: {
        all: "All Statuses",
        active: "Active",
        repair: "Under Maintenance",
        inactive: "Inactive",
        searchPlaceholder: "Search by plate or bus ID...",
        addBtn: "Add Bus"
      },
      card: {
        code: "Bus ID",
        plateHeader: "LICENSE PLATE",
        capacity: "Capacity",
        seat: "seats",
        status: "Status",
        edit: "Edit",
        delete: "Delete"
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        repair: "Maintenance"
      },
      modal: {
        addTitle: "Add New Bus",
        editTitle: "Edit Bus",
        plateLabel: "License Plate",
        platePlaceholder: "e.g., 51B-12345",
        capacityLabel: "Capacity (seats)",
        capacityPlaceholder: "e.g., 45",
        statusLabel: "Status",
        cancel: "Cancel",
        create: "Add Bus",
        update: "Update",
        processing: "Processing..."
      },
      messages: {
        validationMissing: "⚠️ Please fill in all information!",
        validationCapacity: "⚠️ Capacity must be greater than 0!",
        createSuccess: "✅ Bus added successfully!",
        updateSuccess: "✅ Bus updated successfully!",
        deleteSuccess: "✅ Bus deleted successfully!",
        genericError: "❌ An error occurred!"
      },
      swal: {
        deleteTitle: "Confirm Delete Bus",
        plate: "License Plate",
        busId: "Bus ID",
        capacity: "Capacity",
        warning: "This action cannot be undone!",
        confirmDelete: "Delete Bus",
        cancel: "Cancel",
        deleting: "Deleting bus...",
        constraintError: "Bus is being used in schedules!",
        cannotDelete: "Cannot Delete!",
        busInUse: "Bus is currently being used in schedules.",
        instructionTitle: "Instructions",
        instruction1: "Go to Schedule Management page",
        instruction2: "Delete this bus's schedules",
        instruction3: "Return to delete bus",
        understood: "Understood"
      },
      empty: {
        title: "No Buses Found",
        start: "No buses yet. Click \"Add Bus\" to get started!",
        search: "Try changing filters or search keywords"
      }
    },
    modal: {
      addTitle: "Add New Bus",
      editTitle: "Edit Bus",
      plateLabel: "License Plate",
      platePlaceholder: "Ex: 51B-12345",
      capacityLabel: "Capacity (seats)",
      capacityPlaceholder: "Ex: 45",
      statusLabel: "Status",
      cancel: "Cancel",
      create: "Add Bus",
      update: "Update",
      processing: "Processing..."
    },
    messages: {
      validationMissing: "⚠️ Please fill in all information!",
      validationCapacity: "⚠️ Capacity must be greater than 0!",
      createSuccess: "✅ Bus created successfully!",
      updateSuccess: "✅ Bus updated successfully!",
      deleteConfirm: "⚠️ Are you sure you want to delete bus {plate} ({id})?\n\nThis action cannot be undone!",
      deleteSuccess: "✅ Bus deleted successfully!",
      deleteConstraint: "❌ Cannot delete this bus!\n\nIt is currently assigned to a schedule. Please remove the schedule first.",
      genericError: "❌ An error occurred! "
    },
    empty: {
      title: "No buses found",
      start: "No buses available. Click \"Add Bus\" to start!",
      search: "Try changing filters or search keywords"
    }
  },
  // Account Manager Page
  accountManager: {
    title: "Account Management",
    subtitle: "Manage parents, drivers, and system users",
    loading: "Loading user list...",
    stats: {
      total: "Total",
      totalAccounts: "Total Accounts",
      active: "Active",
      parents: "Parents",
      tracking: "Tracking students",
      drivers: "Drivers",
      assigned: "Assigned",
      managers: "Managers",
      adminRights: "Admin Privileges"
    },
    filter: {
      allRole: "All Roles",
      parent: "Parent",
      driver: "Driver",
      manager: "Manager",
      searchPlaceholder: "Search by name, phone or ID...",
      addBtn: "Add User",
      clearFilter: "Clear Filter"
    },
    roles: {
      parent: "Parent",
      driver: "Driver",
      admin: "Administrator",
      manager: "Manager",
      unknown: "N/A"
    },
    empty: {
      title: "No users found",
      subtitle: "Try changing filters or search keywords"
    },
    swal: {
      deleteTitle: "Delete User Confirmation",
      name: "Full Name",
      userId: "User ID",
      phone: "Phone Number",
      role: "Role",
      warningAction: "⚠️ This action cannot be undone!",
      btnDelete: "Delete",
      btnCancel: "Cancel",
      btnUnderstood: "Understood",
      deleteLoading: "Deleting user...",
      deleteSuccess: "User deleted",

      // Error Modal - Parent
      errParentTitle: "Cannot delete parent!",
      errParentHasStudent: "⚠️ This parent is linked to students!",
      errParentDesc: "You must remove linked students before deleting this parent.",
      guideTitle: "Instructions",
      guideStepParent1: "1. Go to Student Management",
      guideStepParent2: "2. Find students of this parent",
      guideStepParent3: "3. Delete or transfer students to another parent",
      guideStepParent4: "4. Return to delete parent",

      // Error Modal - Driver
      errDriverTitle: "Cannot delete driver!",
      errDriverHasSchedule: "⚠️ This driver is assigned to a schedule!",
      errDriverDesc: "You must cancel or reassign schedules before deleting this driver.",
      guideStepDriver1: "1. Go to Bus Management or Schedule",
      guideStepDriver2: "2. Find schedules of this driver",
      guideStepDriver3: "3. Cancel schedule or assign another driver",
      guideStepDriver4: "4. Return to delete driver"
    },
    messages: {
      loadSuccess: "Data loaded successfully!",
      loadError: "Could not load user data. Please try again!",
      creating: "Creating user...",
      createSuccess: "User created successfully!",
      createError: "Could not create user. Please try again!",
      deleteError: "Could not delete user. Please try again!"
    }
  },
  // Student Manager Page
  studentManager: {
    title: "Student Management",
    subtitle: "Monitor and manage school-wide student information",
    loading: "Loading student list...",
    stats: {
      totalStudents: "Total Students",
      schoolWide: "School Wide",
      studying: "Studying",
      activeStudents: "Active Students",
      classes: "Total Classes",
      activeClasses: "Active Classes",
      avgPerClass: "Avg/Class",
      studentPerClass: "Students per class",
      total: "Total",
      studyingShort: "Active",
      classCount: "Classes"
    },
    filter: {
      allClasses: "All Classes",
      searchPlaceholder: "Search by name, ID or class...",
      addBtn: "Add Student",
      clearFilter: "Clear Filter"
    },
    data: {
      noInfo: "N/A",
      noRoute: "Unassigned"
    },
    swal: {
      deleteTitle: "Are you sure you want to delete?",
      student: "Student",
      class: "Class",
      studentCode: "Student ID",
      warningAction: "⚠️ This action cannot be undone!",
      btnDelete: "Delete",
      btnCancel: "Cancel",
      deleteLoading: "Deleting student..."
    },
    messages: {
      fetchError: "Could not load student list",
      fetchMetaError: "Could not load parent and route data",
      adding: "Adding student...",
      addSuccess: "Student added successfully!",
      addError: "Could not add student. Please try again!",
      updating: "Updating information...",
      updateSuccess: "Student information updated successfully!",
      updateError: "Could not update information. Please try again!",
      deleteSuccess: "Student and links deleted successfully!",
      deleteError: "Failed to delete student!"
    },
    empty: {
      notFoundTitle: "No students found",
      noDataTitle: "No students available",
      notFoundDesc: "Try changing filters or search keywords",
      noDataDesc: "Start adding students to the system"
    }
  },
  // Route Manager Page
  routeManager: {
    title: "Route Management",
    subtitle: "List and information of bus routes",
    loading: "Loading route data...",
    stats: {
      totalRoutes: "Total Routes",
      created: "Created in system",
      active: "Active",
      operating: "Operating routes",
      totalStops: "Total Stops",
      allRoutes: "Across all routes",
      avgStops: "Avg Stops",
      stopPerRoute: "Stops per route",
      total: "Total",
      activeShort: "Active",
      avg: "Avg Stops"
    },
    filter: {
      allStatus: "All Statuses",
      active: "Active",
      inactive: "Inactive",
      searchPlaceholder: "Search by name, code, start/end...",
      addBtn: "Create New Route",
      clearFilter: "Clear Filter"
    },
    table: {
      code: "Route ID",
      name: "Route Name",
      start: "Start Point",
      end: "End Point",
      stops: "Stops",
      status: "Status",
      action: "Actions",
      actions: {
        detail: "Detail",
        edit: "Edit",
        delete: "Delete"
      }
    },
    status: {
      active: "Active",
      inactive: "Inactive"
    },
    modal: {
      detailTitle: "Route Details",
      editTitle: "Edit Route Info",
      code: "Route ID",
      name: "Route Name",
      start: "Start Point",
      end: "End Point",
      stopsCount: "Number of Stops",
      status: "Status",
      stopsList: "Stops List:",
      close: "Close",
      save: "Save Changes",
      cancel: "Cancel",
      placeholders: {
        name: "Enter route name",
        start: "Enter start point",
        end: "Enter end point",
        stops: "Enter number of stops"
      },
      unitStop: "stops"
    },
    messages: {
      fetchError: "Could not load route list. Please try again later.",
      deleteConfirm: "Are you sure you want to delete this route?",
      errorTitle: "Data Load Error"
    },
    empty: {
      notFoundTitle: "No routes found",
      noDataTitle: "No routes available",
      notFoundDesc: "Try changing filters or search keywords",
      noDataDesc: "Start creating new routes for the system"
    }
  },
  // Notification Manager Page
  notificationManager: {
    title: "Notification Management",
    subtitle: "Send and track notifications to parents and drivers",
    loading: "Loading notifications...",
    stats: {
      total: "Total",
      totalNotifications: "Total Notifications",
      sent: "Sent",
      alert: "Alerts",
      emergency: "Emergency alerts",
      info: "Information",
      normal: "Standard info",
      success: "Success",
      completed: "Completed successfully"
    },
    filter: {
      all: "All Types",
      alert: "Alert",
      info: "Info",
      success: "Success",
      announcement: "Announcement",
      searchPlaceholder: "Search notifications...",
      addBtn: "Create Notification",
      clearFilter: "Clear Filter"
    },
    card: {
      receiver: "Receiver:",
      sentTo: "Sent to {count} people",
      role: {
        parent: "👨‍👩‍👧 Parent",
        driver: "🚗 Driver",
        admin: "👔 Admin"
      },
      type: {
        alert: "Alert",
        info: "Info",
        success: "Success",
        announcement: "Announcement",
        other: "Other"
      },
      actions: {
        edit: "Edit",
        delete: "Delete"
      }
    },
    list: {
      title: "Notification List"
    },
    messages: {
      loadSuccess: "Notifications loaded successfully!",
      loadError: "Could not load notifications. Please try again!",
      deleteConfirm: "Are you sure you want to delete this notification?",
      deleting: "Deleting notification...",
      deleteSuccess: "Notification deleted successfully!",
      deleteError: "Could not delete notification. Please try again!"
    },
    empty: {
      title: "No notifications found",
      subtitle: "Try changing filters or search keywords"
    }
  },
  // Report Manager Page
  reportManager: {
    title: "Incident Report Management",
    subtitle: "Monitor and handle incident reports from parents and drivers",
    loading: "Loading reports...",
    stats: {
      total: "Total",
      totalReports: "Total Reports",
      received: "Received",
      urgent: "Urgent",
      urgentAction: "Requires immediate action",
      pending: "Pending",
      reviewing: "Under review",
      resolved: "Resolved",
      completed: "Completed"
    },
    filter: {
      allStatus: "All Statuses",
      urgent: "Urgent",
      pending: "Pending",
      resolved: "Resolved",
      searchPlaceholder: "Search reports...",
      clearFilter: "Clear Filter"
    },
    card: {
      driver: "Driver:",
      titleLabel: "Title:",
      location: "Location:",
      bus: "Bus:",
      schedule: "Schedule:",
      noDescription: "No description",
      na: "N/A",
      actions: {
        edit: "Edit",
        delete: "Delete"
      }
    },
    status: {
      resolved: "Resolved",
      pending: "Pending",
      urgent: "Urgent",
      unknown: "Unknown"
    },
    list: {
      title: "Incident Report List"
    },
    messages: {
      loadSuccess: "Reports loaded successfully!",
      loadError: "Could not load reports. Please try again!",
      deleteConfirm: "Are you sure you want to delete this report?",
      deleting: "Deleting report...",
      deleteSuccess: "Report deleted successfully!",
      deleteError: "Could not delete report. Please try again!"
    },
    empty: {
      title: "No reports found",
      subtitle: "Try changing filters or search keywords"
    }
  },
  // Parent Notification Page
  parentNotifications: {
    title: "My Notifications",
    subtitle: "Latest updates on schedule and student status",
    loading: "Loading notifications...",
    stats: {
      total: "Total Notifications",
      received: "Received",
      unread: "Unread",
      attention: "Attention needed",
      read: "Read",
      history: "History",
      alert: "Alerts",
      emergency: "Emergency"
    },
    filter: {
      all: "All Notifications",
      alert: "Alert",
      info: "Info",
      reminder: "Reminder",
      searchPlaceholder: "Search notifications...",
      markAllRead: "Mark all as read"
    },
    card: {
      justNow: "Just now",
      markRead: "Mark as read",
      minutesAgo: "{min} mins ago",
      hoursAgo: "{hour} hours ago",
      yesterday: "Yesterday",
      type: {
        alert: "Important Alert",
        reminder: "Reminder",
        info: "Information",
        default: "Notification"
      }
    },
    empty: {
      title: "No notifications",
      subtitle: "You have no notifications or no matching results found"
    },
    messages: {
      fetchError: "Could not load notifications",
      markAllSuccess: "All marked as read"
    }
  },
  // Parent Tracking Page
  parentTracking: {
    title: "Student Bus Tracking",
    loading: "Loading information...",
    live: "LIVE - Realtime Tracking",
    selectStudent: "Select student to track:",
    studentInfo: "Student Information",
    busInfo: "Bus Info",
    emergency: "Emergency",
    call: "Call",
    labels: {
      student: "Student",
      grade: "Grade",
      route: "Route",
      pickup: "Pickup Point",
      dropoff: "Dropoff Point",
      distance: "Distance",
      estTime: "Est. Time",
      status: "Status",
      pickupStatus: "Pickup",
      dropoffStatus: "Dropoff"
    },
    status: {
      picked: "✅ Picked Up",
      completed: "✅ Completed",
      pending: "🚌 On the way",
      unknown: "⏸️ Unknown"
    },
    alerts: {
      pickupTitle: "⚡ Bus arriving at pickup!",
      pickupDesc: "The bus is very close to the pickup point. Please get ready.",
      dropoffTitle: "🏫 Child arriving soon!",
      dropoffDesc: "The bus is approaching the dropoff point. Your child is almost home."
    },
    defaults: {
      unknown: "Unknown",
      unassigned: "Unassigned",
      undefined: "Undefined",
      na: "N/A"
    },
    empty: {
      title: "No students found",
      desc: "You have no students registered in the system"
    },
    messages: {
      errorFetch: "Could not load student list"
    }
  },
  // Driver Dashboard
  driverDashboard: {
    loading: "Loading information...",
    greeting: {
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      hello: "Good {time}, {name}! 👋",
      subtext: "Have a safe and pleasant driving day"
    },
    time: {
      current: "Current Time",
      today: "Today"
    },
    info: {
      title: "Driver Information",
      name: "Full Name",
      id: "Driver ID",
      license: "License No."
    },
    stats: {
      todayTrips: "Today's Trips",
      totalTrips: "Total trips",
      completed: "Completed",
      tripsDone: "Trips done",
      upcoming: "Upcoming",
      tripsPending: "Trips pending",
      students: "Students",
      totalStudents: "Total students today"
    },
    schedule: {
      title: "Today's Schedule",
      emptyTitle: "No schedule today",
      emptyDesc: "You have the day off today. Relax! 🎉",
      tripPrefix: "Trip",
      bus: "Bus",
      students: "Students",
      studentUnit: "students",
      departure: "Departure",
      arrival: "Return",
      stops: "Stops",
      btnStart: "Start Trip",
      btnDetail: "Details"
    },
    status: {
      scheduled: "Upcoming",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled"
    },
    tips: {
      title: "Reminders",
      tip1: "Check vehicle before departure (fuel, tires, lights, brakes)",
      tip2: "Always prioritize safety when picking up/dropping off students",
      tip3: "Adhere to the schedule and designated stops",
      tip4: "Report immediately if there is an incident or absent student"
    }
  },
  // Driver Schedule Page
  driverSchedule: {
    loading: "Loading schedule...",
    header: {
      title: "Work Schedule",
      subtitle: "View and manage your schedule",
      currentTime: "Current Time",
      driver: "Driver"
    },
    filter: {
      dateLabel: "Select date:",
      showing: "Showing",
      unit: "schedules"
    },
    stats: {
      total: "Total Schedules",
      allDays: "All days",
      today: "Today",
      todayDesc: "Today's schedule",
      vehicle: "Assigned Bus",
      plate: "License Plate"
    },
    list: {
      title: "Schedule List",
      emptyDateTitle: "No schedule",
      emptyDateDesc: "No schedule for the selected date",
      emptyAllTitle: "No schedules found",
      emptyAllDesc: "You have not been assigned any work schedules"
    },
    card: {
      tripPrefix: "Trip",
      code: "Code",
      startTime: "Start Time",
      endTime: "End Time",
      bus: "Bus",
      capacity: "Capacity",
      students: "students",
      route: "Route",
      startPoint: "Start Point",
      endPoint: "End Point",
      unknownRoute: "Unknown Route",
      na: "N/A"
    },
    status: {
      upcoming: "Upcoming",
      running: "Running",
      completed: "Completed"
    },
    buttons: {
      detail: "Route Details",
      map: "View Map"
    },
    tips: {
      title: "Reminders",
      tip1: "Check vehicle before departure (fuel, tires, lights, brakes)",
      tip2: "Always prioritize safety when picking up/dropping off students",
      tip3: "Adhere to the schedule and designated stops",
      tip4: "Report immediately if there is an incident or absent student"
    },
    messages: {
      error: "Could not load schedule"
    }
  },
  // Driver Report Page
  driverReport: {
    header: {
      title: "My Incident Reports",
      subtitle: "Manage incidents you have reported"
    },
    stats: {
      total: "Total Incidents",
      pending: "Pending",
      resolved: "Resolved"
    },
    filter: {
      allStatus: "All Statuses",
      pending: "Pending",
      resolved: "Resolved",
      ignored: "Ignored",
      searchPlaceholder: "Search by title, bus...",
      addBtn: "Add Report"
    },
    card: {
      code: "Incident Code",
      driver: "Driver",
      bus: "Bus",
      status: "Status",
      actions: {
        edit: "Edit",
        delete: "Delete"
      },
      unknownDriver: "Unknown"
    },
    status: {
      pending: "Pending",
      resolved: "Resolved",
      ignored: "Ignored"
    },
    modal: {
      addTitle: "Add New Incident Report",
      editTitle: "Edit Incident Report",
      busLabel: "Bus",
      scheduleLabel: "Schedule",
      titleLabel: "Incident Title",
      descLabel: "Description",
      latLabel: "Latitude",
      longLabel: "Longitude",
      statusLabel: "Status",
      selectBus: "Select Bus",
      selectSchedule: "Select Schedule",
      placeholders: {
        title: "Ex: Engine failure",
        desc: "Detailed description of the incident...",
        lat: "Ex: 10.762622",
        long: "Ex: 106.660172"
      },
      btnCancel: "Cancel",
      btnProcess: "Processing...",
      btnUpdate: "Update",
      btnAdd: "Add Report"
    },
    messages: {
      validation: "⚠️ Please fill in all required fields!",
      validationLocation: "⚠️ Please enter location coordinates!",
      updateSuccess: "✅ Incident report updated successfully!",
      addSuccess: "✅ Incident report added successfully!",
      deleteConfirm: "⚠️ Are you sure you want to delete incident \"{title}\"?\n\nThis action cannot be undone!",
      deleteSuccess: "✅ Incident report deleted successfully!",
      error: "❌ An error occurred! ",
      noDriver: "Driver information not found. Please login again!",
      loadError: "Could not load data. Please try again!"
    },
    empty: {
      title: "No incident reports found",
      start: "You have no reports. Click \"Add Report\" to start!",
      search: "Try changing filters or search keywords"
    }
  },
  // Driver Sidebar
  driverSidebar: {
    dashboard: "Dashboard",
    schedule: "My Schedule",
    report: "Report Incident"
  },
  // Parent Sidebar
  parentSidebar: {
    tracking: "Student Tracking",
    notifications: "Notifications",
    support: "24/7 Support",
    hotline: "Hotline: 1900-xxxx",
    role: "Parent"
  },

  // Common translations (used across multiple components)
  common: {
    back: "Back",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    saveChanges: "Save Changes",
    delete: "Delete",
    edit: "Edit",
    add: "Add New",
    update: "Update",
    create: "Create",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    status: "Status",
    loading: "Loading...",
    loadingData: "Loading data...",
    processing: "Processing...",
    success: "Success",
    error: "Error",
    warning: "Warning",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    ok: "OK",
    retry: "Retry",
    refresh: "Refresh",
    export: "Export",
    import: "Import",
    clear: "Clear",
    clearFilter: "Clear Filter",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    noData: "No Data",
    noResults: "No Results",
    notSet: "Not Set",
    notDefined: "Not Defined",
    notUpdated: "Not Updated",
    unknown: "Unknown",
    na: "N/A",
    optional: "Optional",
    required: "Required",
    characters: "characters",
    items: "items",
    selected: "selected",
    showMore: "Show More",
    showLess: "Show Less",
    viewDetails: "View Details",
    details: "Details",
    info: "Information",
    note: "Note",
    description: "Description",
    address: "Address",
    noAddress: "No Address",
    phone: "Phone Number",
    email: "Email",
    name: "Name",
    fullName: "Full Name",
    date: "Date",
    time: "Time",
    startTime: "Start Time",
    endTime: "End Time",
    all: "All",
    active: "Active",
    inactive: "Inactive",
    enabled: "Enabled",
    disabled: "Disabled",
    uploading: "Uploading...",
    downloading: "Downloading...",
    saving: "Saving...",
    deleting: "Deleting...",
    updating: "Updating...",
    creating: "Creating...",
    sending: "Sending...",
    received: "Received",
    sent: "Sent",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    stt: "No.",
    grade: "Grade",
    pickup: "Pickup",
    dropoff: "Dropoff",
    picked: "Picked up",
    dropped: "Dropped off",
    waiting: "Waiting",
    loadError: "Cannot load data",
    daysAgo: "days ago"
  },

  // Login Page
  login: {
    title: "Login",
    subtitle: "Login to the system",
    phoneLabel: "Phone Number",
    phonePlaceholder: "Enter phone number",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    loginButton: "Login",
    loggingIn: "Logging in...",
    loginSuccess: "Login successful!",
    loginFailed: "Login failed",
    invalidCredentials: "Invalid phone number or password",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign up now"
  },

  // Register Page
  register: {
    title: "Register",
    subtitle: "Create new account",
    success: "Registration successful!",
    failed: "Registration failed"
  },

  // My Account Page
  myAccount: {
    title: "My Account",
    tabs: {
      profile: "Profile",
      security: "Security"
    },
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email",
    address: "Address",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updateProfile: "Update Profile",
    changePassword: "Change Password",
    updating: "Updating...",
    updateSuccess: "Profile updated successfully!",
    updateFailed: "Update failed!",
    loginRequired: "You need to login to view account information."
  },

  // Not Found Page
  notFound: {
    title: "404",
    message: "Oops! Page not found.",
    description: "The page you are looking for does not exist or has been removed.",
    backHome: "Back to Home"
  },

  // Create Route Page
  createRoute: {
    pageTitle: "Create New Bus Route",
    nameLabel: "Route Name",
    namePlaceholder: "Route Name (Ex: Sai Thanh Route)",
    startLabel: "Start Point: *",
    startPoint: "🚩 Start Point",
    endLabel: "End Point: *",
    endPoint: "🏁 End Point",
    stopsLabel: "Stops (optional):",
    stopPoint: "📍 Stop Point",
    addStop: "Add Stop",
    stopPlaceholder: "Click on map to select stop",
    clickMap: "Click on map to select location",
    selectInputFirst: "Please select input field before clicking on map",
    instructions: "Instructions:",
    instructionsDetail: "Click on the input field (start/stop/end) first, then click on the map to select location. The route will be drawn automatically.",
    creating: "Creating...",
    createButton: "+ Create Route",
    createSuccess: "✅ Route created successfully!",
    error: {
      nameRequired: "Please enter route name",
      startRequired: "Please select start point",
      endRequired: "Please select end point",
      stopsIncomplete: "Please select all stops or remove incomplete ones",
      failed: "Cannot create route. Please try again."
    }
  },

  // Route Management Page
  routePage: {
    title: "Route Management",
    subtitle: "List and information of bus routes",
    loading: "Loading route data...",
    processing: "Processing...",
    loadError: "Load Error",
    loadErrorDesc: "Cannot load route list. Please try again later.",
    filterAll: "All Statuses",
    filterActive: "Active",
    filterInactive: "Inactive",
    searchPlaceholder: "Search by name, code, start/end point...",
    createNew: "Create New Route",
    stats: {
      total: "Total",
      totalDesc: "Created in system",
      active: "Active",
      activeDesc: "Currently operating",
      totalStops: "Total Stops",
      totalStopsDesc: "Across all routes",
      avgStops: "Avg Stops",
      avgStopsDesc: "Stops per route"
    },
    table: {
      code: "Route Code",
      name: "Route Name",
      start: "Start Point",
      end: "End Point",
      stops: "Stops",
      status: "Status",
      actions: "Actions"
    },
    statusActive: "Active",
    statusInactive: "Inactive",
    noRoutes: "No routes yet",
    noRoutesDesc: "Start creating new routes for the system",
    noResults: "No routes found",
    noResultsDesc: "Try changing filters or search keywords",
    clearFilter: "Clear filters",
    actions: {
      view: "Details",
      edit: "Edit",
      delete: "Delete"
    },
    delete: {
      title: "Confirm Delete Route",
      routeName: "🛣️ Route Name:",
      routeCode: "🆔 Route Code:",
      startPoint: "📍 Start Point:",
      endPoint: "🏁 End Point:",
      stopsCount: "📍 Number of Stops:",
      stopsUnit: "stops",
      warning: "⚠️ This action cannot be undone!",
      confirmButton: "Delete Route",
      cancelButton: "Cancel",
      deleting: "Deleting route...",
      deleteSuccess: "Route deleted successfully!",
      deleteError: "Cannot delete route!",
      notFoundError: "Route ID not found!"
    },
    detail: {
      loadError: "Cannot load details. Please try again!"
    },
    edit: {
      loadError: "Cannot load route information. Please try again!",
      updateSuccess: "Route updated successfully!",
      updateError: "Cannot update route!"
    }
  },  // Student Checkin Page
  checkin: {
    title: "Student Check-in/Check-out",
    subtitle: "Student Check-in/Check-out",
    backToBusManagement: "Back to Bus Management",
    sessionMorning: "Morning",
    sessionAfternoon: "Afternoon",
    checkinAt: "checked-in at",
    checkoutAt: "checked-out at",
    status: {
      present: "On Bus",
      absent: "Off Bus",
      pending: "Not Checked"
    },
    table: {
      name: "Full Name",
      status: "Status",
      action: "Action",
      studentCode: "Student ID:"
    },
    loading: "Loading information...",
    checkIn: "Check-in",
    checkOut: "Check-out"
  },

  // Add User Modal
  addUser: {
    title: "Add New User",
    name: "Full Name",
    namePlaceholder: "Enter full name",
    phoneNumber: "Phone Number",
    phonePlaceholder: "0912345678",
    password: "Password",
    passwordPlaceholder: "Minimum 6 characters",
    role: "Role",
    roleParent: "Parent",
    roleDriver: "Driver",
    roleAdmin: "Administrator",
    licenseNumber: "Driver License Number",
    licensePlaceholder: "E.g: B2-12345678",
    address: "Address",
    addressPlaceholder: "Enter address",
    creating: "Creating...",
    createButton: "Create User",
    error: {
      createFailed: "Failed to create user. Please try again."
    }
  },

  // Edit User Modal
  editUser: {
    title: "Edit User",
    subtitle: "Update user information",
    fullName: "Full Name *",
    fullNamePlaceholder: "Enter full name",
    phone: "Phone Number *",
    phonePlaceholder: "Enter phone number",
    newPassword: "New Password",
    passwordPlaceholder: "Enter new password",
    passwordHint: "Leave blank to keep current",
    passwordNote: "Only enter if you want to change password",
    role: "Role *",
    roleParent: "Parent",
    roleDriver: "Driver",
    roleAdmin: "Administrator",
    licenseNumber: "Driver License Number",
    licensePlaceholder: "Enter license number",
    address: "Address",
    addressPlaceholder: "Enter address",
    loading: "Loading information...",
    updating: "Updating...",
    error: {
      loadFailed: "Cannot load user information. Please try again.",
      updateFailed: "Cannot update user. Please try again."
    }
  },

  // Student Table Component
  studentTable: {
    headers: {
      code: "Student ID",
      name: "Full Name",
      grade: "Grade",
      parentCode: "Parent ID",
      parentName: "Parent Name",
      pickup: "Pickup Point",
      dropoff: "Dropoff Point",
      actions: "Actions"
    },
    noStudents: "No students found",
    notSet: "Not Set"
  },

  // Edit Student Modal
  editStudent: {
    title: "Edit Student Information",
    subtitle: "Update student information",
    currentInfo: "📋 Current Information",
    studentCode: "Student ID",
    parentCode: "Parent ID",
    name: "Full Name *",
    namePlaceholder: "Enter student full name",
    grade: "Grade *",
    gradePlaceholder: "Ex: Grade 1A, 2B, 3C...",
    parent: "Parent *",
    selectParent: "-- Select Parent --",
    route: "Route *",
    selectRoute: "-- Select Route --",
    pickup: "📍 Pickup Point *",
    selectPickup: "-- Select Pickup Point --",
    dropoff: "📍 Dropoff Point *",
    selectDropoff: "-- Select Dropoff Point --",
    compareChanges: "🔄 Compare Changes:",
    changes: {
      from: "From",
      to: "To"
    },
    validation: {
      parentRequired: "Please select parent",
      routeRequired: "Please select route",
      pickupRequired: "Please select pickup point",
      dropoffRequired: "Please select dropoff point"
    }
  },

  // Route Detail Modal
  routeDetail: {
    title: "Route Details",
    code: "Route ID",
    name: "Route Name",
    start: "Start Point",
    end: "End Point",
    stopsCount: "Number of Stops",
    stopsList: "Stops List:",
    stops: "stops",
    statusActive: "Active",
    statusInactive: "Inactive"
  },

  // Route Edit Modal
  routeEdit: {
    title: "Edit Route Information",
    code: "Route ID:",
    start: "Start Point:",
    end: "End Point:",
    stopsCount: "Number of Stops:",
    note: "💡 Cannot change stops and locations. Only name and status can be edited.",
    name: "Route Name *",
    namePlaceholder: "Enter route name",
    status: "Status",
    statusActive: "Active",
    statusInactive: "Inactive",
    validation: {
      nameRequired: "Please enter route name"
    }
  },

  // Create Notification Modal
  createNotification: {
    titleCreate: "Create New Notification",
    titleEdit: "Edit Notification",
    subtitleCreate: "Send notification to users",
    subtitleEdit: "Update notification information",
    receiver: "Receiver *",
    selectReceiver: "-- Select Receiver --",
    loading: "Loading...",
    roleParent: "👨‍👩‍👧 Parent",
    roleDriver: "🚗 Driver",
    roleAdmin: "👔 Administrator",
    type: "Notification Type *",
    typeInfo: "📘 Information",
    typeAlert: "⚠️ Alert",
    typeSuccess: "✅ Success",
    typeAnnouncement: "📢 Announcement",
    message: "Message Content *",
    messagePlaceholder: "Enter message content...",
    characterCount: "characters",
    preview: "Preview Notification",
    creating: "Creating...",
    updating: "Updating...",
    createButton: "Create Notification",
    updateButton: "Update",
    createSuccess: "Notification created successfully!",
    updateSuccess: "Notification updated successfully!",
    validation: {
      receiverRequired: "Please select receiver",
      messageRequired: "Please enter message content",
      typeRequired: "Please select notification type"
    },
    error: {
      loadUsers: "Cannot load user list",
      createFailed: "Cannot create notification",
      updateFailed: "Cannot update notification"
    }
  },

  // Bus Tracking Map
  tracking: {
    loadingMap: "Loading map...",
    legend: "Legend",
    pickup: "Pickup Point",
    dropoff: "Dropoff Point",
    otherStop: "Other Stop",
    route: "Route",
    yourPickup: "🏫 Your Pickup Point",
    yourDropoff: "🏠 Your Dropoff Point",
    stopPoint: "📍 Stop Point",
    estimated: "⏰ Estimated:",
    order: "Order:",
    driver: "👨‍✈️ Driver:",
    stopsCount: "📊 {count} stops",
    routeStops: "🗺️ Route ({count} stops)",
    hoverHint: "💡 Hover over marker to highlight"
  },

  // Bus Card Component
  busCard: {
    editSchedule: "Edit Schedule",
    deleteSchedule: "Delete Schedule",
    studentList: "Student List",
    driver: "Driver:",
    capacity: "Capacity",
    seats: "seats",
    driverLabel: "Driver *",
    selectDriver: "Select Driver",
    busLabel: "Bus *",
    selectBus: "Select Bus",
    busCapacity: "{plate} - {capacity} seats",
    routeLabel: "Route",
    routeLocked: "🔒 Cannot change route",
    startTime: "Start Time *",
    endTime: "End Time *",
    date: "Date",
    status: "Status",
    statusScheduled: "Scheduled",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    saving: "Saving...",
    error: {
      fillAll: "⚠️ Please fill in all information!"
    }
  },

  // Add Bus Modal
  addBus: {
    titleCreate: "Create New Bus",
    titleEdit: "✏️ Edit Bus Schedule",
    titleSchedule: "Assign Bus Schedule",
    selectFunction: "🚌 Select Function",
    modeCreate: "Create New Bus",
    modeSchedule: "Assign Schedule",
    plate: "License Plate *",
    platePlaceholder: "Ex: 51B-12345",
    capacity: "Capacity (seats) *",
    capacityPlaceholder: "Ex: 45",
    busStatus: "Bus Status",
    statusActive: "Active",
    statusRepair: "Under Maintenance",
    statusInactive: "Inactive",
    selectBus: "Select Bus *",
    selectBusPlaceholder: "-- Select Bus --",
    selectDriver: "Select Driver *",
    selectDriverPlaceholder: "-- Select Driver --",
    selectRoute: "Select Route *",
    selectRoutePlaceholder: "-- Select Route --",
    routeNote: "🔒 Cannot change route when editing",
    startTime: "Start Time *",
    endTime: "End Time *",
    date: "Date",
    scheduleStatus: "Schedule Status",
    creating: "Creating...",
    createButton: "Create Bus",
    scheduleButton: "Assign Schedule",
    updateButton: "Update Schedule",
    createBusSuccess: "✅ Bus created successfully!",
    createScheduleSuccess: "Bus schedule assigned successfully",
    updateScheduleSuccess: "Schedule updated successfully",
    successTitle: "Success!",
    errorTitle: "Error!",
    validation: {
      fillAll: "Please fill in all information",
      selectBus: "Please select bus",
      selectDriver: "Please select driver",
      selectRoute: "Please select route"
    }
  },

  // Account Table Component
  accountTable: {
    loading: "Loading data...",
    noUsers: "No users",
    noUsersFiltered: "No users matching filter criteria",
    headers: {
      code: "ID",
      name: "Full Name",
      phone: "Phone Number",
      role: "Role",
      license: "License",
      address: "Address",
      actions: "Actions"
    },
    plateNumber: "Plate:"
  },

  // Add Student Modal
  addStudent: {
    title: "Add New Student",
    subtitle: "Fill in student information in the form below",
    name: "Student Name *",
    namePlaceholder: "Enter student name...",
    grade: "Grade *",
    gradePlaceholder: "Ex: 10A1, 11B2...",
    parent: "Parent *",
    selectParent: "-- Select Parent --",
    route: "Route *",
    selectRoute: "-- Select Route --",
    pickup: "Pickup Point *",
    selectPickup: "-- Select Pickup Point --",
    dropoff: "Dropoff Point *",
    selectDropoff: "-- Select Dropoff Point --",
    loadingStops: "Loading stops...",
    noStops: "No stops available",
    noteTitle: "Note about Pickup/Dropoff",
    noteContent: "This route has {count} stops. Please select appropriate pickup and dropoff points.",
    noteSelect: "Please select route first to view stops",
    submit: "Add Student",
    validation: {
      nameRequired: "Please enter student name",
      gradeRequired: "Please enter grade",
      parentRequired: "Please select parent",
      routeRequired: "Please select route",
      pickupRequired: "Please select pickup point",
      dropoffRequired: "Please select dropoff point"
    }
  },

  // Add Student to Schedule Modal
  addStudentSchedule: {
    title: "Add Students to Schedule",
    searchPlaceholder: "Search by name, student ID, grade...",
    selectAll: "Select All ({count} students)",
    selected: "Selected: {count}",
    noStudents: "No students available",
    noResults: "No students found",
    noStudentsHelp: "All students in this route have been added to the schedule",
    searchHelp: "Try changing search keywords",
    pickupLabel: "Pickup:",
    dropoffLabel: "Dropoff:",
    loadingStudents: "Loading student list...",
    adding: "Adding {count} students...",
    addSuccess: "Added {count} students to schedule!",
    addStudents: "Add {count} students",
    error: {
      noRoute: "Schedule has no route information",
      loadFailed: "Cannot load student list",
      selectAtLeast: "Please select at least one student",
      failed: "Cannot add students. Please try again!"
    }
  },

  // Schedule Detail Modal
  scheduleDetail: {
    title: "Schedule Details",
    tripInfo: "Trip Information",
    route: "Route",
    departure: "Departure",
    arrival: "Arrival",
    stops: "Stops ({count})",
    noAddress: "No Address",
    estimated: "⏰ Estimated:",
    students: "Students",
    studentsCount: "students on this trip",
    studentList: "Student List",
    noStudents: "No students yet",
    emergency: "Emergency Contact",
    emergencyCall: "📞 Call: 1900-1412",
    startTrip: "Start Trip",
    loading: "Loading information...",
    loadError: "Cannot load details"
  },

  // Confirm Delete Modal
  confirmDelete: {
    title: "Confirm Delete Schedule",
    subtitle: "This action cannot be undone",
    warningTitle: "Important Warning!",
    warningText: "You are about to delete a bus schedule. After deletion, all related information will be permanently removed and cannot be recovered.",
    scheduleInfo: "Schedule Information",
    scheduleId: "Schedule ID",
    plate: "License Plate",
    route: "Route",
    driver: "Driver",
    time: "Time",
    status: "Status",
    confirmQuestion: "Are you sure you want to delete this schedule?",
    cancelButton: "Cancel",
    deleteButton: "Delete Schedule"
  },

  // Notification Bell Component
  notificationBell: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    markAllReadShort: "Read All",
    markRead: "Mark as read",
    deleteNotification: "Delete",
    viewAll: "View all notifications",
    noNotifications: "No notifications",
    noNotificationsDesc: "You will receive notifications here",
    justNow: "Just now",
    minutesAgo: "{min} mins ago",
    hoursAgo: "{hour} hours ago",
    yesterday: "Yesterday",
    typeAlert: "Important Alert",
    typeReminder: "Reminder",
    typeInfo: "Information",
    typeDefault: "Notification",
    deleteSuccess: "Notification deleted",
    deleteError: "Cannot delete notification",
    markAllSuccess: "All marked as read",
    markAllError: "Cannot mark all as read",
    markReadError: "Cannot mark as read"
  },

  // User Dropdown Component
  userDropdown: {
    account: "Account",
    logout: "Logout",
    logoutConfirm: "Are you sure you want to logout?",
    logoutDesc: "Your current session will end.",
    logoutSuccess: "Logged out successfully!"
  },

  // Pagination Component
  pagination: {
    previous: "← Previous",
    next: "Next →",
    page: "Page"
  },

  // Student Form Page
  studentForm: {
    editTitle: "Edit Student",
    addTitle: "Add New Student",
    editSubtitle: "Update student information",
    addSubtitle: "Fill in information to add new student",
    adding: "Adding student...",
    updating: "Updating student...",
    addSuccess: "Student added successfully!",
    updateSuccess: "Student updated successfully!",
    confirmCancel: "Are you sure you want to cancel? Changes will not be saved.",
    error: {
      notFound: "Student not found!",
      fillAll: "Please fill in all information!"
    }
  },

  // Student List Page
  studentList: {
    title: "Student List",
    backButton: "Back to Bus Management",
    driverInfo: "Driver: {name} | {time}",
    capacity: "Capacity",
    students: "students",
    searchPlaceholder: "Search by name or grade...",
    exportButton: "Export List",
    addButton: "Add Student",
    noSchedule: "Schedule information not found.",
    backToManagement: "Back to management page",
    loading: "Loading student list...",
    noStudents: "No students",
    noStudentsHelp: "Add students to this schedule",
    searchHelp: "Try changing search keywords",
    deleteConfirm: "Remove student from schedule?",
    deleteDesc: "Student <strong>{name}</strong> (Grade {grade}) will be removed from this schedule.",
    deleteButton: "Remove",
    deleting: "Removing...",
    deleteSuccess: "Removed!",
    deleteSuccessDesc: "Student {name} has been removed from schedule.",
    deleteError: "Error",
    deleteErrorDesc: "Cannot remove student. Please try again later!",
    removeFromSchedule: "Remove from schedule",
    studentNotFound: "Student not found",
    studentNotFoundDesc: "Student does not exist in current list."
  },

  // Notification Form Page
  notificationForm: {
    back: "Back",
    editTitle: "Edit Notification",
    createTitle: "Create New Notification",
    editSubtitle: "Update notification information",
    createSubtitle: "Send notification to drivers and parents",
    typeLabel: "Notification Type",
    typeAlert: "Alert",
    typeInfo: "Info",
    typeReminder: "Reminder",
    contentLabel: "Notification Content",
    contentPlaceholder: "Enter notification content...",
    routeLabel: "Notification for Route",
    selectRoute: "-- Select Bus Route --",
    recipientsLabel: "Recipients",
    selectAll: "Select All",
    driver: "Driver",
    parent: "Parent",
    selectRouteFirst: "* Please select route first",
    update: "Update",
    send: "Send Notification",
    sending: "Sending notification...",
    updating: "Updating notification...",
    sendSuccess: "Notification sent successfully!",
    updateSuccess: "Notification updated successfully!",
    confirmCancel: "Are you sure you want to cancel? Changes will not be saved.",
    validation: {
      routeRequired: "Please select route!",
      recipientRequired: "Please select at least one recipient!"
    }
  },

  // Data Translations - for translating dynamic content from backend
  data: {
    // Route names
    "Tuyến 19 - Bến xe Miền Tây ⇄ ĐHQG": "Route 19 - Western Bus Station ⇄ VNU",
    "Tuyến 45 - Bến Thành ⇄ Sân bay TSN": "Route 45 - Ben Thanh ⇄ TSN Airport",

    // Status
    "hoạt động": "Active",
    "không hoạt động": "Inactive",
    "đang bảo trì": "Under Maintenance",
    "đang sửa chữa": "Under Repair",
    "ngừng hoạt động": "Inactive",

    // Schedule status
    "Đang chờ": "Scheduled",
    "Hoàn thành": "Completed",
    "Hủy": "Cancelled",
    "Đang chạy": "In Progress",

    // Notification types
    "Cảnh báo": "Alert",
    "Thông tin": "Info",
    "Nhắc nhở": "Reminder",
    "Thông báo chung": "Announcement",

    // Common data
    "Chưa cập nhật": "Not updated",
    "Không rõ": "Unknown",
    "N/A": "N/A",
    "Chưa có": "Not set",
    "Chưa xác định": "Undefined",

    // Roles
    "Phụ huynh": "Parent",
    "Tài xế": "Driver",
    "Quản trị viên": "Administrator",
    "Quản lý": "Manager"
  }
};