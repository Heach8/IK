# IK SaaS Monorepo

Apps:
- apps/backend: NestJS API
- apps/web: Next.js 14 web app

## Geliştirme

1) Bağımlılıklar

```
npm install
```

2) Geliştirme sunucuları

- Backend: `npm run dev:backend`
- Web: `npm run dev:web`

## Postgres (Docker ile)

`docker` yüklü ise:
```
docker compose up -d
```
Postgres: localhost:5432 (kullanıcı: iksaas, şifre: iksaas, db: iksaas)
Adminer: http://localhost:8080

## Ortam Değişkenleri
`.env` için örnek:
```
DATABASE_URL=postgresql://iksaas:iksaas@localhost:5432/iksaas
NODE_ENV=development
```
