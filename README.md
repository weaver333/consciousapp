<img src="https://consciousos.com/images/logo.svg" width="200" alt="logo"></img>

# Conscious MVP
Conscious' first web project built in Javascript to provide a new multiplayer meditation experience that tracks your breath and stress state using only your camera - to reduce stress, quantify physiological improvement and increase calm worldwide.

## Project Structure
This level of the project is for the server side stack. For this, we are using a MongoDB, Node.js with Express.js stack - hosted on Heroku.

Within the `app` folder is where everything else resides for the Breath technology engine, and the application front end UI. Please see the ReadMe inside the `app` folder for more details on how to set up the front end. This ReadMe will only be about the general project structure and the serverside set up instructions.

## Running the app
0) Clone the repo!
1) Make sure you have MongoDB Community installed. You can manage it with MongoDB Compass GUI. Make sure it's running!
2) Use `npm install` and then `npm run watch` on the top level folder - making sure you have yarn installed. This starts the server. Make sure you also have mongodb installed locally, and run it in another tab if necessary.
3) Use `npm install` and then `npm run watch` on the app folder. This builds the front end javascript.
4) Add the variables to `.env.template` and remove the `.template` extension. (Needs Sendgrid key for email verification, localhost runs on port 3000)
5) go to `http://localhost:3000` and sign up, check your email, and verify your account. Email might be in spam!


## Heroku Environments

consciousapp-staging.herokuapp.com - staging (automatic deploys from master branch)
consciousapp.herokuapp.com - production (manual deploy from heroku dashboard, using master branch)

## Database structure

TBD

## API Endpoints

### Login Authentication

  `GET /`
    
    REQUEST:
    
      Not required
      
    RESPONSE:
      
      SUCCESS:
      
        VIEW:
        
          views/sign-in.hbs

  `POST /`
    
    REQUEST:
    
      {
          "email": <email>,
          "password": <password>
      }
    
    RESPONSE:
      
      SUCCESS:
  
        redirect to '/dashboard'
      
      FAIL:
      
        VIEW:
        
          views/sign-in.hbs
        
        RESULT:
        
          {
              "status": "error",
              "payload": {
                  "message": <reason>
              }
          }

### Registration
*Sign up*

  `GET /sign-up`

      REQUEST:

        Not required

      RESPONSE:

        SUCCESS:

          VIEW:

            views/sign-up.hbs
            
  `POST /sign-up`
    
    REQUEST:
    
      {
          "email": <email>,
          "password": <password>,
          "passwordConf": <re-type password>
      }
    
    RESPONSE:
      
      SUCCESS:
  
        redirect to '/login-confirm'
      
      FAIL:
      
        VIEW:
        
          views/sign-up.hbs
        
        RESULT:
        
          {
              "status": "error",
              "payload": {
                  "message": <reason>
              }
          }

*Confirm email*

  `GET /login-confirm`
  
    REQUEST:
      
      Not required
      
    RESPONSE:
      
      SUCCESS:
      
        VIEW:
          
          views/login-confirm.hbs
  
  `GET /login-confirm?h=<hash code>`
  
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      SUCCESS:
      
        redirect to '/welcome'
        
      FAIL:
      
        VIEW:
        
          views/login-confirm.hbs
          
        RESULT:
        
          {
              "status": "error",
              "payload": {
                  "message": <reason>
              }
          }

### Forgot password
*Show forgot password page*

  `GET /forgot-password`

    REQUEST:
    
      Not required
      
    RESPONSE:
    
      VIEW:
      
        views/forgot-password.hbs

*Send reset password email*

  `POST /forgot-password`
  
    REQUEST:
    
      {
        "email": <email>
      }
      
    RESPONSE:
    
      SUCCESS:
      
        VIEW:
        
          views/forgot-password.hbs
          
        RESULT:
        
          {
            "status": "success"
          }
      
      FAIL:
      
        VIEW:
        
          views/forgot-password.hbs
          
        RESULT:
        
          {
            "status": "error",
            "payload:" {
              "message": <reason>
            }
          }

*Show reset password page*

  `GET /reset-password?h=<hash code>`
  
    REQUEST:
      
      Not required
    
    RESPONSE:
    
      SUCCESS:
       
        VIEW:
          
          views/reset-password.hbs
          
        RESULT:
        
          {
            "status": "success"
          }
          
      FAIL:
      
        redirect to '/'

