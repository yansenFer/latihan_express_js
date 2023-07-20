# User API Spec

## Register User API

Endpoint :  POST /api/users

Request Body : 

```json      
{
    "username" : "pzn",
    "password" : "rahasia",
    "name" : "Yanson Ferdinand Kurniadi"
}
```

Response Body Success: 

```json      
{
    "data" : {
        "username" : "pzn",
        "name" : "Yanson Ferdinand Kurniadi"
    }
}
```

Response Body Error: 

```json      
{
    "errors" : "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body : 

```json      
{
    "username" : "pzn",
    "password" : "rahasia",
}
```

Response Body Success: 

```json      
{
    "data" : {
        "token" : "unique-token",
        "name" : "Yanson Ferdinand Kurniadi"
    }
}
```

Response Body Error: 

```json      
{
    "errors" : "Username or password wrongs"
}
```

## Update User API

 Endpoint : PATCH /api/users/:id

 Headers : 
 - Authorization : token

 Request Body:

 ```json
 {
    "name" : "yanson ferdinand kurniadi", //optional
    "password": "new pasword" //optional
 }
 ```

 Response Body Success :

 ```json
 {
    "username" : "pzn", 
    "name" : "yanson ferdinand kurniadi"
 }
 ```

Response Body Error :

 ```json
 {
    "errors" : "Name length max 100", 
 }
 ```

## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success :

 ```json
 {
    "data" : {
        "username" : "pzn",
        "name" : "yanson ferdinand kurniadi"
    }, 
 }
 ```

Response Body Error :

 ```json
 {
    "errors" : "Unauthorized", 
 }
 ```

## Logout User API

Endpoint : Delete /api/users/logout

Headers: 
- Authorization : token

Response Body Success : 

```json
{
    "data" : "ok"
}
```

Response Body Error : 

```json
{
    "errors" : "Unauthorized"
}
```

