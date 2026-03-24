# SocialForum

React + Django alapú Reddit-szerű fórumprojekt.

## Fő funkciók
- regisztráció és bejelentkezés
- témák létrehozása, törlése
- kommentelés és komment törlése
- publikus profiloldal
- profilkép feltöltés és bio szerkesztés
- post like rendszer
- keresés a témák között
- Profil megtekintése (saját, illetve többieké)
- Profilokon belüli témák és hozzászólások egyénenként
- Saját profil testre szabása
- Like-olási lehetőség

## Indítás

### Backend
```bash
cd forum-backend-sqlite
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# vagy: cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd forum-frontend
npm install
copy .env.example .env   # Windows
# vagy: cp .env.example .env
npm run dev
```

Frontend: http://localhost:3000
Backend: http://127.0.0.1:8000
