// document.getElementById("btnEntrar").addEventListener("click", () => {
//   window.location.href = "/HOME/home.html";
// });

document.getElementById("patronus-btn").addEventListener("click", () => {
  window.location.href = "/HOME/home.html";
});

// REPRODUCTOR

let audioCtx,
  source,
  gainNode,
  filtroGraves,
  filtroMedios,
  filtroAgudos,
  analyser;
let reproduciendo = false;

function iniciarAudio() {
  audioCtx = new AudioContext();

  // Ruido blanco
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Filtros EQ
  filtroGraves = audioCtx.createBiquadFilter();
  filtroGraves.type = "lowshelf";
  filtroGraves.frequency.value = 320;
  filtroGraves.gain.value = 0;

  filtroMedios = audioCtx.createBiquadFilter();
  filtroMedios.type = "peaking";
  filtroMedios.frequency.value = 1000;
  filtroMedios.Q.value = 1;
  filtroMedios.gain.value = 0;

  filtroAgudos = audioCtx.createBiquadFilter();
  filtroAgudos.type = "highshelf";
  filtroAgudos.frequency.value = 3200;
  filtroAgudos.gain.value = 0;

  // Volumen
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.5;

  // Visualizador
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  // Cadena de conexiones
  source.connect(filtroGraves);
  filtroGraves.connect(filtroMedios);
  filtroMedios.connect(filtroAgudos);
  filtroAgudos.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  source.start();
}

// Play / Pause
document.querySelector("#btn-play").addEventListener("click", () => {
  if (!reproduciendo) {
    iniciarAudio();
    reproduciendo = true;
    document.querySelector("#btn-play").textContent = "⏸ Detener";
  } else {
    if (audioCtx.state === "running") {
      audioCtx.suspend();
      document.querySelector("#btn-play").textContent = "▶ Escuchar";
    } else {
      audioCtx.resume();
      document.querySelector("#btn-play").textContent = "⏸ Detener";
    }
  }
});

// Slider de volumen
const sliderVolumen = document.querySelector("#volumen");

sliderVolumen.addEventListener("input", (e) => {
  if (gainNode) gainNode.gain.value = e.target.value;

  const porcentaje = e.target.value * 100;
  e.target.style.background =
    `linear-gradient(to right, black ${porcentaje}%, gray ${porcentaje}%)`;
});

// Pintar el slider al cargar la página
sliderVolumen.dispatchEvent(new Event("input"));

// Sliders EQ
document.querySelector("#graves").addEventListener("input", (e) => {
  if (filtroGraves) filtroGraves.gain.value = e.target.value;
});

document.querySelector("#medios").addEventListener("input", (e) => {
  if (filtroMedios) filtroMedios.gain.value = e.target.value;
});

document.querySelector("#agudos").addEventListener("input", (e) => {
  if (filtroAgudos) filtroAgudos.gain.value = e.target.value;
});

// Visualizador
function dibujar() {
  requestAnimationFrame(dibujar);

  if (!analyser) return;

  const canvas = document.querySelector("#visualizador");
  const ctx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;

  dataArray.forEach((valor, i) => {
    const barHeight = (valor / 255) * canvas.height;
    ctx.fillStyle = `hsl(${i * 2}, 80%, 60%)`;
    ctx.fillRect(
      i * barWidth,
      canvas.height - barHeight,
      barWidth - 1,
      barHeight
    );
  });
}

dibujar();