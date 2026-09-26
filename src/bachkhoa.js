import "./bachkhoa.css";

const app = document.querySelector("#bkApp");
const courseForm = document.querySelector("#courseForm");
const courseInput = document.querySelector("#courseInput");
const courseError = document.querySelector("#courseError");
const courseChips = [...document.querySelectorAll("[data-course]")];
const holdButton = document.querySelector("#holdButton");
const holdProgress = document.querySelector("#holdProgress");
const holdHint = document.querySelector("#holdHint");
const courseResult = document.querySelector("#courseResult");
const resetButton = document.querySelector("#resetButton");
const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");
const soundButton = document.querySelector("#soundButton");
const sparkField = document.querySelector("#sparkField");

const HOLD_DURATION = 2600;
let holdStartedAt = 0;
let holdFrame = 0;
let holding = false;
let complete = false;
let soundEnabled = false;
let audioContext;

function courseName() {
  return courseInput.value.trim().replace(/\s+/g, " ");
}

function setProgress(value) {
  const progress = Math.max(0, Math.min(1, value));
  app.style.setProperty("--hold-progress", progress.toFixed(4));
  holdProgress.textContent = `${Math.round(progress * 100)}%`;
}

function setError(message = "") {
  courseError.textContent = message;
  courseInput.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateCourse() {
  if (courseName()) return true;
  setError("Nhập tên môn cần cầu may trước nhé.");
  courseInput.focus({ preventScroll: true });
  app.classList.remove("input-shake");
  requestAnimationFrame(() => app.classList.add("input-shake"));
  return false;
}

function ensureAudio() {
  if (!soundEnabled) return null;
  audioContext ||= new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, duration, gain = 0.03, delay = 0) {
  const context = ensureAudio();
  if (!context) return;
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + duration);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.025);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(volume).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function createSparks() {
  sparkField.replaceChildren();
  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement("i");
    spark.style.setProperty("--x", `${15 + Math.random() * 70}%`);
    spark.style.setProperty("--drift", `${-35 + Math.random() * 70}px`);
    spark.style.setProperty("--delay", `${Math.random() * 0.8}s`);
    spark.style.setProperty("--duration", `${1.4 + Math.random() * 1.5}s`);
    sparkField.append(spark);
  }
}

function finishRitual() {
  if (complete) return;
  complete = true;
  holding = false;
  cancelAnimationFrame(holdFrame);
  setProgress(1);
  app.dataset.state = "done";
  courseInput.disabled = true;
  courseResult.textContent = courseName();
  createSparks();
  tone(523.25, 0.6, 0.035);
  tone(659.25, 0.8, 0.025, 0.16);
  navigator.vibrate?.([40, 45, 75]);
  window.gtag?.("event", "bachkhoa_ritual_complete", { course_name: courseName() });
}

function tickHold(now) {
  if (!holding || complete) return;
  const progress = (now - holdStartedAt) / HOLD_DURATION;
  setProgress(progress);
  if (progress >= 1) {
    finishRitual();
    return;
  }
  holdFrame = requestAnimationFrame(tickHold);
}

function startHold(event) {
  if (complete || holding || !validateCourse()) return;
  event?.preventDefault();
  if (event?.pointerId !== undefined) holdButton.setPointerCapture(event.pointerId);
  setError();
  holding = true;
  holdStartedAt = performance.now();
  app.dataset.state = "holding";
  holdHint.textContent = "Giữ vững — đừng buông tay…";
  tone(262, 0.12, 0.014);
  holdFrame = requestAnimationFrame(tickHold);
}

function cancelHold() {
  if (!holding || complete) return;
  holding = false;
  cancelAnimationFrame(holdFrame);
  app.dataset.state = "idle";
  holdHint.textContent = "Chưa đủ thành tâm — giữ đủ 3 giây nhé";
  setProgress(0);
}

function resetRitual() {
  complete = false;
  holding = false;
  app.dataset.state = "idle";
  courseInput.disabled = false;
  shareStatus.textContent = "";
  holdHint.textContent = "Nhập tên môn, rồi giữ nút trong 3 giây";
  sparkField.replaceChildren();
  setProgress(0);
  courseInput.select();
  courseInput.focus({ preventScroll: true });
}

async function shareRitual() {
  const data = {
    title: "Vía qua môn Bách khoa",
    text: `Mình vừa thắp hương cầu qua môn ${courseName()}. May mắn 10%, ôn bài 90%!`,
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      shareStatus.textContent = "Đã mở bảng chia sẻ.";
    } else {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      shareStatus.textContent = "Đã sao chép lời chúc và đường dẫn.";
    }
  } catch (error) {
    if (error?.name !== "AbortError") shareStatus.textContent = "Chưa thể chia sẻ. Thử lại nhé.";
  }
}

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateCourse()) holdButton.focus();
});
courseInput.addEventListener("input", () => {
  if (courseName()) setError();
});
courseChips.forEach((chip) => chip.addEventListener("click", () => {
  courseInput.value = chip.dataset.course;
  setError();
  holdButton.focus({ preventScroll: true });
}));

holdButton.addEventListener("pointerdown", startHold);
holdButton.addEventListener("pointerup", cancelHold);
holdButton.addEventListener("pointercancel", cancelHold);
holdButton.addEventListener("lostpointercapture", cancelHold);
holdButton.addEventListener("keydown", (event) => {
  if ((event.key === " " || event.key === "Enter") && !event.repeat) startHold(event);
});
holdButton.addEventListener("keyup", (event) => {
  if (event.key === " " || event.key === "Enter") cancelHold();
});
window.addEventListener("blur", cancelHold);

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Tắt âm thanh" : "Bật âm thanh");
  if (soundEnabled) tone(392, 0.25, 0.02);
});
resetButton.addEventListener("click", resetRitual);
shareButton.addEventListener("click", shareRitual);

setProgress(0);
