# Movies API


## Technologies should be
- Prisma 
- PostgreSQL
- Graphql(code first)
- Mongodb
- Redis
- Nginx 
- Passport(Google, Github, Outlook)
- Elasticsearch 
- Socket io
- Cypress
- RabbitMQ
- Prometheus
- Nodemailer
- TensorFlow.js
- Github Actions



## Features app have:

- user can registration. with vallidation. after send data, user receive email from smtp. and should verify his account.  
- login  
- Reset Password
- Resend Email during 15 minutes, if user forget to validate.
- OAuth Access Token. Create During 31d when user log in.
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


## Features should be:

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
- Authorization through code. You should receive in mail box code and enter to proceed authorization
- AES encryption 

- Add field to table Users ban true or false. By default false

## In future:

- Premium status to user after purchase subscription through Paypal or Stripe. User can purchase every month pr year.  It should - include: 
can edit after 1 minute review, 
animated avatar, 
show list all reviews/comments without button  "open more"
everyday recieve letter to mail box about favorite movies, he subscribed


