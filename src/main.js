import "./style.css";

const assetUrl = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;

const ritual = document.querySelector("#ritual");
const surface = document.querySelector("#dragSurface");
const hand = document.querySelector("#handLayer");
const orbitValue = document.querySelector(".orbit-value");
const progressValue = document.querySelector("#progressValue");
const title = document.querySelector("#title");
const eyebrow = document.querySelector("#eyebrow");
const message = document.querySelector("#message");
const resetButton = document.querySelector("#resetButton");
const soundButton = document.querySelector(".sound-toggle");
const scene = document.querySelector(".scene");
const altarToggle = document.querySelector("#altarToggle");
const currentAltarLabel = document.querySelector("#currentAltar");
const altarPicker = document.querySelector("#altarPicker");
const pickerBackdrop = document.querySelector("#pickerBackdrop");
const pickerClose = document.querySelector("#pickerClose");
const altarOptions = [...document.querySelectorAll(".altar-option")];
const altarDots = [...document.querySelectorAll("[data-dot]")];
const wishButton = document.querySelector("#wishButton");
const wishSheet = document.querySelector("#wishSheet");
const wishBackdrop = document.querySelector("#wishBackdrop");
const wishClose = document.querySelector("#wishClose");
const wishInput = document.querySelector("#wishInput");
const wishCount = document.querySelector("#wishCount");
const wishSave = document.querySelector("#wishSave");
const wishClear = document.querySelector("#wishClear");
const wishChips = [...document.querySelectorAll("[data-wish]")];

const altars = {
  ancestor: {
    label: "Gia tiên",
    image: assetUrl("altar-background.png"),
    burnerBottom: "46%",
    placeTarget: 125,
    eyebrow: "TĨNH TÂM · THÀNH Ý",
    title: "Thắp một nén<br><em>tâm hương</em>",
    message: "Nhẹ lòng tưởng niệm, gửi điều lành đến những người ta thương.",
    doneEyebrow: "HƯƠNG ĐĂNG VIÊN MÃN",
    doneTitle: "Nguyện lòng<br><em>an yên</em>",
    doneMessage: "Khói hương nhẹ tỏa, mong bình an và điều lành luôn ở bên bạn."
  },
  maitreya: {
    label: "Phật Di Lặc",
    image: assetUrl("altar-di-lac.png"),
    burnerBottom: "38%",
    placeTarget: 170,
    eyebrow: "HOAN HỶ · AN LẠC",
    title: "Gieo một niềm<br><em>hoan hỷ</em>",
    message: "Thắp nén tâm hương, mở lòng đón nhận niềm vui và sự đủ đầy.",
    doneEyebrow: "TÂM AN · VẠN SỰ AN",
    doneTitle: "Tâm luôn<br><em>hoan hỷ</em>",
    doneMessage: "Nguyện nụ cười và lòng bao dung luôn hiện diện trong mỗi ngày."
  },
  guanyin: {
    label: "Quan Âm",
    image: assetUrl("altar-quan-am.png"),
    burnerBottom: "33%",
    placeTarget: 215,
    eyebrow: "TỪ BI · THANH TỊNH",
    title: "Lắng nghe lòng<br><em>từ bi</em>",
    message: "Một nén hương lành, một phút lắng lòng và thương yêu muôn loài.",
    doneEyebrow: "TỪ TÂM · TỰ TẠI",
    doneTitle: "Nguyện lòng<br><em>từ bi</em>",
    doneMessage: "Nguyện lòng thanh tịnh, biết lắng nghe và dịu dàng với chính mình."
  },
  amida: {
    label: "Phật A Di Đà",
    image: assetUrl("altar-amida.png"),
    burnerBottom: "37%",
    placeTarget: 180,
    eyebrow: "TĨNH TẠI · SÁNG TÂM",
    title: "Một niệm<br><em>sáng trong</em>",
    message: "Lắng lòng trong một hơi thở, để tâm trở về nơi bình yên vốn có.",
    doneEyebrow: "NHẤT TÂM · AN LẠC",
    doneTitle: "Tâm về<br><em>tĩnh tại</em>",
    doneMessage: "Nguyện ánh sáng tỉnh thức soi đường, để mỗi bước đều nhẹ và an."
  },
  wealth: {
    label: "Thần Tài",
    image: assetUrl("altar-than-tai.png"),
    burnerBottom: "44%",
    placeTarget: 140,
    eyebrow: "THÀNH TÂM · ĐÓN LỘC",
    title: "Gọi điều lành<br><em>ghé đến</em>",
    message: "Thành tâm vun bồi phúc khí, mong công việc thuận hòa và gia đạo ấm no.",
    doneEyebrow: "PHÚC LỘC · HANH THÔNG",
    doneTitle: "Nguyện đời<br><em>sung túc</em>",
    doneMessage: "Nguyện chăm chỉ gặp hanh thông, biết đủ gặp an vui và phúc lành bền lâu."
  },
  zen: {
    label: "Thiền Sen",
    image: assetUrl("altar-thien-sen.png"),
    burnerBottom: "37%",
    placeTarget: 180,
    eyebrow: "THỞ SÂU · AN TRÚ",
    title: "Trở về với<br><em>tĩnh lặng</em>",
    message: "Chậm lại một nhịp, nghe hơi thở và để những xao động nhẹ nhàng đi qua.",
    doneEyebrow: "THÂN AN · TÂM NHẸ",
    doneTitle: "Một khoảng<br><em>thảnh thơi</em>",
    doneMessage: "Nguyện tâm như sen, bình dị giữa đời và trong sáng giữa mọi đổi thay."
  }
};

