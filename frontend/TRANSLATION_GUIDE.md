# 🌐 Hướng dẫn sử dụng hệ thống i18n (Đa ngôn ngữ)

## 📌 Tổng quan

Hệ thống hỗ trợ 2 ngôn ngữ: **Tiếng Việt (vi)** và **Tiếng Anh (en)**

### Có 2 loại cần dịch:

1. **UI Labels** (nút, tiêu đề, placeholder...) → Dùng `t()`
2. **Dynamic Data** (status, tên tuyến từ backend...) → Dùng `translateData()`

---

## 🎯 Cách sử dụng

### 1. Import hook trong component:

```jsx
import { useLanguage } from '../contexts/LanguageContext';

function YourComponent() {
  const { t, translateData } = useLanguage();
  
  // ... component code
}
```

### 2. Dịch UI Labels với `t()`:

```jsx
// ✅ Buttons
<button>{t('common.save')}</button>
<button>{t('common.cancel')}</button>

// ✅ Titles
<h1>{t('dashboard.title')}</h1>

// ✅ Placeholders
<input placeholder={t('common.searchPlaceholder')} />

// ✅ Table Headers
<th>{t('routePage.table.name')}</th>
<th>{t('routePage.table.status')}</th>
```

### 3. Dịch Dynamic Data với `translateData()`:

```jsx
// Giả sử data từ backend (tiếng Việt)
const bus = {
  status: "hoạt động",
  plate: "51B-12345"
};

const route = {
  name: "Tuyến 19 - Bến xe Miền Tây ⇄ ĐHQG"
};

// ✅ Dịch status
<p>{translateData(bus.status)}</p>
// Kết quả: VI: "hoạt động" | EN: "Active"

// ✅ Dịch tên tuyến
<p>{translateData(route.name)}</p>
// Kết quả: VI: "Tuyến 19..." | EN: "Route 19..."

// ✅ Kết hợp cả 2
<p>
  <strong>{t('common.status')}:</strong> {translateData(bus.status)}
</p>
// Kết quả: VI: "Trạng thái: hoạt động" | EN: "Status: Active"
```

---

## 📝 Ví dụ thực tế

### Component BusCard:

```jsx
import { useLanguage } from '../contexts/LanguageContext';

function BusCard({ bus }) {
  const { t, translateData } = useLanguage();
  
  return (
    <div className="card">
      {/* ✅ UI Label */}
      <h3>{t('busManager.card.code')}: {bus.bus_id}</h3>
      
      {/* ✅ UI Label */}
      <p>{t('busManager.card.plateHeader')}: {bus.license_plate}</p>
      
      {/* ✅ UI Label + translateData */}
      <p>
        {t('busManager.card.status')}: {translateData(bus.status)}
      </p>
      
      {/* ✅ Button labels */}
      <button>{t('busManager.card.edit')}</button>
      <button>{t('busManager.card.delete')}</button>
    </div>
  );
}
```

### Component RouteList:

```jsx
function RouteList({ routes }) {
  const { t, translateData } = useLanguage();
  
  return (
    <table>
      <thead>
        <tr>
          {/* ✅ UI Labels */}
          <th>{t('routePage.table.code')}</th>
          <th>{t('routePage.table.name')}</th>
          <th>{t('routePage.table.status')}</th>
        </tr>
      </thead>
      <tbody>
        {routes.map(route => (
          <tr key={route.id}>
            <td>{route.code}</td>
            {/* ✅ translateData cho tên tuyến */}
            <td>{translateData(route.name)}</td>
            {/* ✅ translateData cho status */}
            <td>{translateData(route.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🔧 Thêm translation mới

### 1. Thêm UI Label mới:

Vào file `translations.ts`:

```typescript
export const translations = {
  vi: {
    myPage: {
      title: "Tiêu đề của tôi",
      subtitle: "Mô tả ngắn",
      saveButton: "Lưu lại"
    }
  },
  en: {
    myPage: {
      title: "My Title",
      subtitle: "Short description",
      saveButton: "Save"
    }
  }
}
```

Sử dụng:
```jsx
{t('myPage.title')}
{t('myPage.saveButton')}
```

### 2. Thêm Data Translation mới:

Vào file `translations.ts` → `en.data`:

```typescript
en: {
  // ... existing translations
  data: {
    // Thêm mapping mới
    "Tuyến mới từ backend": "New Route from Backend",
    "Trạng thái mới": "New Status"
  }
}
```

Sử dụng:
```jsx
{translateData("Tuyến mới từ backend")}
{translateData("Trạng thái mới")}
```

---

## 🎨 Best Practices

### ✅ DO (Nên làm):

```jsx
// ✅ UI Labels dùng t()
<h1>{t('dashboard.title')}</h1>
<button>{t('common.save')}</button>

// ✅ Data từ backend dùng translateData()
<span>{translateData(bus.status)}</span>
<p>{translateData(route.name)}</p>

// ✅ Kết hợp cả 2
<p>{t('common.status')}: {translateData(item.status)}</p>
```

### ❌ DON'T (Không nên):

```jsx
// ❌ Hardcode text
<h1>Trang chủ</h1>
<button>Lưu</button>

// ❌ Dùng t() cho data từ backend
<span>{t(bus.status)}</span> // Sai!

// ❌ Dùng translateData() cho UI label
<button>{translateData('Lưu')}</button> // Sai!
```

---

## 🚀 Tóm tắt

| Loại | Công cụ | Ví dụ |
|------|---------|-------|
| **UI Labels** | `t('key')` | `{t('common.save')}` |
| **Backend Data** | `translateData(text)` | `{translateData(status)}` |

**Rule đơn giản:**
- Nếu text **cố định trong code** → Dùng `t()`
- Nếu text **từ backend/database** → Dùng `translateData()`

---

## 📚 Xem thêm

- File translations: `frontend/src/i18n/translations.ts`
- LanguageContext: `frontend/src/contexts/LanguageContext.tsx`
- Example: `frontend/src/components/ExampleTranslation.jsx`
- Dashboard example: `frontend/src/pages/Dashboard.jsx`
