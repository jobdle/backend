You can follow this step for using our.

# 1."git clone https://github.com/jobdle/backend.git" for clone code from github

# 2."yarn" for install all module

# 3.create .env file

Create a .env file in the root of your project and insert your key/value pairs in the following format of KEY=VALUE:

| Key Name                  | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| PORT                      | some port number for backend                           |
| MONGODB_URL               | mongoDB url for collect data                                                     |
| JWT_KEY                   | some string                                                         |
| EMAIL                     | email for send email to empolyer                                         |
| EMAIL_PASS                | password of EMAIL                                                                                         |
| JWT_EMAIL_KEY             | some string                                                                                  |
| APP_NAME                  | website name                                                                              |
| PUBLIC_CLIENT_URL         | main path url of client  |
| SALTHASH                  | some number                                                                 |

# 4.Run project by "yarn start"