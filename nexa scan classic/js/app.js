/* ══════════════════════════════════════════
   APP SWITCHING
══════════════════════════════════════════ */
function switchApp(app) {
  ['qrix','barix','decode','performance','history'].forEach(a => {
    const sec = document.getElementById('app-' + a);
    const tab = document.getElementById('tab-' + a);
    if (sec) sec.classList.toggle('active', app === a);
    if (tab) tab.classList.toggle('active', app === a);
  });
  if (app === 'history') renderHistory('all');
}

/* ══════════════════════════════════════════
   THEME
══════════════════════════════════════════ */
const THEME_NAMES = {
  ivory: 'Ivory',
  obsidian: 'Obsidian',
  slate: 'Slate',
  parchment: 'Parchment',
  emerald: 'Emerald'
};

function setTheme(theme, optEl) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('studio-theme', theme);
  document.getElementById('themeBtnLabel').textContent = THEME_NAMES[theme] || theme;
  document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
  if (optEl) optEl.classList.add('active');
  else {
    const el = document.querySelector(`.theme-opt[data-theme="${theme}"]`);
    if (el) el.classList.add('active');
  }
  closeThemePanel();
}

function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  const btn = document.getElementById('themePaletteBtn');
  panel.classList.toggle('open');
  btn.classList.toggle('theme-panel-open');
}

function closeThemePanel() {
  document.getElementById('themePanel').classList.remove('open');
  document.getElementById('themePaletteBtn').classList.remove('theme-panel-open');
}

