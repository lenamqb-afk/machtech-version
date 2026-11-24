/**
 * MÁY CHỦ CHẤM CÔNG – Google Apps Script (miễn phí)
 *
 * - Máy QUẢN LÝ đồng bộ toàn bộ dữ liệu (cần MA_BI_MAT).
 * - Máy NHÂN VIÊN chấm công bằng mã NV + PIN, máy chủ kiểm tra toạ độ công trình.
 *
 * Cài đặt:
 *  1. Vào https://script.google.com > Dự án mới > xóa hết, dán toàn bộ file này.
 *  2. Đổi MA_BI_MAT bên dưới thành mã riêng của anh (dài, khó đoán). Chỉ máy quản lý dùng mã này.
 *  3. Bấm Triển khai > Tùy chọn triển khai mới > Loại: Ứng dụng web
 *       Thực thi với tư cách: Tôi
 *       Ai có quyền truy cập: Bất kỳ ai
 *     > Triển khai > cấp quyền > copy "URL ứng dụng web" (…/exec).
 *  4. Trong app Chấm công (máy quản lý): ⚙️ > dán URL + mã bí mật > Lưu & đồng bộ.
 *
 * Khi sửa file này: Triển khai > Quản lý triển khai > ✏️ > Phiên bản: Mới > Triển khai (giữ nguyên URL).
 *
 * Dữ liệu lưu thành file "cham-cong-du-lieu.json" trong Google Drive của anh,
 * mỗi ngày giữ 1 bản sao lưu trong thư mục "cham-cong-sao-luu".
 */

var MA_BI_MAT = 'doi-ma-nay-di-123';
var TEN_FILE = 'cham-cong-du-lieu.json';
var THU_MUC_SAO_LUU = 'cham-cong-sao-luu';
var TZ = 'Asia/Ho_Chi_Minh';

