/* ==========================================================
   Base 5 - one lock for the whole site
   Every private page (My targets, project pages, Milestones,
   Rebuild targets, the live view) opens the same way:

   1. Sign-in first. If this browser is signed in to a school
      Google account listed in the People tab of Jay's sheet, the
      sheet says who it is and hands over that person's code (or
      the staff passphrase for staff), and the page opens itself.
   2. Code as backup. Otherwise the page asks for the code: four
      numbers per student, one passphrase for staff.

   No code is written anywhere on the site. /data/b5keys.js holds
   only scrambled checks of them (PBKDF2), made by Rebuild targets.

   B5Lock.whoami()            -> Promise of { who, code } or
                                 { staff: true, pass } or null
   B5Lock.checkCode(who, c)   -> Promise of true / false
   B5Lock.checkStaff(pass)    -> Promise of true / false
   Needs /data/b5site.js (for the sheet) and /data/b5keys.js.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(window.B5Lock) return;

function b64(s){ var raw = atob(s), a = new Uint8Array(raw.length); for(var i = 0; i < raw.length; i++) a[i] = raw.charCodeAt(i); return a; }
function toB64(buf){ var a = new Uint8Array(buf), s = ""; for(var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }

function bits(secret, saltB64, iter){
  return crypto.subtle.importKey("raw", new TextEncoder().encode(String(secret)), "PBKDF2", false, ["deriveBits"])
    .then(function(k){ return crypto.subtle.deriveBits({ name: "PBKDF2", salt: b64(saltB64), iterations: iter, hash: "SHA-256" }, k, 256); })
    .then(toB64);
}
function check(entry, secret){
  var K = window.B5KEYS;
  if(!K || !entry || !secret) return Promise.resolve(false);
  return bits(secret, entry.salt, K.iter).then(function(h){ return h === entry.hash; }, function(){ return false; });
}

var asked = null;
function whoami(){
  if(asked) return asked;
  var S = window.B5Site;
  if(!S || !S.call || S.guest || !S.syncUrl) return (asked = Promise.resolve(null));
  asked = S.call("whoami").then(function(o){
    if(!o || !o.ok) return null;
    if(o.staff && o.pass) return { staff: true, pass: o.pass, who: o.who || "Staff" };
    if(o.who && o.code) return { who: o.who, code: String(o.code) };
    return null;
  }, function(){ return null; });
  return asked;
}

window.B5Lock = {
  whoami: whoami,
  checkCode: function(who, code){ var K = window.B5KEYS; return check(K && K.students && K.students[who], code); },
  checkStaff: function(pass){ var K = window.B5KEYS; return check(K && K.staff, pass); },
  bits: bits
};
})();
