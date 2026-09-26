<template>
  <section v-if="show" class="section demo-reviews" aria-label="Демо-блок отзывов">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow"><span></span> Демо для разработки</div>
          <h2>Блок отзывов<br /><em>готов к реальным отзывам.</em></h2>
        </div>
        <p>Эти тексты показываются только в локальном режиме разработки и не попадают в production-сборку как отзывы клиентов.</p>
      </div>
      <div class="demo-review-grid">
        <article v-for="item in items" :key="item.name" class="demo-review-card">
          <div class="demo-review-label">ДЕМО-ОТЗЫВ</div>
          <p>“{{ item.text }}”</p>
          <strong>{{ item.name }}</strong>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const show = import.meta.env.DEV
const items = [
  { name: 'Пример клиента 01', text: 'Мастер быстро разобрался с проблемой холодильника и понятно объяснил, что сломалось.' },
  { name: 'Пример клиента 02', text: 'Удобно, что можно сразу позвонить без формы. Согласовали время и всё обсудили по телефону.' },
  { name: 'Пример клиента 03', text: 'Аккуратная диагностика и понятное объяснение вариантов ремонта без лишних слов.' }
]
</script>
