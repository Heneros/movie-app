# Movies API

App analogue imdb/kinopoisk about movies. Site have modules: auth, users(for actions for admin and user), movie included reviews and favorites. App have custom guards, pipes and decorators.



## Technologies implemented:
- Prisma 
- PostgreSQL
- Graphql(code first)
- Graphql-ws
- Redis
- Nginx 
- Passport(Google, Github, Discord)
- Nodemailer with custom templates
- Cloudinary
- Github Actions
- Jest and Supertest (e2e)
- Docker Compose (dev and build version)
- JWT
- Winston
- fakerjs
- Throttler


## Installation with docker-compose

Rename file .env.example to .env 

```bash
mv .env.example .env
```


Build project

```bash
  npm run docker:prod:build
```

Install prisma into docker container

```bash  
  docker compose -f docker-compose.dev.yaml exec nestapp   npm run prisma:docker
```

DB seed

```bash  
  npm run prisma:seed
```
##  Swagger Documentation

To explore the available API endpoints, open Swagger in your browse

[To to read swagger](http://localhost:3000/api)

## Start Using the API

A sample endpoint to get started:

```bash
curl -X GET http://localhost:3000/movie
```

[localhost:3000/movie](http://localhost:3000/movie/)


## Technologies should be
- Elasticsearch 
- Socket io
- Cypress
- RabbitMQ
- Prometheus
- TensorFlow.js
- Kubernetes
- Mongodb


## Features app have:
- CQRS architecture.
- user can register. with validation(class-validator). after send data, user receive email link from smtp server. link which he should verify his account.  
- login  
- Reset Password, user enter his email and receive valid link duration 15 minutes. in this link user enter new password and send back to site, after this user update his password in account 
- Resend Email during 15 minutes, if user forget to validate email.
- OAuth Access Token. Create token in db during 31days when user log in. when token expired, user can perform any actions in site
- Logout.
- CRUD operations with movies is only available for admins and editor
- Deactivate user account
- Delete user account 
- search movie
- Add to Favorite movie
- Remove from Favorite list movie
- User can rate movie and change overall rating of the film display
- Reviews movie. positive or negative. 
- Edit review during 15 minutes. Latter gonna be edit without limitless for premium users. 
- ApiLimiter  
- Custom guards like ProfileOwner, where restricted content to only owners account or check Profile exist
- You can upload avatar for your profile


## In future. Features and functionality app should be:

- Premium status to user after purchase subscription through Paypal or Stripe. User can purchase every month pr year.  It should - include: 
can edit after 1 minute review, 
animated avatar, 
show list all reviews/comments without button  "open more"
everyday recieve letter to mail box about favorite movies, he subscribed

- Live chat with users through ws
- Temp link for 20 minutes and after expire link deleted himself
- Create token on  only 31 day to access to data, you can share with other user token(only 3 times) after this token gonna be invalid
- If you admin or editor, authorization through code. You should receive in mail box code and enter to proceed authorization
- You can't change password on same. check prev password before update on new
- WS online user or not. add functionality
- Bash write script
- Mailing to user about new movies, comments,
- Export and import data(csv and pdf). should send to user mailbox to download data
- Load Balancer to db and redis
- 2FA authentication
- TMDb API, Quotable API 
- Moderation reviews with moderation
- Automatic moderation   
- Integration with calender
- Metrics for user and movie 
- Watch later movie
- Notification about new movie and reply on my  
- Friends you add/delete friend
- Service Workers
- Honeypot endpoints
- CSRF tokens
- XSS protection
- Implement cursor and offset pagination
- Chat with specific user.
- CRON-tasks.
- HttpModule NestJS for request to API 
- Weekly newsletter with movie recommendations.
- Nginx configure for load balancer app
- AES encryption 
- Add field to table Users ban true or false. By default false
- CQRS event if someone reply or 
- auth resolver later passport try with next/react


## Links on author or feedback
[![GitHub](https://img.shields.io/badge/GitHub-heneros-181717?style=flat-square&logo=github)](https://github.com/heneros)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%D0%A0%D1%83%D1%81%D1%82%D0%B0%D0%BC%20%D0%90%D1%85%D0%BC%D0%B5%D1%82%D0%B7%D1%8F%D0%BD%D0%BE%D0%B2-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/%D1%80%D1%83%D1%81%D1%82%D0%B0%D0%BC-%D0%B0%D1%85%D0%BC%D0%B5%D1%82%D0%B7%D1%8F%D0%BD%D0%BE%D0%B2-1320181ba/)

- Email rustam-dev@outlook.com