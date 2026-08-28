// =================================================================
// 1. FIREBASE CONFIGURATION (ALPHACONNECT LIVE PRODUCTION)
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDjJ89EHkqWiuZTzNmGWA0rKeRwOVGDwqo",
  authDomain: "alsaconnect-69352.firebaseapp.com",
  databaseURL: "https://alsaconnect-69352-default-rtdb.firebaseio.com",
  projectId: "alsaconnect-69352",
  storageBucket: "alsaconnect-69352.firebasestorage.app",
  messagingSenderId: "166143567404",
  appId: "1:166143567404:web:ca3702d283ad5a8e6a9389"
};

// Initialize Firebase SDK[cite: 4]
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// =================================================================
// 2. HARDCODED USERS (Hafsa & Alfaz Only)[cite: 4]
// =================================================================
const USERS = {
  "Hafsa81": {
    password: "hafsa@8181",
    name: "Hafsa",
    gender: "female",
    avatarClass: "avatar-hafsa",
    partnerUser: "Alfaz81",
    partnerName: "Alfaz",
    partnerAvatarClass: "avatar-alfaz"
  },
  "Alfaz81": {
    password: "alfaz@8181",
    name: "Alfaz",
    gender: "male",
    avatarClass: "avatar-alfaz",
    partnerUser: "Hafsa81",
    partnerName: "Hafsa",
    partnerAvatarClass: "avatar-hafsa"
  }
};

// Application State[cite: 4]
let currentUser = null;
let currentCaptcha = "";
let typingTimeout = null;
let inactivityTimer = null;
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 Minutes Inactivity Auto-Lock
let selectedMessageId = null;
let activeQuotedReply = null;
let lastRenderedDateString = "";
let isChatViewActive = false;
let deletedForMeList = JSON.parse(localStorage.getItem("alsaconnect_deleted_for_me") || "[]");

const THEMES = ["theme-default", "theme-oled", "theme-emerald"];
let currentThemeIndex = 0;
let scratchpadSaveTimeout = null;

// Countdown State[cite: 4]
let activeCountdownTarget = null;
let countdownInterval = null;
let calSelectedDate = new Date();
let calViewingMonth = calSelectedDate.getMonth();
let calViewingYear = calSelectedDate.getFullYear();

// DOM Elements[cite: 4]
const welcomeToast = document.getElementById("welcomeToast");
const toastMessage = document.getElementById("toastMessage");
const authScreen = document.getElementById("authScreen");
const conversationHubScreen = document.getElementById("conversationHubScreen");
const chatScreen = document.getElementById("chatScreen");

// Camouflage Elements[cite: 4]
const camouflageScreen = document.getElementById("camouflageScreen");
const camoExitTrigger = document.getElementById("camoExitTrigger");
const hubCamoBtn = document.getElementById("hubCamoBtn");
const chatCamoBtn = document.getElementById("chatCamoBtn");

// Auth Form Elements[cite: 4]
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const captchaInput = document.getElementById("captchaInput");
const captchaCanvas = document.getElementById("captchaCanvas");
const refreshCaptchaBtn = document.getElementById("refreshCaptchaBtn");
const authError = document.getElementById("authError");
const togglePassword = document.getElementById("togglePassword");

// Biometric Elements[cite: 4]
const biometricLoginBox = document.getElementById("biometricLoginBox");
const biometricUnlockBtn = document.getElementById("biometricUnlockBtn");
const savedBioUsername = document.getElementById("savedBioUsername");
const menuBiometricBtn = document.getElementById("menuBiometricBtn");
const menuBiometricText = document.getElementById("menuBiometricText");
const menuBiometricIcon = document.getElementById("menuBiometricIcon");

// Hub Elements[cite: 4]
const openChatCard = document.getElementById("openChatCard");
const hubPartnerAvatar = document.getElementById("hubPartnerAvatar");
const hubStatusBadge = document.getElementById("hubStatusBadge");
const hubPartnerName = document.getElementById("hubPartnerName");
const hubLastActiveTime = document.getElementById("hubLastActiveTime");
const hubLastMessagePreview = document.getElementById("hubLastMessagePreview");
const hubUnreadBadge = document.getElementById("hubUnreadBadge");
const hubLogoutBtn = document.getElementById("hubLogoutBtn");
const backToHubBtn = document.getElementById("backToHubBtn");

// Chat Header Elements[cite: 4]
const partnerDisplayName = document.getElementById("partnerDisplayName");
const partnerAvatar = document.getElementById("partnerAvatar");
const partnerStatusPill = document.getElementById("partnerStatusPill");
const partnerStatusText = document.getElementById("partnerStatusText");
const messageFeed = document.getElementById("messageFeed");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const logoutBtn = document.getElementById("logoutBtn");

// Drawer Menu Elements[cite: 4]
const menuToggleBtn = document.getElementById("menuToggleBtn");
const toolsMenuDrawer = document.getElementById("toolsMenuDrawer");
const menuCountdownBtn = document.getElementById("menuCountdownBtn");
const menuNicknameBtn = document.getElementById("menuNicknameBtn");
const menuSearchBtn = document.getElementById("menuSearchBtn");
const menuScratchpadBtn = document.getElementById("menuScratchpadBtn");
const menuThemeBtn = document.getElementById("menuThemeBtn");
const menuClearChatBtn = document.getElementById("menuClearChatBtn");

// Countdown Banner Elements[cite: 4]
const countdownBanner = document.getElementById("countdownBanner");
const countdownTitleDisplay = document.getElementById("countdownTitleDisplay");
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");
const editCountdownQuickBtn = document.getElementById("editCountdownQuickBtn");