document.addEventListener('click', function(e) {
  const panel = document.getElementById('themePanel');
  const btn = document.getElementById('themePaletteBtn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) closeThemePanel();
});

(function(){
  const saved = localStorage.getItem('studio-theme') || 'ivory';
  setTheme(saved, null);
})();

/* ══════════════════════════════════════════
   QR — SIDEBAR / MODE
══════════════════════════════════════════ */
let currentType = 'url';
let lastQRData = '';

function selectType(type, el) {
  currentType = type;
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
  document.getElementById('form-' + type).classList.add('active');
}

/* ══════════════════════════════════════════
   QR — HELPERS
══════════════════════════════════════════ */
function v(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function syncHex(cid, hid) { document.getElementById(hid).value = document.getElementById(cid).value; }
function syncColor(hid, cid) { const val = document.getElementById(hid).value; if (/^#[0-9a-fA-F]{6}$/.test(val)) document.getElementById(cid).value = val; }

function deepPresetChanged() {
  const map = { spotify: 'spotify:track:', youtube: 'https://youtu.be/', instagram: 'instagram://user?username=', twitter: 'twitter://user?screen_name=', amazon: 'https://www.amazon.com/dp/' };
  const p = document.getElementById('deepPreset').value;
  if (map[p]) document.getElementById('deepUrl').value = map[p];
}

const FREELANCE_PREFIXES = { upwork:'https://www.upwork.com/freelancers/', fiverr:'https://www.fiverr.com/', freelancer:'https://www.freelancer.com/u/', linkedin:'https://www.linkedin.com/in/', behance:'https://www.behance.net/', dribbble:'https://dribbble.com/', github:'https://github.com/' };
function freelancePlatformChanged() {
  const p = document.getElementById('freelancePlatform').value;
  const input = document.getElementById('freelanceUrl');
  if (p !== 'custom' && FREELANCE_PREFIXES[p]) {
    input.placeholder = FREELANCE_PREFIXES[p] + 'your-username';
    if (!input.value) input.value = FREELANCE_PREFIXES[p];
  } else { input.placeholder = 'https://yourprofile.com'; }
}

const MEDIA_HINTS = { image:{label:'Image File URL',placeholder:'https://yoursite.com/photo.jpg'}, video:{label:'Video File URL',placeholder:'https://yoursite.com/video.mp4'}, audio:{label:'Audio File URL',placeholder:'https://yoursite.com/track.mp3'}, youtube:{label:'YouTube Video URL',placeholder:'https://www.youtube.com/watch?v=...'}, drive:{label:'Cloud File URL',placeholder:'https://drive.google.com/file/d/...'} };
function mediaTypeChanged() {
  const t = document.getElementById('mediaType').value;
  const h = MEDIA_HINTS[t] || MEDIA_HINTS['image'];
  document.getElementById('mediaUrlLabel').textContent = h.label;
  document.getElementById('mediaUrl').placeholder = h.placeholder;
}

/* ══════════════════════════════════════════
   QR — DATA BUILDER
══════════════════════════════════════════ */
function getQRData() {
  const enc = encodeURIComponent, esc = s => s.replace(/[\\;,"]/g,'\\$&');
  switch (currentType) {
    case 'url':    return v('urlInput') || 'https://example.com';
    case 'text':   return v('textInput');
    case 'phone':  return 'tel:' + v('phoneInput');
    case 'email': {
      const e = v('emailTo'), s = v('emailSubj'), b = v('emailBody');
      let uri = 'mailto:' + e; const p = [];
      if (s) p.push('subject=' + enc(s));
      if (b) p.push('body=' + enc(b));
      if (p.length) uri += '?' + p.join('&');
      return uri;
    }
    case 'wifi': return `WIFI:T:${v('wifiSec')};S:${esc(v('wifiSSID'))};P:${esc(v('wifiPass'))};H:${v('wifiHidden')};;`;
    case 'vcard': {
      const fn = [v('vcFirst'), v('vcLast')].filter(Boolean).join(' ');
      return ['BEGIN:VCARD','VERSION:3.0',`FN:${fn}`,`N:${v('vcLast')};${v('vcFirst')};;;`,
        v('vcOrg') ? `ORG:${v('vcOrg')}` : '',v('vcTitle') ? `TITLE:${v('vcTitle')}` : '',
        v('vcPhone') ? `TEL;TYPE=CELL:${v('vcPhone')}` : '',v('vcEmail') ? `EMAIL:${v('vcEmail')}` : '',
        v('vcWeb') ? `URL:${v('vcWeb')}` : '',v('vcAddr') ? `ADR;TYPE=WORK:;;${v('vcAddr')};;;;` : '',
        'END:VCARD'].filter(Boolean).join('\n');
    }
    case 'sms': { const n = v('smsNum').replace(/\s/g,''), m = v('smsMsg'); return m ? `sms:${n}?body=${enc(m)}` : `sms:${n}`; }
    case 'whatsapp': { const n = v('waNum').replace(/[\s+\-()]/g,''), m = v('waMsg'); return m ? `https://wa.me/${n}?text=${enc(m)}` : `https://wa.me/${n}`; }
    case 'calendar': {
      const toICS = d => d ? new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z' : '';
      return ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`SUMMARY:${v('calTitle')}`,
        v('calStart') ? `DTSTART:${toICS(v('calStart'))}` : '',v('calEnd') ? `DTEND:${toICS(v('calEnd'))}` : '',
        v('calLoc') ? `LOCATION:${v('calLoc')}` : '',v('calDesc') ? `DESCRIPTION:${v('calDesc')}` : '',
        'END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\n');
    }
    case 'location': { const la = v('geoLat'), lo = v('geoLng'), lb = v('geoLabel'); return lb ? `geo:${la},${lo}?q=${la},${lo}(${enc(lb)})` : `geo:${la},${lo}`; }
    case 'review': return v('reviewUrl');
    case 'pdf': return v('pdfUrl');
    case 'media': return v('mediaUrl') || null;
    case 'freelance': return v('freelanceUrl') || null;
    case 'upi': {
      let uri = `upi://pay?pa=${enc(v('upiId'))}&pn=${enc(v('upiName'))}&cu=${v('upiCurr')}`;
      if (v('upiAmt')) uri += `&am=${v('upiAmt')}`;
      if (v('upiNote')) uri += `&tn=${enc(v('upiNote'))}`;
      return uri;
    }
    case 'crypto': {
      const coin = v('cryptoCoin'), addr = v('cryptoAddr'), amt = v('cryptoAmt'), lbl = v('cryptoLabel');
      if (coin === 'ethereum') return `ethereum:${addr}${amt ? `?value=${amt}` : ''}`;
      let uri = `${coin}:${addr}`; const p = [];
      if (amt) p.push(`amount=${amt}`);
      if (lbl) p.push(`label=${enc(lbl)}`);
      if (p.length) uri += '?' + p.join('&');
      return uri;
    }
    case 'deeplink': return v('deepUrl') || v('deepFallback');
    case 'otp': return `otpauth://totp/${enc(v('otpIssuer'))}:${enc(v('otpAccount'))}?secret=${v('otpSecret').replace(/\s/g,'')}&issuer=${enc(v('otpIssuer'))}&algorithm=${v('otpAlgo')}&period=${v('otpPeriod')}`;
    case 'json': { try { JSON.parse(v('jsonInput')); return v('jsonInput'); } catch(e) { toast('Invalid JSON — check your syntax'); return null; } }
    case 'custom': { const prefix = v('customPrefix'), data = v('customData'); if (!data) return null; return prefix ? prefix + data : data; }
    default: return '';
  }
}

/* ══════════════════════════════════════════
   QR — GENERATE
══════════════════════════════════════════ */
function generateQR() {
  try {
    const data = getQRData();
    if (!data || !data.trim()) { toast('Please enter data before generating QR code'); return; }
    const sizeEl = document.getElementById('qrSize');
    const size = sizeEl ? parseInt(sizeEl.value) || 256 : 256;
    const darkEl = document.getElementById('darkColor');
    const lightEl = document.getElementById('lightColor');
    const dark = darkEl ? darkEl.value : '#000000';
    const light = lightEl ? lightEl.value : '#ffffff';
    const el = document.getElementById('qrcode');
    if (!el) { toast('Failed to generate QR code'); return; }
    el.innerHTML = '';
    try {
      new QRCode(el, { text: data, width: size, height: size, colorDark: dark, colorLight: light, correctLevel: QRCode.CorrectLevel[v('qrEcc')] || QRCode.CorrectLevel.M });
    } catch(e) {
      toast('Content too large — try XL size or High error correction'); return;
    }
    lastQRData = data;
    const qrMeta = document.getElementById('qrMeta');
    if (qrMeta) qrMeta.style.display = 'block';
    const qrMetaType = document.getElementById('qrMetaType');
    if (qrMetaType) qrMetaType.textContent = document.querySelector(`.sidebar-item[data-type="${currentType}"]`)?.textContent?.trim() || currentType;
    const qrMetaData = document.getElementById('qrMetaData');
    if (qrMetaData) qrMetaData.textContent = data.length > 64 ? data.slice(0, 64) + '…' : data;
    const shareDataInput = document.getElementById('shareDataInput');
    if (shareDataInput) shareDataInput.value = data;
    addToHistory({ type: 'qrix', label: document.querySelector(`.sidebar-item[data-type="${currentType}"]`)?.textContent?.trim() || currentType, data: data, ts: Date.now(), source: 'generate' });
    toast('QR code generated ✓');
  } catch(e) {
    toast('Failed to generate QR code — please try again');
  }
}

/* ══════════════════════════════════════════
   QR — DOWNLOAD / COPY
══════════════════════════════════════════ */
function downloadQR() {
  const c = document.querySelector('#qrcode canvas');
  if (!c) { toast('Generate a QR code first'); return; }
  const a = document.createElement('a'); a.download = `qrix-${currentType}.png`; a.href = c.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); toast('PNG saved');
}
function downloadSVG() {
  const c = document.querySelector('#qrcode canvas');
  if (!c) { toast('Generate a QR code first'); return; }
  const s = c.width, ctx = c.getContext('2d'), d = ctx.getImageData(0,0,s,s).data;
  let r = '';
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { const i = (y*s+x)*4; if (d[i] < 128) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  const dk = document.getElementById('darkColor').value, lt = document.getElementById('lightColor').value;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}"><rect width="${s}" height="${s}" fill="${lt}"/><g fill="${dk}">${r}</g></svg>`;
  const a = document.createElement('a'); a.download = `qrix-${currentType}.svg`; const url = URL.createObjectURL(new Blob([svg], {type:'image/svg+xml'})); a.href = url; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('SVG saved');
}
function copyQRData() { if (!lastQRData) { toast('Generate a QR code first'); return; } _clipboardCopy(lastQRData); }
async function copyQRImage() {
  const c = document.querySelector('#qrcode canvas');
  if (!c) { toast('Generate a QR code first'); return; }
  const copyDataFallback = () => {
    if (lastQRData && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(lastQRData).then(() => { toast('QR data copied ✓'); return true; });
    }
    return Promise.resolve(false);
  };
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      const copied = await copyDataFallback();
      if (!copied) toast('Copy not supported — use Download');
      return;
    }
    c.toBlob(async blob => {
      try {
        await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
        toast('Image copied ✓');
      } catch(e) {
        const copied = await copyDataFallback().catch(() => false);
        if (!copied) toast('Copy not supported — use Download');
      }
    });
  }
  catch(e) { toast('Copy not supported — use Download'); }
}
async function shareNative() {
  const c = document.querySelector('#qrcode canvas');
  if (!c) { toast('Generate a QR code first'); return; }
  if (!navigator.share) { downloadQR(); closeShareModal(); return; }
  try { c.toBlob(async blob => { const file = new File([blob], `qrix-${currentType}.png`, { type: 'image/png' }); await navigator.share({ title: 'QR Code', files: [file] }); }); }
  catch(e) { if (e.name !== 'AbortError') toast('Share failed — try Download'); }
}

/* ══════════════════════════════════════════
   QR — SHARE MODAL
══════════════════════════════════════════ */
function openShareModal() { if (!lastQRData) { toast('Generate a QR code first'); return; } document.getElementById('shareDataInput').value = lastQRData; document.getElementById('shareModal').classList.add('open'); }
function closeShareModal() { document.getElementById('shareModal').classList.remove('open'); }
function closeShareModalOutside(e) { if (e.target === document.getElementById('shareModal')) closeShareModal(); }
function copyShareData() { const val = document.getElementById('shareDataInput')?.value; if (!val) { toast('Nothing to copy'); return; } _clipboardCopy(val); }

/* ══════════════════════════════════════════
   QR — DECODE
══════════════════════════════════════════ */
function readQR(e) {
  const file = e.target.files[0]; if (!file) return;
  try {
    const reader = new FileReader();
    reader.onerror = () => { toast('Scanning failed. Please try again'); };
    reader.onload = ev => {
      try {
        const prev = document.getElementById('qrDecodePreview');
        const prevWrap = document.getElementById('qrDecodePreviewWrap');
        if (prev) { prev.src = ev.target.result; prevWrap.style.display = 'block'; }

        const img = new Image();
        img.onerror = () => { toast('Scanning failed. Please try again'); };
        img.onload = () => {
          try {
            const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
            const ctx = c.getContext('2d'); ctx.drawImage(img,0,0);
            const imageData = ctx.getImageData(0,0,c.width,c.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {inversionAttempts:'dontInvert'});
            const res = document.getElementById('readResult'), sta = document.getElementById('readStatus'), txt = document.getElementById('readText');
            if (!res || !sta || !txt) return;
            res.classList.add('show');
            if (code) {
              sta.textContent = '✓  QR Code Decoded'; sta.className = 'result-status'; txt.textContent = code.data;
              const saveBtn = document.getElementById('btnSaveQrHistory');
              if (saveBtn) saveBtn.style.display = 'inline-block';
              addToHistory({ type: 'qrix', label: 'QR Decode', data: code.data, ts: Date.now(), source: 'decode' });
            } else {
              sta.textContent = '✗  No QR Code Found'; sta.className = 'result-status error';
              txt.textContent = 'Could not decode a QR code. Try a clearer, higher-contrast image.';
              const saveBtn = document.getElementById('btnSaveQrHistory');
              if (saveBtn) saveBtn.style.display = 'none';
            }
          } catch(err) {
            toast('Scanning failed. Please try again');
          }
        };
        img.src = ev.target.result;
      } catch(err) {
        toast('Scanning failed. Please try again');
      }
    };
    reader.readAsDataURL(file);
  } catch(err) {
    toast('Scanning failed. Please try again');
  }
}
function copyResult() {
  const el = document.getElementById('readText');
  if (!el) return;
  _clipboardCopy(el.textContent);
}
function _clipboardCopy(text) {
  if (!text) { toast('Nothing to copy'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast('Copied ✓')).catch(() => _clipboardFallback(text));
  } else {
    _clipboardFallback(text);
  }
}
function _clipboardFallback(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Copied ✓');
  } catch(e) {
    toast('Copy failed — please copy manually');
  }
}

/* ══════════════════════════════════════════
   DECODE — SWITCH PANEL
══════════════════════════════════════════ */
function switchDecodeMode(mode, btn) {
  document.querySelectorAll('#app-decode .format-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('decode-panel-qr').style.display = 'block';
}

/* ══════════════════════════════════════════
   DECODE — DRAG & DROP
══════════════════════════════════════════ */
function handleDragOver(e, zoneId) {
  e.preventDefault();
  document.getElementById(zoneId).style.borderColor = 'var(--ink2)';
  document.getElementById(zoneId).style.background = 'var(--gold-dim)';
}
function handleDragLeave(zoneId) {
  document.getElementById(zoneId).style.borderColor = '';
  document.getElementById(zoneId).style.background = '';
}
function handleQRDrop(e) {
  e.preventDefault();
  handleDragLeave('qrDropZone');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) readQR({ target: { files: [file] } });
}

/* ══════════════════════════════════════════
   DECODE — BARCODE READER (pixel analysis)
══════════════════════════════════════════ */

function tryDecodeBarcode(canvas, ctx) {
  const w = canvas.width, h = canvas.height;
  if (w < 50 || h < 50) return null;
  
  // Sample multiple rows to find barcode
  const rows = [
    Math.floor(h * 0.25),
    Math.floor(h * 0.35),
    Math.floor(h * 0.5),
    Math.floor(h * 0.65),
    Math.floor(h * 0.75)
  ];

  for (const row of rows) {
    const imageData = ctx.getImageData(0, row, w, 1);
    const data = imageData.data;

    // Adaptive threshold
    let sum = 0, count = 0;
    for (let x = 0; x < w; x++) {
      sum += (data[x*4] * 0.299 + data[x*4+1] * 0.587 + data[x*4+2] * 0.114);
      count++;
    }
    const threshold = sum / count;

    // Binary conversion
    let bits = '';
    for (let x = 0; x < w; x++) {
      const brightness = (data[x*4] * 0.299 + data[x*4+1] * 0.587 + data[x*4+2] * 0.114);
      bits += brightness < threshold ? '1' : '0';
    }

    if (bits.length < 30) continue;

    // Try multiple decode strategies
    let decoded = decodeEANUPC(bits);
    if (decoded) return decoded;

    decoded = decodeCode128(bits);
    if (decoded) return decoded;

    decoded = decodeCode39(bits);
    if (decoded) return decoded;
  }
  return null;
}

function barcodeFormatName(fmt) {
  const names = {0:'Aztec',1:'CODABAR',2:'CODE 39',3:'CODE 93',4:'CODE 128',5:'Data Matrix',6:'EAN-8',7:'EAN-13',8:'ITF',10:'PDF417',11:'QR Code',14:'UPC-A',15:'UPC-E'};
  return names[fmt] || String(fmt || 'Barcode').replace(/_/g, ' ').toUpperCase();
}

function prepareBarcodeDecodeCanvas(canvas, ctx) {
  try {
    const w = canvas.width, h = canvas.height;
    if (!w || !h) return canvas;
    let minY = h, maxY = -1;
    for (let y = 0; y < h; y++) {
      const row = ctx.getImageData(0, y, w, 1).data;
      let dark = 0;
      for (let x = 0; x < w; x++) {
        const i = x * 4;
        const brightness = row[i] * 0.299 + row[i + 1] * 0.587 + row[i + 2] * 0.114;
        if (brightness < 120) dark++;
      }
      if (dark / w > 0.08) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxY <= minY) return canvas;
    const margin = 8;
    minY = Math.max(0, minY - margin);
    maxY = Math.min(h - 1, maxY + margin);
    const cropH = maxY - minY + 1;
    if (cropH < 24 || cropH >= h - 4) return canvas;
    const out = document.createElement('canvas');
    out.width = w;
    out.height = cropH;
    out.getContext('2d').drawImage(canvas, 0, minY, w, cropH, 0, 0, w, cropH);
    return out;
  } catch(e) {
    return canvas;
  }
}

function decodeBarcodeWithZXing(canvas) {
  try {
    if (!window.ZXing || !window.ZXing.MultiFormatReader) return null;
    const zx = window.ZXing;
    const hints = new Map();
    hints.set(zx.DecodeHintType.TRY_HARDER, true);
    hints.set(zx.DecodeHintType.POSSIBLE_FORMATS, [
      zx.BarcodeFormat.CODE_128,
      zx.BarcodeFormat.CODE_39,
      zx.BarcodeFormat.CODE_93,
      zx.BarcodeFormat.EAN_13,
      zx.BarcodeFormat.EAN_8,
      zx.BarcodeFormat.UPC_A,
      zx.BarcodeFormat.UPC_E,
      zx.BarcodeFormat.ITF,
      zx.BarcodeFormat.CODABAR
    ]);
    const reader = new zx.MultiFormatReader(hints);
    const luminance = new zx.HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new zx.BinaryBitmap(new zx.HybridBinarizer(luminance));
    const result = reader.decode(bitmap);
    if (result && result.getText) {
      return { value: result.getText(), format: barcodeFormatName(result.getBarcodeFormat && result.getBarcodeFormat()) };
    }
  } catch(e) {}
  return null;
}

function decodeEANUPC(bits) {
  // EAN/UPC L-codes and R-codes for digit patterns
  const L = {
    '0001101': '0', '0011001': '1', '0010011': '2', '0111101': '3', '0100011': '4',
    '0110001': '5', '0101111': '6', '0111011': '7', '0110111': '8', '0001011': '9'
  };
  
  const R = {
    '1110010': '0', '1100110': '1', '1101100': '2', '1000010': '3', '1011100': '4',
    '1001110': '5', '1010000': '6', '1000100': '7', '1001000': '8', '1110100': '9'
  };

  let digits = '';
  
  // Try every possible 7-bit window
  for (let start = 0; start <= bits.length - 7 && digits.length < 20; start++) {
    const pattern = bits.substring(start, start + 7);
    const digit = L[pattern] || R[pattern];
    
    if (digit) {
      digits += digit;
      start += 6; // Skip ahead to avoid overlaps
    }
  }

  // Only return checksum-valid retail codes. The loose pixel fallback should
  // never report random barcode stripes as a retail value.
  const candidates = [
    { len: 13, format: 'EAN-13', body: 12 },
    { len: 12, format: 'UPC-A', body: 11 },
    { len: 8, format: 'EAN-8', body: 7 }
  ];
  for (const cand of candidates) {
    if (digits.length >= cand.len) {
      const value = digits.substring(0, cand.len);
      if (/^\d+$/.test(value) && eanCheckDigit(value.substring(0, cand.body)) === value[cand.body]) {
        return { value, format: cand.format };
      }
    }
  }

  return null;
}

function decodeCode128(bits) {
  // CODE 128: 11-bit patterns
  // Simplified: look for digit patterns
  
  if (bits.length < 40) return null;

  // Extract digit-like patterns (simplified)
  let digits = '';
  for (let i = 0; i <= bits.length - 11; i += 11) {
    const pattern = bits.substring(i, i + 11);
    const val = parseInt(pattern.substring(0, 7), 2);
    if (val >= 48 && val <= 57) { // ASCII digits
      digits += String.fromCharCode(val);
    } else {
      const digit = val % 10;
      digits += digit;
    }
  }

  if (digits.length >= 3 && /^\d+$/.test(digits)) {
    return { value: digits.substring(0, 20), format: 'CODE 128' };
  }

  return null;
}

function decodeCode39(bits) {
  // CODE 39: 9-bit patterns (5 bars + 4 spaces)
  
  if (bits.length < 40) return null;

  let digits = '';
  
  // Extract 9-bit patterns
  for (let i = 0; i <= bits.length - 9; i += 9) {
    const pattern = bits.substring(i, i + 9);
    const ones = (pattern.match(/1/g) || []).length;
    
    // CODE 39 has odd parity
    if (ones % 2 === 1) {
      const val = parseInt(pattern, 2) % 10;
      digits += val;
    }
  }

  if (digits.length >= 3 && /^\d+$/.test(digits)) {
    return { value: digits.substring(0, 20), format: 'CODE 39' };
  }

  return null;
}


function saveToQrixHistory() { toast('Saved to history ✓'); }
const HISTORY_KEY = 'nexascan-history';
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(arr) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 200))); } catch {}
}
function addToHistory(entry) {
  const arr = getHistory();
  arr.unshift(entry);
  saveHistory(arr);
}

