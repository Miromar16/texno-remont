<template>
  <main>
    <div class="noise"></div>

    <header class="nav container">
      <a href="#top" class="brand" aria-label="Техноремонт">
        <span class="brand-dot"></span>
        ТЕХНОРЕМОНТ
      </a>
      <nav class="nav-links" aria-label="Навигация">
        <a href="#services">Услуги</a>
        <a href="#why">Почему мы</a>
        <a href="#process">Как работаем</a>
      </nav>
      <a :href="phoneHref" class="phone-pill">{{ phone }}</a>
    </header>

    <section id="top" class="hero container">
      <div class="hero-glow glow-a"></div>
      <div class="hero-glow glow-b"></div>
      <div class="hero-copy reveal in-view">
        <div class="eyebrow"><span></span> Ремонт техники с выездом</div>
       <h1 class="hero-title">
  <span class="hero-title-main">Ремонт холодильников</span>
  <span class="hero-title-sub">и бытовой техники</span>
  <span class="hero-title-city">в Ташкенте</span>
      </h1>
        <p class="hero-text">
  Ремонт холодильников и бытовой техники в Ташкенте с выездом мастера.
  Ремонтируем холодильники, стиральные машины, морозильники,
  посудомойки и другую бытовую технику.
</p>
        <div class="hero-actions">
          <a :href="phoneHref" class="cta magnetic">
            Позвонить мастеру
            <span class="cta-arrow">↗</span>
          </a>
          <div class="micro-proof">
            <strong>30–90 мин</strong>
            <span>среднее время выезда</span>
          </div>
        </div>
      </div>

      <div class="hero-stage">
        <div class="stage-label label-top">диагностика</div>
        <div class="stage-label label-bottom">ремонт на месте</div>
        <HeroFridge3D />
      </div>

      <div class="hero-bottom">
        <div class="scroll-hint"><span></span> листайте</div>
        <div class="trust-row">
          <span>Холодильники</span><i></i>
          <span>Стиральные машины</span><i></i>
          <span>Морозильники</span><i></i>
          <span>Посудомойки</span>
        </div>
      </div>
    </section>

    <section class="marquee-wrap" aria-hidden="true">
      <div class="marquee">
        <span>РЕМОНТ • ДИАГНОСТИКА • ВЫЕЗД • ГАРАНТИЯ • РЕМОНТ • ДИАГНОСТИКА • ВЫЕЗД • ГАРАНТИЯ •</span>
        <span>РЕМОНТ • ДИАГНОСТИКА • ВЫЕЗД • ГАРАНТИЯ • РЕМОНТ • ДИАГНОСТИКА • ВЫЕЗД • ГАРАНТИЯ •</span>
      </div>
    </section>

    <section id="services" class="section container">
      <div class="section-head reveal">
        <div>
          <div class="eyebrow"><span></span> Что ремонтируем</div>
          <h2>Техника ломается.<br /><em>Мы — нет.</em></h2>
        </div>
        <p>Берём самые частые бытовые поломки и стараемся закрыть проблему за один выезд.</p>
      </div>

      <div class="service-grid">
        <article v-for="(item, index) in services" :key="item.title" class="service-card reveal tilt-card" :style="{ '--delay': `${index * 70}ms` }">
          <div class="service-no">0{{ index + 1 }}</div>
          <div class="service-visual">
            <div class="device-glow"></div>
            <ServiceDevice3D :type="item.model" />
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <a :href="phoneHref" class="text-link">Позвонить <span>↗</span></a>
        </article>
      </div>
    </section>

    <section id="why" class="why-section">
      <div class="container why-grid">
        <div class="why-copy reveal">
          <div class="eyebrow light"><span></span> Нормальный сервис</div>
          <h2>Без “оставьте заявку,<br />мы вам перезвоним”.</h2>
          <p>
            На сайте нет формы, регистрации и лишних шагов. Один номер — звоните напрямую,
            описываете поломку и договариваетесь о выезде.
          </p>
          <a :href="phoneHref" class="cta cta-light">{{ phone }} <span>↗</span></a>
        </div>

        <div class="orbital reveal">
          <div class="orbit orbit-1"></div>
          <div class="orbit orbit-2"></div>
          <div class="orbit orbit-3"></div>
          <div class="core">
            <span class="core-icon">✦</span>
            <strong>1 звонок</strong>
            <small>до мастера</small>
          </div>
          <div class="sat sat-a">Диагностика</div>
          <div class="sat sat-b">Выезд</div>
          <div class="sat sat-c">Ремонт</div>
        </div>
      </div>
    </section>

    <section id="process" class="section container process-section">
      <div class="section-head reveal">
        <div>
          <div class="eyebrow"><span></span> Процесс</div>
          <h2>Три шага.<br /><em>И техника снова в деле.</em></h2>
        </div>
      </div>

      <div class="process-list">
        <div v-for="(step, index) in steps" :key="step.title" class="process-item reveal">
          <div class="process-index">{{ index + 1 }}</div>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
          <div class="process-arrow">↘</div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="final-glow"></div>
      <div class="container final-inner reveal">
        <div class="eyebrow light"><span></span> Если техника уже не тянет</div>
        <h2>Не ждите,<br /><span>пока станет хуже.</span></h2>
        <p>Позвоните и коротко расскажите, что случилось.</p>
        <a :href="phoneHref" class="mega-phone">{{ phone }} <span>↗</span></a>
      </div>
    </section>
    <CallButton />

    <footer class="footer container">
      <a href="#top" class="brand"><span class="brand-dot"></span> ТЕХНОРЕМОНТ</a>
      <p>Ремонт холодильников и бытовой техники</p>
      <a :href="phoneHref">Позвонить мастеру ↗</a>
    </footer>
  </main>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import HeroFridge3D from './components/HeroFridge3D.vue'
