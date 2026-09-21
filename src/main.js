import "./style.css";

const assetUrl = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;
const altarImage = (name) => {
  const compact = assetUrl(`${name}-480.webp`);
  const full = assetUrl(`${name}.webp`);
  return {
    image: compact,
    imageName: name,
    imageSrcset: `${compact} 480w, ${full} 941w`
  };
};

const ritual = document.querySelector("#ritual");
const surface = document.querySelector("#dragSurface");
const hand = document.querySelector("#handLayer");
const orbitValue = document.querySelector(".orbit-value");
const progressOrbit = document.querySelector("#progressOrbit");
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
const guideButton = document.querySelector("#guideButton");
const guideSheet = document.querySelector("#guideSheet");
const guideBackdrop = document.querySelector("#guideBackdrop");
const guideClose = document.querySelector("#guideClose");
const deferredEffectImages = [...document.querySelectorAll("[data-effect-src]")];
const onboardingCard = document.querySelector("#onboardingCard");
const onboardingBackdrop = document.querySelector("#onboardingBackdrop");
const onboardingStart = document.querySelector("#onboardingStart");
const shareButton = document.querySelector("#shareButton");
const shareLabel = document.querySelector("#shareLabel");
const shareStatus = document.querySelector("#shareStatus");

const altars = {
  ancestor: {
    ...altarImage("altar-background"),
    label: "Gia tiên",
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
    ...altarImage("altar-di-lac"),
    label: "Phật Di Lặc",
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
    ...altarImage("altar-quan-am"),
    label: "Quan Âm",
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
    ...altarImage("altar-amida"),
    label: "Phật A Di Đà",
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
    ...altarImage("altar-than-tai"),
    label: "Thần Tài",
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
    ...altarImage("altar-thien-sen"),
    label: "Thiền Sen",
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
let effectsRequested = false;
let sceneRequestId = 0;
let hasSeenOnboarding = false;
let shareImagePromise = null;

try {
  customWish = window.localStorage.getItem("tam-huong-wish") || "";
  hasSeenOnboarding = window.localStorage.getItem("tam-huong-onboarding-v1") === "seen";
} catch {
  customWish = "";
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function loadCanvasImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error("Không thể tải ảnh bàn thờ.")), { once: true });
    image.src = source;
  });
}

function drawCover(context, image, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

function wrapCanvasText(context, text, maxWidth, maxLines = Infinity) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (line && context.measureText(testLine).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);

  if (lines.length > maxLines) {
    const visibleLines = lines.slice(0, maxLines);
    let lastLine = `${visibleLines[maxLines - 1]}…`;
    while (lastLine.length > 1 && context.measureText(lastLine).width > maxWidth) {
      lastLine = `${lastLine.slice(0, -2).trimEnd()}…`;
    }
    visibleLines[maxLines - 1] = lastLine;
    return visibleLines;
  }
  return lines;
}

function plainTitle(html) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// The share image always recreates the finished ritual screen inside a fixed
// 9:16 phone frame (390px wide → 1080×1920, a story-sized image), so it looks the same no
// matter which device or window size it is exported from.
const SHARE_SCALE = 1080 / 390;
const SHARE_FRAME = { width: 390, height: 1920 / SHARE_SCALE };

function setLetterSpacing(context, value) {
  if ("letterSpacing" in context) context.letterSpacing = value;
}

