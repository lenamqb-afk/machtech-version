# Chấm Công Tính Lương – bản App Store / Google Play

Thư mục này đóng gói web app `../cham-cong` thành app iOS và Android bằng Capacitor 8.
Sửa giao diện/tính năng ở `../cham-cong/index.html`; app gốc tự lấy bản mới khi build.

- `npm ci && npm run sync` : chép web vào `www/` (kèm SheetJS, capacitor.js để chạy không cần mạng) rồi đồng bộ vào `ios/`, `android/`.
- `npm run icons` : tạo icon và màn hình khởi động từ `assets/`.
- Bundle ID / applicationId: `vn.machtech.chamcong`. Phiên bản: `MARKETING_VERSION` trong `ios/App/App.xcodeproj`, `versionName` trong `android/app/build.gradle`.
- Build trên GitHub: workflow `.github/workflows/cham-cong-app.yml` (macOS cho iOS, Ubuntu cho Android APK).

Khác biệt khi chạy trong app gốc (biến `NATIVE` trong index.html):
- GPS, chia sẻ, lưu file Excel/sao lưu qua plugin Capacitor (Geolocation, Share, Filesystem).
- Lần đầu mở app chọn vai trò Quản lý / Nhân viên; nhân viên dán link quản lý gửi để lấy địa chỉ máy chủ.
- Link gửi nhân viên luôn là link web cố định (`WEB_URL`).

## Thông tin khai báo App Store Connect

| Mục | Nội dung |
|---|---|
| Tên app (≤30 ký tự) | Chấm Công Tính Lương (nếu Apple báo trùng tên: Chấm Công Tính Lương MachTech) |
| Tên dưới biểu tượng | Chấm Công |
| Phụ đề (≤30 ký tự) | Bảng công, lương thợ, công trình |
| Danh mục | Kinh doanh (Business), phụ: Năng suất |
| Độ tuổi | 4+ |
| Giá tải | Miễn phí |
| Mua trong app | Non-Consumable, Product ID `vn.machtech.chamcong.quanly`, tên "Bản đầy đủ" (mở khoá quản lý không giới hạn nhân viên; bản miễn phí tối đa 3 NV đang làm). Máy nhân viên luôn miễn phí. Có nút Khôi phục giao dịch. |
| URL chính sách quyền riêng tư | https://raw.githack.com/lenamqb-afk/machtech-version/cham-cong/cham-cong/chinh-sach.html |
| URL hỗ trợ | cùng link trên (có hotline) |
| Quyền riêng tư (App Privacy) | **Data Not Collected** – nhà phát triển không thu thập dữ liệu; dữ liệu ở trong máy hoặc Google Drive của chính người dùng |
| Mã hoá | Không (ITSAppUsesNonExemptEncryption = NO đã khai trong Info.plist) |

**Từ khoá (≤100 ký tự):** `cham cong,chấm công,tính lương,bảng công,công trình,thợ,tạm ứng,thu chi,nhân viên,lịch âm`

**Mô tả:**

> Chấm Công Tính Lương giúp chủ xưởng, chủ thầu công trình chấm công và tính lương thợ ngay trên điện thoại, dùng được cả khi không có mạng.
>
> • Chấm công nhanh: 1 công, 1/2 công, nghỉ có lý do, không lý do, nghỉ có lương. Chấm cả nhóm một lần.
> • Lịch tháng có ngày âm lịch.
> • Tính lương tự động: lương ngày × số công + tăng ca + phụ cấp − tạm ứng − trừ tiền. Thanh toán tự tính số còn phải trả, gửi bảng lương qua Zalo.
> • Nhân viên tự chấm Vào ca / Ra ca bằng GPS tại công trình, quản lý đối chiếu trên máy mình.
> • Quản lý công trình: thu tiền chủ nhà, chi vật tư, tạm ứng mua vật tư và quyết toán, tiến độ từng hạng mục, lãi tạm tính.
> • Nhắc chấm công hằng ngày bằng thông báo, tự bỏ qua ngày đã chấm.
> • Xuất Excel bảng công, bảng lương có cột ký nhận.
> • Khoá app bằng mật khẩu. Sao lưu ra file, đồng bộ nhiều máy qua Google Drive của chính anh/chị.
> • Không quảng cáo, không cần tài khoản.
> • Tải miễn phí, quản lý tới 3 nhân viên. Mua bản đầy đủ 1 lần để không giới hạn. Máy nhân viên luôn miễn phí.

**Ghi chú cho người duyệt (App Review Notes, tiếng Anh):**

> The app works fully offline without an account. On first launch choose "Chủ / quản lý" (manager). Tap "+" to add a work group and employees, then tap "Chấm công" on an employee to record a work day; the Bảng tab shows payroll; Thu chi / Tiến độ tabs track project money and progress; "Xuất Excel" exports a spreadsheet via the share sheet.
> The optional "Nhân viên" (employee) mode lets workers clock in/out with GPS against a server the business owner deploys in their own Google account. Demo employee link and credentials: (fill in before submitting).
> In-app purchase: the free tier allows 3 active employees; adding a 4th opens the "Bản đầy đủ" purchase sheet (also ⚙️ › ⭐), which has Restore Purchases.
> Location is requested only while in use, when clocking in/out or when the manager saves a site location.

**Ảnh chụp màn hình:** cần ảnh iPhone 6.9" (1320×2868 hoặc 1290×2796). Có thể chụp từ máy anh hoặc để Claude tạo.
