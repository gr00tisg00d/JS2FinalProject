<script>
export default {
  name: 'AppFooter',
}
</script>

<template>
  <footer class="border-top py-2 py-md-4">
    <div class="footer-inner d-flex flex-column flex-md-row align-items-center m-auto px-4">
      <div class="footer-brand d-flex align-items-center gap-2 col justify-content-start">
        <i class="bi bi-bug-fill fs-4 brand-accent"></i>
        <span class="fw-bold">Find The Err0r</span>
      </div>
      <div class="footer-links d-none d-md-flex col-4 justify-content-between align-content-center">
        <a href="#" class="text-decoration-none small col align-content-center text-center"
          >Privacy Policy</a
        >
        <a href="#" class="text-decoration-none small col align-content-center text-center"
          >Terms of Service</a
        >
        <a href="#" class="text-decoration-none small col align-content-center text-center"
          >Contact</a
        >
      </div>
      <div class="footer-social d-none d-md-flex gap-3 col justify-content-end">
        <a href="#"><i class="bi bi-github fs-5"></i></a>
        <a href="#"><i class="bi bi-twitter-x fs-5"></i></a>
        <a href="#"><i class="bi bi-envelope fs-5"></i></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: linear-gradient(180deg, rgba(8, 19, 29, 0.94), rgba(11, 37, 58, 0.98));
  color: var(--screen-text);
}

footer a {
  color: inherit;
}

footer a:hover {
  color: var(--screen-accent);
}

.brand-accent {
  color: var(--screen-accent);
}
</style>