async function createShareImage(altarKey, wish) {
  const altar = altars[altarKey];
  const [background, incense, smokeA, smokeB] = await Promise.all([
    loadCanvasImage(assetUrl(`${altar.imageName}.webp`)),
    loadCanvasImage(assetUrl("planted-incense-real.webp")),
    loadCanvasImage(assetUrl("incense-smoke-wisp-1.webp")).catch(() => null),
    loadCanvasImage(assetUrl("incense-smoke-wisp-2.webp")).catch(() => null)
  ]);
  // Google Fonts serves Vietnamese glyphs in a separate unicode-range file, and
  // canvas text does not trigger that download, so request it explicitly.
  const serifText = wish || plainTitle(altar.doneTitle);
  const sansText = `TÂM HƯƠNG Một phút an yên ${altar.doneEyebrow} ${altar.doneMessage} KHÔNG GIAN ${altar.label.toUpperCase()}`;
  await Promise.all([
    document.fonts?.load('600 32px "Playfair Display"', serifText),
    ...["300", "500", "600"].map((weight) => document.fonts?.load(`${weight} 10px "Be Vietnam Pro"`, sansText))
  ]).catch(() => {});
  await document.fonts?.ready;

  const { width, height } = SHARE_FRAME;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * SHARE_SCALE);
  canvas.height = Math.round(height * SHARE_SCALE);
  const context = canvas.getContext("2d", { alpha: false });
  context.scale(SHARE_SCALE, SHARE_SCALE);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  // .scene (object-fit: cover, scale 1.015)
  context.save();
  context.translate(width / 2, height / 2);
  context.scale(1.015, 1.015);
  context.translate(-width / 2, -height / 2);
  drawCover(context, background, width, height);
  context.restore();

  // .scene-shade
  const shade = context.createLinearGradient(0, 0, 0, height);
  shade.addColorStop(0, "rgba(6, 3, 2, .38)");
  shade.addColorStop(.36, "rgba(15, 5, 2, 0)");
  shade.addColorStop(.59, "rgba(10, 3, 1, .02)");
  shade.addColorStop(1, "rgba(9, 3, 1, .52)");
  context.fillStyle = shade;
  context.fillRect(0, 0, width, height);
  const vignetteX = width / 2;
  const vignetteY = height * .42;
  const vignette = context.createRadialGradient(vignetteX, vignetteY, 0, vignetteX, vignetteY, Math.hypot(vignetteX, height - vignetteY));
  vignette.addColorStop(.14, "rgba(5, 2, 1, 0)");
  vignette.addColorStop(.66, "rgba(5, 2, 1, .16)");
  vignette.addColorStop(1, "rgba(4, 2, 1, .45)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

  // .planted-incense and .smoke-field, positioned from the altar's burner line.
  const incenseHeight = 165;
  const incenseSink = 10;
  const incenseBottom = height - (height * parseFloat(altar.burnerBottom) / 100 - incenseSink);
  const incenseWidth = incense.naturalWidth * (incenseHeight / incense.naturalHeight);
  const smokeBottom = incenseBottom - incenseHeight + 2;
  const smokes = [
    [smokeA, 118, .03, -20, .88, 1.02, .27],
    [smokeB, 105, -.03, -23, .85, 1.03, .22],
    [smokeA, 96, .05, -26, .84, 1.05, .15]
  ];
  context.save();
  context.globalCompositeOperation = "screen";
  smokes.forEach(([image, smokeWidth, offset, rise, scaleX, scaleY, opacity]) => {
    if (!image) return;
    const drawWidth = smokeWidth * scaleX;
    const drawHeight = smokeWidth * (image.naturalHeight / image.naturalWidth) * scaleY;
    context.globalAlpha = opacity;
    context.drawImage(image, width / 2 + offset * smokeWidth - drawWidth / 2, smokeBottom + rise - drawHeight, drawWidth, drawHeight);
  });
  context.restore();
  context.drawImage(incense, (width - incenseWidth) / 2, incenseBottom - incenseHeight, incenseWidth, incenseHeight);

  // .topbar brand
  context.beginPath();
  context.arc(40, 38, 17.5, 0, Math.PI * 2);
  context.strokeStyle = "rgba(239, 191, 108, .45)";
  context.lineWidth = 1;
  context.stroke();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#ffda8f";
  context.font = "17px serif";
  context.fillText("心", 40, 39);
  context.textAlign = "left";
  context.fillStyle = "#ffe7b9";
  context.font = '600 10px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, "2.2px");
  context.fillText("TÂM HƯƠNG", 68, 32);
  context.fillStyle = "rgba(255, 239, 208, .51)";
  context.font = '300 8px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, ".8px");
  context.fillText("Một phút an yên", 68, 45);

  // .intro-copy in its done state
  const copyWidth = width - 56;
  let y = 112;
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#e8b762";
  context.font = '500 8px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, "2.56px");
  context.fillText(altar.doneEyebrow, width / 2, y);
  y += 10 + 9;

  context.save();
  context.shadowColor = "rgba(0, 0, 0, .38)";
  context.shadowOffsetY = 4;
  context.shadowBlur = 28;
  if (wish) {
    const [size, lineHeight] = wish.length > 110 ? [21, 1.16] : wish.length > 60 ? [25.4, 1.12] : [32, 1.05];
    context.fillStyle = "#ffda8f";
    context.font = `600 ${size}px "Playfair Display", Georgia, serif`;
    setLetterSpacing(context, `${-.025 * size}px`);
    const lines = wrapCanvasText(context, wish, copyWidth, 7);
    lines.forEach((line, index) => context.fillText(line, width / 2, y + index * size * lineHeight));
    y += lines.length * size * lineHeight;
  } else {
    const size = 40;
    context.font = `600 ${size}px "Playfair Display", Georgia, serif`;
    setLetterSpacing(context, `${-.035 * size}px`);
    altar.doneTitle.split(/<br\s*\/?>/i).forEach((part, index) => {
      context.fillStyle = /<em>/i.test(part) ? "#ffda8f" : "#fff4dc";
      context.fillText(plainTitle(part), width / 2, y + index * size * .94);
    });
    y += altar.doneTitle.split(/<br\s*\/?>/i).length * size * .94;
  }
  context.restore();

  y += 13;
  context.fillStyle = "rgba(255, 244, 219, .65)";
  context.font = '300 10px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, "0px");
  wrapCanvasText(context, altar.doneMessage, 310, 3)
    .forEach((line, index) => context.fillText(line, width / 2, y + 3 + index * 16));

  // Footer credit where the action buttons sit on screen.
  context.textBaseline = "middle";
  context.fillStyle = "#e8b661";
  context.font = '500 8px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, "2.4px");
  context.fillText(`KHÔNG GIAN ${altar.label.toUpperCase()}`, width / 2, height - 56);
  context.fillStyle = "rgba(255, 235, 199, .5)";
  context.font = '300 9px "Be Vietnam Pro", sans-serif';
  setLetterSpacing(context, ".4px");
  context.fillText("cuongpo.github.io/thaphuong", width / 2, height - 38);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Không thể tạo hình chia sẻ."));
    }, "image/jpeg", .9);
  });
}

