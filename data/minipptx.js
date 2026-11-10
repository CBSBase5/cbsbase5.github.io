/* ==========================================================
   Base 5 - a very small PowerPoint (.pptx) maker, no library.
   A .pptx is a zip of XML files plus any pictures; this writes
   them, stored without compression, and hands back a Blob. Made
   for evidence slides that go into a student's evidence deck in
   Google Slides (File > Import slides) or PowerPoint.

     B5Pptx.make(slides) -> Blob
     B5Pptx.download(filename, slides)

   A slide: { bg: "FFFDF8", shapes: [ ... ] }, sizes in inches on a
   13.333 x 7.5 inch (16:9) slide. Shapes:
     { t: "rect", x, y, w, h, fill: "007291", round: true }
     { t: "text", x, y, w, h, fill, anchor: "t"|"ctr"|"b", inset,
       paras: [ { align: "l"|"ctr"|"r", after: 4,
                  runs: [ { text, size, bold, italic, color } ] } ] }
     { t: "img", x, y, w, h, data: Uint8Array, ext: "png"|"jpeg" }
   ASCII only in this file (text is UTF-8 encoded when written).
   ========================================================== */
(function(){
"use strict";
if(window.B5Pptx) return;
var EMU = 914400;
var NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
var HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
var CRC = (function(){ var t = [], c, n, k; for(n = 0; n < 256; n++){ c = n; for(k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b){ var c = 0xFFFFFFFF; for(var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function xml(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""); }
function e(v){ return Math.round(v * EMU); }
function hex(c){ return String(c || "000000").replace("#", "").toUpperCase(); }

/* ---------- zip (stored), text or binary ---------- */
function zip(files){
  var enc = new TextEncoder(), parts = [], central = [], off = 0, d = new Date();
  var time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  var date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  function dv(n){ return new DataView(new ArrayBuffer(n)); }
  files.forEach(function(f){
    var name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
    var h = dv(30);
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true);
    h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(h.buffer, name, data);
    var c = dv(46);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(42, off, true);
    central.push(c.buffer, name);
    off += 30 + name.length + data.length;
  });
  var size = 0; central.forEach(function(x){ size += x.byteLength; });
  var end = dv(22);
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, size, true); end.setUint32(16, off, true);
  return new Blob(parts.concat(central, [end.buffer]), { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
}

/* ---------- the fixed parts ---------- */
var THEME = HEAD + '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Base 5"><a:themeElements>' +
  '<a:clrScheme name="Base 5"><a:dk1><a:srgbClr val="0A2F38"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="0A2F38"/></a:dk2><a:lt2><a:srgbClr val="FFFDF8"/></a:lt2>' +
  '<a:accent1><a:srgbClr val="007291"/></a:accent1><a:accent2><a:srgbClr val="EF7724"/></a:accent2><a:accent3><a:srgbClr val="7B4B8F"/></a:accent3><a:accent4><a:srgbClr val="00A6C9"/></a:accent4>' +
  '<a:accent5><a:srgbClr val="E0950B"/></a:accent5><a:accent6><a:srgbClr val="1E9E5A"/></a:accent6><a:hlink><a:srgbClr val="007291"/></a:hlink><a:folHlink><a:srgbClr val="7B4B8F"/></a:folHlink></a:clrScheme>' +
  '<a:fontScheme name="Base 5"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>' +
  '<a:fmtScheme name="Base 5"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>' +
  '<a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="25400"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="38100"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>' +
  '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>' +
  '<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>' +
  '</a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>';
var GRP = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
var MASTER = HEAD + '<p:sldMaster ' + NS + '><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>' + GRP + '</p:spTree></p:cSld>' +
  '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
  '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>' +
  '<p:txStyles><p:titleStyle><a:lvl1pPr><a:defRPr sz="3200"/></a:lvl1pPr></p:titleStyle><p:bodyStyle><a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr></p:bodyStyle><p:otherStyle><a:lvl1pPr><a:defRPr sz="1800"/></a:lvl1pPr></p:otherStyle></p:txStyles></p:sldMaster>';
var LAYOUT = HEAD + '<p:sldLayout ' + NS + ' type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>' + GRP + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>';
function rels(list){
  return HEAD + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    list.map(function(r){ return '<Relationship Id="' + r[0] + '" Type="http://schemas.openxmlformats.org/' + r[1] + '" Target="' + r[2] + '"/>'; }).join("") + '</Relationships>';
}
var OD = "officeDocument/2006/relationships/";

/* ---------- shapes ---------- */
function shape(s, id, imgRel){
  var xf = '<a:xfrm><a:off x="' + e(s.x) + '" y="' + e(s.y) + '"/><a:ext cx="' + e(s.w) + '" cy="' + e(s.h) + '"/></a:xfrm>';
  var fill = s.fill ? '<a:solidFill><a:srgbClr val="' + hex(s.fill) + '"/></a:solidFill>' : '<a:noFill/>';
  if(s.t === "img"){
    return '<p:pic><p:nvPicPr><p:cNvPr id="' + id + '" name="Picture ' + id + '"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>' +
      '<p:blipFill><a:blip r:embed="' + imgRel + '"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>' + xf + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>';
  }
  if(s.t === "rect"){
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="Shape ' + id + '"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>' + xf +
      '<a:prstGeom prst="' + (s.round ? "roundRect" : "rect") + '"><a:avLst/></a:prstGeom>' + fill + '<a:ln><a:noFill/></a:ln></p:spPr></p:sp>';
  }
  var ins = e(s.inset == null ? .08 : s.inset);
  var paras = (s.paras || []).map(function(p){
    var runs = (p.runs || []).filter(function(r){ return r && r.text != null && r.text !== ""; }).map(function(r){
      return '<a:r><a:rPr lang="en-GB" sz="' + Math.round((r.size || 14) * 100) + '"' + (r.bold ? ' b="1"' : '') + (r.italic ? ' i="1"' : '') + ' dirty="0">' +
        '<a:solidFill><a:srgbClr val="' + hex(r.color || "0A2F38") + '"/></a:solidFill><a:latin typeface="' + xml(r.font || "Arial") + '"/><a:cs typeface="' + xml(r.font || "Arial") + '"/></a:rPr><a:t>' + xml(r.text) + '</a:t></a:r>';
    }).join("");
    return '<a:p><a:pPr algn="' + (p.align || "l") + '"><a:spcAft><a:spcPts val="' + Math.round((p.after == null ? 4 : p.after) * 100) + '"/></a:spcAft></a:pPr>' + runs +
      '<a:endParaRPr lang="en-GB" sz="' + Math.round(((p.runs && p.runs[0] && p.runs[0].size) || 14) * 100) + '" dirty="0"/></a:p>';
  }).join("") || '<a:p><a:endParaRPr lang="en-GB" dirty="0"/></a:p>';
  return '<p:sp><p:nvSpPr><p:cNvPr id="' + id + '" name="Text ' + id + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>' + xf +
    '<a:prstGeom prst="' + (s.round ? "roundRect" : "rect") + '"><a:avLst/></a:prstGeom>' + fill + '<a:ln><a:noFill/></a:ln></p:spPr>' +
    '<p:txBody><a:bodyPr wrap="square" lIns="' + ins + '" tIns="' + ins + '" rIns="' + ins + '" bIns="' + ins + '" anchor="' + (s.anchor || "t") + '" rtlCol="0">' + (s.shrink ? '<a:normAutofit/>' : '<a:noAutofit/>') + '</a:bodyPr><a:lstStyle/>' + paras + '</p:txBody></p:sp>';
}

function make(slides){
  var files = [], media = 0, slideRels = [];
  var ct = '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
    '<Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/>' +
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>' +
    '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>' +
    '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>' +
    '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>';
  slides.forEach(function(sl, n){
    var i = n + 1, id = 2, rl = [["rId1", OD + "slideLayout", "../slideLayouts/slideLayout1.xml"]], tree = "";
    (sl.shapes || []).forEach(function(s){
      var rid = null;
      if(s.t === "img"){
        if(!s.data || !s.data.length) return;
        media++; var ext = s.ext === "png" ? "png" : "jpeg", nm = "image" + media + "." + ext;
        files.push({ name: "ppt/media/" + nm, data: s.data });
        rid = "rId" + (rl.length + 1); rl.push([rid, OD + "image", "../media/" + nm]);
      }
      tree += shape(s, id++, rid);
    });
    var bg = sl.bg ? '<p:bg><p:bgPr><a:solidFill><a:srgbClr val="' + hex(sl.bg) + '"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>' : '';
    files.push({ name: "ppt/slides/slide" + i + ".xml", data: HEAD + '<p:sld ' + NS + '><p:cSld>' + bg + '<p:spTree>' + GRP + tree + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>' });
    files.push({ name: "ppt/slides/_rels/slide" + i + ".xml.rels", data: rels(rl) });
    ct += '<Override PartName="/ppt/slides/slide' + i + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>';
    slideRels.push(["rId" + (i + 2), OD + "slide", "slides/slide" + i + ".xml"]);
  });
  var now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  files.unshift(
    { name: "[Content_Types].xml", data: HEAD + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' + ct + '</Types>' },
    { name: "_rels/.rels", data: rels([["rId1", OD + "officeDocument", "ppt/presentation.xml"], ["rId2", "package/2006/relationships/metadata/core-properties", "docProps/core.xml"], ["rId3", OD + "extended-properties", "docProps/app.xml"]]) },
    { name: "docProps/core.xml", data: HEAD + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Evidence slides</dc:title><dc:creator>Base 5</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + now + '</dcterms:created></cp:coreProperties>' },
    { name: "docProps/app.xml", data: HEAD + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Base 5</Application><Slides>' + slides.length + '</Slides></Properties>' },
    { name: "ppt/presentation.xml", data: HEAD + '<p:presentation ' + NS + ' saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>' +
      '<p:sldIdLst>' + slides.map(function(_, n){ return '<p:sldId id="' + (256 + n) + '" r:id="rId' + (n + 3) + '"/>'; }).join("") + '</p:sldIdLst>' +
      '<p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>' },
    { name: "ppt/_rels/presentation.xml.rels", data: rels([["rId1", OD + "slideMaster", "slideMasters/slideMaster1.xml"], ["rId2", OD + "theme", "theme/theme1.xml"]].concat(slideRels)) },
    { name: "ppt/slideMasters/slideMaster1.xml", data: MASTER },
    { name: "ppt/slideMasters/_rels/slideMaster1.xml.rels", data: rels([["rId1", OD + "slideLayout", "../slideLayouts/slideLayout1.xml"], ["rId2", OD + "theme", "../theme/theme1.xml"]]) },
    { name: "ppt/slideLayouts/slideLayout1.xml", data: LAYOUT },
    { name: "ppt/slideLayouts/_rels/slideLayout1.xml.rels", data: rels([["rId1", OD + "slideMaster", "../slideMasters/slideMaster1.xml"]]) },
    { name: "ppt/theme/theme1.xml", data: THEME }
  );
  return zip(files);
}
function download(filename, slides){
  var blob = make(slides), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  return blob;
}
/* a data: URL (from a canvas or a saved photo) as bytes */
function bytes(dataUrl){
  var m = String(dataUrl || "").match(/^data:image\/(png|jpeg);base64,(.*)$/); if(!m) return null;
  var raw = atob(m[2]), out = new Uint8Array(raw.length);
  for(var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return { data: out, ext: m[1] };
}
window.B5Pptx = { make: make, download: download, bytes: bytes };
})();
