# f/forum

Egy Reddit-szerű fórum webalkalmazás, ahol a felhasználók regisztráció után témákat hozhatnak létre és kommentelhetnek. A frontend React-ben, a backend Django REST Framework-ben készült, SQLite adatbázissal. A projekt célja egy egyszerű, modern közösségi platform megvalósítása teljes autentikációval és CRUD funkciókkal.

## Csapattagok

Kádár Dóra

Molnár Tamás Sándor

Tóth Sándor Benedek

## Indítás

**Backend:**
```bash
cd forum-backend-sqlite
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations users posts comments
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd forum-frontend
npm install
copy .env.example .env
npm run dev
```