function prepareShareImage() {
  const altarKey = currentAltar;
  const wish = customWish;
  shareImagePromise = createShareImage(altarKey, wish).catch(() => null);
}

function downloadShareImage(blob) {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "tam-huong.jpg";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function setShareState(label, status = "", busy = false) {
  shareLabel.textContent = label;
  shareStatus.textContent = status;
  shareButton.disabled = busy;
  shareButton.setAttribute("aria-busy", String(busy));
}

async function shareImage() {
  setShareState("Đang tạo hình…", "Đang chuẩn bị hình chia sẻ.", true);
  try {
    shareImagePromise ||= createShareImage(currentAltar, customWish).catch(() => null);
    const blob = await shareImagePromise;
    if (!blob) throw new Error("Không thể tạo hình chia sẻ.");

    const file = new File([blob], "tam-huong.jpg", { type: "image/jpeg" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Tâm Hương – Một phút an yên",
          text: "Một nén tâm hương, một lời nguyện bình an."
        });
        setShareState("Đã chia sẻ", "Hình đã được chia sẻ.");
      } catch (error) {
        if (error?.name === "AbortError") {
          setShareState("Chia sẻ hình");
          return;
        }
        downloadShareImage(blob);
        setShareState("Đã lưu hình", "Thiết bị không mở được bảng chia sẻ nên hình đã được tải xuống.");
      }
    } else {
      downloadShareImage(blob);
      setShareState("Đã lưu hình", "Hình đã được tải xuống thiết bị.");
    }
    navigator.vibrate?.(25);
    setTimeout(() => setShareState("Chia sẻ hình"), 1800);
  } catch {
    setShareState("Thử lại", "Không thể tạo hình. Vui lòng thử lại.");
  } finally {
    shareButton.disabled = false;
    shareButton.setAttribute("aria-busy", "false");
  }
}

function loadRitualEffects() {
  if (effectsRequested) return;
  effectsRequested = true;
  deferredEffectImages.forEach((image) => {
    image.src = assetUrl(image.dataset.effectSrc);
    delete image.dataset.effectSrc;
  });
}

function setProgress(value) {
  const rounded = Math.round(clamp(value, 0, 100));
  ritual.style.setProperty("--progress", `${rounded}%`);
  orbitValue.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - rounded / 100));
  progressValue.textContent = rounded;
  progressOrbit.setAttribute("aria-valuenow", String(rounded));
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
  prepareShareImage();
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
      if (gestureMode === "ritual") loadRitualEffects();
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
  shareImagePromise = null;
  setShareState("Chia sẻ hình");
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
  closeGuide();
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

function updateWishViewport() {
  // The popup sits near the top of the shell so the keyboard never covers it;
  // only cap its height to the visible area and undo any scroll the browser
  // applied while revealing the focused field.
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  ritual.style.setProperty("--visual-viewport-height", `${viewportHeight}px`);
  ritual.scrollTop = 0;
}

function openWish() {
  closePicker();
  closeGuide();
  wishInput.value = customWish;
  updateWishCount();
  ritual.classList.add("wish-open");
  wishButton.setAttribute("aria-expanded", "true");
  wishSheet.setAttribute("aria-hidden", "false");
  wishBackdrop.setAttribute("aria-hidden", "false");
  updateWishViewport();
  // Focus synchronously inside the tap so iOS agrees to open the keyboard.
  wishInput.focus({ preventScroll: true });
}

function closeWish() {
  if (document.activeElement === wishInput) wishInput.blur();
  ritual.classList.remove("wish-open");
  wishButton.setAttribute("aria-expanded", "false");
  wishSheet.setAttribute("aria-hidden", "true");
  wishBackdrop.setAttribute("aria-hidden", "true");
  window.scrollTo(0, 0);
}

