/* ==========================================================
   Base 5 - send to Jay
   One shared component so every tool sends work the same way.

   Use:
     Base5Send.mount(element, {
       tool:     "Writing pad",          // shows in the subject line
       getText:  function(){ ... },      // the work itself
       filename: "writing"               // for the download
     });

   When the shared memory is on (B5Site.syncUrl, see
   /teacher/sync.html) the first button sends it straight into the
   Sends tab of Jay's sheet. Otherwise, and as a backup, every route
   opens a message with the work already written in it, and the
   student presses send. Nothing ever goes on its own.
   ========================================================== */

var Base5Send = (function(){
"use strict";

var TEACHER_EMAIL = "jay.raine@chiltonbridgeschool.co.uk";
var NAME_KEY = "base5.who.v1";

function getName(){
  try{ return localStorage.getItem(NAME_KEY) || "" }catch(e){ return "" }
}
function setName(v){
  try{ localStorage.setItem(NAME_KEY, v) }catch(e){}
}

/* In a student's HQ space, remember when something was last sent, so the
   home page can say how long it has been. Nothing else is stored, and
   nothing happens outside those spaces. */
function hqPrefix(){
  if(window.HQ && window.HQ.prefix) return window.HQ.prefix;
  if(location.pathname.indexOf("/egw/") === 0) return "b5.egw.";
  return null;
}
function noteSent(tool){
  var pre = hqPrefix(); if(!pre) return;
  try{
    var k = pre + "sent.v1", d = JSON.parse(localStorage.getItem(k) || "null") || {};
    d.last = new Date().toISOString(); d.n = (d.n || 0) + 1;
    d.log = (d.log || []).concat([{ t: d.last, tool: String(tool || "").slice(0, 60) }]).slice(-30);
    localStorage.setItem(k, JSON.stringify(d));
  }catch(e){}
  try{ document.dispatchEvent(new CustomEvent("base5sent", { detail: { tool: tool } })); }catch(e){}
}

function stamp(){
  return new Date().toLocaleString("en-GB",{
    weekday:"long", day:"numeric", month:"long", year:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
}

function wrap(opts){
  var who = getName() || "no initials given";
  return [
    opts.tool + " - Base 5",
    "From: " + who,
    "Sent: " + stamp(),
    "",
    "----------",
    "",
    opts.getText(),
    "",
    "----------"
  ].join("\n");
}

function syncUrl(){ var S = window.B5Site; return (S && S.syncUrl && !(S.bridgeDown && S.bridgeDown())) ? S.syncUrl : ""; }
function hqWho(){ return (window.B5Site && window.B5Site.hq) || ""; }

function guestNote(host){
  host.innerHTML = '<div class="sendbox"><p class="sendtitle">Send this to Jay</p>' +
    '<p class="sendwhy">Sending is switched off in guest mode, so nothing here can reach Jay. Students see a Send to Jay button in this spot.</p></div>';
}
function isGuest(){ return !!(window.B5Site && window.B5Site.guest); }

function mount(host, opts){
  if(isGuest()){ guestNote(host); return; }
  var direct = !!syncUrl();
  host.innerHTML =
    '<div class="sendbox">' +
      '<p class="sendtitle">Send this to Jay</p>' +
      (direct
        ? '<p class="sendwhy">Only if you want to. One tap and it lands in Jay\'s list. Nothing goes anywhere until you press it.</p>'
        : '<p class="sendwhy">Only if you want to. It opens a message with your work already in it, ' +
          'and you press send. Nothing goes anywhere on its own.</p>') +
      '<div class="sendwho">' +
        '<label class="sendlab" for="b5who">Your initials</label>' +
        '<input type="text" id="b5who" maxlength="6" placeholder="e.g. LW">' +
      '</div>' +
      '<div class="sendrow">' +
        (direct ? '<button class="btn btn-orange" data-a="sheet">Send to Jay</button>' : '') +
        '<button class="btn ' + (direct ? 'btn-quiet' : 'btn-orange') + '" data-a="gmail">Open in Gmail</button>' +
        '<button class="btn btn-quiet" data-a="mail">Email app</button>' +
        '<button class="btn btn-quiet" data-a="copy">Copy it</button>' +
        '<button class="btn btn-quiet" data-a="save">Save a copy</button>' +
      '</div>' +
      '<p class="sendmsg"></p>' +
    '</div>';

  var whoIn = host.querySelector('#b5who');
  var msg   = host.querySelector('.sendmsg');
  whoIn.value = getName() || hqWho();
  whoIn.addEventListener('input', function(){ setName(whoIn.value.trim()) });

  function subject(){
    var w = getName();
    return opts.tool + " - " + (w ? w : "Base 5");
  }

  host.addEventListener('click', function(e){
    var b = e.target.closest('button[data-a]');
    if(!b) return;
    noteSent(opts.tool);
    var body = wrap(opts);
    var a = b.dataset.a;

    if(a === 'sheet'){
      b.disabled = true; msg.textContent = 'Sending...';
      window.B5Site.call('send', {
        who: whoIn.value.trim() || hqWho(), tool: opts.tool,
        text: opts.getText(), page: location.pathname
      })
        .then(function(o){
          if(!o || !o.ok) throw new Error('no');
          msg.textContent = 'Sent. It is in Jay\'s list now.';
          b.textContent = 'Sent';
          setTimeout(function(){ b.disabled = false; b.textContent = 'Send to Jay'; }, 4000);
        })
        .catch(function(){
          b.disabled = false;
          msg.textContent = 'That did not go through just now. Open in Gmail does the same job.';
        });
      return;
    }

    if(a === 'gmail'){
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' +
        encodeURIComponent(TEACHER_EMAIL) +
        '&su=' + encodeURIComponent(subject()) +
        '&body=' + encodeURIComponent(body), '_blank');
      msg.textContent = 'Gmail should have opened in a new tab. Press send there.';
    }

    if(a === 'mail'){
      window.location.href = 'mailto:' + TEACHER_EMAIL +
        '?subject=' + encodeURIComponent(subject()) +
        '&body=' + encodeURIComponent(body);
    }

    if(a === 'copy'){
      var okCopy = function(){ msg.textContent = 'Copied. Paste it wherever you like.'; };
      var oldCopy = function(){
        try{
          var ta = document.createElement('textarea'); ta.value = body; ta.setAttribute('readonly', '');
          ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
          var done = document.execCommand('copy'); document.body.removeChild(ta);
          if(done){ okCopy(); return }
        }catch(er){}
        msg.textContent = 'Copying did not work here. Try the Save button, or select the text and copy it.';
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(body).then(okCopy, oldCopy);
      } else { oldCopy() }
    }

    if(a === 'save'){
      var name = (opts.filename || 'base5') + '-' + (getName() || 'work') + '.txt';
      var link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([body], {type:'text/plain'}));
      link.download = name;
      link.click();
      URL.revokeObjectURL(link.href);
      msg.textContent = 'Saved to your downloads as ' + name;
    }
  });
}

/* For pictures rather than text. Downloads the image first, then
   opens a message the student can attach it to. */
function mountImage(host, opts){
  if(isGuest()){ guestNote(host); return; }
  host.innerHTML =
    '<div class="sendbox">' +
      '<p class="sendtitle">Send this to Jay</p>' +
      '<p class="sendwhy">Pictures cannot go straight into an email from here. ' +
        'This saves it to your downloads first, then opens a message for you to attach it to.</p>' +
      '<div class="sendwho">' +
        '<label class="sendlab" for="b5who">Your initials</label>' +
        '<input type="text" id="b5who" maxlength="6" placeholder="e.g. LW">' +
      '</div>' +
      '<div class="sendrow">' +
        '<button class="btn btn-orange" data-a="both">Save it and open Gmail</button>' +
        '<button class="btn btn-quiet" data-a="dl">Just save it</button>' +
      '</div>' +
      '<p class="sendmsg"></p>' +
    '</div>';

  var whoIn = host.querySelector('#b5who');
  var msg   = host.querySelector('.sendmsg');
  whoIn.value = getName();
  whoIn.addEventListener('input', function(){ setName(whoIn.value.trim()) });

  function download(){
    var who = getName() || 'work';
    var name = (opts.filename || 'base5') + '-' + who + '.png';
    var link = document.createElement('a');
    link.href = opts.getImage();
    link.download = name;
    link.click();
    return name;
  }

  host.addEventListener('click', function(e){
    var b = e.target.closest('button[data-a]');
    if(!b) return;
    noteSent(opts.tool);
    var name = download();

    if(b.dataset.a === 'dl'){
      msg.textContent = 'Saved to your downloads as ' + name;
      return;
    }

    var body = [
      opts.tool + " - Base 5",
      "From: " + (getName() || "no initials given"),
      "Sent: " + stamp(),
      "",
      "The picture is saved in my downloads as " + name + ".",
      "I need to attach it to this message before sending."
    ].join("\n");

    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' +
      encodeURIComponent(TEACHER_EMAIL) +
      '&su=' + encodeURIComponent(opts.tool + ' - ' + (getName() || 'Base 5')) +
      '&body=' + encodeURIComponent(body), '_blank');

    msg.textContent = 'Saved as ' + name + '. In the Gmail tab, use the paperclip to attach it, then send.';
  });
}

return {mount: mount, mountImage: mountImage, getName: getName};
})();