// Custom Calendar Modal Elements[cite: 4]
const countdownModal = document.getElementById("countdownModal");
const countdownTitleInput = document.getElementById("countdownTitleInput");
const calPrevMonthBtn = document.getElementById("calPrevMonthBtn");
const calNextMonthBtn = document.getElementById("calNextMonthBtn");
const calMonthYearLabel = document.getElementById("calMonthYearLabel");
const calendarDaysGrid = document.getElementById("calendarDaysGrid");
const calHourSelect = document.getElementById("calHourSelect");
const calMinuteSelect = document.getElementById("calMinuteSelect");
const calAmPmSelect = document.getElementById("calAmPmSelect");
const saveCountdownBtn = document.getElementById("saveCountdownBtn");
const clearCountdownBtn = document.getElementById("clearCountdownBtn");
const cancelCountdownBtn = document.getElementById("cancelCountdownBtn");

// Typing & Emoji Elements[cite: 4]
const typingIndicator = document.getElementById("typingIndicator");
const typingText = document.getElementById("typingText");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
const emojiTray = document.getElementById("emojiTray");

// Search Elements[cite: 4]
const searchDrawer = document.getElementById("searchDrawer");
const chatSearchInput = document.getElementById("chatSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchResultsInfo = document.getElementById("searchResultsInfo");

// Scratchpad Elements[cite: 4]
const scratchpadDrawer = document.getElementById("scratchpadDrawer");
const scratchpadTextarea = document.getElementById("scratchpadTextarea");
const closeScratchpadBtn = document.getElementById("closeScratchpadBtn");
const scratchpadSyncStatus = document.getElementById("scratchpadSyncStatus");

// Quoted Reply Elements[cite: 4]
const replyPreviewBox = document.getElementById("replyPreviewBox");
const replyToUser = document.getElementById("replyToUser");
const replyToText = document.getElementById("replyToText");
const cancelReplyBtn = document.getElementById("cancelReplyBtn");

// Nickname Modal Elements[cite: 4]
const nicknameModal = document.getElementById("nicknameModal");
const nicknameInput = document.getElementById("nicknameInput");
const saveNicknameBtn = document.getElementById("saveNicknameBtn");
const resetNicknameBtn = document.getElementById("resetNicknameBtn");
const cancelNicknameBtn = document.getElementById("cancelNicknameBtn");

// Delete & Clear Modals[cite: 4]
const deleteModal = document.getElementById("deleteModal");
const deleteEveryoneBtn = document.getElementById("deleteEveryoneBtn");
const deleteMeBtn = document.getElementById("deleteMeBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const clearChatModal = document.getElementById("clearChatModal");
const confirmClearChatBtn = document.getElementById("confirmClearChatBtn");
const cancelClearChatBtn = document.getElementById("cancelClearChatBtn");

// =================================================================
// 3. CAMOUFLAGE / PANIC MODE[cite: 4]
// =================================================================
function activateCamouflage() {
  camouflageScreen.classList.remove("hidden");
}

function deactivateCamouflage() {
  camouflageScreen.classList.add("hidden");
}

function toggleCamouflage() {
  camouflageScreen.classList.toggle("hidden");
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleCamouflage();
  }
});

if (chatCamoBtn) chatCamoBtn.addEventListener("click", activateCamouflage);
if (hubCamoBtn) hubCamoBtn.addEventListener("click", activateCamouflage);

camoExitTrigger.addEventListener("dblclick", deactivateCamouflage);
camoExitTrigger.addEventListener("click", (e) => {
  if (e.detail === 2) deactivateCamouflage();
});

// =================================================================
// 4. CAPITAL-ONLY ALPHANUMERIC CAPTCHA[cite: 4]
// =================================================================
function generateCapitalCaptcha() {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  currentCaptcha = code;

  const ctx = captchaCanvas.getContext("2d");
  ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

  const grad = ctx.createLinearGradient(0, 0, captchaCanvas.width, captchaCanvas.height);
  grad.addColorStop(0, "#090e1a");
  grad.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.15})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
    ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
    ctx.stroke();
  }

  ctx.font = "bold 20px 'Plus Jakarta Sans', monospace";
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    ctx.fillStyle = i % 2 === 0 ? "#c084fc" : "#38bdf8";
    const x = 14 + i * 21;
    const y = 26 + (Math.random() * 4 - 2);
    const angle = (Math.random() - 0.5) * 0.25;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }
}

refreshCaptchaBtn.addEventListener("click", generateCapitalCaptcha);

togglePassword.addEventListener("click", () => {
  const isPass = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPass ? "text" : "password");
  
  const icon = togglePassword.querySelector("i");
  if (isPass) {
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
});

// =================================================================
// 5. WEBAUTHN / BIOMETRIC AUTHENTICATION & REMOVE/DISABLE[cite: 4]
// =================================================================
function checkBiometricAvailability() {
  const savedBio = localStorage.getItem("alsaconnect_biometric_user");
  if (savedBio && USERS[savedBio] && window.PublicKeyCredential) {
    savedBioUsername.textContent = USERS[savedBio].name;
    biometricLoginBox.classList.remove("hidden");
  } else {
    biometricLoginBox.classList.add("hidden");
  }
}