*Set new password:*

  `POST /reset-password?h=<hash code>`
  
    REQUEST:
    
      {
        "password": <password>
        "passwordConf": <re-type password>
      }
      
    RESPONSE:
    
      SUCCESS:
      
        redirect to '/'
        
      FAIL:
      
        VIEW:
        
          views/reset-password.hbs
          
        RESULT:
        
          {
            "status": "error"
            "payload": {
              "message": <reason>
            }
          }

`auth` : Middleware, if routing is discovered by `auth` middleware then view page can get user model, and can only be access after login

### Resend email | api

  `POST /resend`
    
    REQUEST:
    
      type: 'verify' | 'reset' | 'change'
      
    RESPONSE:
      
      SUCCESS:
      
        RESULT:
        
          {
            "status": "success"
          }
          
      FAIL:
      
        RESULT:
        
          {
            "status": "error"
            "payload": {
              "message": <reason>
            }
          }      

### Delete Account | auth

  `POST /delete-account`
    
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      SUCCESS:
      
        redirect to '/'

### Profile page | auth

  `GET /user`
  
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      SUCCESS:
      
        VIEW:
          
          views/user.hbs
          
  `POST /user`
  
    REQUEST:
    
      {
        "info": {
          "password": <can be null>
          "fullname": <can be null>
        }
      }
      
    RESPONSE:
    
      SUCCESS:
      
        VIEW:
        
          views/user.hbs
          
        RESULT:
        
          {
            "status": "success"
          }
      
      FAIL:
      
        VIEW:
        
          views/user.hbs
          
        RESULT:
        
          {
            "status": "error"
            "payload": {
              "message": <reason>
            }
          }

### Change email | auth
*send new email verification link*

  `GET /change-email` | api
    
    REQUEST:
    
      {
        "email": <new email>
      }
      
    RESPONSE:
    
      SUCCESS:
        
        RESULT:
          {
            "status": "success"
          }
      
      FAIL:
      
        RESULT: refer to others
        
  `GET /email-confirm?h=<hash code>`
  
    REQUEST:
      
      Not required
      
    RESPONSE:
    
      redirect to '/'

### welcome page | auth

  `GET /welcome`
  
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      VIEW:
      
        views/welcome.hbs
        
### dashboard page | auth, refer to welcome

### stats page | auth, refer to welcome

### session page | auth, refer to welcome

### subscribe page | auth, refer to welcome

### add location | auth | api

  `POST /location`
  
    REQUEST:
    
      {
        "lng": Number
        "lat": Number
        "lastGuideAccuracyToday: Number
      }
      
    RESPONSE:
    
      SUCCESS:
      
        {
          "status": "success"
        }
        
      FAIL:
      
        {
          "status": "error"
          "payload": ...
        }
        
  `GET /location`
  
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      SUCCESS:
      
        {
          "status": "success"
          "payload": {
            "locations": Array
          }
        }

      FAIL:
      
        {
          "status": "error"
          "payload": ...
        }

### after-session page | auth, refer to welcome

### session-stats page | auth, refer to welcome

  `GET /session-stats/:session_id`
    
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      VIEW:
      
        views/session-stats.hbs
        
      RESULT:
      
        {        
          "session": <session>
        }

### privacy, refer to welcome

### terms, refer to welcome

### cookies, refer to welcome

### logout

  `GET /logout`
  
    REQUEST:
    
      Not required
      
    RESPONSE:
    
      redirect to '/'

### Session APIs

*Add new session data:*

`POST /session` `{"session": <session data as JSON format>}`

*Get multiple session datas in ascending order (newest first):*

`GET /session/last/:amount?attr=<specified attributes splitting by ','>` 

*Example getting specific attrs only:*

`GET /session/last/10?attr=packType,totalXP,topOfBreathAvg`

*Example getting whole obj for 10 sessions:*

`GET /session/last/10`

**Sample response:**

`{
    status: 'success',
    payload: {
        sessions: [{"packType":<packType>, "totalXP":<totalXP>, "topOfBreathAvg":<topOfBreathAvg>}, {...}, ...]
    }
  }`


## Database backups

TBD
