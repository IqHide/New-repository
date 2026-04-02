# AutoRu — Техническая документация

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Архитектура](#2-архитектура)
3. [Технический стек](#3-технический-стек)
4. [Структура проекта](#4-структура-проекта)
5. [База данных](#5-база-данных)
6. [Аутентификация](#6-аутентификация)
7. [API и Server Actions](#7-api-и-server-actions)
8. [Компоненты и модули](#8-компоненты-и-модули)
9. [Управление состоянием](#9-управление-состоянием)
10. [Безопасность](#10-безопасность)
11. [Запуск и развёртывание](#11-запуск-и-развёртывание)
12. [Переменные окружения](#12-переменные-окружения)

---

## 1. Обзор проекта

**AutoRu** — это веб-приложение для каталога автомобилей с возможностью управления личной коллекцией. Пользователи могут регистрироваться, добавлять автомобили с техническими характеристиками (разгон 0–100, время на 1/4 мили, время на Нюрбургринге), фильтровать и сравнивать машины.

| Параметр | Значение |
|---|---|
| Название | AutoRu |
| Тип | Full-stack веб-приложение |
| Язык интерфейса | Русский |
| URL | localhost:3000 (dev) |
| Репозиторий | `2_autoru` |

---

## 2. Архитектура

Приложение построено по модели **Full-Stack SPA** на базе Next.js App Router.

```
Браузер
  └── Next.js (App Router)
        ├── Публичные страницы  (/)
        ├── Защищённые страницы (/cars, /line-chart)
        ├── Server Actions       (мутации данных)
        ├── API Routes           (/api/cars/[id], /image-proxy)
        └── Prisma ORM ──► PostgreSQL (через Prisma Accelerate)
```

### Роутинг

| Группа | Путь | Доступ | Описание |
|---|---|---|---|
| `(public)` | `/` | Все | Главная — 2 последних автомобиля |
| `(public)` | `/about` | Все | Страница «О нас» |
| `(protected)` | `/cars` | Авторизованные | Управление коллекцией авто |
| `(protected)` | `/line-chart` | Авторизованные | Демо-страница с графиком |
| API | `/api/cars/[id]` | Все | Получение авто по ID |
| API | `/image-proxy` | Все | Прокси изображений с защитой |

---

## 3. Технический стек

| Категория | Технология | Версия |
|---|---|---|
| Фреймворк | Next.js | 16.1.0 |
| UI-библиотека | React | 19.2.3 |
| Язык | TypeScript | — |
| БД ORM | Prisma | 7.4.2 |
| База данных | PostgreSQL | — |
| Аутентификация | NextAuth | 5.0.0-beta.30 |
| UI-компоненты | HeroUI | 2.x |
| State Management | Zustand | 5.0.11 |
| Валидация | Zod | 4.3.6 |
| Стили | Tailwind CSS + SASS | 4.2.1 |
| Графики | Recharts | 3.8.0 |
| Хеширование паролей | bcryptjs | 3.0.3 |
| Пакетный менеджер | pnpm | 10.26.2 |
| Кэширование БД | Prisma Accelerate | — |

---

## 4. Структура проекта

```
2_autoru/
├── src/
│   ├── actions/               # Server Actions (мутации данных)
│   │   ├── car.tsx            # CRUD для автомобилей
│   │   ├── register.tsx       # Регистрация пользователя
│   │   ├── sign-in.tsx        # Вход в систему
│   │   └── sign-out.tsx       # Выход из системы
│   │
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Публичные страницы
│   │   │   ├── page.tsx       # Главная страница
│   │   │   └── about/         # Страница «О нас»
│   │   ├── (protected)/       # Защищённые страницы
│   │   │   ├── cars/          # Управление автомобилями
│   │   │   └── line-chart/    # Демо с графиком
│   │   ├── api/
│   │   │   └── cars/[id]/route.ts  # REST endpoint
│   │   ├── image-proxy/route.ts    # Прокси изображений
│   │   └── layout.tsx         # Корневой layout
│   │
│   ├── auth/
│   │   └── auth.ts            # Конфигурация NextAuth
│   │
│   ├── components/
│   │   ├── UI/
│   │   │   ├── layout/        # Header, Title
│   │   │   ├── modals/        # Модалки Login/Registration
│   │   │   └── icons/         # Иконки (Compare, Edit, Trash)
│   │   └── common/            # Переиспользуемые компоненты
│   │
│   ├── forms/                 # Формы с валидацией
│   │   ├── cars.form.tsx      # Добавить авто
│   │   ├── edit-car.form.tsx  # Редактировать авто
│   │   ├── login.form.tsx     # Вход
│   │   └── registration.form.tsx  # Регистрация
│   │
│   ├── store/                 # Zustand-сторы
│   │   ├── cars.store.ts      # Список авто + операции
│   │   └── auth.store.ts      # Состояние аутентификации
│   │
│   ├── schema/
│   │   └── zod.ts             # Zod-схемы валидации
│   │
│   ├── types/
│   │   └── cars.ts            # TypeScript-тип Car
│   │
│   ├── config/
│   │   ├── site.config.ts     # Метаданные сайта, навигация
│   │   └── layout.config.ts   # Размеры header/footer
│   │
│   ├── hoc/
│   │   └── app-loader.tsx     # Инициализация сессии и авто
│   │
│   ├── providers/
│   │   └── provider.tsx       # HeroUI Provider
│   │
│   └── utils/
│       ├── user.ts            # Запросы пользователей в БД
│       ├── password.ts        # Хеширование паролей
│       └── prisma.ts          # Prisma Client (singleton)
│
├── prisma/
│   └── schema.prisma          # Схема базы данных
│
├── public/
│   └── Mercedes-Logo.png      # Логотип сайта
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 5. База данных

### Схема Prisma

#### Модель `User`

| Поле | Тип | Описание |
|---|---|---|
| `id` | String (cuid) | Первичный ключ |
| `email` | String (unique) | Email пользователя |
| `password` | String (nullable) | Хеш пароля |
| `accounts` | Account[] | OAuth-аккаунты |
| `sessions` | Session[] | Сессии |

#### Модель `Car`

| Поле | Тип | Описание |
|---|---|---|
| `id` | String (cuid) | Первичный ключ |
| `brand` | String | Марка автомобиля |
| `model` | String | Модель автомобиля |
| `timeToOneHundred` | String | Разгон 0–100 км/ч |
| `timeToQuater` | String | Время на 1/4 мили |
| `nurburgringTime` | String | Время на Нюрбургринге |
| `imageUrl` | String (nullable) | URL изображения |

#### Вспомогательные модели

- `Account` — OAuth-провайдеры (подготовка к OAuth-интеграции)
- `Session` — JWT-сессии
- `VerificationToken` — токены верификации email

### ER-диаграмма

```
User ──(1:N)── Account
User ──(1:N)── Session
```

> `Car` на данный момент не связана с `User` (глобальный каталог)

---

## 6. Аутентификация

Используется **NextAuth v5** со стратегией **JWT**.

### Поток аутентификации

```
1. Пользователь вводит email/пароль
2. Server Action signInWithCredentials()
3. NextAuth Credentials Provider
4. Поиск пользователя в БД (utils/user.ts)
5. Сравнение bcryptjs-хеша
6. Выпуск JWT-токена (срок: 1 час)
7. Синхронизация сессии в Zustand (useAuthStore)
8. Доступ к защищённым маршрутам
```

### Конфигурация

| Параметр | Значение |
|---|---|
| Provider | Credentials |
| Session Strategy | JWT |
| Token TTL | 1 час |
| Хеширование | bcryptjs |

### AppLoader HOC

`hoc/app-loader.tsx` — обёртка, которая при старте приложения:
1. Получает текущую сессию через `useSession()`
2. Синхронизирует сессию в `useAuthStore`
3. Загружает список авто через `getCars()`, если пользователь авторизован

---

## 7. API и Server Actions

### REST API

#### `GET /api/cars/[id]`

Возвращает данные одного автомобиля по ID.

**Response:**
```json
{
  "id": "clxxx...",
  "brand": "BMW",
  "model": "M5",
  "timeToOneHundred": "3.5",
  "timeToQuater": "11.8",
  "nurburgringTime": "7:38",
  "imageUrl": "https://..."
}
```

#### `GET /image-proxy?url=<encoded_url>`

Безопасное проксирование внешних изображений.

**Защита:**
- Разрешены только HTTPS URL
- Блокировка приватных IP-диапазонов (SSRF-защита)
- Проверка `Content-Type: image/*`

---

### Server Actions

| Функция | Файл | Описание |
|---|---|---|
| `getCars()` | `actions/car.tsx` | Получить все автомобили |
| `createCar(formData)` | `actions/car.tsx` | Создать автомобиль |
| `editCar(id, formData)` | `actions/car.tsx` | Редактировать автомобиль |
| `deleteCar(id)` | `actions/car.tsx` | Удалить автомобиль |
| `registerUser(formData)` | `actions/register.tsx` | Зарегистрировать пользователя |
| `signInWithCredentials(email, pw)` | `actions/sign-in.tsx` | Войти в систему |
| `signOutFunc()` | `actions/sign-out.tsx` | Выйти из системы |

---

## 8. Компоненты и модули

### Основные компоненты UI

| Компонент | Путь | Описание |
|---|---|---|
| `Header` | `components/UI/layout/` | Навигация, кнопки Login/Register |
| `LoginModal` | `components/UI/modals/` | Модальное окно входа |
| `RegistrationModal` | `components/UI/modals/` | Модальное окно регистрации |
| `Modal` | `components/common/` | Базовый компонент модального окна |
| `PageContent` | `components/common/` | Обёртка контента страницы |
| `CompareIcon` | `components/UI/icons/` | Иконка сравнения |
| `EditIcon` | `components/UI/icons/` | Иконка редактирования |
| `TrashIcon` | `components/UI/icons/` | Иконка удаления |

### Формы

| Форма | Валидация | Описание |
|---|---|---|
| `cars.form.tsx` | Zod | Добавление нового автомобиля |
| `edit-car.form.tsx` | Zod | Редактирование автомобиля |
| `login.form.tsx` | Zod | Вход в систему |
| `registration.form.tsx` | Zod | Регистрация |

### Валидация (Zod)

Схемы находятся в `schema/zod.ts`:

- **SignIn Schema** — валидация email и пароля
- **Cars Schema** — валидация марки, модели и временных показателей (регулярные выражения для форматов времени)

---

## 9. Управление состоянием

Используется **Zustand** — лёгкая библиотека управления состоянием.

### `useCarsStore` (`store/cars.store.ts`)

| Состояние / Метод | Тип | Описание |
|---|---|---|
| `cars` | `Car[]` | Список всех автомобилей |
| `isLoading` | `boolean` | Флаг загрузки |
| `selectedCar` | `Car \| null` | Выбранный авто для редактирования |
| `setCars(cars)` | Function | Установить список |
| `addCar(car)` | Function | Добавить авто |
| `updateCar(car)` | Function | Обновить авто |
| `removeCar(id)` | Function | Удалить авто |
| `setSelectedCar(car)` | Function | Выбрать авто для редактирования |

### `useAuthStore` (`store/auth.store.ts`)

| Состояние / Метод | Тип | Описание |
|---|---|---|
| `session` | `Session \| null` | Текущая сессия NextAuth |
| `isSessionLoading` | `boolean` | Флаг загрузки сессии |
| `setSession(session)` | Function | Сохранить сессию |
| `setIsSessionLoading(v)` | Function | Установить флаг загрузки |

---

## 10. Безопасность

| Аспект | Реализация |
|---|---|
| Хеширование паролей | bcryptjs с солью |
| JWT-сессии | Подписаны `NEXTAUTH_SECRET` |
| SSRF-защита | Прокси блокирует приватные IP |
| HTTPS enforcement | Image proxy отклоняет HTTP URL |
| Валидация входных данных | Zod-схемы для всех форм |
| Защищённые маршруты | Паттерн `(protected)` + AppLoader HOC |
| SQL Injection | Исключён благодаря Prisma ORM |
| XSS | Next.js/React автоэкранирование |

---

## 11. Запуск и развёртывание

### Требования

- Node.js >= 18
- pnpm >= 10
- PostgreSQL (или Prisma Accelerate)

### Локальная разработка

```bash
# 1. Установить зависимости
pnpm install

# 2. Настроить переменные окружения (см. раздел 12)
cp .env.example .env

# 3. Применить миграции БД
npx prisma migrate deploy

# 4. Запустить dev-сервер
pnpm dev
```

Приложение доступно по адресу: `http://localhost:3000`

### Production-сборка

```bash
# Собрать приложение
pnpm build

# Запустить production-сервер
pnpm start
```

### Доступные скрипты

| Команда | Описание |
|---|---|
| `pnpm dev` | Dev-сервер с HMR |
| `pnpm build` | Production-сборка |
| `pnpm start` | Запуск production-сервера |
| `pnpm lint` | Запуск ESLint |
| `npx prisma generate` | Генерация Prisma Client |
| `npx prisma migrate deploy` | Применение миграций |
| `npx prisma studio` | GUI для базы данных |

---

## 12. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# База данных (PostgreSQL + Prisma Accelerate)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

| Переменная | Обязательная | Описание |
|---|---|---|
| `DATABASE_URL` | Да | Строка подключения к PostgreSQL |
| `NEXTAUTH_SECRET` | Да | Секрет для подписи JWT (мин. 32 символа) |
| `NEXTAUTH_URL` | В production | Публичный URL приложения |

> **Внимание:** Никогда не коммитьте `.env` файл в репозиторий.

---

## Приложение: Навигация сайта

| Пункт меню | Путь | Доступ |
|---|---|---|
| Главная | `/` | Все |
| О нас | `/about` | Все |
| Мои авто | `/cars` | Авторизованные |
| Сравнение | `/comparison` | Авторизованные |

---

*Документация сгенерирована: 2026-03-27*
