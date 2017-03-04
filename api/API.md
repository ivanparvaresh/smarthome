API Documentation
====================

### Login

```code

url : /login

parameter: 
    - token : string
    - username : string
    - password : string

return : 
    device information

```

## Command

```code

url : /command/exec
parameter:
    - token : string
    - name : string
    - data : any

return :
    {success:true}

```

## Claims

``` code 

url : /claim/set
parameters:
    - token : string
    - claims: {
        name : string,
        value : string
    }
return :
    {success:true}