biometricUnlockBtn.addEventListener("click", async () => {
  const savedUsername = localStorage.getItem("alsaconnect_biometric_user");
  const savedCredentialId = localStorage.getItem("alsaconnect_biometric_id");

  if (!savedUsername || !USERS[savedUsername] || !savedCredentialId) {
    authError.textContent = "No biometric key registered on this device.";
    return;
  }

  try {
    const rawId = Uint8Array.from(atob(savedCredentialId), c => c.charCodeAt(0));
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        allowCredentials: [{
          id: rawId,
          type: "public-key"
        }],
        userVerification: "required",
        timeout: 60000
      }
    });

    if (assertion) {
      currentUser = { ...USERS[savedUsername], username: savedUsername };
      localStorage.setItem("alsaconnect_active_session", savedUsername);
      localStorage.setItem("alsaconnect_active_view", "hub");
      showWelcomeToast("✨ Biometric verified successfully!");
      openConversationHub();
    }
  } catch (err) {
    console.warn("Biometric Verification Error:", err);
    authError.textContent = "Biometric verification canceled or failed. Use password.";
  }
});

menuBiometricBtn.addEventListener("click", async () => {
  toolsMenuDrawer.classList.add("hidden");

  const saved = localStorage.getItem("alsaconnect_biometric_user");
  
  if (saved && saved === currentUser.username) {
    localStorage.removeItem("alsaconnect_biometric_user");
    localStorage.removeItem("alsaconnect_biometric_id");
    updateBiometricMenuLabel();
    checkBiometricAvailability();
    showWelcomeToast("🗑️ Biometric unlock disabled for this device.");
    return;
  }

  if (!window.PublicKeyCredential) {
    showWelcomeToast("❌ Biometrics not supported on this browser.");
    return;
  }

  try {
    const challenge = new Uint8Array(32);
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(challenge);
    window.crypto.getRandomValues(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: challenge,
        rp: {
          name: "AlsaConnect"
        },
        user: {
          id: userId,
          name: currentUser.username,
          displayName: currentUser.name
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },  // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000
      }
    });

    if (credential) {
      const rawIdString = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      localStorage.setItem("alsaconnect_biometric_user", currentUser.username);
      localStorage.setItem("alsaconnect_biometric_id", rawIdString);
      showWelcomeToast("✅ Face ID / Fingerprint enabled for this device!");
      updateBiometricMenuLabel();
      checkBiometricAvailability();
    }
  } catch (err) {
    console.warn("Biometric Registration Error:", err);
    showWelcomeToast("Biometric registration canceled.");
  }
});

function updateBiometricMenuLabel() {
  if (currentUser) {
    const saved = localStorage.getItem("alsaconnect_biometric_user");
    if (saved === currentUser.username) {
      menuBiometricText.textContent = "Disable Face ID / Biometric";
      menuBiometricBtn.classList.add("active-bio-danger");
      menuBiometricIcon.className = "fa-solid fa-trash-can";
    } else {
      menuBiometricText.textContent = "Setup Face ID / Fingerprint";
      menuBiometricBtn.classList.remove("active-bio-danger");
      menuBiometricIcon.className = "fa-solid fa-fingerprint";
    }
  }
}

// =================================================================
// 6. AUTHENTICATION & LOGIN LOGIC[cite: 4]
// =================================================================
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  authError.textContent = "";

  const userKey = usernameInput.value.trim();
  const pass = passwordInput.value;
  const inputCaptcha = captchaInput.value.trim().toUpperCase();

  if (inputCaptcha !== currentCaptcha) {
    authError.textContent = "Incorrect captcha code. Try again.";
    generateCapitalCaptcha();
    captchaInput.value = "";
    return;
  }

  if (!USERS[userKey] || USERS[userKey].password !== pass) {
    authError.textContent = "Invalid username or password.";
    generateCapitalCaptcha();
    return;
  }

  currentUser = { ...USERS[userKey], username: userKey };
  localStorage.setItem("alsaconnect_active_session", userKey);
  localStorage.setItem("alsaconnect_active_view", "hub");
  showWelcomeToast();
  openConversationHub();
});

function showWelcomeToast(customMsg) {
  toastMessage.textContent = customMsg || "✨ Exciting new features coming soon!";
  welcomeToast.classList.remove("hidden");
  setTimeout(() => {
    welcomeToast.classList.add("hidden");
  }, 4000);
}

// =================================================================
// 7. NICKNAME HANDLERS[cite: 4]
// =================================================================
function getPartnerDisplayName() {
  const customNick = localStorage.getItem(`alsaconnect_nick_${currentUser.username}`);
  return customNick || currentUser.partnerName;
}

function updateAllDisplayNameReferences() {
  const displayName = getPartnerDisplayName();
  partnerDisplayName.textContent = displayName;
  hubPartnerName.textContent = displayName;
}

// =================================================================
// 8. 30-MINUTE INACTIVITY AUTO-LOCK
// =================================================================
function resetInactivityTimer() {
  if (!currentUser) return;
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    handleInactivityAutoLock();
  }, INACTIVITY_LIMIT_MS);
}

function handleInactivityAutoLock() {
  if (currentUser) {
    authError.textContent = "Session locked due to 30 minutes of inactivity.";
    executeLogout();
  }
}

["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach(event => {
  window.addEventListener(event, resetInactivityTimer, { passive: true });
});