const CIRCUMFERENCE = 132;
let phase = "shake";
let dragging = false;
let pointerId = null;
let startX = 0;
let lastY = 0;
let startY = 0;
let gestureMode = null;
let swipeOffset = 0;
let canPlantOnRelease = false;
let shakeDistance = 0;
let visualY = 0;
let previousDirection = 0;
let directionChanges = 0;
let audioEnabled = false;
let audioContext;
let currentAltar = "ancestor";
let customWish = "";

try {
  customWish = window.localStorage.getItem("tam-huong-wish") || "";
} catch {
  customWish = "";
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function setProgress(value) {
  const rounded = Math.round(clamp(value, 0, 100));
  ritual.style.setProperty("--progress", `${rounded}%`);
  orbitValue.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - rounded / 100));
  progressValue.textContent = rounded;
}

function tone(frequency = 440, duration = 0.25, gain = 0.035) {
  if (!audioEnabled) return;
  audioContext ||= new AudioContext();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.78, now + duration);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.025);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(volume).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function completeRitual() {
  if (phase === "done") return;
  phase = "done";
  ritual.dataset.phase = phase;
  const altar = altars[currentAltar];
  eyebrow.textContent = altar.doneEyebrow;
  title.innerHTML = altar.doneTitle;
  message.textContent = altar.doneMessage;
  renderWish();
  const flash = document.createElement("div");
  flash.className = "completion-flash";
  ritual.append(flash);
  flash.addEventListener("animationend", () => flash.remove());
  tone(659.25, .55, .04);
  setTimeout(() => tone(783.99, .7, .025), 170);
  navigator.vibrate?.([35, 40, 60]);
}

function onPointerDown(event) {
  dragging = true;
  pointerId = event.pointerId;
  startX = event.clientX;
  lastY = event.clientY;
  startY = event.clientY;
  gestureMode = null;
  swipeOffset = 0;
  canPlantOnRelease = false;
  previousDirection = 0;
  surface.setPointerCapture(pointerId);
  ritual.classList.add("is-dragging");
  tone(280, .08, .012);
}

