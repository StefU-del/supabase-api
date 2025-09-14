# Usefull Links's


## Starting the project

```shell
  npm install
  npm run dev
```
## Features
- Signup
- Signin
- Get account by id
- Delete account

## Tech Stack
- Node.js
- Express.js
- Supabase

lookups 

## Auth

```shell
  curl --location --request POST 'http://localhost:3000/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "stefanos.mm@hotmail.com",
    "password" : "Pass1234!"
}'

curl --location --request POST 'http://localhost:3000/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "stefanos.mm@hotmail.com",
    "password" : "Pass1234!"
}'
```

#Get account by id

```shell
  curl --location --request GET 'http://localhost:3000/admin/users?id=91a8255e-34b4-4833-9c83-2f22eaf2e0d1' \
```

## Delete account

```shell
  curl --location --request DELETE 'http://localhost:3000/deleteAccount?id=2d2c4110-3b43-440f-96a1-c07af6f73aad'

```