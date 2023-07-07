# PowerSmart-Backend

## Technologies

-   API - ExpressJs
-   Database - PostgreSql
-   ORM - Sequelize
-   Authentication - JSON Web Tokens

## npm packages

`express` - Create the REST-API

`sequelize` - ORM

`pg` `pg-hstore` - Support for postgresql database

`jsonwebtoken` `passport` `passport-jwt` - packages for authentication

`bcrypt` `cookie-parser` `dot-env` `body-parser` `cors` - Some useful packages

`nodemon` - Auto restart development server

### Folder Structure

    |- config
    |- controllers
    |- models
    |- routes
    |> index.js

### Environment Variables

-   _PORT_ -> Server running port

-   _DB_NAME_ -> Database Name

-   _DB_USER_ -> Database Username

-   _DB_PASSWORD_ -> Database Password

-   _ACCESS_TOKEN_SECRET_ -> Secret for create the access token (JWT)

-   _REFRESH_TOKEN_SECRET_ -> Secret for create the refresh token (JWT)