function onPointerMove(event) {
  if (!dragging || event.pointerId !== pointerId) return;
  const deltaY = event.clientY - lastY;
  const totalX = event.clientX - startX;
  const totalY = event.clientY - startY;
  lastY = event.clientY;

  if (!gestureMode) {
    const horizontalIntent = Math.abs(totalX) > 14 && Math.abs(totalX) > Math.abs(totalY) * 1.35;
    const verticalIntent = Math.abs(totalY) > 8 && Math.abs(totalY) > Math.abs(totalX) * .72;
    if (horizontalIntent) {
      gestureMode = "swipe";
      ritual.classList.add("is-swiping");
    } else if (verticalIntent) {
      gestureMode = phase === "done" ? "idle" : "ritual";
    } else {
      return;
    }
  }

  if (gestureMode === "swipe") {
    swipeOffset = totalX;
    const preview = clamp(totalX * .28, -36, 36);
    ritual.style.setProperty("--swipe-preview", `${preview * .45}px`);
    scene.style.setProperty("--scene-x", `${preview}px`);
    return;
  }

  if (gestureMode !== "ritual" || phase === "done") return;

  if (phase === "shake") {
    const direction = Math.sign(deltaY);
    if (Math.abs(deltaY) > 2 && previousDirection && direction !== previousDirection) directionChanges += 1;
    if (Math.abs(deltaY) > 2) previousDirection = direction;

    // Keep the full travel distance: fast mobile swipes may only emit a few
    // pointer events, so capping each event can leave the ritual stuck.
    shakeDistance += Math.abs(deltaY);
    const completedByShaking = shakeDistance >= 180 && directionChanges >= 2;
    const completedByDistance = shakeDistance >= 340;
    const readyForPlacement = completedByShaking || completedByDistance;
    const distanceProgress = Math.min(shakeDistance / 220, 1) * 72;
    const reversalProgress = Math.min(directionChanges / 2, 1) * 28;
    const progress = readyForPlacement ? 100 : Math.min(distanceProgress + reversalProgress, 96);
    const placeTarget = altars[currentAltar].placeTarget;
    visualY = clamp(totalY, -90, placeTarget + 12);
    const rotation = clamp(deltaY * .22, -6, 6);
    hand.style.setProperty("--hand-y", `${visualY}px`);
    hand.style.setProperty("--hand-r", `${rotation}deg`);
    setProgress(progress);

    // Reaching the burner only arms the placement. The ritual completes
    // when the user releases while the incense is still in position.
    canPlantOnRelease = readyForPlacement && visualY >= placeTarget;
  }
}

function onPointerUp(event) {
  if (event.pointerId !== pointerId) return;
  const completedSwipe = event.type !== "pointercancel" && gestureMode === "swipe" && Math.abs(swipeOffset) >= 55;
  const shouldPlant = event.type !== "pointercancel" && gestureMode === "ritual" && phase === "shake" && canPlantOnRelease;
  dragging = false;
  pointerId = null;
  ritual.classList.remove("is-dragging", "is-swiping");
  ritual.style.setProperty("--swipe-preview", "0px");

  if (completedSwipe) {
    switchAltarBy(swipeOffset < 0 ? 1 : -1);
  } else if (gestureMode === "swipe") {
    scene.style.setProperty("--scene-x", "0px");
  }

  if (shouldPlant) completeRitual();

  if (phase === "shake" && gestureMode !== "swipe") {
    visualY = 0;
    hand.style.setProperty("--hand-y", "0px");
    hand.style.setProperty("--hand-r", "0deg");
  }
  gestureMode = null;
  swipeOffset = 0;
  canPlantOnRelease = false;
}

function resetRitual() {
  const altar = altars[currentAltar];
  phase = "shake";
  ritual.dataset.phase = phase;
  shakeDistance = 0;
  visualY = 0;
  directionChanges = 0;
  canPlantOnRelease = false;
  ritual.style.setProperty("--swipe-preview", "0px");
  hand.style.setProperty("--hand-y", "0px");
  hand.style.setProperty("--hand-r", "0deg");
  eyebrow.textContent = altar.eyebrow;
  title.classList.remove("custom-wish-title", "is-long-wish", "is-very-long-wish");
  title.innerHTML = altar.title;
  message.textContent = altar.message;
  setProgress(0);
  tone(392, .25, .02);
}

function openPicker() {
  closeWish();
  ritual.classList.add("picker-open");
  altarToggle.setAttribute("aria-expanded", "true");
  altarPicker.setAttribute("aria-hidden", "false");
  pickerBackdrop.setAttribute("aria-hidden", "false");
  pickerClose.focus({ preventScroll: true });
}

function closePicker() {
  ritual.classList.remove("picker-open");
  altarToggle.setAttribute("aria-expanded", "false");
  altarPicker.setAttribute("aria-hidden", "true");
  pickerBackdrop.setAttribute("aria-hidden", "true");
}

function renderWish() {
  const hasWish = Boolean(customWish);
  wishButton.classList.toggle("has-wish", hasWish);
  wishClear.hidden = !hasWish;

  if (phase !== "done") return;

  title.classList.toggle("custom-wish-title", hasWish);
  title.classList.toggle("is-long-wish", customWish.length > 60);
  title.classList.toggle("is-very-long-wish", customWish.length > 110);
  if (hasWish) title.textContent = customWish;
  else title.innerHTML = altars[currentAltar].doneTitle;
}

function updateWishCount() {
  wishCount.textContent = String(wishInput.value.length);
}

