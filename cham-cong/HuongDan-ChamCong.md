# Phần mềm Chấm công cho iPhone – Hướng dẫn

App chạy trên Safari của iPhone, thêm ra màn hình chính như một app thật. Không cần App Store, không cần máy Mac, không mất phí.

## 1. App làm được gì

- **Nhóm / công trình** (VD: "Lắp Máy Sấy"), mỗi nhóm nhiều nhân viên.
- **Chấm công hôm nay**: nút *Chấm công* (1 công) và *Chấm 1/2 công* trên từng người. Bấm lần nữa để hủy.
- **Chấm nhanh**: tích chọn cả nhóm rồi chấm 1 lần; hoặc chấm cả khoảng ngày cho 1 người (bỏ qua Chủ nhật).
- **Lịch tháng** có **ngày âm lịch**: bấm vào ô ngày để chọn Đi làm, 1/2 ngày, Nghỉ có lý do, Nghỉ không lý do, Nghỉ có lương, ghi chú, tăng ca.
- **Tiền công**: lương 1 ngày công × số công + tăng ca + phụ cấp − ứng lương − trừ tiền − đã thanh toán = **còn chưa nhận**.
- **Ứng lương, Tăng ca (theo giờ), Phụ cấp, Trừ tiền, Thanh toán**: mỗi khoản có ngày, số tiền, ghi chú; sửa/xóa được.
- **Tạm ngừng** nhân viên nghỉ việc (giữ lịch sử).
- **Ẩn/hiện số tiền** (nút con mắt).
- **Xuất Excel** theo nhóm hoặc theo 1 người: Bảng công (X, ½, P, K, L từng ngày), Bảng tiền công có cột Ký nhận, danh sách ứng/tăng ca/thanh toán, ghi chú.
- **Chạy không cần mạng**. Dữ liệu lưu trên iPhone; có **Sao lưu ra file / Khôi phục**.
- **Đồng bộ nhiều máy** (tùy chọn) qua Google Drive của anh, miễn phí.

## 2. Đưa app lên mạng (làm 1 lần)

App là các file trong thư mục `app/` (index.html, manifest.json, sw.js, icon-*.png). Cần đặt lên một trang web có **https**. Cách miễn phí: GitHub Pages hoặc Netlify Drop (kéo thả thư mục `app` vào https://app.netlify.com/drop).

## 3. Cài trên iPhone

1. Mở địa chỉ app bằng **Safari**.
2. Bấm nút **Chia sẻ** (ô vuông có mũi tên lên) › **Thêm vào MH chính** › Thêm.
3. Mở app từ biểu tượng "Chấm công" trên màn hình chính.

Lưu ý: nên luôn mở từ biểu tượng ngoài màn hình chính. iPhone giữ dữ liệu của app ngoài màn hình chính lâu dài; nếu chỉ mở trong tab Safari mà lâu không dùng, iOS có thể tự xóa dữ liệu.

## 4. Đồng bộ nhiều máy qua Google (không bắt buộc)

Dùng khi anh và người quản lý khác cùng chấm công trên 2 điện thoại, hoặc muốn dữ liệu luôn có bản trên mạng.

1. Vào https://script.google.com › **Dự án mới**. Xóa hết, dán nội dung file `may-chu/Code.gs`.
2. Sửa dòng `var MA_BI_MAT = '...'` thành mã riêng của anh.
3. **Triển khai › Tùy chọn triển khai mới › Ứng dụng web**: *Thực thi với tư cách: Tôi*, *Ai có quyền truy cập: Bất kỳ ai* › Triển khai › cấp quyền (bấm Nâng cao › Đi tới… nếu Google cảnh báo).
4. Copy **URL ứng dụng web** (đuôi `/exec`).
5. Trong app: ⚙️ › dán URL và mã bí mật › **Lưu & đồng bộ**. Làm giống vậy trên máy thứ hai.

Dữ liệu nằm trong file `cham-cong-du-lieu.json` ở Google Drive của anh, mỗi ngày có thêm 1 bản sao lưu trong thư mục `cham-cong-sao-luu`.

## 5. Ký hiệu

| Màu | Ý nghĩa | Tính công |
|---|---|---|
| Xanh lá | Đi làm | 1 |
| Xanh dương | 1/2 ngày | 0,5 |
| Nâu "–" | Nghỉ có lý do | 0 |
| Hồng "?" | Nghỉ không lý do | 0 |
| Xám đậm "–" | Nghỉ có lương | 1 |
| Xám nhạt | Chưa chấm | 0 |

Dấu nhỏ góc ô: **＋** có tăng ca, **ⓘ** có ghi chú, **$** có thanh toán.
