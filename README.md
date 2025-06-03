# Movies API
App analogue imdb/kinopoisk about movies. Site separated on 4 modules: auth(login, registration etc), users(for actions for admin and user), movie()



## Technologies implemented:
- Prisma 
- PostgreSQL
- Graphql(code first)
- Graphql-ws

- Redis
- Nginx 
- Passport(Google, Github, Discord)
- Nodemailer
- Github Actions
- Jest (e2e)
- Docker-Compose
- JWT


## Technologies should be
- Elasticsearch 
- Socket io
- Cypress
- RabbitMQ
- Prometheus
- TensorFlow.js
- Github Actions
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
- You can upload for your profile


## In future. Features and functionality app should be:

- Premium status to user after purchase subscription through Paypal or Stripe. User can purchase every month pr year.  It should - include: 
can edit after 1 minute review, 
animated avatar, 
show list all reviews/comments without button  "open more"
everyday recieve letter to mail box about favorite movies, he subscribed

- Review, editor and admin.
- Live chat with users through ws
- Temp link for 20 minutes and after expire link deleted himself
- Create token on  only 31 day to access to data, you can share with other user token(only 3 times) after this token gonna be invalid
- If you admin or editor, authorization through code. You should receive in mail box code and enter to proceed authorization
- You can't change password on same. check prev password before update on new
- WS online user or not. add functionality
- Passport google/outlook/discord/github.
- Bash write script
- Mailing to user about new movies, comments,
- Redis(search movie result) should be
- Export and import data(csv and pdf). should send to user mailbox to download data
- Load Balancer to db and redis
- filter movies. By year/category/key actors/rating
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