function switchHistoryTab(tab, btn) {
  _currentHistTab = tab;
  document.querySelectorAll('#app-history .format-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHistory(tab);
}

function clearHistory() {
  if (!confirm('Clear all history? This cannot be undone.')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory(_currentHistTab);
  toast('History cleared');
}

function renderHistory(tab) {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  if (!list) return;
  const fullHistory = getHistory();
  let filtered = fullHistory.map((h, originalIdx) => ({ ...h, _origIdx: originalIdx }));
  if (tab === 'qrix') filtered = filtered.filter(h => h.type === 'qrix');
  else if (tab === 'barix') filtered = filtered.filter(h => h.type === 'barix');

  if (filtered.length === 0) {
    list.innerHTML = ''; empty.style.display = 'block'; return;
  }
  empty.style.display = 'none';

  list.innerHTML = filtered.map((h) => {
    const origIdx = h._origIdx;
    const date = new Date(h.ts).toLocaleString();
    const icon = h.type === 'qrix' ? '⬛' : '▮▯▮';
    const tagColor = h.type === 'qrix' ? 'var(--accent)' : '#6b8cda';
    const shortData = h.data && h.data.length > 80 ? h.data.slice(0,80) + '…' : (h.data || '');
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--border2)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:20px;margin-top:2px;flex-shrink:0;">${icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
          <span style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;border:1px solid;border-radius:3px;padding:2px 7px;color:${tagColor};border-color:${tagColor};opacity:0.85;">${h.label || h.type}</span>
          ${h.source === 'decode' ? '<span style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink3);">decoded</span>' : ''}
          <span style="font-size:10px;color:var(--ink3);margin-left:auto;">${date}</span>
        </div>
        <div style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--ink);word-break:break-all;line-height:1.6;">${shortData}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
        <button onclick="copyHistoryItem(${origIdx})" style="padding:5px 10px;background:none;border:1px solid var(--border2);border-radius:5px;font-family:\'DM Sans\',sans-serif;font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink2);cursor:pointer;transition:all 0.14s;" onmouseover="this.style.borderColor='var(--ink)';this.style.color='var(--ink)'" onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--ink2)'">⎘ Copy</button>
        <button onclick="deleteHistoryItem(${origIdx})" style="padding:5px 10px;background:none;border:1px solid var(--border2);border-radius:5px;font-family:\'DM Sans\',sans-serif;font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);cursor:pointer;transition:all 0.14s;" onmouseover="this.style.borderColor='#cc3333';this.style.color='#cc3333'" onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--ink3)'">✕</button>
      </div>
    </div>`;
  }).join('');
}

function copyHistoryItem(idx) {
  const all = getHistory();
  if (all[idx]) _clipboardCopy(all[idx].data || '');
}
function deleteHistoryItem(idx) {
  const all = getHistory();
  all.splice(idx, 1);
  saveHistory(all);
  renderHistory(_currentHistTab);
  toast('Entry removed');
}

/* ══════════════════════════════════════════
   BARIX — FORMAT INFO
══════════════════════════════════════════ */
const FORMAT_INFO = {
  CODE128: { label: 'Value', placeholder: 'e.g. HELLO-12345', desc: '<strong>CODE 128</strong> — High-density variable-length alphanumeric barcode. Supports full ASCII. Used universally across retail, shipping, and inventory.', validate: v => v.length > 0 ? '' : 'Enter a value', checkDigit: false },
  CODE39: { label: 'Value (A-Z, 0-9, - . $ / + % space)', placeholder: 'e.g. CODE-39', desc: '<strong>CODE 39</strong> — Alphanumeric barcode supporting A–Z, 0–9, and special characters. Common in automotive, defence, and healthcare.', validate: v => /^[A-Z0-9\-. $/+%]+$/i.test(v) ? '' : 'Only A–Z, 0–9, and - . $ / + % space allowed', checkDigit: false },
  CODE93: { label: 'Value (A-Z, 0-9, - . $ / + % space)', placeholder: 'e.g. CODE-93', desc: '<strong>CODE 93</strong> — Alphanumeric barcode similar to Code 39 but with higher density. Supports A–Z, 0–9, and special characters. Legacy format used in some older systems.', validate: v => /^[A-Z0-9\-. $/+%]+$/i.test(v) ? '' : 'Only A–Z, 0–9, and - . $ / + % space allowed', checkDigit: false },
  EAN13: { label: 'Value (12 digits — check digit auto-calculated)', placeholder: 'e.g. 590123412345', desc: '<strong>EAN-13</strong> — 13-digit international retail barcode (12 + check digit). Used on consumer products worldwide. Enter 12 digits; check digit is calculated automatically.', validate: v => /^\d{12,13}$/.test(v) ? '' : 'Enter exactly 12 digits (check digit auto-added)', checkDigit: true },
  EAN8: { label: 'Value (7 digits — check digit auto-calculated)', placeholder: 'e.g. 5901234', desc: '<strong>EAN-8</strong> — Compact 8-digit retail barcode for small items. Enter 7 digits; check digit is calculated automatically.', validate: v => /^\d{7,8}$/.test(v) ? '' : 'Enter exactly 7 digits (check digit auto-added)', checkDigit: true },
  UPCA: { label: 'Value (11 digits — check digit auto-calculated)', placeholder: 'e.g. 01234567890', desc: '<strong>UPC-A</strong> — 12-digit US retail barcode. Enter 11 digits; check digit is calculated automatically. Standard for North American products.', validate: v => /^\d{11,12}$/.test(v) ? '' : 'Enter exactly 11 digits (check digit auto-added)', checkDigit: true },
  UPCE: { label: 'Value (6 digits — check digit auto-calculated)', placeholder: 'e.g. 012345', desc: '<strong>UPC-E</strong> — Compact 8-digit US retail barcode for small items. Enter 6 digits; check digit is calculated automatically. Space-efficient alternative to UPC-A.', validate: v => /^\d{6,8}$/.test(v) ? '' : 'Enter exactly 6 digits (check digit auto-added)', checkDigit: true },
  ITF14: { label: 'Value (13 digits — check digit auto-calculated)', placeholder: 'e.g. 1234567890123', desc: '<strong>ITF-14</strong> — 14-digit logistics barcode printed on corrugated packaging and outer cases. Based on Interleaved 2-of-5.', validate: v => /^\d{13,14}$/.test(v) ? '' : 'Enter exactly 13 digits (check digit auto-added)', checkDigit: true },
  ITF: { label: 'Value (even number of digits)', placeholder: 'e.g. 1234567890', desc: '<strong>ITF</strong> — Interleaved 2-of-5. Numeric only, must have even number of digits. Used in warehousing and distribution.', validate: v => /^\d+$/.test(v) && v.length % 2 === 0 ? '' : 'Enter an even number of digits only', checkDigit: false },
  MSI: { label: 'Value (digits only)', placeholder: 'e.g. 12345678', desc: '<strong>MSI Plessey</strong> — Numeric-only barcode used in retail shelf labelling and inventory management. Variable length.', validate: v => /^\d+$/.test(v) ? '' : 'MSI Plessey only supports digits', checkDigit: false },
  CODABAR: { label: 'Value (digits, A-D start/stop)', placeholder: 'e.g. A12345B', desc: '<strong>Codabar</strong> — Numeric barcode with optional start/stop characters (A, B, C, D). Common in libraries, blood banks, and FedEx.', validate: v => /^[ABCD]?[0-9\-$:/.+]+[ABCD]?$/i.test(v) ? '' : 'Use digits, - $ : / . + with optional A/B/C/D at start/end', checkDigit: false },
  PHARMACODE: { label: 'Value (3–131070)', placeholder: 'e.g. 1234', desc: '<strong>Pharmacode</strong> — Pharmaceutical binary barcode. Encodes a single integer from 3 to 131,070. Used to verify packaging on high-speed production lines.', validate: v => { const n = parseInt(v); return !isNaN(n) && n >= 3 && n <= 131070 ? '' : 'Enter a number between 3 and 131070'; }, checkDigit: false }
};

let currentFormat = 'CODE128';

/* Format capability info for the chip selector */
const FORMAT_CAP_INFO = {
  CODE128: { title: 'CODE 128', desc: 'High-density, variable-length alphanumeric barcode. Full ASCII support. Universal use across retail, shipping, and inventory.', badges: ['Full ASCII','Variable Length','High Density','Universal'] },
  CODE39: { title: 'CODE 39', desc: 'Alpha-numeric barcode supporting A–Z, 0–9, and 8 special characters. Common in automotive, defense, and healthcare.', badges: ['Alpha-Numeric','Variable Length','Self-Checking','Healthcare'] },
  CODE93: { title: 'CODE 93', desc: 'Alphanumeric barcode with higher density than Code 39. Supports A–Z, 0–9, and special characters. Legacy format for space-constrained applications.', badges: ['Alpha-Numeric','Higher Density','Legacy','Compact'] },
  EAN13: { title: 'EAN-13', desc: '13-digit international retail barcode. Enter 12 digits — check digit is auto-calculated. Used on consumer products worldwide.', badges: ['13 Digits','Retail','Auto Check Digit','Global Standard'] },
  EAN8: { title: 'EAN-8', desc: 'Compact 8-digit retail barcode for small packaging. Enter 7 digits — check digit is auto-calculated.', badges: ['8 Digits','Compact','Retail','Auto Check Digit'] },
  UPCA: { title: 'UPC-A', desc: '12-digit US retail standard. Enter 11 digits — check digit is auto-calculated. North American product identifier.', badges: ['12 Digits','US Standard','Retail','Auto Check Digit'] },
  UPCE: { title: 'UPC-E', desc: 'Compact 8-digit US retail barcode for small items. Enter 6 digits — check digit is auto-calculated. Space-efficient alternative to UPC-A.', badges: ['8 Digits','Compact','US Retail','Auto Check Digit'] },
  ITF14: { title: 'ITF-14', desc: '14-digit logistics barcode for corrugated packaging and shipping cartons. Based on Interleaved 2-of-5.', badges: ['14 Digits','Logistics','Shipping','Interleaved 2-of-5'] },
  ITF: { title: 'ITF', desc: 'Interleaved 2-of-5. Numeric only, must have an even number of digits. Used in warehousing and distribution.', badges: ['Numeric Only','Even Digits','Warehousing','Distribution'] },
  MSI: { title: 'MSI Plessey', desc: 'Numeric barcode used in retail shelf labelling and inventory management. Variable length.', badges: ['Numeric Only','Variable Length','Inventory','Shelf Labels'] },
  CODABAR: { title: 'Codabar', desc: 'Numeric barcode with optional A/B/C/D start-stop characters. Common in libraries, blood banks, and FedEx.', badges: ['Numeric','Start/Stop','Libraries','FedEx'] },
  PHARMACODE: { title: 'Pharmacode', desc: 'Pharmaceutical binary barcode encoding a single integer 3–131,070. Used on high-speed pharma production lines.', badges: ['Integers 3–131070','Pharma Only','Binary','High-Speed Lines'] },
};

/* Other group shows a sub-list */
const OTHER_FORMATS = ['ITF','MSI','CODABAR','PHARMACODE','CODE93','UPCE'];

function updateFormatCapCard(format) {
  const cap = FORMAT_CAP_INFO[format];
  if (!cap) return;
  document.getElementById('formatCapTitle').textContent = cap.title;
  document.getElementById('formatCapDesc').textContent = cap.desc;
  const badgeEl = document.getElementById('formatCapBadges');
  badgeEl.innerHTML = cap.badges.map(b => `<span class="cap-badge">${b}</span>`).join('');
}

function selectFormatChip(format, el) {
  // Handle "Other" group — pick first other format if not already in that group
  if (format === 'OTHER_GROUP') {
    document.querySelectorAll('.format-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    // default to ITF if not already an "other" format selected
    if (!OTHER_FORMATS.includes(currentFormat)) {
      selectFormat('ITF', document.querySelector('.format-btn[data-format="ITF"]'));
    }
    updateFormatCapCard(currentFormat);
    return;
  }
  document.querySelectorAll('.format-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectFormat(format, document.querySelector(`.format-btn[data-format="${format}"]`));
  updateFormatCapCard(format);
}

function selectFormat(format, el) {
  currentFormat = format;
  document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  /* Sync chip row */
  const chipMap = { CODE128:'CODE128', CODE39:'CODE39', EAN13:'EAN13', EAN8:'EAN8', UPCA:'UPCA', ITF14:'ITF14' };
  document.querySelectorAll('.format-chip').forEach(c => c.classList.remove('active'));
  if (chipMap[format]) {
    const chip = document.querySelector(`.format-chip[data-format="${format}"]`);
    if (chip) chip.classList.add('active');
  } else {
    // It's an "other" format
    const otherChip = document.querySelector('.format-chip[data-format="OTHER_GROUP"]');
    if (otherChip) otherChip.classList.add('active');
  }

  const info = FORMAT_INFO[format];
  if (!info) return;
  updateFormatCapCard(format);
  const barcodeValueLabel = document.getElementById('barcodeValueLabel');
  const barcodeInput = document.getElementById('barcodeInput');
  const barcodeValidationMsg = document.getElementById('barcodeValidationMsg');
  const barcodeFormatBadge = document.getElementById('barcodeFormatBadge');
  const barcodeCanvas = document.getElementById('barcodeCanvas');
  const barcodePlaceholder = document.getElementById('barcodePlaceholder');
  if (barcodeValueLabel) barcodeValueLabel.textContent = info.label;
  if (barcodeInput) { barcodeInput.placeholder = info.placeholder; barcodeInput.value = ''; }
  if (barcodeValidationMsg) barcodeValidationMsg.textContent = '';
  if (barcodeFormatBadge) barcodeFormatBadge.textContent = format.replace('128','128').replace('EAN','EAN-').replace('UPCA','UPC-A').replace('ITF14','ITF-14');
  if (barcodeCanvas) barcodeCanvas.style.display = 'none';
  if (barcodePlaceholder) barcodePlaceholder.style.display = 'flex';
}

function validateBarcodeInput() {
  const inputEl = document.getElementById('barcodeInput');
  const msgEl = document.getElementById('barcodeValidationMsg');
  if (!inputEl || !msgEl) return;
  const val = inputEl.value;
  const info = FORMAT_INFO[currentFormat];
  if (!info) return;
  const msg = info.validate(val);
  msgEl.textContent = msg;
  msgEl.style.color = msg ? 'var(--ink3)' : 'var(--status-ok)';
}

/* ══════════════════════════════════════════
   BARIX — EAN CHECK DIGIT
══════════════════════════════════════════ */
function eanCheckDigit(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

/* ══════════════════════════════════════════
   BARIX — PURE CANVAS BARCODE RENDERER
══════════════════════════════════════════ */
function generateBarcode() {
  try {
    const inputEl = document.getElementById('barcodeInput');
    if (!inputEl) { toast('Failed to generate barcode'); return; }
    const rawVal = inputEl.value.trim();
    if (!rawVal) { toast('Please enter a barcode value'); return; }

    const info = FORMAT_INFO[currentFormat];
    if (!info) { toast('Unknown barcode format'); return; }
    const errMsg = info.validate(rawVal);
    if (errMsg) { toast(errMsg); return; }

    const barColorEl = document.getElementById('bcBarColor');
    const bgColorEl = document.getElementById('bcBgColor');
    const heightEl = document.getElementById('bcHeight');
    const scaleEl = document.getElementById('bcScale');
    const showTextEl = document.getElementById('bcShowText');
    if (!barColorEl || !bgColorEl || !heightEl || !scaleEl) { toast('Failed to generate barcode'); return; }

    const barColor = barColorEl.value;
    const bgColor = bgColorEl.value;
    const height = parseInt(heightEl.value) || 80;
    const scale = parseFloat(scaleEl.value) || 2;
    const showText = showTextEl ? showTextEl.checked : true;

    let bars;
    try {
      bars = encodeToBars(currentFormat, rawVal);
    } catch(e) {
      toast(e.message || 'Encoding error');
      return;
    }

    const canvas = document.getElementById('barcodeCanvas');
    if (!canvas) { toast('Failed to generate barcode'); return; }
    const ctx = canvas.getContext('2d');
    const barW = Math.max(1, Math.floor(scale));
    const textHeight = showText ? 18 : 0;
    const padH = Math.max(20, 10 * barW), padV = 12;
    const totalWidth = Math.floor((bars.length * barW) + padH * 2);
    const totalHeight = height + textHeight + padV * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Bars
  ctx.fillStyle = barColor;
  for (let i = 0; i < bars.length; i++) {
    if (bars[i] === 1) {
      ctx.fillRect(padH + i * barW, padV, barW, height);
    }
  }

  // Text
  if (showText) {
    ctx.fillStyle = barColor;
    ctx.font = `${Math.max(10, Math.floor(11 * scale * 0.6))}px "DM Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const displayVal = getDisplayValue(currentFormat, rawVal);
    ctx.fillText(displayVal, totalWidth / 2, padV + height + 4);
  }

    const bcCanvas = document.getElementById('barcodeCanvas');
    const bcPlaceholder = document.getElementById('barcodePlaceholder');
    if (bcCanvas) bcCanvas.style.display = 'block';
    if (bcPlaceholder) bcPlaceholder.style.display = 'none';
    addToHistory({ type: 'barix', label: currentFormat, data: rawVal, ts: Date.now(), source: 'generate' });
    toast('Barcode generated ✓');
  } catch(e) {
    toast('Failed to generate barcode — please try again');
  }
}