// =================================================================
// 9. CONVERSATIONS HUB & LIVE UNREAD BADGE COUNTER
// =================================================================
function openConversationHub() {
  isChatViewActive = false;
  localStorage.setItem("alsaconnect_active_view", "hub");
  resetInactivityTimer();

  authScreen.classList.add("hidden");
  chatScreen.classList.add("hidden");
  conversationHubScreen.classList.remove("hidden");

  updateAllDisplayNameReferences();
  updateBiometricMenuLabel();
  hubPartnerAvatar.className = `card-avatar-ring ${currentUser.partnerAvatarClass}`;
  partnerAvatar.className = `avatar-ring ${currentUser.partnerAvatarClass}`;

  const userStatusRef = db.ref(`status/${currentUser.username}`);
  userStatusRef.set({ online: true, lastSeen: Date.now() });
  userStatusRef.onDisconnect().set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });

  db.ref(`status/${currentUser.partnerUser}`).on("value", (snap) => {
    const val = snap.val();
    if (val && val.online) {
      hubStatusBadge.classList.add("online");
      hubLastActiveTime.textContent = "Online";
      hubLastActiveTime.style.color = "var(--online-color)";

      partnerStatusPill.classList.add("online");
      partnerStatusText.textContent = "Online";
    } else {
      hubStatusBadge.classList.remove("online");
      const relativeTime = val && val.lastSeen ? formatLastSeen(val.lastSeen) : "Offline";
      hubLastActiveTime.textContent = relativeTime;
      hubLastActiveTime.style.color = "var(--text-muted)";

      partnerStatusPill.classList.remove("online");
      partnerStatusText.textContent = relativeTime;
    }
  });

  // Real-time unread counter and latest preview synchronization
  db.ref("messages").on("value", (snap) => {
    const data = snap.val();
    if (data) {
      const allMsgs = Object.values(data);
      const lastMsg = allMsgs[allMsgs.length - 1];

      if (lastMsg && !lastMsg.deleted) {
        hubLastMessagePreview.textContent = `${lastMsg.sender === currentUser.username ? 'You: ' : ''}${lastMsg.text}`;
      } else {
        hubLastMessagePreview.textContent = "This message was deleted";
      }

      // Count unread messages in real-time
      let unreadCount = 0;
      Object.entries(data).forEach(([key, val]) => {
        if (val.sender === currentUser.partnerUser && !val.seen && !val.deleted && !deletedForMeList.includes(key)) {
          unreadCount++;
        }
      });

      if (unreadCount > 0) {
        hubUnreadBadge.textContent = `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
        hubUnreadBadge.classList.remove("hidden");
      } else {
        hubUnreadBadge.classList.add("hidden");
      }
    } else {
      hubUnreadBadge.classList.add("hidden");
    }
  });
}

openChatCard.addEventListener("click", () => {
  conversationHubScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  startChatSession();
});

backToHubBtn.addEventListener("click", () => {
  isChatViewActive = false;
  chatScreen.classList.add("hidden");
  conversationHubScreen.classList.remove("hidden");
  openConversationHub();
});

// =================================================================
// 10. RELATIVE "LAST ACTIVE" FORMATTER[cite: 4]
// =================================================================
function formatLastSeen(timestamp) {
  if (!timestamp) return "Offline";
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return "Active just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Active ${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `Active ${diffHour}h ago`;
  
  const d = new Date(timestamp);
  return `Last seen ${d.toLocaleDateString([], { month: "short", day: "numeric" })} at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function formatSeenTime(timestamp) {
  if (!timestamp) return "just now";
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" });
}

// =================================================================
// 11. SMART DATE DIVIDERS HELPER[cite: 4]
// =================================================================
function getDateLabel(timestamp) {
  const msgDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (msgDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
  }
}

function checkAndInsertDateDivider(timestamp) {
  const dateLabel = getDateLabel(timestamp);
  if (dateLabel !== lastRenderedDateString) {
    const divider = document.createElement("div");
    divider.className = "date-divider";
    divider.innerHTML = `<span>${dateLabel}</span>`;
    messageFeed.appendChild(divider);
    lastRenderedDateString = dateLabel;
  }
}

// =================================================================
// 12. SHARED COUNTDOWN TIMER ENGINE & CUSTOM CALENDAR[cite: 4]
// =================================================================
function populateTimeDropdowns() {
  calHourSelect.innerHTML = "";
  for (let h = 1; h <= 12; h++) {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h < 10 ? `0${h}` : `${h}`;
    calHourSelect.appendChild(opt);
  }

  calMinuteSelect.innerHTML = "";
  for (let m = 0; m < 60; m += 5) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m < 10 ? `0${m}` : `${m}`;
    calMinuteSelect.appendChild(opt);
  }
}
populateTimeDropdowns();

function renderCustomCalendar(month, year) {
  calMonthYearLabel.textContent = new Date(year, month).toLocaleDateString([], { month: "long", year: "numeric" });
  calendarDaysGrid.innerHTML = "";

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "cal-day-cell empty-day";
    calendarDaysGrid.appendChild(emptyCell);
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dayCell = document.createElement("div");
    dayCell.className = "cal-day-cell";
    dayCell.textContent = d;

    if (
      d === calSelectedDate.getDate() &&
      month === calSelectedDate.getMonth() &&
      year === calSelectedDate.getFullYear()
    ) {
      dayCell.classList.add("selected-day");
    }

    dayCell.addEventListener("click", () => {
      document.querySelectorAll(".cal-day-cell").forEach(c => c.classList.remove("selected-day"));
      dayCell.classList.add("selected-day");
      calSelectedDate = new Date(year, month, d);
    });

    calendarDaysGrid.appendChild(dayCell);
  }
}

calPrevMonthBtn.addEventListener("click", () => {
  calViewingMonth--;
  if (calViewingMonth < 0) {
    calViewingMonth = 11;
    calViewingYear--;
  }
  renderCustomCalendar(calViewingMonth, calViewingYear);
});

calNextMonthBtn.addEventListener("click", () => {
  calViewingMonth++;
  if (calViewingMonth > 11) {
    calViewingMonth = 0;
    calViewingYear++;
  }
  renderCustomCalendar(calViewingMonth, calViewingYear);
});

menuCountdownBtn.addEventListener("click", () => {
  toolsMenuDrawer.classList.add("hidden");
  openCountdownModal();
});

editCountdownQuickBtn.addEventListener("click", openCountdownModal);

function openCountdownModal() {
  if (activeCountdownTarget) {
    countdownTitleInput.value = activeCountdownTarget.title || "";
    const existingDate = new Date(activeCountdownTarget.targetTime);
    calSelectedDate = existingDate;
    calViewingMonth = existingDate.getMonth();
    calViewingYear = existingDate.getFullYear();
    
    let hours = existingDate.getHours();
    const isPM = hours >= 12;
    hours = hours % 12 || 12;
    calHourSelect.value = hours;
    calMinuteSelect.value = Math.floor(existingDate.getMinutes() / 5) * 5;
    calAmPmSelect.value = isPM ? "PM" : "AM";
  } else {
    countdownTitleInput.value = "";
    calSelectedDate = new Date();
    calSelectedDate.setDate(calSelectedDate.getDate() + 7);
    calViewingMonth = calSelectedDate.getMonth();
    calViewingYear = calSelectedDate.getFullYear();
  }

  renderCustomCalendar(calViewingMonth, calViewingYear);
  countdownModal.classList.remove("hidden");
}

saveCountdownBtn.addEventListener("click", () => {
  const title = countdownTitleInput.value.trim() || "Special Event";
  let hour = parseInt(calHourSelect.value);
  const minute = parseInt(calMinuteSelect.value);
  const ampm = calAmPmSelect.value;

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const targetDate = new Date(calSelectedDate.getFullYear(), calSelectedDate.getMonth(), calSelectedDate.getDate(), hour, minute, 0);

  if (targetDate.getTime() <= Date.now()) {
    alert("Please choose a future date & time for the countdown!");
    return;
  }

  const payload = {
    title: title,
    targetTime: targetDate.getTime(),
    setBy: currentUser.username,
    updatedAt: Date.now()
  };

  db.ref("countdown/event").set(payload);
  countdownModal.classList.add("hidden");
  showWelcomeToast(`⏳ Countdown started for "${title}"!`);
});

clearCountdownBtn.addEventListener("click", () => {
  db.ref("countdown/event").remove();
  countdownModal.classList.add("hidden");
  showWelcomeToast("Countdown removed.");
});

cancelCountdownBtn.addEventListener("click", () => {
  countdownModal.classList.add("hidden");
});

function initCountdownListener() {
  db.ref("countdown/event").on("value", (snap) => {
    const data = snap.val();
    if (data && data.targetTime) {
      activeCountdownTarget = data;
      countdownTitleDisplay.textContent = data.title || "Special Event";
      countdownBanner.classList.remove("hidden");
      startCountdownTicker();
    } else {
      activeCountdownTarget = null;
      countdownBanner.classList.add("hidden");
      clearInterval(countdownInterval);
    }
  });
}

function startCountdownTicker() {
  clearInterval(countdownInterval);
  updateCountdownDigits();
  countdownInterval = setInterval(updateCountdownDigits, 1000);
}

function updateCountdownDigits() {
  if (!activeCountdownTarget) return;

  const now = Date.now();
  const diff = activeCountdownTarget.targetTime - now;

  if (diff <= 0) {
    cdDays.textContent = "00";
    cdHours.textContent = "00";
    cdMinutes.textContent = "00";
    cdSeconds.textContent = "00";
    countdownTitleDisplay.textContent = `${activeCountdownTarget.title} is TODAY! 🎉`;
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  cdDays.textContent = days < 10 ? `0${days}` : `${days}`;
  cdHours.textContent = hours < 10 ? `0${hours}` : `${hours}`;
  cdMinutes.textContent = minutes < 10 ? `0${minutes}` : `${minutes}`;
  cdSeconds.textContent = seconds < 10 ? `0${seconds}` : `${seconds}`;
}

// =================================================================
// 13. REALTIME CHAT ENGINE (INSTAGRAM SEEN RECEIPT SYSTEM)
// =================================================================
function markIncomingMessagesAsSeen() {
  if (!isChatViewActive || !currentUser) return;
  
  db.ref("messages").once("value", (snap) => {
    const data = snap.val();
    if (!data) return;

    Object.entries(data).forEach(([key, val]) => {
      if (val.sender === currentUser.partnerUser && !val.seen) {
        db.ref(`messages/${key}`).update({
          seen: true,
          seenAt: Date.now()
        });
      }
    });
  });
}

function updateLastSeenReceipt() {
  document.querySelectorAll(".instagram-seen-status").forEach(el => el.remove());

  const sentWrappers = document.querySelectorAll(".msg-wrapper.sent:not(.deleted-wrapper)");
  if (!sentWrappers.length) return;

  const lastSentWrapper = sentWrappers[sentWrappers.length - 1];
  const msgId = lastSentWrapper.id.replace("msg-", "");

  db.ref(`messages/${msgId}`).once("value", (snap) => {
    const val = snap.val();
    if (val && val.seen === true && !val.deleted) {
      const timeText = formatSeenTime(val.seenAt);
      const seenDiv = document.createElement("div");
      seenDiv.className = "instagram-seen-status";
      seenDiv.innerHTML = `<span>Seen ${timeText}</span>`;
      lastSentWrapper.appendChild(seenDiv);
    }
  });
}

function startChatSession() {
  isChatViewActive = true;
  localStorage.setItem("alsaconnect_active_view", "chat");
  resetInactivityTimer();

  updateAllDisplayNameReferences();
  initCountdownListener();

  db.ref(`typing/${currentUser.partnerUser}`).on("value", (snap) => {
    const isPartnerTyping = snap.val();
    if (isPartnerTyping === true) {
      typingText.textContent = `${getPartnerDisplayName()} is typing...`;
      typingIndicator.classList.remove("hidden");
    } else {
      typingIndicator.classList.add("hidden");
    }
  });

  const scratchpadRef = db.ref("scratchpad/content");
  scratchpadRef.on("value", (snapshot) => {
    const content = snapshot.val() || "";
    if (document.activeElement !== scratchpadTextarea) {
      scratchpadTextarea.value = content;
    }
  });

  const messagesRef = db.ref("messages");
  messagesRef.off();
  lastRenderedDateString = "";
  
  messageFeed.innerHTML = `
    <div class="encryption-banner">
      <i class="fa-solid fa-lock"></i>
      <span>End-to-End Encrypted &bull; TRUST ME</span>
    </div>
  `;

  messagesRef.on("child_added", (snapshot) => {
    const msgId = snapshot.key;
    const msg = snapshot.val();
    if (msg && !deletedForMeList.includes(msgId)) {
      checkAndInsertDateDivider(msg.timestamp || Date.now());
      renderBubble(msgId, msg);

      if (isChatViewActive && msg.sender === currentUser.partnerUser && !msg.seen) {
        db.ref(`messages/${msgId}`).update({
          seen: true,
          seenAt: Date.now()
        });
      }
      updateLastSeenReceipt();
    }
  });

  messagesRef.on("child_changed", (snapshot) => {
    const msgId = snapshot.key;
    const msg = snapshot.val();
    const existingElement = document.getElementById(`msg-${msgId}`);
    
    if (existingElement && !deletedForMeList.includes(msgId)) {
      updateBubble(existingElement, msgId, msg);
    }
    updateLastSeenReceipt();
  });

  messagesRef.on("child_removed", (snapshot) => {
    const msgId = snapshot.key;
    const existingElement = document.getElementById(`msg-${msgId}`);
    if (existingElement) existingElement.remove();
    updateLastSeenReceipt();
  });

  markIncomingMessagesAsSeen();
}

// Send Message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !currentUser) return;

  const newMsg = {
    sender: currentUser.username,
    senderName: currentUser.name,
    text: text,
    timestamp: Date.now(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    deleted: false,
    seen: false,
    seenAt: null,
    reactions: {},
    replyTo: activeQuotedReply || null
  };

  db.ref("messages").push(newMsg);
  db.ref(`typing/${currentUser.username}`).set(false);
  clearTimeout(typingTimeout);
  
  chatInput.value = "";
  clearQuotedReply();
  emojiTray.classList.add("hidden");
  toolsMenuDrawer.classList.add("hidden");
  resetInactivityTimer();
});

function renderBubble(msgId, msg) {
  const isMine = msg.sender === currentUser.username;
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${isMine ? "sent" : "received"} ${msg.deleted ? "deleted-wrapper" : ""}`;
  wrapper.id = `msg-${msgId}`;
  wrapper.setAttribute("data-text", (msg.text || "").toLowerCase());

  wrapper.innerHTML = createBubbleHTML(msgId, msg, isMine);
  messageFeed.appendChild(wrapper);
  messageFeed.scrollTop = messageFeed.scrollHeight;

  attachBubbleEvents(wrapper, msgId, msg, isMine);
}

function updateBubble(element, msgId, msg) {
  const isMine = msg.sender === currentUser.username;
  element.className = `msg-wrapper ${isMine ? "sent" : "received"} ${msg.deleted ? "deleted-wrapper" : ""}`;
  element.setAttribute("data-text", (msg.text || "").toLowerCase());
  element.innerHTML = createBubbleHTML(msgId, msg, isMine);
  attachBubbleEvents(element, msgId, msg, isMine);
}

function createBubbleHTML(msgId, msg, isMine) {
  let textDisplay = escapeHTML(msg.text);
  if (msg.deleted) {
    textDisplay = `<i class="fa-solid fa-ban" style="margin-right:4px;"></i> <span class="deleted-text">This message was deleted</span>`;
  }

  let quotedReplyHTML = "";
  if (msg.replyTo && !msg.deleted) {
    quotedReplyHTML = `
      <div class="quoted-reply-card" data-scroll-id="msg-${msg.replyTo.id}">
        <span class="quoted-reply-user">${escapeHTML(msg.replyTo.senderName)}</span>
        <div class="quoted-reply-text">${escapeHTML(msg.replyTo.text)}</div>
      </div>
    `;
  }

  let reactionsHTML = "";
  if (msg.reactions && !msg.deleted) {
    const counts = {};
    Object.values(msg.reactions).forEach(emoji => {
      counts[emoji] = (counts[emoji] || 0) + 1;
    });
    
    const badges = Object.entries(counts).map(([emoji, count]) => `
      <span class="reaction-badge">${emoji} ${count > 1 ? count : ''}</span>
    `).join("");

    if (badges) {
      reactionsHTML = `<div class="reactions-cluster">${badges}</div>`;
    }
  }

  return `
    <div class="msg-bubble-container">
      ${!msg.deleted ? `
      <div class="msg-action-bar">
        <button type="button" class="react-pill" data-emoji="❤️" title="Love">❤️</button>
        <button type="button" class="react-pill" data-emoji="😂" title="Laugh">😂</button>
        <button type="button" class="react-pill" data-emoji="👍" title="Thumbs Up">👍</button>
        <button type="button" class="react-pill" data-emoji="🔥" title="Fire">🔥</button>
        <button type="button" class="action-bar-btn reply-btn" title="Reply">
          <i class="fa-solid fa-reply"></i>
        </button>
        <button type="button" class="action-bar-btn del-btn" title="Delete">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>` : ''}

      <div class="msg-bubble">
        ${quotedReplyHTML}
        <div class="msg-content">${textDisplay}</div>
        <div class="msg-footer">
          <span>${msg.formattedTime}</span>
        </div>
      </div>
    </div>
    ${reactionsHTML}
  `;
}

function attachBubbleEvents(wrapper, msgId, msg, isMine) {
  wrapper.addEventListener("click", (e) => {
    if (e.target.closest(".msg-action-bar") || e.target.closest(".reactions-cluster") || e.target.closest(".quoted-reply-card")) return;
    document.querySelectorAll(".msg-wrapper.active-touch").forEach(el => {
      if (el !== wrapper) el.classList.remove("active-touch");
    });
    wrapper.classList.toggle("active-touch");
  });

  const quotedCard = wrapper.querySelector(".quoted-reply-card");
  if (quotedCard) {
    quotedCard.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = quotedCard.getAttribute("data-scroll-id");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.classList.add("highlight-msg");
        setTimeout(() => targetEl.classList.remove("highlight-msg"), 1800);
      }
    });
  }

  wrapper.querySelectorAll(".react-pill").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const emoji = btn.getAttribute("data-emoji");
      const reactionRef = db.ref(`messages/${msgId}/reactions/${currentUser.username}`);
      
      reactionRef.once("value", (snap) => {
        if (snap.val() === emoji) {
          reactionRef.remove();
        } else {
          reactionRef.set(emoji);
        }
      });
      wrapper.classList.remove("active-touch");
      resetInactivityTimer();
    });
  });

  const replyBtn = wrapper.querySelector(".reply-btn");
  if (replyBtn) {
    replyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setQuotedReply(msgId, msg.senderName, msg.text);
      wrapper.classList.remove("active-touch");
    });
  }

  const delBtn = wrapper.querySelector(".del-btn");
  if (delBtn) {
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedMessageId = msgId;
      if (!isMine) {
        deleteEveryoneBtn.classList.add("hidden");
      } else {
        deleteEveryoneBtn.classList.remove("hidden");
      }
      deleteModal.classList.remove("hidden");
      wrapper.classList.remove("active-touch");
    });
  }
}

// =================================================================
// 14. 3-DOT DRAWER MENU & NICKNAME MODAL[cite: 4]
// =================================================================
menuToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  updateBiometricMenuLabel();
  toolsMenuDrawer.classList.toggle("hidden");
});

menuNicknameBtn.addEventListener("click", () => {
  toolsMenuDrawer.classList.add("hidden");
  nicknameInput.value = localStorage.getItem(`alsaconnect_nick_${currentUser.username}`) || "";
  nicknameModal.classList.remove("hidden");
});

saveNicknameBtn.addEventListener("click", () => {
  const val = nicknameInput.value.trim();
  if (val) {
    localStorage.setItem(`alsaconnect_nick_${currentUser.username}`, val);
  } else {
    localStorage.removeItem(`alsaconnect_nick_${currentUser.username}`);
  }
  updateAllDisplayNameReferences();
  nicknameModal.classList.add("hidden");
});

resetNicknameBtn.addEventListener("click", () => {
  localStorage.removeItem(`alsaconnect_nick_${currentUser.username}`);
  updateAllDisplayNameReferences();
  nicknameModal.classList.add("hidden");
});

cancelNicknameBtn.addEventListener("click", () => {
  nicknameModal.classList.add("hidden");
});

menuSearchBtn.addEventListener("click", () => {
  toolsMenuDrawer.classList.add("hidden");
  searchDrawer.classList.remove("hidden");
  chatSearchInput.focus();
});

menuScratchpadBtn.addEventListener("click", () => {
  toolsMenuDrawer.classList.add("hidden");
  scratchpadDrawer.classList.toggle("hidden");
  if (!scratchpadDrawer.classList.contains("hidden")) {
    scratchpadTextarea.focus();
  }
});

menuThemeBtn.addEventListener("click", () => {
  document.body.classList.remove(...THEMES);
  currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
  if (THEMES[currentThemeIndex] !== "theme-default") {
    document.body.classList.add(THEMES[currentThemeIndex]);
  }
});

menuClearChatBtn.addEventListener("click", () => {
  toolsMenuDrawer.classList.add("hidden");
  clearChatModal.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (!toolsMenuDrawer.contains(e.target) && !menuToggleBtn.contains(e.target)) {
    toolsMenuDrawer.classList.add("hidden");
  }
});

// =================================================================
// 15. SHARED SCRATCHPAD LOGIC[cite: 4]
// =================================================================
closeScratchpadBtn.addEventListener("click", () => {
  scratchpadDrawer.classList.add("hidden");
});

scratchpadTextarea.addEventListener("input", () => {
  scratchpadSyncStatus.textContent = "Saving...";
  scratchpadSyncStatus.style.color = "#f59e0b";

  clearTimeout(scratchpadSaveTimeout);
  scratchpadSaveTimeout = setTimeout(() => {
    db.ref("scratchpad/content").set(scratchpadTextarea.value);
    scratchpadSyncStatus.textContent = "Synced";
    scratchpadSyncStatus.style.color = "var(--online-color)";
  }, 400);
});

// =================================================================
// 16. CLEAR CHAT MODAL ACTIONS[cite: 4]
// =================================================================
confirmClearChatBtn.addEventListener("click", () => {
  db.ref("messages").remove();
  clearChatModal.classList.add("hidden");
});

cancelClearChatBtn.addEventListener("click", () => {
  clearChatModal.classList.add("hidden");
});

// =================================================================
// 17. QUOTED REPLIES[cite: 4]
// =================================================================
function setQuotedReply(id, senderName, text) {
  activeQuotedReply = {
    id: id,
    senderName: senderName,
    text: text.length > 50 ? text.substring(0, 50) + "..." : text
  };
  
  replyToUser.textContent = `Replying to ${senderName}`;
  replyToText.textContent = activeQuotedReply.text;
  replyPreviewBox.classList.remove("hidden");
  chatInput.focus();
}

function clearQuotedReply() {
  activeQuotedReply = null;
  replyPreviewBox.classList.add("hidden");
}

cancelReplyBtn.addEventListener("click", clearQuotedReply);

// =================================================================
// 18. IN-CHAT SEARCH[cite: 4]
// =================================================================
chatSearchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  const allBubbles = document.querySelectorAll(".msg-wrapper");
  let matchesCount = 0;

  if (!query) {
    allBubbles.forEach(b => b.classList.remove("dimmed"));
    searchResultsInfo.textContent = "";
    return;
  }

  allBubbles.forEach(bubble => {
    const text = bubble.getAttribute("data-text") || "";
    if (text.includes(query)) {
      bubble.classList.remove("dimmed");
      matchesCount++;
    } else {
      bubble.classList.add("dimmed");
    }
  });

  searchResultsInfo.textContent = matchesCount > 0 
    ? `Found ${matchesCount} matching message${matchesCount > 1 ? 's' : ''}` 
    : "No matches found";
});

clearSearchBtn.addEventListener("click", () => {
  searchDrawer.classList.add("hidden");
  clearSearchFilter();
});

function clearSearchFilter() {
  chatSearchInput.value = "";
  searchResultsInfo.textContent = "";
  document.querySelectorAll(".msg-wrapper").forEach(b => b.classList.remove("dimmed"));
}

// =================================================================
// 19. DELETE / UNSEND[cite: 4]
// =================================================================
deleteEveryoneBtn.addEventListener("click", () => {
  if (selectedMessageId) {
    db.ref(`messages/${selectedMessageId}`).update({
      deleted: true,
      text: "This message was deleted",
      reactions: null,
      replyTo: null
    });
  }
  closeDeleteModal();
});

deleteMeBtn.addEventListener("click", () => {
  if (selectedMessageId) {
    deletedForMeList.push(selectedMessageId);
    localStorage.setItem("alsaconnect_deleted_for_me", JSON.stringify(deletedForMeList));
    const targetElement = document.getElementById(`msg-${selectedMessageId}`);
    if (targetElement) targetElement.remove();
    updateLastSeenReceipt();
  }
  closeDeleteModal();
});

cancelDeleteBtn.addEventListener("click", closeDeleteModal);

function closeDeleteModal() {
  deleteModal.classList.add("hidden");
  selectedMessageId = null;
}

// =================================================================
// 20. PRECISE TYPING BROADCAST[cite: 4]
// =================================================================
chatInput.addEventListener("input", () => {
  if (!currentUser) return;
  
  const text = chatInput.value.trim();
  if (text.length > 0) {
    db.ref(`typing/${currentUser.username}`).set(true);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      db.ref(`typing/${currentUser.username}`).set(false);
    }, 1400);
  } else {
    db.ref(`typing/${currentUser.username}`).set(false);
  }
});

chatInput.addEventListener("blur", () => {
  if (currentUser) {
    db.ref(`typing/${currentUser.username}`).set(false);
  }
});

// Emoji Tray[cite: 4]
emojiToggleBtn.addEventListener("click", () => {
  emojiTray.classList.toggle("hidden");
});

document.querySelectorAll(".emoji-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    chatInput.value += btn.textContent;
    chatInput.focus();
    resetInactivityTimer();
  });
});

document.addEventListener("click", (e) => {
  if (!emojiTray.contains(e.target) && !emojiToggleBtn.contains(e.target)) {
    emojiTray.classList.add("hidden");
  }
});

// =================================================================
// 21. LOGOUT CLEANUP & SESSION REHYDRATION
// =================================================================
function executeLogout() {
  isChatViewActive = false;
  clearTimeout(inactivityTimer);
  clearInterval(countdownInterval);
  if (currentUser) {
    db.ref(`status/${currentUser.username}`).set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
    db.ref(`typing/${currentUser.username}`).set(false);
  }
  
  currentUser = null;
  activeCountdownTarget = null;
  localStorage.removeItem("alsaconnect_active_session");
  localStorage.removeItem("alsaconnect_active_view");

  clearQuotedReply();
  clearSearchFilter();
  searchDrawer.classList.add("hidden");
  scratchpadDrawer.classList.add("hidden");
  toolsMenuDrawer.classList.add("hidden");
  nicknameModal.classList.add("hidden");
  countdownModal.classList.add("hidden");
  welcomeToast.classList.add("hidden");
  camouflageScreen.classList.add("hidden");
  loginForm.reset();
  generateCapitalCaptcha();
  
  chatScreen.classList.add("hidden");
  conversationHubScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
  checkBiometricAvailability();
}

logoutBtn.addEventListener("click", executeLogout);
hubLogoutBtn.addEventListener("click", executeLogout);

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Check for Saved Session on Refresh / Page Load
function initSessionRehydration() {
  generateCapitalCaptcha();
  checkBiometricAvailability();

  const savedActiveUser = localStorage.getItem("alsaconnect_active_session");
  const savedActiveView = localStorage.getItem("alsaconnect_active_view") || "hub";

  if (savedActiveUser && USERS[savedActiveUser]) {
    currentUser = { ...USERS[savedActiveUser], username: savedActiveUser };
    if (savedActiveView === "chat") {
      authScreen.classList.add("hidden");
      conversationHubScreen.classList.add("hidden");
      chatScreen.classList.remove("hidden");
      startChatSession();
    } else {
      openConversationHub();
    }
  }
}

initSessionRehydration();