function openWish() {
  closePicker();
  wishInput.value = customWish;
  updateWishCount();
  ritual.classList.add("wish-open");
  wishButton.setAttribute("aria-expanded", "true");
  wishSheet.setAttribute("aria-hidden", "false");
  wishBackdrop.setAttribute("aria-hidden", "false");
  setTimeout(() => wishInput.focus({ preventScroll: true }), 260);
}

function closeWish() {
  ritual.classList.remove("wish-open");
  wishButton.setAttribute("aria-expanded", "false");
  wishSheet.setAttribute("aria-hidden", "true");
  wishBackdrop.setAttribute("aria-hidden", "true");
}

function saveWish() {
  customWish = wishInput.value.trim();
  try {
    if (customWish) window.localStorage.setItem("tam-huong-wish", customWish);
    else window.localStorage.removeItem("tam-huong-wish");
  } catch {
    // The ritual still works when private browsing blocks local storage.
  }
  renderWish();
  closeWish();
  tone(587.33, .35, .025);
  navigator.vibrate?.(25);
}

function clearWish() {
  wishInput.value = "";
  customWish = "";
  try { window.localStorage.removeItem("tam-huong-wish"); } catch { /* no-op */ }
  updateWishCount();
  renderWish();
}

function selectAltar(key, direction = 0) {
  if (!altars[key]) return;
  if (key === currentAltar) {
    closePicker();
    scene.style.setProperty("--scene-x", "0px");
    return;
  }

  const altarKeys = Object.keys(altars);
  const previousIndex = altarKeys.indexOf(currentAltar);
  const nextIndex = altarKeys.indexOf(key);
  const transitionDirection = direction || (nextIndex > previousIndex ? 1 : -1);
  currentAltar = key;
  const altar = altars[key];
  currentAltarLabel.textContent = altar.label;
  altarOptions.forEach((option) => {
    const selected = option.dataset.altar === key;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });
  altarDots.forEach((dot) => dot.classList.toggle("is-active", dot.dataset.dot === key));

  resetRitual();
  closePicker();
  const exitX = transitionDirection * -44;
  scene.style.setProperty("--scene-x", `${exitX}px`);
  scene.classList.add("is-switching");
  setTimeout(() => {
    ritual.style.setProperty("--altar-image", `url("${altar.image}")`);
    ritual.style.setProperty("--burner-bottom", altar.burnerBottom);
    scene.classList.add("no-transition");
    scene.style.setProperty("--scene-x", `${-exitX}px`);
    scene.getBoundingClientRect();
    scene.classList.remove("no-transition");
    requestAnimationFrame(() => {
      scene.classList.remove("is-switching");
      scene.style.setProperty("--scene-x", "0px");
    });
  }, 210);
}

function switchAltarBy(direction) {
  const altarKeys = Object.keys(altars);
  const currentIndex = altarKeys.indexOf(currentAltar);
  const nextIndex = (currentIndex + direction + altarKeys.length) % altarKeys.length;
  selectAltar(altarKeys[nextIndex], direction);
}

surface.addEventListener("pointerdown", onPointerDown);
surface.addEventListener("pointermove", onPointerMove);
surface.addEventListener("pointerup", onPointerUp);
surface.addEventListener("pointercancel", onPointerUp);

resetButton.addEventListener("click", resetRitual);
altarToggle.addEventListener("click", openPicker);
pickerClose.addEventListener("click", closePicker);
pickerBackdrop.addEventListener("click", closePicker);
altarOptions.forEach((option) => option.addEventListener("click", () => selectAltar(option.dataset.altar)));
wishButton.addEventListener("click", openWish);
wishClose.addEventListener("click", closeWish);
wishBackdrop.addEventListener("click", closeWish);
wishInput.addEventListener("input", updateWishCount);
wishSave.addEventListener("click", saveWish);
wishClear.addEventListener("click", clearWish);
wishChips.forEach((chip) => chip.addEventListener("click", () => {
  wishInput.value = chip.dataset.wish;
  updateWishCount();
  wishInput.focus();
}));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && ritual.classList.contains("picker-open")) closePicker();
  if (event.key === "Escape" && ritual.classList.contains("wish-open")) closeWish();
});
soundButton.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  soundButton.setAttribute("aria-pressed", String(audioEnabled));
  soundButton.setAttribute("aria-label", audioEnabled ? "Tắt âm thanh" : "Bật âm thanh");
  if (audioEnabled) tone(523.25, .25, .025);
});

setProgress(0);
renderWish();
