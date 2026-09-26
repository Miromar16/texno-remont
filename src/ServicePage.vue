<template>
  <main class="service-page">
    <div class="noise"></div>

    <div data-nosnippet>
      <header class="nav container service-nav">
        <a href="/" class="brand" aria-label="Техноремонт — главная">
          <span class="brand-dot"></span>
          ТЕХНОРЕМОНТ
        </a>
        <nav class="nav-links" aria-label="Навигация по услуге">
          <a href="#problems">Неисправности</a>
          <a href="#process">Как работаем</a>
          <a href="#faq">Вопросы</a>
        </nav>
        <a :href="phoneHref" class="phone-pill">{{ phone }}</a>
      </header>
    </div>

    <section class="service-hero container">
      <div class="hero-glow glow-a"></div>
      <div class="hero-glow glow-b"></div>
      <div class="service-hero-copy reveal in-view">
        <div class="eyebrow"><span></span>{{ page.eyebrow }}</div>
        <h1>{{ page.title }}</h1>
        <p>{{ page.lead }}</p>
        <div class="hero-actions">
          <a :href="phoneHref" class="cta">Позвонить мастеру <span class="cta-arrow">↗</span></a>
          <a href="#problems" class="secondary-link">Что ремонтируем ↓</a>
        </div>
      </div>

      <div class="service-page-model" :class="{ 'service-page-model--showcase': page.showcase }">
        <ApplianceShowcase3D v-if="page.showcase" />
        <ServiceDevice3D v-else :type="page.model" />
      </div>
    </section>

    <section class="service-intro section container">
      <div class="section-head reveal">
        <div>
          <div class="eyebrow"><span></span> Диагностика</div>
          <h2>{{ page.introTitle }}</h2>
        </div>
        <p>{{ page.introText }}</p>
      </div>
    </section>

    <section id="problems" class="section service-problems">
      <div class="container">
        <div class="service-problem-grid">
          <article v-for="(item, index) in page.problems" :key="item[0]" class="service-problem-card reveal" :style="{ '--delay': `${index * 55}ms` }">
            <span>0{{ index + 1 }}</span>
            <h2>{{ item[0] }}</h2>
            <p>{{ item[1] }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="process" class="section container process-section service-process">
      <div class="section-head reveal">
        <div>
          <div class="eyebrow"><span></span> Как проходит ремонт</div>
          <h2>Сначала причина.<br /><em>Потом решение.</em></h2>
        </div>
      </div>
      <div class="process-list">
        <div v-for="(step, index) in page.steps" :key="step[0]" class="process-item reveal">
          <div class="process-index">0{{ index + 1 }}</div>
          <div><h3>{{ step[0] }}</h3><p>{{ step[1] }}</p></div>
          <div class="process-arrow">↘</div>
        </div>
      </div>
    </section>

    <section id="faq" class="section service-faq-section">
      <div class="container">
        <div class="faq service-faq">
          <div class="eyebrow"><span></span> Вопросы</div>
          <h2>Что обычно спрашивают перед выездом</h2>
          <details v-for="item in page.faq" :key="item[0]">
            <summary>{{ item[0] }}</summary>
            <p>{{ item[1] }}</p>
          </details>
        </div>
      </div>
    </section>

    <DemoReviews />

    <section class="section related-section">
      <div class="container">
        <div class="eyebrow"><span></span> Другие услуги</div>
        <div class="related-grid">
          <a v-for="item in page.related" :key="item[0]" :href="item[0]" class="related-card">
            <span>{{ item[1] }}</span><b>↗</b>
          </a>
          <a href="/" class="related-card related-card-home"><span>Все услуги на главной</span><b>↗</b></a>
        </div>
      </div>
    </section>

    <section class="final-cta service-final">
      <div class="final-glow"></div>
      <div class="container final-inner reveal">
        <div class="eyebrow light"><span></span> Выезд по Ташкенту</div>
        <h2>Опишите проблему<br /><span>по телефону.</span></h2>
        <p>Сообщите тип техники и признаки неисправности — мастер уточнит детали и согласует выезд.</p>
        <a :href="phoneHref" class="mega-phone">{{ phone }} <span>↗</span></a>
      </div>
    </section>

    <CallButton />

    <div data-nosnippet>
      <footer class="footer container">
        <a href="/" class="brand"><span class="brand-dot"></span> ТЕХНОРЕМОНТ</a>
        <p>{{ page.title }}</p>
        <a :href="phoneHref">Позвонить мастеру ↗</a>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { servicePages } from './servicePages.js'
import ServiceDevice3D from './components/ServiceDevice3D.vue'
import ApplianceShowcase3D from './components/ApplianceShowcase3D.vue'
import CallButton from './components/CallButton.vue'
import DemoReviews from './components/DemoReviews.vue'

const key = document.body.dataset.page || 'fridge'
const page = computed(() => servicePages[key] || servicePages.fridge)
const phone = '+998 90 938 56 31'
const phoneHref = 'tel:+998909385631'

let observer
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view')
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())
</script>