import ServiceDevice3D from './components/ServiceDevice3D.vue'
import CallButton from './components/CallButton.vue'

// Поменяйте номер здесь — он обновится во всех кнопках сайта.
const phone = '+998 90 938 56 31'
const phoneHref = 'tel:+998909385631'

const services = [
  {
    model: 'fridge',
    title: 'Ремонт холодильников',
    text: 'Холодильник не морозит, шумит, течёт, намерзает лёд, плохо охлаждает или не выключается.'
  },
  {
    model: 'washer',
    title: 'Ремонт стиральных машин',
    text: 'Стиральная машина не сливает воду, не крутит барабан, не нагревает воду или показывает ошибку.'
  },
  {
    model: 'freezer',
    title: 'Ремонт морозильников',
    text: 'Морозильник не набирает температуру, не включается или возникла проблема с компрессором и электроникой.'
  },
  {
    model: 'microwave',
    title: 'Ремонт бытовой техники',
    text: 'Посудомоечные машины, микроволновки и другая бытовая техника в Ташкенте.'
  }
]
const steps = [
  { title: 'Звоните напрямую', text: 'Без заявки на сайте. Расскажите, какая техника и что именно произошло.' },
  { title: 'Мастер приезжает', text: 'Проводит диагностику, объясняет причину и согласовывает стоимость.' },
  { title: 'Ремонт на месте', text: 'Если деталь есть в наличии — устраняем неисправность сразу.' }
]

let observer
let onMove

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view')
    })
  }, { threshold: 0.14 })

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

  onMove = (e) => {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const r = card.getBoundingClientRect()
      if (e.clientX < r.left - 100 || e.clientX > r.right + 100 || e.clientY < r.top - 100 || e.clientY > r.bottom + 100) {
        card.style.setProperty('--rx', '0deg')
        card.style.setProperty('--ry', '0deg')
        return
      }
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      card.style.setProperty('--rx', `${-py * 5}deg`)
      card.style.setProperty('--ry', `${px * 7}deg`)
    })
  }
  window.addEventListener('pointermove', onMove, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('pointermove', onMove)
})
</script>