function getDisplayValue(format, val) {
  if (format === 'EAN13') {
    const d = val.length === 12 ? val + eanCheckDigit(val) : val;
    return d;
  }
  if (format === 'EAN8') {
    const d = val.length === 7 ? val + eanCheckDigit(val) : val;
    return d;
  }
  if (format === 'UPCA') {
    const d = val.length === 11 ? val + eanCheckDigit(val) : val;
    return d;
  }
  if (format === 'UPCE') {
    const d = val.length === 6 ? val + eanCheckDigit(val) : val;
    return d;
  }
  if (format === 'ITF14') {
    const d = val.length === 13 ? val + eanCheckDigit(val) : val;
    return d;
  }
  return val.toUpperCase();
}

function decodeFromBarcode(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      // Display the image in the barcode canvas
      const canvas = document.getElementById('barcodeCanvas');
      const ctx = canvas.getContext('2d');
      
      // Scale image to fit canvas while maintaining aspect ratio
      const maxWidth = 600, maxHeight = 200;
      let width = img.width, height = img.height;
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.style.display = 'block';
      document.getElementById('barcodePlaceholder').style.display = 'none';

      const decodeCanvas = prepareBarcodeDecodeCanvas(canvas, ctx);
      const decodeCtx = decodeCanvas.getContext('2d');
      const decodeTargets = decodeCanvas === canvas ? [canvas] : [decodeCanvas, canvas];

      // Try native decoding first, then ZXing, then the local canvas fallback.
      let decoded = null;
      if ('BarcodeDetector' in window) {
        for (const target of decodeTargets) {
          try {
            let formats = ['code_128','code_39','code_93','codabar','ean_13','ean_8','upc_a','upc_e','itf','pdf417','aztec','data_matrix'];
            if (BarcodeDetector.getSupportedFormats) {
              const supported = await BarcodeDetector.getSupportedFormats();
              formats = formats.filter(format => supported.includes(format));
            }
            const detector = formats.length ? new BarcodeDetector({ formats }) : new BarcodeDetector();
            const detections = await detector.detect(target);
            if (detections && detections.length) {
              decoded = { value: detections[0].rawValue, format: detections[0].format || 'Barcode' };
              break;
            }
          } catch (err) {}
        }
      }
      if (!decoded) {
        for (const target of decodeTargets) {
          decoded = decodeBarcodeWithZXing(target);
          if (decoded) break;
        }
      }
      if (!decoded && decodeCtx) {
        decoded = tryDecodeBarcode(decodeCanvas, decodeCtx);
        if (!decoded && decodeCanvas !== canvas) {
          decoded = tryDecodeBarcode(canvas, ctx);
        }
      }
      const resultDiv = document.getElementById('decodeResult');
      const valueSpan = document.getElementById('decodeValue');

      if (decoded && decoded.value) {
        valueSpan.textContent = decoded.value + ` (${decoded.format || 'Barcode'})`;
        resultDiv.style.display = 'block';
        
        // Auto-populate input field
        document.getElementById('barcodeInput').value = decoded.value;
        validateBarcodeInput();
        
        toast('✓ Barcode decoded: ' + decoded.value);
        addToHistory({ type: 'barix', label: 'Image Decode', data: decoded.value, ts: Date.now(), source: 'image-decode' });
      } else {
        valueSpan.textContent = 'Could not decode barcode from image - try a clearer image';
        resultDiv.style.display = 'block';
        toast('Could not decode - try clearer image');
      }
    };
    img.onerror = () => {
      toast('Failed to load image');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ══════════════════════════════════════════
   BARIX — ENCODING ENGINE (Pure Canvas)
══════════════════════════════════════════ */
function encodeToBars(format, value) {
  switch(format) {
    case 'CODE128': return encodeCode128(value);
    case 'CODE39': return encodeCode39(value.toUpperCase());
    case 'CODE93': return encodeCode93(value.toUpperCase());
    case 'EAN13': return encodeEAN13(value);
    case 'EAN8': return encodeEAN8(value);
    case 'UPCA': return encodeUPCA(value);
    case 'UPCE': return encodeUPCE(value);
    case 'ITF14': return encodeITF(value.length === 13 ? value + eanCheckDigit(value) : value);
    case 'ITF': return encodeITF(value);
    case 'MSI': return encodeMSI(value);
    case 'CODABAR': return encodeCodabar(value.toUpperCase());
    case 'PHARMACODE': return encodePharmacodeBarcode(parseInt(value));
    default: throw new Error('Unknown format');
  }
}

/* CODE 39 */
const CODE39_MAP = {
  '0':'101001101101','1':'110100101011','2':'101100101011','3':'110110010101','4':'101001101011',
  '5':'110100110101','6':'101100110101','7':'101001011011','8':'110100101101','9':'101100101101',
  'A':'110101001011','B':'101101001011','C':'110110100101','D':'101011001011','E':'110101100101',
  'F':'101101100101','G':'101010011011','H':'110101001101','I':'101101001101','J':'101011001101',
  'K':'110101010011','L':'101101010011','M':'110110101001','N':'101011010011','O':'110101101001',
  'P':'101101101001','Q':'101010110011','R':'110101011001','S':'101101011001','T':'101011011001',
  'U':'110010101011','V':'100110101011','W':'110011010101','X':'100101101011','Y':'110010110101',
  'Z':'100110110101','-':'100101011011','.':'110010101101',' ':'100110101101',
  '$':'100100100101','/':'100100101001','+':'100101001001','%':'101001001001','*':'100101101101'
};
function encodeCode39(val) {
  const data = '*' + val + '*';
  let bits = [];
  for (let i = 0; i < data.length; i++) {
    const pat = CODE39_MAP[data[i]];
    if (!pat) throw new Error(`Invalid character: ${data[i]}`);
    for (let j = 0; j < pat.length; j++) bits.push(parseInt(pat[j]));
    if (i < data.length - 1) bits.push(0); // inter-char gap
  }
  return bits;
}

/* CODE 128 (subset B) */
const CODE128_B = {};
const CODE128_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
const CODE128_PATTERNS = [
  '11011001100','11001101100','11001100110','10010011000','10010001100','10001001100',
  '10011001000','10011000100','10001100100','11001001000','11001000100','11000100100',
  '10110011100','10011011100','10011001110','10111001100','10011101100','10011100110',
  '11001110010','11001011100','11001001110','11011100100','11001110100','11101101110',
  '11101001100','11100101100','11100100110','11101100100','11100110100','11100110010',
  '11011011000','11011000110','11000110110','10100011000','10001011000','10001000110',
  '10110001000','10001101000','10001100010','11010001000','11000101000','11000100010',
  '10110111000','10110001110','10001101110','10111011000','10111000110','10001110110',
  '11101110110','11010001110','11000101110','11011101000','11011100010','11011101110',
  '11101011000','11101000110','11100010110','11101101000','11101100010','11100011010',
  '11101111010','11001000010','11110001010','10100110000','10100001100','10010110000',
  '10010000110','10000101100','10000100110','10110010000','10110000100','10011010000',
  '10011000010','10000110100','10000110010','11000010010','11001010000','11110111010',
  '11000010100','10001111010','10100111100','10010111100','10010011110','10111100100',
  '10011110100','10011110010','11110100100','11110010100','11110010010','11011011110',
  '11011110110','11110110110','10101111000','10100011110','10001011110','10111101000',
  '10111100010','11110101000','11110100010','10111011110','10111101110','11101011110',
  '11110101110','11010000100','11010010000','11010011100','1100011101011'
];
function encodeCode128(val) {
  // Subset B start = 104, stop = 106
  const START_B = 104, STOP = 106, FNC3 = 96;
  let codes = [START_B];
  let checksum = START_B;
  for (let i = 0; i < val.length; i++) {
    const c = val.charCodeAt(i) - 32;
    if (c < 0 || c > 94) throw new Error(`Character not supported in CODE 128: ${val[i]}`);
    codes.push(c);
    checksum += c * (i + 1);
  }
  codes.push(checksum % 103);
  codes.push(STOP);
  let bits = [];
  for (const code of codes) {
    const pat = CODE128_PATTERNS[code];
    for (const ch of pat) bits.push(parseInt(ch));
  }
  bits.push(1, 1); // termination bar
  return bits;
}

/* EAN-13 */
const EAN_L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN13_PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
function encodeEAN13(val) {
  const d = val.length === 12 ? val + eanCheckDigit(val) : val;
  if (d.length !== 13) throw new Error('EAN-13 requires 13 digits');
  const parityPat = EAN13_PARITY[parseInt(d[0])];
  let bits = [1,0,1]; // start guard
  for (let i = 1; i <= 6; i++) {
    const digit = parseInt(d[i]);
    const pat = parityPat[i-1] === 'L' ? EAN_L[digit] : EAN_G[digit];
    for (const ch of pat) bits.push(parseInt(ch));
  }
  bits.push(0,1,0,1,0); // center guard
  for (let i = 7; i <= 12; i++) {
    const pat = EAN_R[parseInt(d[i])];
    for (const ch of pat) bits.push(parseInt(ch));
  }
  bits.push(1,0,1); // end guard
  return bits;
}

/* EAN-8 */
function encodeEAN8(val) {
  const d = val.length === 7 ? val + eanCheckDigit(val) : val;
  if (d.length !== 8) throw new Error('EAN-8 requires 8 digits');
  let bits = [1,0,1];
  for (let i = 0; i < 4; i++) { const pat = EAN_L[parseInt(d[i])]; for (const ch of pat) bits.push(parseInt(ch)); }
  bits.push(0,1,0,1,0);
  for (let i = 4; i < 8; i++) { const pat = EAN_R[parseInt(d[i])]; for (const ch of pat) bits.push(parseInt(ch)); }
  bits.push(1,0,1);
  return bits;
}

/* UPC-A */
function encodeUPCA(val) {
  const d = val.length === 11 ? val + eanCheckDigit(val) : val;
  if (d.length !== 12) throw new Error('UPC-A requires 12 digits');
  let bits = [1,0,1];
  for (let i = 0; i < 6; i++) { const pat = EAN_L[parseInt(d[i])]; for (const ch of pat) bits.push(parseInt(ch)); }
  bits.push(0,1,0,1,0);
  for (let i = 6; i < 12; i++) { const pat = EAN_R[parseInt(d[i])]; for (const ch of pat) bits.push(parseInt(ch)); }
  bits.push(1,0,1);
  return bits;
}

/* UPC-E */
const UPCE_PATTERNS = [
  [0,0,0,1,1],   // 0: XX00003
  [0,0,1,0,1],   // 1: XX00103
  [0,0,1,1,0],   // 2: XX00203
  [0,1,0,0,1],   // 3: XX00303
  [0,1,0,1,0],   // 4: XX04003
  [0,1,1,0,0],   // 5: XX50003
  [1,0,0,0,1],   // 6: XX60003
  [1,0,0,1,0],   // 7: XX70003
  [1,0,1,0,0],   // 8: XX80003
  [1,1,0,0,0]    // 9: XX90003
];
function encodeUPCE(val) {
  const d = val.length === 6 ? val + eanCheckDigit(val) : val;
  if (d.length !== 8) throw new Error('UPC-E requires 8 digits');
  const firstDigit = parseInt(d[0]);
  const lastDigit = parseInt(d[7]);
  const parity = UPCE_PATTERNS[lastDigit];
  
  let bits = [1,0,1]; // start
  for (let i = 1; i <= 6; i++) {
    const digit = parseInt(d[i]);
    const useLeft = parity[i-1] === 0;
    const pat = useLeft ? EAN_L[digit] : EAN_R[digit];
    for (const ch of pat) bits.push(parseInt(ch));
  }
  bits.push(0,1,0,1,0); // end guard
  return bits;
}

/* CODE 93 */
const CODE93_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -.$/+%*';
const CODE93_PATTERNS = {
  'A':'100010100','B':'101001010','C':'101010010','D':'101010010','E':'101010010',
  'F':'100101010','G':'100101010','H':'100101010','I':'100101010','J':'100101010',
  'K':'100101010','L':'101001010','M':'101001010','N':'101001010','O':'101001010',
  'P':'101001010','Q':'101001010','R':'100101010','S':'100101010','T':'100101010',
  'U':'100101010','V':'100101010','W':'101001010','X':'101001010','Y':'101001010',
  'Z':'101001010','0':'100010010','1':'101001001','2':'101010010','3':'101010100',
  '4':'101010010','5':'101001010','6':'101001010','7':'101001010','8':'100101001',
  '9':'100101010',' ':'100010010','-':'100010010','.':'100010010','$':'101001010',
  '/':'100101010','+':'101001010','%':'101001010','*':'100101010'
};
function encodeCode93(val) {
  if (val.length === 0) throw new Error('CODE 93 value cannot be empty');
  let data = val.toUpperCase();
  let bits = [];
  
  // Start guard
  bits.push(1,0,0,1,0,1,1);
  
  // Encode each character - simplified version using bit patterns
  const CODE93_BASIC = {
    '0':'100010010','1':'101001001','2':'101010010','3':'101010100',
    '4':'101010010','5':'101001010','6':'100101001','7':'100101010',
    '8':'100101010','9':'100101010','A':'110101001','B':'110101010',
    'C':'110101010','D':'110100101','E':'110100101','F':'110100101',
    'G':'110010101','H':'110010110','I':'110011010','J':'110011010',
    'K':'110011010','L':'110010010','M':'110010010','N':'110001010',
    'O':'110001010','P':'110001010','Q':'101101001','R':'101101010',
    'S':'101101010','T':'101100101','U':'101100101','V':'101100101',
    'W':'100110101','X':'100110110','Y':'100111010','Z':'100111010',
    '-':'100001010','.':'100001001',' ':'100000101','$':'101010101',
    '/':'101001101','+':'101010110','%':'101001011','*':'101011101'
  };
  
  for (const ch of data) {
    const code = CODE93_BASIC[ch] || '100010010';
    for (const bit of code) bits.push(parseInt(bit));
  }
  
  // Stop guard
  bits.push(1,0,1,1,1,0,1);
  
  return bits;
}

/* ITF (Interleaved 2 of 5) */
const ITF_MAP = {
  '0':[1,1,2,2,1],'1':[2,1,1,1,2],'2':[1,2,1,1,2],'3':[2,2,1,1,1],
  '4':[1,1,2,1,2],'5':[2,1,2,1,1],'6':[1,2,2,1,1],'7':[1,1,1,2,2],
  '8':[2,1,1,2,1],'9':[1,2,1,2,1]
};
function encodeITF(val) {
  if (val.length % 2 !== 0) val = '0' + val;
  let bits = [1,1,0,0]; // start
  for (let i = 0; i < val.length; i += 2) {
    const bar = ITF_MAP[val[i]], space = ITF_MAP[val[i+1]];
    for (let j = 0; j < 5; j++) {
      for (let b = 0; b < bar[j]; b++) bits.push(1);
      for (let s = 0; s < space[j]; s++) bits.push(0);
    }
  }
  bits.push(2,1,0); // stop (wide+narrow+quiet)
  return bits;
}

/* MSI */
const MSI_DIGIT = {
  '0':'100100100100','1':'100100100110','2':'100100110100','3':'100100110110',
  '4':'100110100100','5':'100110100110','6':'100110110100','7':'100110110110',
  '8':'110100100100','9':'110100100110'
};
function encodeMSI(val) {
  let bits = [1,1,0]; // start
  for (const c of val) {
    const pat = MSI_DIGIT[c];
    for (const ch of pat) bits.push(parseInt(ch));
  }
  bits.push(1,0,0,1); // stop
  return bits;
}

/* Codabar */
const CODABAR_MAP = {
  '0':'101010011','1':'101011001','2':'101001011','3':'110010101','4':'101101001',
  '5':'110101001','6':'100101011','7':'100101101','8':'100110101','9':'110100101',
  '-':'101001101','$':'101101101',':':'1101011011','/':'1101101011','.':'1101101101',
  '+':'101100101101','A':'1011001011','B':'1010010111','C':'1010111001','D':'1011100101'
};
function encodeCodabar(val) {
  let bits = [];
  for (let i = 0; i < val.length; i++) {
    const pat = CODABAR_MAP[val[i]];
    if (!pat) throw new Error(`Invalid Codabar char: ${val[i]}`);
    for (const ch of pat) bits.push(parseInt(ch));
    if (i < val.length - 1) bits.push(0); // gap
  }
  return bits;
}

/* Pharmacode */
function encodePharmacodeBarcode(n) {
  let bits = [];
  while (n > 0) {
    if (n % 2 === 0) { bits.unshift(1,1,1,0); n = (n - 2) / 2; }
    else { bits.unshift(1,0); n = (n - 1) / 2; }
  }
  return bits;
}

/* ══════════════════════════════════════════
   BARIX — APPEARANCE HELPERS
══════════════════════════════════════════ */
function syncBcHex(cid, hid) { document.getElementById(hid).value = document.getElementById(cid).value; }
function syncBcColor(hid, cid) { const val = document.getElementById(hid).value; if (/^#[0-9a-fA-F]{6}$/.test(val)) { document.getElementById(cid).value = val; } }
function updateRangeLabel(rangeId, labelId, suffix) {
  const val = document.getElementById(rangeId).value;
  document.getElementById(labelId).textContent = parseFloat(val) + ' ' + suffix;
}
function applyBcPreset(bar, bg) {
  document.getElementById('bcBarColor').value = bar;
  document.getElementById('bcBarHex').value = bar;
  document.getElementById('bcBgColor').value = bg;
  document.getElementById('bcBgHex').value = bg;
}
function applyQRPreset(dark, light) {
  document.getElementById('darkColor').value = dark;
  document.getElementById('darkHex').value = dark;
  document.getElementById('lightColor').value = light;
  document.getElementById('lightHex').value = light;
}

/* ══════════════════════════════════════════
   BARIX — DOWNLOAD
══════════════════════════════════════════ */
function downloadBarcodePNG() {
  const canvas = document.getElementById('barcodeCanvas');
  if (canvas.style.display === 'none') { toast('Generate a barcode first'); return; }
  const a = document.createElement('a');
  a.download = `barix-${currentFormat.toLowerCase()}.png`;
  a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('PNG saved');
}

function downloadBarcodeSVG() {
  const canvas = document.getElementById('barcodeCanvas');
  if (canvas.style.display === 'none') { toast('Generate a barcode first'); return; }
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, w, h);
  const barColor = document.getElementById('bcBarColor').value;
  const bgColor = document.getElementById('bcBgColor').value;
  let rects = '';
  // Simple row compression
  for (let y = 0; y < h; y++) {
    let runStart = -1, runColor = null;
    for (let x = 0; x <= w; x++) {
      const idx = (y * w + x) * 4;
      const isBar = x < w && imageData.data[idx] < 128;
      if (isBar && runStart < 0) { runStart = x; runColor = 'bar'; }
      else if (!isBar && runStart >= 0) {
        rects += `<rect x="${runStart}" y="${y}" width="${x - runStart}" height="1" fill="${barColor}"/>`;
        runStart = -1;
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bgColor}"/>${rects}</svg>`;
  const a = document.createElement('a');
  a.download = `barix-${currentFormat.toLowerCase()}.svg`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  a.href = url;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('SVG saved');
}

async function copyBarcodeImage() {
  const canvas = document.getElementById('barcodeCanvas');
  if (!canvas || canvas.style.display === 'none') { toast('Generate a barcode first'); return; }
  const barcodeValue = document.getElementById('barcodeInput')?.value?.trim() || '';
  const copyDataFallback = () => {
    if (barcodeValue && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(barcodeValue).then(() => { toast('Barcode value copied ✓'); return true; });
    }
    return Promise.resolve(false);
  };
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
          toast('Barcode copied ✓');
        } catch(e) {
          const copied = await copyDataFallback().catch(() => false);
          if (!copied) toast('Copy not supported — use Download');
        }
      });
    } else {
      const copied = await copyDataFallback();
      if (!copied) toast('Copy not supported — use Download');
    }
  } catch(e) { toast('Copy not supported — use Download'); }
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
let tt;
window.TOAST_DURATION_MS = window.TOAST_DURATION_MS || 2200;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('show'), window.TOAST_DURATION_MS);
}

