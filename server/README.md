# SERVER

## uu-Homework 4

BE Homework Assignment 4

---

## Local Dependencies

Version of npm - `8.xx.xx`

Version of node - `16.xx.xx`

Docker or Podman must be installed.

## Installation

### Local developing (localhost:4000)

1.  In server root folder run `docker-compose up` for MongoDB
2.  Rename `.env.example` to `.env`
3.  Run `$ npm i`
4.  `$ npm run serve`
5.  At the first time app will be seeded with dummy data

## Access

**Local**

- (localhost) -> Port 4000
- Credentials:
  1.  AdminUser: **adminPassword**
  2.  SimpleUser: **userPassword**
- MongoDB Compass URI:
  - `mongodb://username:root@localhost:27017/`
- Insomnia / Postman
  - import data from `/server/Collections/`
  - create your own environment with that values :
  ```
  {
	"host": "localhost:4000",
	"jwtToken": "<COPY&PAST token from /login here>"
  }
  ```

## Test 

- start mongodb in docker `docker-compose up`
- if server run stop it 
- run `npm run test`

---

## Authors

- [Michal Durik](https://github.com/miko866)

## Copyright

&copy; Michal Durik