function doGet() {
  return json_({ ok: true, msg: 'May chu cham cong dang chay' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var fn = API[req.action];
    if (!fn) return json_({ ok: false, err: 'Lệnh không hợp lệ' });
    return json_(fn(req));
  } catch (err) {
    return json_({ ok: false, err: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

var API = {
  /* ----- máy quản lý ----- */
  dongBo: function (r) {
    kiemTraQL_(r.khoa);
    var d = doc_();
    if (r.data && r.data.v) d = gop_(d, r.data);
    ghi_(d);
    return { ok: true, data: d, gioMayChu: Date.now() };
  },

  /* ----- máy nhân viên ----- */
  nvDangNhap: function (r) {
    var d = doc_(), nv = timNV_(d, r.ma, r.pin);
    return { ok: true, nv: congKhaiNV_(d, nv) };
  },

  nvCham: function (r) {
    var d = doc_(), nv = timNV_(d, r.ma, r.pin);
    var kq = [], ds = r.ds || [];
    ds.forEach(function (x) { kq.push(ghiCham_(d, nv, x)); });
    ghi_(d);
    var loi = kq.filter(function (k) { return !k.ok; });
    return { ok: true, kq: kq, nv: congKhaiNV_(d, nv), loi: loi.length };
  },

  nvLichSu: function (r) {
    var d = doc_(), nv = timNV_(d, r.ma, r.pin), th = String(r.thang || '');
    var cc = (d.cc || []).filter(function (x) { return !x.xoa && x.nvId === nv.id && x.ngay.indexOf(th) === 0; });
    var cong = {};
    Object.keys(d.cong || {}).forEach(function (k) {
      if (k.indexOf(nv.id + '|' + th) === 0) cong[k] = d.cong[k];
    });
    return { ok: true, cc: cc, cong: cong, nv: congKhaiNV_(d, nv) };
  }
};

/* Ghi 1 lần chấm của nhân viên. x = {id, loai, lat, lng, acc, tgMay, offline} */
function ghiCham_(d, nv, x) {
  d.cc = d.cc || [];
  if (x.id && d.cc.some(function (c) { return c.id === x.id; })) return { id: x.id, ok: true, trung: true };
  var g = timNhom_(d, nv.nhomId) || {};
  var lat = Number(x.lat), lng = Number(x.lng), coGps = x.lat != null && x.lat !== '' && isFinite(lat) && isFinite(lng);
  var kc = null, ok = true, gc = [];
  if (g.viDo !== undefined && g.viDo !== '' && g.viDo !== null) {
    if (!coGps) { ok = false; gc.push('Không có GPS'); }
    else {
      kc = Math.round(khoangCach_(lat, lng, Number(g.viDo), Number(g.kinhDo)));
      if (kc > Number(g.banKinh || 150)) { ok = false; gc.push('Ngoài công trình ' + kc + ' m'); }
    }
  }
  // Chấm trực tuyến ngoài vùng: từ chối, không ghi
  if (!ok && !x.offline) return { id: x.id, ok: false, err: gc.join(', ') + ' (cho phép ' + (g.banKinh || 150) + ' m). Chưa chấm công.' };

  var tg;
  if (x.offline && x.tgMay) {
    tg = Utilities.formatDate(new Date(Number(x.tgMay)), TZ, 'yyyy-MM-dd HH:mm:ss');
    gc.push('Chấm khi mất mạng (giờ điện thoại)');
  } else {
    tg = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
  }
  if (coGps && Number(x.acc) > 150) gc.push('GPS kém ±' + Math.round(x.acc) + ' m');
  var rec = {
    id: x.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
    nvId: nv.id, loai: x.loai === 'RA' ? 'RA' : 'VAO', tg: tg, ngay: tg.slice(0, 10),
    lat: coGps ? lat : null, lng: coGps ? lng : null, acc: x.acc ? Math.round(x.acc) : null,
    kc: kc, ok: ok, offline: !!x.offline, gc: gc.join(', '), upd: Date.now()
  };
  d.cc.push(rec);
  return { id: rec.id, ok: ok, tg: tg, kc: kc, gc: rec.gc, err: ok ? '' : rec.gc };
}

/* ---------- dữ liệu ---------- */
function file_() {
  var it = DriveApp.getFilesByName(TEN_FILE);
  return it.hasNext() ? it.next() : null;
}
function doc_() {
  var f = file_();
  var d = f ? JSON.parse(f.getBlob().getDataAsString('UTF-8') || 'null') : null;
  return d && d.v ? d : { v: 1, nhom: [], nv: [], cong: {}, gd: [], cc: [] };
}
function ghi_(d) {
  var f = file_(), s = JSON.stringify(d);
  if (f) { saoLuuTheoNgay_(f); f.setContent(s); }
  else DriveApp.createFile(TEN_FILE, s, 'application/json');
}
/** Gộp: bản ghi nào sửa sau cùng (upd lớn hơn) thì thắng. */
function gop_(a, b) {
  ['nhom', 'nv', 'gd', 'cc'].forEach(function (k) {
    var m = {};
    (a[k] || []).forEach(function (x) { m[x.id] = x; });
    (b[k] || []).forEach(function (x) { if (!m[x.id] || (x.upd || 0) > (m[x.id].upd || 0)) m[x.id] = x; });
    a[k] = Object.keys(m).map(function (i) { return m[i]; });
  });
  a.cong = a.cong || {};
  Object.keys(b.cong || {}).forEach(function (k) {
    var x = a.cong[k], y = b.cong[k];
    if (!x || (y.upd || 0) > (x.upd || 0)) a.cong[k] = y;
  });
  return a;
}
function saoLuuTheoNgay_(f) {
  var ten = 'cham-cong-' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd') + '.json';
  var it = DriveApp.getFoldersByName(THU_MUC_SAO_LUU);
  var dir = it.hasNext() ? it.next() : DriveApp.createFolder(THU_MUC_SAO_LUU);
  if (!dir.getFilesByName(ten).hasNext()) dir.createFile(ten, f.getBlob().getDataAsString('UTF-8'), 'application/json');
}

/* ---------- tiện ích ---------- */
function kiemTraQL_(khoa) {
  if (String(khoa || '') !== MA_BI_MAT) { Utilities.sleep(1000); throw new Error('Sai mã bí mật'); }
}
function timNhom_(d, id) {
  return (d.nhom || []).filter(function (g) { return g.id === id && !g.xoa; })[0];
}
function timNV_(d, ma, pin) {
  ma = String(ma || '').trim().toUpperCase();
  var nv = (d.nv || []).filter(function (n) { return !n.xoa && String(n.ma || '').toUpperCase() === ma; })[0];
  if (!nv || String(nv.pin || '') === '' || String(nv.pin) !== String(pin || '').trim()) {
    Utilities.sleep(800); throw new Error('Sai mã nhân viên hoặc mã PIN');
  }
  if (nv.tamNgung) throw new Error('Tài khoản đang tạm ngừng, liên hệ quản lý');
  return nv;
}
function congKhaiNV_(d, nv) {
  var g = timNhom_(d, nv.nhomId) || {};
  return { id: nv.id, ma: nv.ma, ten: nv.ten, nhom: g.ten || '', viDo: g.viDo, kinhDo: g.kinhDo,
           banKinh: g.banKinh || 150, gioNua: g.gioNua || 5 };
}
function khoangCach_(lat1, lng1, lat2, lng2) {
  var R = 6371000, r = Math.PI / 180;
  var dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
