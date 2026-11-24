/**
 * MÁY CHỦ ĐỒNG BỘ CHẤM CÔNG – Google Apps Script (miễn phí)
 *
 * Cài đặt:
 *  1. Vào https://script.google.com > Dự án mới > xóa hết, dán toàn bộ file này.
 *  2. Đổi MA_BI_MAT bên dưới thành mã riêng của anh (dài, khó đoán).
 *  3. Bấm Triển khai > Tùy chọn triển khai mới > Loại: Ứng dụng web
 *       Thực thi với tư cách: Tôi
 *       Ai có quyền truy cập: Bất kỳ ai
 *     > Triển khai > cấp quyền > copy "URL ứng dụng web" (…/exec).
 *  4. Trong app Chấm công: ⚙️ > dán URL + mã bí mật > Lưu & đồng bộ.
 *
 * Dữ liệu lưu thành file "cham-cong-du-lieu.json" trong Google Drive của anh,
 * mỗi lần lưu giữ thêm 1 bản sao lưu theo ngày (thư mục "cham-cong-sao-luu").
 */

var MA_BI_MAT = 'doi-ma-nay-di-123';
var TEN_FILE = 'cham-cong-du-lieu.json';
var THU_MUC_SAO_LUU = 'cham-cong-sao-luu';

function doGet() {
  return json_({ ok: true, msg: 'May chu cham cong dang chay' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (String(req.khoa || '') !== MA_BI_MAT) {
      Utilities.sleep(1000);
      return json_({ ok: false, err: 'Sai mã bí mật' });
    }
    if (req.action === 'lay') {
      var f = file_(false);
      return json_({ ok: true, data: f ? JSON.parse(f.getBlob().getDataAsString('UTF-8') || 'null') : null });
    }
    if (req.action === 'luu') {
      if (!req.data || !req.data.v) return json_({ ok: false, err: 'Thiếu dữ liệu' });
      var cu = file_(false);
      var moi = JSON.stringify(req.data);
      if (cu) {
        saoLuuTheoNgay_(cu);
        cu.setContent(moi);
      } else {
        DriveApp.createFile(TEN_FILE, moi, 'application/json');
      }
      return json_({ ok: true });
    }
    return json_({ ok: false, err: 'Lệnh không hợp lệ' });
  } catch (err) {
    return json_({ ok: false, err: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function file_(taoMoi) {
  var it = DriveApp.getFilesByName(TEN_FILE);
  return it.hasNext() ? it.next() : null;
}

/** Mỗi ngày giữ 1 bản sao lưu (bản đầu tiên trong ngày). */
function saoLuuTheoNgay_(f) {
  var ngay = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  var ten = 'cham-cong-' + ngay + '.json';
  var it = DriveApp.getFoldersByName(THU_MUC_SAO_LUU);
  var dir = it.hasNext() ? it.next() : DriveApp.createFolder(THU_MUC_SAO_LUU);
  if (!dir.getFilesByName(ten).hasNext()) dir.createFile(ten, f.getBlob().getDataAsString('UTF-8'), 'application/json');
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
