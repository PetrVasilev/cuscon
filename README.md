#### Фриланс биржа CusCon
Это проект для регионального этапа Всероссийского конкурса профессионального мастерства «Лучший по профессии» в номинации «Лучший разработчик WEB и мультимедийных приложений» в Республике Саха (Якутия).
##### Запуск сервера
```
cd server/
npm install
npm start
```
##### Примерный файл конфигурации сервера `server/.env`
```
PORT=3000
MONGO="mongodb://localhost:27017/cuscon"
USER_SECRET="user-secret"
ADMIN_SECRET="admin-secret"
ADMIN_LOGIN="admin@ityakutia.com"
ADMIN_PASSWORD="QWErty123"
```
#### Запуск клиента
```
cd client/
npm install
npm start
```
### Запуск панели администратора
```
cd admin/
npm install
npm start
```
