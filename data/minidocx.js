/* ==========================================================
   Base 5 - a very small Word (.docx) maker, no library needed.
   A .docx is a zip of three XML files; this writes them, stored
   without compression, and hands back a Blob.
     B5Docx.make([{ text, size, bold, gap }...]) -> Blob
       size in points (default 11), gap = space after in points
     B5Docx.download(name, paras)
   ASCII only in this file (text is UTF-8 encoded when written).
   ========================================================== */
(function(){
"use strict";
if(window.B5Docx) return;
var CRC = (function(){ var t = [], c, n, k; for(n = 0; n < 256; n++){ c = n; for(k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b){ var c = 0xFFFFFFFF; for(var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function xml(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""); }

function para(p){
  var rpr = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>' + (p.bold ? "<w:b/>" : "") + '<w:sz w:val="' + Math.round((p.size || 11) * 2) + '"/></w:rPr>';
  var lines = String(p.text == null ? "" : p.text).split("\n"), runs = "";
  lines.forEach(function(l, i){ runs += (i ? "<w:br/>" : "") + '<w:t xml:space="preserve">' + xml(l) + "</w:t>"; });
  return '<w:p><w:pPr><w:spacing w:after="' + Math.round((p.gap == null ? 6 : p.gap) * 20) + '"/></w:pPr><w:r>' + rpr + runs + "</w:r></w:p>";
}

function zip(files){
  var enc = new TextEncoder(), parts = [], central = [], off = 0, d = new Date();
  var time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  var date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  function hdr(n){ return new DataView(new ArrayBuffer(n)); }
  files.forEach(function(f){
    var name = enc.encode(f.name), data = enc.encode(f.data), crc = crc32(data);
    var h = hdr(30);
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true);
    h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(h.buffer, name, data);
    var c = hdr(46);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(42, off, true);
    central.push(c.buffer, name);
    off += 30 + name.length + data.length;
  });
  var size = 0; central.forEach(function(x){ size += x.byteLength; });
  var e = hdr(22);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, size, true); e.setUint32(16, off, true);
  return parts.concat(central, [e.buffer]);
}

function make(paras){
  var W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  var doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="' + W + '"><w:body>' +
    paras.map(para).join("") +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
  var types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  var rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  return new Blob(zip([{ name: "[Content_Types].xml", data: types }, { name: "_rels/.rels", data: rels }, { name: "word/document.xml", data: doc }]),
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
function download(name, paras){
  var a = document.createElement("a"), u = URL.createObjectURL(make(paras));
  a.href = u; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); }, 1500);
}
window.B5Docx = { make: make, download: download };
})();
