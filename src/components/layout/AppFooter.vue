<script>
export default {
  name: 'AppFooter',
}
</script>

<template>
  <footer class="app-side-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <i class="bi bi-bug-fill fs-4 brand-accent"></i>
      </div>
      <div class="footer-links">
        <a href="#" class="text-decoration-none small text-center">Privacy</a>
        <a href="#" class="text-decoration-none small text-center">Terms</a>
        <a href="#" class="text-decoration-none small text-center">Contact</a>
      </div>
      <div class="footer-social">
        <a href="#"><i class="bi bi-github fs-5"></i></a>
        <a href="#"><i class="bi bi-twitter-x fs-5"></i></a>
        <a href="#"><i class="bi bi-envelope fs-5"></i></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-side-footer {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(78, 81, 71, 0.98), rgba(35, 37, 31, 0.98));
  color: var(--screen-text);
  border-left: 2px solid var(--screen-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  font-family: 'Press Start 2P', monospace;
}

.app-side-footer a {
  color: inherit;
}

.app-side-footer a:hover {
  color: var(--screen-accent);
}

.footer-inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  min-height: 0;
  padding: 1rem 0.5rem;
}

.footer-brand,
.footer-links,
.footer-social {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
}

.footer-links,
.footer-social {
  font-size: 0.58rem;
}

.footer-links a,
.footer-social a {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.brand-accent {
  color: var(--screen-accent);
}

@media (max-width: 767.98px) {
  .app-side-footer {
    height: auto;
    border-left: 0;
    border-top: 2px solid var(--screen-border);
  }

  .footer-inner {
    flex-direction: row;
    padding: 0.75rem 1rem;
  }

  .footer-brand,
  .footer-links,
  .footer-social {
    flex-direction: row;
    width: auto;
  }

  .footer-links a,
  .footer-social a {
    writing-mode: initial;
    text-orientation: initial;
  }
}
</style>
