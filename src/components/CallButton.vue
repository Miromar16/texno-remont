<template>
  <div data-nosnippet>
  <a
    class="call-button"
    href="tel:+998909385631"
    aria-label="Позвонить в Техноремонт"
  >
    <span class="call-button__icon">☎</span>
    <span class="call-button__text">Позвонить</span>
  </a>
  </div>
</template>

<style scoped>
.call-button {
  position: fixed;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 16px 22px;
  border: 1px solid rgba(39, 255, 222, 0.55);
  border-radius: 999px;

  background:
    linear-gradient(
      135deg,
      rgba(20, 255, 218, 0.18),
      rgba(4, 18, 20, 0.92)
    );

  color: #ffffff;
  text-decoration: none;

  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow:
    0 0 20px rgba(23, 255, 215, 0.25),
    0 0 50px rgba(23, 255, 215, 0.08),
    inset 0 0 20px rgba(23, 255, 215, 0.05);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  animation: callGlow 2.2s ease-in-out infinite;
}

.call-button:hover {
  transform: translateY(-50%) scale(1.06);

  border-color: rgba(39, 255, 222, 0.95);

  box-shadow:
    0 0 25px rgba(23, 255, 215, 0.5),
    0 0 70px rgba(23, 255, 215, 0.16);
}

.call-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  border-radius: 50%;

  background: #20e8cb;
  color: #041413;

  font-size: 19px;

  box-shadow:
    0 0 16px rgba(32, 232, 203, 0.55);
}

.call-button__text {
  white-space: nowrap;
}

@keyframes callGlow {
  0%,
  100% {
    box-shadow:
      0 0 18px rgba(23, 255, 215, 0.25),
      0 0 45px rgba(23, 255, 215, 0.07);
  }

  50% {
    box-shadow:
      0 0 28px rgba(23, 255, 215, 0.48),
      0 0 70px rgba(23, 255, 215, 0.15);
  }
}

@media (max-width: 640px) {
  .call-button {
    top: auto;
    right: 16px;
    bottom: 20px;

    transform: none;

    padding: 14px 19px;

    font-size: 15px;
  }

  .call-button:hover {
    transform: scale(1.04);
  }

  .call-button__icon {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .call-button {
    animation: none;
  }
}
</style>