function openGuide() {
  closePicker();
  closeWish();
  ritual.classList.add("guide-open");
  guideButton.setAttribute("aria-expanded", "true");
  guideSheet.setAttribute("aria-hidden", "false");
  guideBackdrop.setAttribute("aria-hidden", "false");
  guideClose.focus({ preventScroll: true });
}

function closeGuide() {
  ritual.classList.remove("guide-open");
  guideButton.setAttribute("aria-expanded", "false");
  guideSheet.setAttribute("aria-hidden", "true");
  guideBackdrop.setAttribute("aria-hidden", "true");
}

function openOnboarding() {
  closePicker();
  closeWish();
  closeGuide();
  ritual.classList.add("onboarding-open");
  onboardingCard.setAttribute("aria-hidden", "false");
  onboardingBackdrop.setAttribute("aria-hidden", "false");
  onboardingStart.focus({ preventScroll: true });
}

function closeOnboarding() {
  ritual.classList.remove("onboarding-open");
  onboardingCard.setAttribute("aria-hidden", "true");
  onboardingBackdrop.setAttribute("aria-hidden", "true");
  try {
    window.localStorage.setItem("tam-huong-onboarding-v1", "seen");
  } catch {
    // The onboarding can still be dismissed when storage is unavailable.
  }
  altarToggle.focus({ preventScroll: true });
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
  const requestId = ++sceneRequestId;
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
  ritual.style.setProperty("--burner-bottom", altar.burnerBottom);

  const nextScene = new Image();
  nextScene.decoding = "async";
  nextScene.sizes = "(max-width: 430px) 100vw, 430px";
  nextScene.srcset = altar.imageSrcset;
  nextScene.src = altar.image;
  nextScene.addEventListener("load", () => {
    if (requestId !== sceneRequestId) return;
    const exitX = transitionDirection * -44;
    scene.style.setProperty("--scene-x", `${exitX}px`);
    scene.classList.add("is-switching");
    setTimeout(() => {
      if (requestId !== sceneRequestId) return;
      scene.srcset = altar.imageSrcset;
      scene.src = altar.image;
      scene.classList.add("no-transition");
      scene.style.setProperty("--scene-x", `${-exitX}px`);
      scene.getBoundingClientRect();
      scene.classList.remove("no-transition");
      requestAnimationFrame(() => {
        scene.classList.remove("is-switching");
        scene.style.setProperty("--scene-x", "0px");
      });
    }, 210);
  }, { once: true });
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
shareButton.addEventListener("click", shareImage);
altarToggle.addEventListener("click", openPicker);
pickerClose.addEventListener("click", closePicker);
pickerBackdrop.addEventListener("click", closePicker);
altarOptions.forEach((option) => option.addEventListener("click", () => selectAltar(option.dataset.altar)));
wishButton.addEventListener("click", openWish);
wishClose.addEventListener("click", closeWish);
wishBackdrop.addEventListener("click", closeWish);
wishInput.addEventListener("input", updateWishCount);
wishInput.addEventListener("blur", () => window.scrollTo(0, 0));
wishSave.addEventListener("click", saveWish);
wishClear.addEventListener("click", clearWish);
guideButton.addEventListener("click", openGuide);
guideClose.addEventListener("click", closeGuide);
guideBackdrop.addEventListener("click", closeGuide);
onboardingStart.addEventListener("click", closeOnboarding);
wishChips.forEach((chip) => chip.addEventListener("click", () => {
  wishInput.value = chip.dataset.wish;
  updateWishCount();
  wishInput.focus();
}));
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && ritual.classList.contains("onboarding-open")) {
    event.preventDefault();
    onboardingStart.focus({ preventScroll: true });
  }
  if (event.key === "Escape" && ritual.classList.contains("picker-open")) closePicker();
  if (event.key === "Escape" && ritual.classList.contains("wish-open")) closeWish();
  if (event.key === "Escape" && ritual.classList.contains("guide-open")) closeGuide();
  if (event.key === "Escape" && ritual.classList.contains("onboarding-open")) closeOnboarding();
});
soundButton.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  soundButton.setAttribute("aria-pressed", String(audioEnabled));
  soundButton.setAttribute("aria-label", audioEnabled ? "Tắt âm thanh" : "Bật âm thanh");
  if (audioEnabled) tone(523.25, .25, .025);
});
window.visualViewport?.addEventListener("resize", updateWishViewport);
window.addEventListener("orientationchange", () => setTimeout(updateWishViewport, 120));

setProgress(0);
renderWish();
if (!hasSeenOnboarding) setTimeout(openOnboarding, 450);
