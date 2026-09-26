# Техноремонт — сайт услуг в Ташкенте

Vue + Vite + Three.js. Главная и три отдельные SEO-страницы услуг:

- `/remont-holodilnikov-tashkent/`
- `/remont-stiralnyh-mashin-tashkent/`
- `/remont-bytovoy-tehniki-tashkent/`

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Vite собирает главную и все три вложенные страницы в `dist/`. `public/sitemap.xml` уже содержит все URL.

## Отзывы

В `src/components/DemoReviews.vue` есть три **демо-текста**, чтобы увидеть дизайн блока локально. Они показываются только в `npm run dev` (`import.meta.env.DEV`) и не отображаются в production. Перед публикацией отзывов замените демо-тексты реальными отзывами клиентов.

## Телефон

Основной номер: `+998 90 938 56 31` / `tel:+998909385631`.