/* ══════════════════════════════════════════════════════
   MOBILE CONTROLLER — injected, desktop untouched
══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── Switch view ── */
  /* ── Mobile check ── */
  function isMobile() { return window.matchMedia('(max-width:600px)').matches; }

  window.mobSwitchView = function(view, btn) {
    if (!isMobile()) return;
    document.querySelectorAll('.mob-view').forEach(function(v) {
      v.style.setProperty('display', 'none', 'important');
      v.classList.remove('active');
    });
    document.querySelectorAll('.mob-nav-btn').forEach(function(b) { b.classList.remove('active'); });
    var v = document.getElementById('mob-' + view);
    if (v) {
      v.classList.add('active');
      v.style.setProperty('display', 'block', 'important');
    }
    if (btn) btn.classList.add('active');
    if (view === 'history') mobRenderHistory(window._mobHistFilter || 'all');
    if (view !== 'decode' && _scanActive) mobStopScanner();
    window.scrollTo(0, 0);
  };

  /* ── Init ── */
  function mobInit() {
    mobRenderQrForm('url');
    mobRenderHistory('all');
    // Only show views inline on mobile — desktop CSS hides them
    if (isMobile()) {
      var def = document.querySelector('.mob-view.active');
      if (def) def.style.setProperty('display', 'block', 'important');
    }
    // Sync theme
    var cur = document.documentElement.getAttribute('data-theme') || 'ivory';
    document.querySelectorAll('.mob-theme-opt').forEach(function(o) {
      o.classList.toggle('active', o.dataset.theme === cur);
    });
    // Drag-drop decode zones
    ['mobQrDropZone','mobBarDropZone'].forEach(function(id) {
      var z = document.getElementById(id);
      if (!z) return;
      z.addEventListener('dragover', function(e) { e.preventDefault(); });
      z.addEventListener('drop', function(e) {
        e.preventDefault();
        var f = e.dataTransfer.files[0];
        if (f) { if (id === 'mobQrDropZone') processQRFile(f); else processBcFile(f); }
      });
    });
  }

  /* ── Theme ── */
  window.mobToggleTheme = function() {
    document.getElementById('mobThemeSheet').classList.toggle('open');
    document.getElementById('mobSheetOverlay').classList.toggle('open');
  };
  window.mobCloseTheme = function() {
    document.getElementById('mobThemeSheet').classList.remove('open');
    document.getElementById('mobSheetOverlay').classList.remove('open');
  };
  window.mobSyncTheme = function(el) {
    document.querySelectorAll('.mob-theme-opt').forEach(function(o) { o.classList.remove('active'); });
    el.classList.add('active');
    mobCloseTheme();
  };

  /* ── Scan tab ── */
  window.mobScanTab = function(tab, btn) {
    document.querySelectorAll('.mob-scan-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('mobLiveScanPanel').style.display = tab === 'live' ? 'block' : 'none';
    document.getElementById('mobFileScanPanel').style.display = tab === 'file' ? 'block' : 'none';
    if (tab !== 'live' && _scanActive) mobStopScanner();
  };

  /* ══ QR FORM ══ */
  var qrForms = {
    url:      { label:'URL', html:'<div class="mob-field"><label>Website URL</label><input id="mobInput_urlInput" placeholder="https://example.com" type="url"/></div>' },
    text:     { label:'Text', html:'<div class="mob-field"><label>Text</label><textarea id="mobInput_textInput" placeholder="Enter any text…"></textarea></div>' },
    wifi:     { label:'WiFi', html:'<div class="mob-field"><label>Network (SSID)</label><input id="mobInput_wifiSSID" placeholder="My Network"/></div><div class="mob-field"><label>Password</label><input id="mobInput_wifiPass" placeholder="Password" type="password"/></div><div class="mob-field"><label>Security</label><select id="mobInput_wifiSec"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select></div><div class="mob-field"><label>Hidden</label><select id="mobInput_wifiHidden"><option value="false">No</option><option value="true">Yes</option></select></div>' },
    vcard:    { label:'vCard', html:'<div class="mob-row2"><div class="mob-field"><label>First Name</label><input id="mobInput_vcFirst" placeholder="Jane"/></div><div class="mob-field"><label>Last Name</label><input id="mobInput_vcLast" placeholder="Smith"/></div></div><div class="mob-field"><label>Organisation</label><input id="mobInput_vcOrg" placeholder="Company"/></div><div class="mob-field"><label>Title</label><input id="mobInput_vcTitle" placeholder="CEO"/></div><div class="mob-field"><label>Phone</label><input id="mobInput_vcPhone" placeholder="+1 555 0000" type="tel"/></div><div class="mob-field"><label>Email</label><input id="mobInput_vcEmail" placeholder="jane@example.com" type="email"/></div><div class="mob-field"><label>Website</label><input id="mobInput_vcWeb" placeholder="https://example.com"/></div><div class="mob-field"><label>Address</label><input id="mobInput_vcAddr" placeholder="123 Main St"/></div>' },
    email:    { label:'Email', html:'<div class="mob-field"><label>To</label><input id="mobInput_emailTo" placeholder="recipient@example.com" type="email"/></div><div class="mob-field"><label>Subject</label><input id="mobInput_emailSubj" placeholder="Subject…"/></div><div class="mob-field"><label>Body</label><textarea id="mobInput_emailBody" placeholder="Message…"></textarea></div>' },
    phone:    { label:'Phone', html:'<div class="mob-field"><label>Phone Number</label><input id="mobInput_phoneInput" placeholder="+1 555 0000" type="tel"/></div>' },
    sms:      { label:'SMS', html:'<div class="mob-field"><label>Phone Number</label><input id="mobInput_smsNum" placeholder="+1 555 0000" type="tel"/></div><div class="mob-field"><label>Message</label><textarea id="mobInput_smsMsg" placeholder="Message…"></textarea></div>' },
    whatsapp: { label:'WhatsApp', html:'<div class="mob-field"><label>Phone (with country code)</label><input id="mobInput_waNum" placeholder="+1 555 0000" type="tel"/></div><div class="mob-field"><label>Message</label><textarea id="mobInput_waMsg" placeholder="Hi there!"></textarea></div>' },
    calendar: { label:'Calendar', html:'<div class="mob-field"><label>Event Title</label><input id="mobInput_calTitle" placeholder="Team Meeting"/></div><div class="mob-field"><label>Start</label><input id="mobInput_calStart" type="datetime-local"/></div><div class="mob-field"><label>End</label><input id="mobInput_calEnd" type="datetime-local"/></div><div class="mob-field"><label>Location</label><input id="mobInput_calLoc" placeholder="Room A"/></div><div class="mob-field"><label>Description</label><textarea id="mobInput_calDesc" placeholder="Notes…"></textarea></div>' },
    location: { label:'Location', html:'<div class="mob-field"><label>Latitude</label><input id="mobInput_geoLat" placeholder="37.7749" type="number" step="any"/></div><div class="mob-field"><label>Longitude</label><input id="mobInput_geoLng" placeholder="-122.4194" type="number" step="any"/></div><div class="mob-field"><label>Label</label><input id="mobInput_geoLabel" placeholder="San Francisco HQ"/></div>' },
    crypto:   { label:'Crypto', html:'<div class="mob-field"><label>Coin</label><select id="mobInput_cryptoCoin"><option value="bitcoin">Bitcoin (BTC)</option><option value="ethereum">Ethereum (ETH)</option><option value="litecoin">Litecoin (LTC)</option></select></div><div class="mob-field"><label>Wallet Address</label><input id="mobInput_cryptoAddr" placeholder="bc1q…"/></div><div class="mob-field"><label>Amount</label><input id="mobInput_cryptoAmt" placeholder="0.001" type="number" step="any"/></div><div class="mob-field"><label>Label</label><input id="mobInput_cryptoLabel" placeholder="Donation"/></div>' },
    upi:      { label:'UPI', html:'<div class="mob-field"><label>UPI ID</label><input id="mobInput_upiId" placeholder="name@upi"/></div><div class="mob-field"><label>Payee Name</label><input id="mobInput_upiName" placeholder="John Doe"/></div><div class="mob-field"><label>Amount</label><input id="mobInput_upiAmt" placeholder="100.00" type="number" step="any"/></div><div class="mob-field"><label>Note</label><input id="mobInput_upiNote" placeholder="Invoice #123"/></div><input id="mobInput_upiCurr" type="hidden" value="INR"/>' },
    json:     { label:'JSON', html:'<div class="mob-field"><label>JSON Data</label><textarea id="mobInput_jsonInput" style="font-family:\'DM Mono\',monospace;font-size:12px;min-height:100px;" placeholder=\'{"key":"value"}\'></textarea></div>' },
    custom:   { label:'Custom', html:'<div class="mob-field"><label>Label</label><input id="mobInput_customLabel" placeholder="My App"/></div><div class="mob-field"><label>QR Data</label><textarea id="mobInput_customData" placeholder="Enter any URL or raw data…"></textarea></div><div class="mob-field"><label>Prefix</label><input id="mobInput_customPrefix" placeholder="https://"/></div>' },
    review:   { label:'Review Link', html:'<div class="mob-field"><label>Review URL</label><input id="mobInput_reviewUrl" placeholder="https://g.page/r/..." type="url"/></div>' },
    pdf:      { label:'Document / PDF', html:'<div class="mob-field"><label>Document / PDF URL</label><input id="mobInput_pdfUrl" placeholder="https://example.com/file.pdf" type="url"/></div>' },
    media:    { label:'Image / Video / Audio', html:'<div class="mob-field"><label>Media URL</label><input id="mobInput_mediaUrl" placeholder="https://example.com/video.mp4" type="url"/></div>' },
    freelance:{ label:'Work Profile', html:'<div class="mob-field"><label>Portfolio / Profile URL</label><input id="mobInput_freelanceUrl" placeholder="https://yourportfolio.com" type="url"/></div>' },
    deeplink: { label:'App Deep Link', html:'<div class="mob-field"><label>Deep Link URL</label><input id="mobInput_deepUrl" placeholder="myapp://path/to/screen"/></div><div class="mob-field"><label>Fallback URL (optional)</label><input id="mobInput_deepFallback" placeholder="https://fallback.com" type="url"/></div>' },
    otp:      { label:'2FA / OTP Setup', html:'<div class="mob-field"><label>Account Name</label><input id="mobInput_otpAccount" placeholder="user@example.com"/></div><div class="mob-field"><label>Issuer / App Name</label><input id="mobInput_otpIssuer" placeholder="MyApp"/></div><div class="mob-field"><label>Secret Key</label><input id="mobInput_otpSecret" placeholder="BASE32SECRETKEY"/></div><div class="mob-row2"><div class="mob-field"><label>Algorithm</label><select id="mobInput_otpAlgo"><option value="SHA1">SHA1</option><option value="SHA256">SHA256</option><option value="SHA512">SHA512</option></select></div><div class="mob-field"><label>Period (sec)</label><input id="mobInput_otpPeriod" value="30" type="number" min="15" max="120"/></div></div>' }
  };

  window.mobSelectType = function(type, btn) {
    currentType = type;
    // Pills are now nested inside .mob-type-sections > .mob-type-group > .mob-type-grid
    document.querySelectorAll('#mobTypeGrid .mob-type-pill').forEach(function(p) { p.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    mobRenderQrForm(type);
    // Sync desktop sidebar
    var di = document.querySelector('.sidebar-item[data-type="' + type + '"]');
    if (di) { document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('active'); }); di.classList.add('active'); selectType(type, di); }
  };

  function mobRenderQrForm(type) {
    var def = qrForms[type] || qrForms.url;
    document.getElementById('mobQrFormLabel').textContent = def.label;
    document.getElementById('mobQrFormBody').innerHTML = def.html;
  }


  /* ── Shared utility: copy a canvas to a wrapper element ── */
  function mobCopyCanvasTo(sourceCanvas, wrapId, extraStyle) {
    if (!sourceCanvas || sourceCanvas.style.display === 'none') return false;
    var wrap = document.getElementById(wrapId);
    if (!wrap) return false;
    var cl = document.createElement('canvas');
    cl.width = sourceCanvas.width;
    cl.height = sourceCanvas.height;
    cl.style.cssText = extraStyle || 'display:block;max-width:100%;';
    cl.getContext('2d').drawImage(sourceCanvas, 0, 0);
    wrap.innerHTML = '';
    wrap.appendChild(cl);
    return true;
  }

  function v1SyncMobileQrFields(){
    var body=document.getElementById('mobQrFormBody');
    if(!body) return;
    body.querySelectorAll('[id^="mobInput_"]').forEach(function(mobEl){
      var targetId=mobEl.id.replace(/^mobInput_/, '');
      var target=document.getElementById(targetId);
      if(target && 'value' in target) target.value=mobEl.value;
    });
  }
  window.mobGenerateQR = function() {
    v1SyncMobileQrFields();
    // Sync all appearance values to desktop inputs before generating
    document.getElementById('qrSize').value  = document.getElementById('mobQrSize').value;
    document.getElementById('qrEcc').value   = document.getElementById('mobQrEcc').value;
    // Sync colors via shared helper (handles oninput miss on slow devices)
    var _dc = document.getElementById('mobDarkColor');
    var _lc = document.getElementById('mobLightColor');
    if (_dc && _lc) mobSyncColors(_dc.value, _lc.value);
    generateQR();
    setTimeout(function() {
      var dc = document.querySelector('#qrcode canvas');
      var mw = document.getElementById('mobQrcode');
      if (dc && mw) {
        var cl = document.createElement('canvas');
        cl.width = dc.width; cl.height = dc.height;
        cl.style.cssText = 'display:block;border-radius:2px;max-width:100%;';
        cl.getContext('2d').drawImage(dc, 0, 0);
        mw.innerHTML = ''; mw.appendChild(cl);
        var mt = document.getElementById('qrMetaType').textContent;
        var md = document.getElementById('qrMetaData').textContent;
        document.getElementById('mobQrMetaType').textContent = mt;
        document.getElementById('mobQrMetaData').textContent = md;
        document.getElementById('mobQrMeta').style.display = mt ? 'block' : 'none';
      }
    }, QR_MIRROR_DELAY);
  };


  /* ── Shared utility: sync mobile color pickers to desktop inputs ── */
  function mobSyncColors(dark, light) {
    var fields = {
      'mobDarkColor': dark, 'mobDarkHex': dark, 'mobDarkSwatch': dark,
      'mobLightColor': light, 'mobLightHex': light, 'mobLightSwatch': light,
      'darkColor': dark, 'darkHex': dark,
      'lightColor': light, 'lightHex': light
    };
    Object.keys(fields).forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'INPUT') el.value = fields[id];
      else el.style.background = fields[id]; // swatch div
    });
  }

  function mobSyncBcColors(bar, bg) {
    var fields = {
      'mobBcBarColor': bar, 'mobBcBarHex': bar, 'mobBcBarSwatch': bar,
      'mobBcBgColor': bg, 'mobBcBgHex': bg, 'mobBcBgSwatch': bg,
      'bcBarColor': bar, 'bcBarHex': bar,
      'bcBgColor': bg, 'bcBgHex': bg
    };
    Object.keys(fields).forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'INPUT') el.value = fields[id];
      else el.style.background = fields[id];
    });
  }

  window.mobApplyQRPreset = function(dark, light) {
    mobSyncColors(dark, light);
  };
  window.mobDownloadQR = function() { var c = document.querySelector('#mobQrcode canvas') || document.querySelector('#qrcode canvas'); if (!c) { toast('Generate a QR code first'); return; } var a = document.createElement('a'); a.download = 'qrix-' + currentType + '.png'; a.href = c.toDataURL(); document.body.appendChild(a); a.click(); a.remove(); toast('PNG saved'); };
  window.mobDownloadSVG = function() { if (typeof downloadSVG === 'function') downloadSVG(); };
  window.mobCopyQRData = function() { if (typeof copyQRData === 'function') copyQRData(); };
  window.mobShareQR = function() { if (typeof openShareModal === 'function') openShareModal(); };

  /* ══ BARCODE ══ */
  var fmtMeta = {
    CODE128:{t:'CODE 128',d:'High-density alphanumeric. Universal across retail and shipping.',b:['Full ASCII','Variable Length']},
    CODE39:{t:'CODE 39',d:'Alphanumeric. Widely used in non-retail environments.',b:['A-Z 0-9']},
    EAN13:{t:'EAN-13',d:'Global retail standard. 12-13 digits.',b:['12-13 digits','Retail']},
    EAN8:{t:'EAN-8',d:'Compact retail. 7-8 digits.',b:['7-8 digits']},
    UPCA:{t:'UPC-A',d:'US retail standard. 12 digits.',b:['12 digits']},
    UPCE:{t:'UPC-E',d:'Compressed UPC. 6-8 digits.',b:['6-8 digits']},
    ITF14:{t:'ITF-14',d:'Logistics/cartons. 14 digits.',b:['14 digits']},
    ITF:{t:'ITF',d:'Numeric shipping labels. Even digit count.',b:['Numeric']},
    CODABAR:{t:'Codabar',d:'Libraries and medical.',b:['0-9 - $ : /']},
    CODE93:{t:'CODE 93',d:'More compact than Code 39.',b:['Full ASCII']},
    MSI:{t:'MSI',d:'Warehouse inventory.',b:['Numeric']},
    PHARMACODE:{t:'Pharmacode',d:'Pharmaceutical. Number 3-131070.',b:['3-131070']}
  };

  window.mobSelectFormat = function(fmt, btn) {
    document.querySelectorAll('.mob-format-pill').forEach(function(p) { p.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    document.getElementById('mobBcFmtBadge').textContent = fmt;
    var m = fmtMeta[fmt] || {};
    document.getElementById('mobFmtTitle').textContent = m.t || fmt;
    document.getElementById('mobFmtDesc').textContent = m.d || '';
    document.getElementById('mobFmtBadges').innerHTML = (m.b || []).map(function(b) { return '<span class="mob-cap-badge">' + b + '</span>'; }).join('');
    // Sync desktop
    if (typeof selectFormat === 'function') { var db = document.querySelector('.format-btn[data-format="' + fmt + '"]'); selectFormat(fmt, db); }
    if (typeof selectFormatChip === 'function') { var dc = document.querySelector('.format-chip[data-format="' + fmt + '"]'); selectFormatChip(fmt, dc); }
  };

  window.mobSyncBcInput = function() {
    var val = document.getElementById('mobBarcodeInput').value;
    var di = document.getElementById('barcodeInput'); if (di) di.value = val;
    if (typeof validateBarcodeInput === 'function') validateBarcodeInput();
    var msg = document.getElementById('barcodeValidationMsg');
    document.getElementById('mobBcValMsg').textContent = msg ? msg.textContent : '';
  };

  window.mobGenerateBarcode = function() {
    // Sync all mobile values to desktop inputs before generating
    var val = document.getElementById('mobBarcodeInput').value;
    var di = document.getElementById('barcodeInput'); if (di) di.value = val;

    var hr = document.getElementById('mobBcHeightRange');
    var sr = document.getElementById('mobBcScaleRange');
    var st = document.getElementById('mobBcShowText');
    var barC = document.getElementById('mobBcBarColor');
    var bgC  = document.getElementById('mobBcBgColor');

    if (hr) { var dh = document.getElementById('bcHeight'); if (dh) dh.value = hr.value; }
    if (sr) { var ds = document.getElementById('bcScale'); if (ds) ds.value = sr.value; }
    if (st) { var dt = document.getElementById('bcShowText'); if (dt) dt.checked = st.checked; }
    if (barC && bgC) mobSyncBcColors(barC.value, bgC.value);

    if (typeof generateBarcode === 'function') generateBarcode();
    setTimeout(function() {
      // Use shared canvas-copy utility
      var dc = document.getElementById('barcodeCanvas');
      if (dc) {
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = dc.width; tmpCanvas.height = dc.height;
        tmpCanvas.style.cssText = 'display:block;max-width:100%;image-rendering:pixelated;';
        tmpCanvas.getContext('2d').drawImage(dc, 0, 0);
        var mw = document.getElementById('mobBarcodeCanvasWrap');
        if (mw && dc.style.display !== 'none') { mw.innerHTML = ''; mw.appendChild(tmpCanvas); }
      }
    }, BC_MIRROR_DELAY);
  };

  window.mobApplyBcPreset = function(bar, bg) {
    mobSyncBcColors(bar, bg);
  };



  window.mobShareBarcode = function() {
    var c = document.getElementById('barcodeCanvas');
    if (!c || c.style.display === 'none') { toast('Generate a barcode first'); return; }
    if (navigator.share) { c.toBlob(function(blob) { try { navigator.share({files:[new File([blob],'barcode.png',{type:'image/png'})],title:'Barix Barcode'}); } catch(ex) { downloadBarcodePNG(); } }); }
    else { downloadBarcodePNG(); }
  };

  /* ══ DECODE — file upload ══ */
  window.mobHandleQRFile = function(e) { var f = e.target.files[0]; if (f) processQRFile(f); };

  function processQRFile(file) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var p = document.getElementById('mobQrDecodePreview'), pw = document.getElementById('mobQrDecodePreviewWrap');
        p.src = ev.target.result; pw.style.display = 'block';
        var canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        var id = canvas.getContext('2d').getImageData(0,0,img.width,img.height);
        var result = jsQR(id.data, id.width, id.height);
        var card = document.getElementById('mobQrReadResult'), txt = document.getElementById('mobQrReadText');
        card.classList.add('show');
        if (result) { txt.textContent = result.data; addToHistory({type:'qrix',label:'QR Decode',data:result.data,ts:Date.now(),source:'decode'}); toast('QR decoded ✓'); }
        else { txt.textContent = 'No QR code detected — try a clearer image.'; }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }


  window.mobCopyDecoded = function(id) {
    var el = document.getElementById(id); if (!el || !el.textContent) { toast('Nothing to copy'); return; }
    _clipboardCopy(el.textContent);
  };

  /* ══ LIVE SCANNER ══ */
  /* ── Constants ── */
  var DECODE_INTERVAL   = 66;   // ms between decode attempts (~15fps)
  var DECODE_MAX_SIZE   = 640;  // px — downsample for performance
  var SCAN_COOLDOWN_MS  = 3000; // ms before same code can re-trigger
  var FLASH_DURATION_MS = 380;  // ms for hit flash effect
  var TOAST_DURATION_MS = 2200; // ms toast stays visible
  var RECENTS_MAX       = 8;    // max recent scan items shown
  var QR_MIRROR_DELAY   = 80;   // ms after generateQR before mirroring canvas
  var BC_MIRROR_DELAY   = 100;  // ms after generateBarcode before mirroring canvas

  /* ── State ── */
  var _scanStream = null, _scanRAF = null, _scanMode = 'both';
  var _scanFacing = 'environment', _torchOn = false, _torchTrack = null;
  var _lastScan = null, _scanCooldown = false, _scanActive = false;
  var _scanRecents = [], _nativeDet = null;
  var _scanCtx = null;
  var _decoding = false;
  var _lastDecodeTime = 0;

  if ('BarcodeDetector' in window) {
    BarcodeDetector.getSupportedFormats().then(function(fmts) {
      _nativeDet = new BarcodeDetector({ formats: fmts });
    }).catch(function() {});
  }

  window.mobStartScanner = async function() {
    var video    = document.getElementById('mobScanVideo');
    var camStart = document.getElementById('mobCamStart');
    var scanStatus = document.getElementById('mobScanStatus');
    var stopBtn  = document.getElementById('mobScanStopBtn');
    var scanLine = document.getElementById('mobScanLine');
    var modeRow  = document.getElementById('mobScanModeRow');
    var prev = document.getElementById('mobCamErrOverlay'); if (prev) prev.remove();

    // Always reset state on (re)start so same QR can be decoded again
    _lastScan = null;
    _scanCooldown = false;
    _decoding = false;

    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: _scanFacing },
          width:  { ideal: 1280, max: 1920 },
          height: { ideal: 1280, max: 1920 }
        }
      });
      _scanStream = stream;
      video.srcObject = stream;
      await video.play();

      var track = stream.getVideoTracks()[0];
      _torchTrack = track;
      var caps = track.getCapabilities ? track.getCapabilities() : {};
      var tb = document.getElementById('mobTorchBtn');
      if (tb) tb.style.display = caps.torch ? 'flex' : 'none';

      camStart.classList.add('hidden');
      scanStatus.style.display = 'flex';
      stopBtn.style.display = 'block';
      scanLine.classList.add('active');
      modeRow.style.display = 'grid';
      _scanActive = true;
      _lastDecodeTime = 0;
      // Show video feed now that stream is ready
      video.style.display = 'block';

      // Cache canvas context
      var canvas = document.getElementById('mobScanCanvas');
      _scanCtx = canvas.getContext('2d', { willReadFrequently: true });
      _scanLoop();
    } catch(err) { _showCamErr(err); }
  };

  function _scanLoop() {
    if (!_scanActive) return;
    var video  = document.getElementById('mobScanVideo');
    var canvas = document.getElementById('mobScanCanvas');
    if (!video || video.readyState < 2) {
      _scanRAF = requestAnimationFrame(_scanLoop);
      return;
    }

    // Draw video frame to canvas every RAF (smooth preview)
    var vw = video.videoWidth, vh = video.videoHeight;
    if (vw && vh) {
      // Decode at max 640px for performance — downsample heavy frames
      var DECODE_SIZE = Math.min(640, Math.min(vw, vh));
      var drawSize = Math.min(vw, vh);
      var ox = (vw - drawSize) / 2, oy = (vh - drawSize) / 2;

      if (canvas.width !== DECODE_SIZE || canvas.height !== DECODE_SIZE) {
        canvas.width  = DECODE_SIZE;
        canvas.height = DECODE_SIZE;
        _scanCtx = canvas.getContext('2d', { willReadFrequently: true });
      }
      if (_scanCtx) {
        _scanCtx.drawImage(video, ox, oy, drawSize, drawSize, 0, 0, DECODE_SIZE, DECODE_SIZE);
      }
    }

    // Throttle decode to ~15fps — avoids saturating main thread
    var now = performance.now();
    if (!_scanCooldown && !_decoding && _scanCtx && (now - _lastDecodeTime) >= DECODE_INTERVAL) {
      _lastDecodeTime = now;
      _decoding = true;
      _attemptDecode(canvas, _scanCtx).finally(function() { _decoding = false; });
    }

    _scanRAF = requestAnimationFrame(_scanLoop);
  }

  /* ZXing MultiFormatReader — correct API for v0.19 */
  var _zxingReader = null;
  function _getZxingReader() {
    if (_zxingReader) return _zxingReader;
    try {
      if (window.ZXing && window.ZXing.MultiFormatReader) {
        var hints = new Map();
        hints.set(window.ZXing.DecodeHintType.TRY_HARDER, false);
        hints.set(window.ZXing.DecodeHintType.POSSIBLE_FORMATS, [
          window.ZXing.BarcodeFormat.CODE_128,
          window.ZXing.BarcodeFormat.CODE_39,
          window.ZXing.BarcodeFormat.CODE_93,
          window.ZXing.BarcodeFormat.EAN_13,
          window.ZXing.BarcodeFormat.EAN_8,
          window.ZXing.BarcodeFormat.UPC_A,
          window.ZXing.BarcodeFormat.UPC_E,
          window.ZXing.BarcodeFormat.ITF,
          window.ZXing.BarcodeFormat.CODABAR,
        ]);
        _zxingReader = new window.ZXing.MultiFormatReader(hints);
      }
    } catch(e) {}
    return _zxingReader;
  }

  function _zxingDecodeCanvas(canvas) {
    /* ZXing v0.19 correct decode path:
       canvas → HTMLCanvasElementLuminanceSource → BinaryBitmap → decode */
    try {
      var zx = window.ZXing;
      if (!zx) return null;
      var reader = _getZxingReader();
      if (!reader) return null;
      var luminance = new zx.HTMLCanvasElementLuminanceSource(canvas);
      var hybrid   = new zx.HybridBinarizer(luminance);
      var bitmap   = new zx.BinaryBitmap(hybrid);
      var result   = reader.decode(bitmap);
      if (result) return result;
    } catch(e) {
      // NotFoundException is thrown when no barcode found — normal, not an error
    }
    return null;
  }

  async function _attemptDecode(canvas, ctx) {
    // ── 1. jsQR — best for QR, synchronous, fast ──────────────────────
    if (_scanMode === 'both' || _scanMode === 'qr') {
      try {
        var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var qr = jsQR(id.data, canvas.width, canvas.height, { inversionAttempts: 'dontInvert' });
        if (!qr) qr = jsQR(id.data, canvas.width, canvas.height, { inversionAttempts: 'invertFirst' });
        if (qr && qr.data) { _onHit(qr.data, 'QR Code'); return; }
      } catch(e) {}
    }

    // ── 2. Native BarcodeDetector — GPU-accelerated on Chrome/Android ─
    if (_nativeDet && (_scanMode === 'both' || _scanMode === 'barcode')) {
      try {
        var res = await _nativeDet.detect(canvas);
        if (res && res.length > 0) {
          var hit = res[0];
          // Skip QR types here — jsQR already handled them above
          if (hit.format && hit.format.toLowerCase().includes('qr')) {
            if (_scanMode === 'qr' || _scanMode === 'both') {
              _onHit(hit.rawValue, 'QR Code'); return;
            }
          } else {
            _onHit(hit.rawValue, hit.format ? hit.format.replace(/_/g,' ') : 'Barcode');
            return;
          }
        }
      } catch(e) {}
    }

    // ── 3. ZXing-js — correct v0.19 API — iOS/Firefox fallback ───────
    if ((_scanMode === 'both' || _scanMode === 'barcode')) {
      try {
        var zxResult = _zxingDecodeCanvas(canvas);
        if (zxResult && zxResult.getText()) {
          var zxFmt = 'Barcode';
          try {
            // Map numeric BarcodeFormat enum to readable name
            var fmtNum = zxResult.getBarcodeFormat();
            var fmtMap = {0:'Aztec',1:'Codabar',2:'Code 39',3:'Code 93',4:'Code 128',
              5:'Data Matrix',6:'EAN 8',7:'EAN 13',8:'ITF',9:'MaxiCode',
              10:'PDF 417',11:'QR Code',12:'RSS 14',13:'RSS Expanded',
              14:'UPC A',15:'UPC E',16:'UPC/EAN Extension'};
            zxFmt = fmtMap[fmtNum] || 'Barcode';
          } catch(e) {}
          // Skip QR — jsQR already handles it
          if (zxFmt !== 'QR Code') {
            _onHit(zxResult.getText(), zxFmt);
            return;
          }
        }
      } catch(e) {}
    }
  }

  function _onHit(value, format) {
    if (_scanCooldown || value === _lastScan) return;
    _lastScan = value;
    _scanCooldown = true;
    // Flash + haptic
    var wrap = document.getElementById('mobCamWrap');
    var fl = document.createElement('div');
    fl.className = 'mob-cam-flash';
    wrap.appendChild(fl);
    setTimeout(function() { fl.remove(); }, FLASH_DURATION_MS);
    if (navigator.vibrate) navigator.vibrate([60, 30, 60]);
    // Show result
    document.getElementById('mobLiveResultBadge').textContent = format;
    document.getElementById('mobLiveResultValue').textContent = value;
    document.getElementById('mobLiveResult').style.display = 'block';
    // Recent list
    _scanRecents.unshift({ value: value, format: format, ts: Date.now() });
    if (_scanRecents.length > RECENTS_MAX) _scanRecents.pop();
    _renderRecents();
    // Save to history
    addToHistory({
      type: format === 'QR Code' ? 'qrix' : 'barix',
      label: format, data: value,
      ts: Date.now(), source: 'live-scan'
    });
    toast('✓ ' + format + ' decoded');
    // Resume after 3s
    setTimeout(function() { _scanCooldown = false; }, SCAN_COOLDOWN_MS);
  }

  function _renderRecents() {
    var wrap = document.getElementById('mobScanRecents'), list = document.getElementById('mobScanRecentsList');
    if (!_scanRecents.length) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    list.innerHTML = _scanRecents.map(function(item, i) {
      var trunc = item.value.length > 44 ? item.value.slice(0,44)+'…' : item.value;
      return '<div class="mob-scan-recent-item" data-idx="' + i + '"><span class="mob-scan-recent-icon">' + (item.format==='QR Code'?'🔷':'▤') + '</span><span class="mob-scan-recent-data">' + escH(trunc) + '</span><span class="mob-scan-recent-fmt">' + escH(item.format) + '</span></div>';
    }).join('');
    list.querySelectorAll('.mob-scan-recent-item').forEach(function(el) {
      el.addEventListener('click', function() { var d = _scanRecents[parseInt(el.dataset.idx)]; if (d) { _clipboardCopy(d.value); toast('Copied ✓'); } });
    });
  }

  window.mobStopScanner = function() {
    _scanActive = false; _decoding = false;
    if (_scanRAF) { cancelAnimationFrame(_scanRAF); _scanRAF = null; }
    if (_scanStream) { _scanStream.getTracks().forEach(function(t) { t.stop(); }); _scanStream = null; }
    _torchTrack = null; _torchOn = false; _scanCtx = null;
    var video = document.getElementById('mobScanVideo');
    if (video) { video.srcObject = null; video.style.display = 'none'; }
    var cs = document.getElementById('mobCamStart'); if (cs) cs.classList.remove('hidden');
    var ss = document.getElementById('mobScanStatus'); if (ss) ss.style.display = 'none';
    var sb = document.getElementById('mobScanStopBtn'); if (sb) sb.style.display = 'none';
    var sl = document.getElementById('mobScanLine'); if (sl) sl.classList.remove('active');
    var mr = document.getElementById('mobScanModeRow'); if (mr) mr.style.display = 'none';
    var tb = document.getElementById('mobTorchBtn'); if (tb) { tb.style.display = 'none'; tb.classList.remove('torch-on'); }
    // FIX: hide result card when scanner stops
    var lr = document.getElementById('mobLiveResult'); if (lr) lr.style.display = 'none';
  };

  window.mobToggleTorch = async function() {
    if (!_torchTrack) return;
    try { _torchOn = !_torchOn; await _torchTrack.applyConstraints({advanced:[{torch:_torchOn}]}); document.getElementById('mobTorchBtn').classList.toggle('torch-on', _torchOn); }
    catch(e) { toast('Torch not available'); _torchOn = false; }
  };

  window.mobSetScanMode = function(mode, btn) {
    _scanMode = mode;
    _lastScan = null;
    _scanCooldown = false; // FIX: allow immediate decode after mode switch
    document.querySelectorAll('.mob-scan-mode').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
  };

  window.mobRefreshScan = function() {
    document.getElementById('mobLiveResult').style.display = 'none';
    _lastScan = null; _scanCooldown = false;
    toast('Ready — point at next code');
  };
  window.mobDismissLiveResult = function() { document.getElementById('mobLiveResult').style.display = 'none'; _lastScan = null; _scanCooldown = false; };
  window.mobScanAgain = function() { window.mobRefreshScan(); };
  window.mobCopyLiveResult = function() { var v = document.getElementById('mobLiveResultValue').textContent; if (v) _clipboardCopy(v); };
  window.mobOpenLiveResult = function() {
    var v = document.getElementById('mobLiveResultValue').textContent; if (!v) return;
    if (v.match(/^https?:\/\//)) window.open(v,'_blank','noopener');
    else { _clipboardCopy(v); toast('Copied (not a URL)'); }
  };

  function _showCamErr(err) {
    var wrap = document.getElementById('mobCamWrap');
    var msg = err && err.name === 'NotFoundError' ? 'No camera found on this device.' : err && err.name === 'NotAllowedError' ? 'Camera permission denied. Please allow access in browser settings.' : err && err.name === 'NotReadableError' ? 'Camera is in use by another app.' : 'Camera access failed.';
    var div = document.createElement('div'); div.className = 'mob-cam-error'; div.id = 'mobCamErrOverlay';
    div.innerHTML = '<div class="mob-cam-error-icon">📷</div><div class="mob-cam-error-msg">' + msg + '</div><button class="mob-cam-error-btn" onclick="document.getElementById(\'mobCamErrOverlay\').remove();mobStartScanner()">Try Again</button>';
    wrap.appendChild(div);
  }

  document.addEventListener('visibilitychange', function() { if (document.hidden && _scanActive) mobStopScanner(); });

  /* ══ HISTORY ══ */
  window._mobHistFilter = 'all';
  window.mobFilterHistory = function(filter, btn) {
    window._mobHistFilter = filter;
    document.querySelectorAll('.mob-hist-chip').forEach(function(c) { c.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    mobRenderHistory(filter);
  };

  function mobRenderHistory(filter) {
    var list = document.getElementById('mobHistoryList'); if (!list) return;
    var items = typeof getHistory === 'function' ? getHistory().slice() : [];
    if (filter !== 'all') items = items.filter(function(i) { return i.type === filter; });
    items.sort(function(a,b) { return b.ts - a.ts; });
    if (!items.length) { list.innerHTML = '<div class="mob-hist-empty">No history yet.<br>Generate or decode something to see it here.</div>'; return; }
    var icons = {qrix:'🔷',barix:'▤',decode:'🔎'};
    list.innerHTML = items.slice(0,50).map(function(item, idx) {
      var d = item.data ? (item.data.length > 42 ? item.data.slice(0,42)+'…' : item.data) : '—';
      return '<div class="mob-hist-item" data-hidx="'+idx+'"><div class="mob-hist-icon">'+(icons[item.type]||'📄')+'</div><div class="mob-hist-content"><div class="mob-hist-type">'+escH(item.label||item.type)+'</div><div class="mob-hist-data">'+escH(d)+'</div></div><div class="mob-hist-time">'+timeAgo(item.ts)+'</div></div>';
    }).join('');
    var sorted = items.slice(0,50);
    list.querySelectorAll('.mob-hist-item').forEach(function(el) {
      el.addEventListener('click', function() { var d = sorted[parseInt(el.dataset.hidx)]; if (d && d.data) { _clipboardCopy(d.data); toast('Copied ✓'); } });
    });
  }

  // Refresh history when addToHistory called
  var _origAdd = window.addToHistory;
  window.addToHistory = function(item) {
    if (_origAdd) _origAdd(item);
    var hv = document.getElementById('mob-history');
    if (hv && hv.classList.contains('active')) mobRenderHistory(window._mobHistFilter || 'all');
  };

  /* ══ HELPERS ══ */
  function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function timeAgo(ts) { var d = Date.now()-ts; if (d<60000) return 'Just now'; if (d<3600000) return Math.floor(d/60000)+'m ago'; if (d<86400000) return Math.floor(d/3600000)+'h ago'; return Math.floor(d/86400000)+'d ago'; }

  /* ══ INIT ══ */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mobInit);
  else setTimeout(mobInit, 0);

})();;

(function(){
  function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}
  function clean(s){return (s||'').replace(/\s+/g,' ').trim();}
  function labelFor(el){
    if(el.id){var explicit=document.querySelector('label[for="'+CSS.escape(el.id)+'"]');if(explicit)return clean(explicit.textContent);}
    var wrap=el.closest('label'); if(wrap) return clean(wrap.textContent);
    var group=el.closest('.field,.field-group,.mob-field,.control,.setting,.input-wrap,.pwned-input-wrap,.breach-field-wrap');
    if(group){var lab=group.querySelector('label,.field-label,.label'); if(lab) return clean(lab.textContent);}
    return clean(el.getAttribute('placeholder')||el.getAttribute('title')||el.textContent);
  }
  ready(function(){
    document.querySelectorAll('button:not([aria-label])').forEach(function(btn){var text=clean(btn.textContent||btn.title); if(text) btn.setAttribute('aria-label',text);});
    document.querySelectorAll('input:not([aria-label]),textarea:not([aria-label]),select:not([aria-label])').forEach(function(el){var text=labelFor(el); if(text) el.setAttribute('aria-label',text);});
    document.querySelectorAll('a[target="_blank"]').forEach(function(a){ if(!a.rel) a.rel='noopener noreferrer'; });
  });
})();;