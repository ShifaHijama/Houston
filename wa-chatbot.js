(function() {
  "use strict";

  var WA_NUMBER = '12816668182';

  var FLOWS = {
    start: {
      bot: 'As-salamu alaykum! Welcome to Al Shifa Hijama.\n\nHow can I help you today?',
      replies: ['Book a Session','Pricing & Packages','What is Hijama?','Female Therapist','Location & Hours','Contact Us']
    },
    'Book a Session': {
      bot: "We'd love to have you!\n\nYou can book on our website or message us on WhatsApp and we'll confirm within 24 hours.",
      replies: ['See Pricing','First Session Tips','Back to Menu'],
      wa: "Hi! I'd like to book a Hijama session."
    },
    'Pricing & Packages': {
      bot: 'Our packages:\n\nDry Cupping - $89\nHijama Wet Cupping - $99\nSilver Package - $459\nGold Package - $900\n\nAll sessions use sterile single-use equipment.',
      replies: ['Book a Session',"What's Included?",'Back to Menu'],
      wa: "Hi! I'd like to know about your pricing."
    },
    'What is Hijama?': {
      bot: 'Hijama is the blessed Sunnah of our Prophet (peace be upon him).\n\nCups create gentle suction to stimulate blood flow, detoxify, and promote natural healing.\n\nBenefits:\n- Pain relief\n- Detoxification\n- Immune boost\n- Stress relief',
      replies: ['Book a Session','Is it Painful?','Back to Menu'],
      wa: 'Hi! I have questions about Hijama therapy.'
    },
    'Is it Painful?': {
      bot: 'Most clients describe it as a firm pulling sensation - not painful.\n\nThe micro-incisions in wet cupping are very superficial. Many clients feel deeply relaxed during the session.',
      replies: ['Book a Session','Back to Menu'],
      wa: 'Hi! I have questions about the Hijama experience.'
    },
    'Female Therapist': {
      bot: 'Yes! We have a dedicated licensed female therapist (Sister Tabassum) for our female clients.\n\nAll female sessions are conducted in full privacy and comfort.',
      replies: ['Book a Session','Pricing & Packages','Back to Menu'],
      wa: 'Hi! I would like to book with the female therapist.'
    },
    'Location & Hours': {
      bot: 'Location: Katy, Houston TX\nExact address shared on booking confirmation.\n\nHours: By appointment only\n\nPhone: (281) 666-8182\nEmail: alshifahijama@gmail.com',
      replies: ['Book a Session','Contact Us','Back to Menu'],
      wa: 'Hi! I would like to know your location and hours.'
    },
    'Contact Us': {
      bot: 'Reach us:\n\nWhatsApp: (281) 666-8182\nCall: (281) 666-8182\nEmail: alshifahijama@gmail.com\n\nWe typically respond within 1 hour.',
      replies: ['Book a Session','Back to Menu'],
      wa: 'Hi! I would like to contact Al Shifa Hijama.'
    },
    'See Pricing': {
      bot: 'Dry Cupping - $89\nHijama Wet Cupping - $99\nSilver Package - $459\nGold Package - $900',
      replies: ['Book a Session','Back to Menu'],
      wa: "Hi! I'd like to book a session."
    },
    'First Session Tips': {
      bot: 'For your first session:\n\n- Eat a light meal 2-3 hrs before\n- Stay well hydrated\n- Wear loose comfortable clothing\n- Plan to rest afterward\n- Drink plenty of water post-session',
      replies: ['Book a Session','Back to Menu'],
      wa: "Hi! I'm interested in my first Hijama session."
    },
    "What's Included?": {
      bot: 'Every session includes:\n\n- Consultation and assessment\n- Sterile single-use equipment\n- Professional cupping therapy\n- Post-session aftercare guidance',
      replies: ['Book a Session','Back to Menu'],
      wa: "Hi! I'd like to know what's included in a session."
    },
    'Back to Menu': 'start'
  };

  var chatOpen = false;
  var chatStarted = false;
  var currentWaMsg = "Hi! I'm interested in Hijama therapy at Al Shifa Hijama.";

  var CSS = [
    '#wab-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:58px;height:58px;border-radius:50%;background:#25D366;box-shadow:0 4px 20px rgba(37,211,102,.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s}',
    '#wab-btn:hover{transform:scale(1.1)}',
    '#wab-btn svg{width:30px;height:30px;fill:#fff}',
    '#wab-dot{position:absolute;top:1px;right:1px;width:13px;height:13px;border-radius:50%;background:#f44;border:2px solid #fff;animation:wab-pulse 1.8s infinite}',
    '@keyframes wab-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}',
    '#wab-box{position:fixed;bottom:92px;right:24px;z-index:99998;width:330px;max-height:500px;border-radius:16px;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;transform:translateY(12px);transition:opacity .25s,transform .25s}',
    '#wab-box.wab-open{opacity:1;pointer-events:all;transform:translateY(0)}',
    '#wab-head{background:#075E54;padding:12px 14px;display:flex;align-items:center;gap:10px}',
    '#wab-av{width:40px;height:40px;border-radius:50%;background:#128C7E;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}',
    '#wab-info{flex:1}',
    '#wab-name{color:#fff;font-weight:700;font-size:.92rem;font-family:sans-serif}',
    '#wab-status{color:rgba(255,255,255,.65);font-size:.72rem;font-family:sans-serif}',
    '#wab-x{background:none;border:none;color:rgba(255,255,255,.7);font-size:1.3rem;cursor:pointer;padding:0 2px;line-height:1}',
    '#wab-msgs{flex:1;overflow-y:auto;padding:14px 12px;background:#ECE5DD;display:flex;flex-direction:column;gap:9px}',
    '.wab-b{max-width:83%;padding:8px 12px;border-radius:10px;font-size:.85rem;line-height:1.5;font-family:sans-serif;word-break:break-word}',
    '.wab-bot{background:#fff;color:#111;border-bottom-left-radius:2px;align-self:flex-start;box-shadow:0 1px 2px rgba(0,0,0,.1)}',
    '.wab-usr{background:#DCF8C6;color:#111;border-bottom-right-radius:2px;align-self:flex-end;box-shadow:0 1px 2px rgba(0,0,0,.1)}',
    '.wab-t{font-size:.66rem;color:#999;margin-top:2px;text-align:right}',
    '.wab-dots{display:flex;gap:4px;align-items:center;padding:8px 0}',
    '.wab-dots span{width:6px;height:6px;border-radius:50%;background:#aaa;animation:wab-b .9s infinite}',
    '.wab-dots span:nth-child(2){animation-delay:.15s}',
    '.wab-dots span:nth-child(3){animation-delay:.3s}',
    '@keyframes wab-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}',
    '#wab-qr{padding:9px 11px;background:#f5f5f5;border-top:1px solid #e5e5e5;display:flex;flex-wrap:wrap;gap:6px}',
    '.wab-qb{background:#fff;border:1.5px solid #25D366;color:#075E54;border-radius:18px;padding:5px 12px;font-size:.78rem;font-weight:600;cursor:pointer;font-family:sans-serif;transition:background .15s,color .15s}',
    '.wab-qb:hover{background:#25D366;color:#fff}',
    '#wab-wa{margin:0 10px 10px;padding:10px;background:#25D366;color:#fff;border:none;border-radius:9px;font-size:.85rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font-family:sans-serif;transition:background .15s}',
    '#wab-wa:hover{background:#1da851}',
    '@media(max-width:480px){#wab-box{width:calc(100vw - 28px);right:14px;bottom:84px}#wab-btn{bottom:16px;right:16px}}'
  ].join('');

  function init() {
    // Inject styles
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Build launcher button
    var btn = document.createElement('button');
    btn.id = 'wab-btn';
    btn.setAttribute('aria-label', 'Chat with Al Shifa Hijama');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.84L.057 23.428a.5.5 0 00.609.61l5.652-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.383l-.36-.214-3.733.949.98-3.646-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg><div id="wab-dot"></div>';
    // Wire click AFTER appending to DOM
    document.body.appendChild(btn);
    document.getElementById('wab-btn').onclick = toggleChat;

    // Build chat box
    var box = document.createElement('div');
    box.id = 'wab-box';
    box.setAttribute('role', 'dialog');
    box.innerHTML = [
      '<div id="wab-head">',
        '<div id="wab-av">&#127807;</div>',
        '<div id="wab-info">',
          '<div id="wab-name">Al Shifa Hijama</div>',
          '<div id="wab-status">&#128994; Typically replies within an hour</div>',
        '</div>',
        '<button id="wab-x" aria-label="Close">&#x2715;</button>',
      '</div>',
      '<div id="wab-msgs"></div>',
      '<div id="wab-qr"></div>',
      '<a id="wab-wa" href="https://wa.me/12816668182" target="_blank" rel="noopener">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">',
          '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
          '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.84L.057 23.428a.5.5 0 00.609.61l5.652-1.437A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.383l-.36-.214-3.733.949.98-3.646-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>',
        '</svg> Continue on WhatsApp',
      '</a>'
    ].join('');

    // Append box to DOM FIRST, then wire close button
    document.body.appendChild(box);
    document.getElementById('wab-x').onclick = toggleChat;

    // Auto-open after 8 seconds
    setTimeout(function() {
      if (!chatOpen) toggleChat();
    }, 8000);
  }

  function toggleChat() {
    chatOpen = !chatOpen;
    var box = document.getElementById('wab-box');
    if (chatOpen) {
      box.classList.add('wab-open');
      var dot = document.getElementById('wab-dot');
      if (dot) dot.style.display = 'none';
      startChat();
    } else {
      box.classList.remove('wab-open');
    }
  }

  function nowTime() {
    return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function addBubble(text, type) {
    var msgs = document.getElementById('wab-msgs');
    var d = document.createElement('div');
    d.className = 'wab-b ' + (type === 'bot' ? 'wab-bot' : 'wab-usr');
    d.innerHTML = text.replace(/\n/g, '<br>');
    var t = document.createElement('div');
    t.className = 'wab-t';
    t.textContent = nowTime();
    d.appendChild(t);
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('wab-msgs');
    var d = document.createElement('div');
    d.className = 'wab-b wab-bot';
    d.innerHTML = '<div class="wab-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function setReplies(keys) {
    var qr = document.getElementById('wab-qr');
    qr.innerHTML = '';
    keys.forEach(function(k) {
      var b = document.createElement('button');
      b.className = 'wab-qb';
      b.textContent = k;
      b.onclick = function() { handleReply(k); };
      qr.appendChild(b);
    });
  }

  function updateWaLink(msg) {
    if (msg) currentWaMsg = msg;
    var a = document.getElementById('wab-wa');
    if (a) a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(currentWaMsg);
  }

  function handleReply(key) {
    addBubble(key, 'usr');
    setReplies([]);
    var flow = FLOWS[key];
    if (typeof flow === 'string') flow = FLOWS[flow];
    if (!flow) {
      setTimeout(function() {
        addBubble('Let me connect you with our team on WhatsApp!', 'bot');
        updateWaLink('Hi! I have a question: ' + key);
        setReplies(['Back to Menu']);
      }, 600);
      return;
    }
    var typing = showTyping();
    setTimeout(function() {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      addBubble(flow.bot, 'bot');
      if (flow.wa) updateWaLink(flow.wa);
      if (flow.replies) setReplies(flow.replies);
    }, 900);
  }

  function startChat() {
    if (chatStarted) return;
    chatStarted = true;
    updateWaLink(null);
    var flow = FLOWS['start'];
    var typing = showTyping();
    setTimeout(function() {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      addBubble(flow.bot, 'bot');
      setReplies(flow.replies);
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
