You can follow this step for using our.

# 1."git clone https://github.com/jobdle/backend.git" for clone code from github

# 2."yarn" for install all module

# 3.create .env file

Create a .env file in the root of your project and insert your key/value pairs in the following format of KEY=VALUE:

PORT=5000
MONGODB_URL=mongodb+srv://SGARO:1q2w3e4r@cluster0.4hgwz.mongodb.net/?retryWrites=true&w=majority
JWT_KEY=secretKey
EMAIL=pj.jobdle@gmail.com
EMAIL_PASS=jeknrddpoesebxqj
JWT_EMAIL_KEY=VERIFYEMAILKEY
APP_NAME=Jobdle
PUBLIC_CLIENT_URL=http://localhost:3000
SALTHASH=10

| Key Name                  | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| PORT                      | some port number for backend                           |
| MONGODB_URL               | mongoDB url for collect data                                                     |
| JWT_KEY                   | some string                                                         |
| EMAIL                     | email for send email to empolyer                                         |
| EMAIL_PASS                | password of EMAIL                                                                                         |
| JWT_EMAIL_KEY             | some string                                                                                  |
| APP_NAME                  | website name                                                                              |
| SALTHASH                  | some number                                                                 |

# 4.Run project by "yarn start"