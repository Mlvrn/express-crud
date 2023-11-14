# Express CRUD RESTful APIs

Simple Express.js project providing CRUD operations for Dota 2 heroes and items.

- Express
- Joi
- Fs

---

## URL

_Server_

```
http://localhost:3000
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (400 - URL Error)_

```
{
    "message": "Invalid URL"
}
```

---

## RESTful Endpoints

### GET /all/:type

> Get all by type (Heroes/Items)

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{

    "data": {
        "<data_type>": [
	        <data_categories>
	       ]
        },

    "status": "Success"

}
```

---

### GET /all/:type/:category

> Get all by hero/item category

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{

    "data": [
	        <data_categories>
        ]

    "status": "Success"

}
```

---

### GET /all/:type/:category/:name

> Get hero/item by name

_Request Params_

```
<type_name>/<category_name>/<hero_or_item_name>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": {
        "name": "<name>",
        "description": "<description>"
    },
    "message": "Success"
}
```

_Response (404)_

```
{
    "message": "Data Not Found"
}
```

---

### POST /new/:type/:category

> Create Dota 2 hero or item

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name" : "<name>",
  "description" : "<description>"
}
```

_Response (200)_

```
{
    "data": [<hero_categories>],
    "status": "Success"
}
```

_Response (404 - Data Already Exists)_

```
{
    "message": "Data with the same name already exists"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "Name is required"
}

{
    "status": "Validation Failed",
    "message": "Description is required"
}

{
    "status": "Validation Failed",
    "message": "Name length must be at least 3 characters long"
}

{
    "status": "Validation Failed",
    "message": "Description length must be at least 10 characters long"
}
```

---

### PUT /all/:type/:category/:name

> Update by name

_Request Params_

```
/<type_name>/<category_name>/<hero_or_item_name>
```

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name": "<name>",
  "description": "<description>",
}
```

_Response (200)_

```
{
    "data": [
        <category_list>
    ],
    "message": "Success"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "Name is required"
}

{
    "status": "Validation Failed",
    "message": "Description is required"
}

{
    "status": "Validation Failed",
    "message": "Name length must be at least 3 characters long"
}

{
    "status": "Validation Failed",
    "message": "Description length must be at least 10 characters long"
}
```

_Response (404 - Data Already Exists)_

```
{
    "message": "Data with the same name already exists"
}
```

_Response (404 - Error Not Found)_

```
{
    "message": "Data Not Found"
}
```

---

### DELETE /all/:type/:category/:name

> Delete hero/item by name

_Request Params_

```
/<type_name>/<category_name>/<name>
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": [<category_list>],
    "message": "Success"
}
```

_Response (404 - Error Not Found)_

```
{
    "message": "Data Not Found"
}
```

---
