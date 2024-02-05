# buegee project management web app


### tools used
#### client
- react
- tailwind css
- yarn
- react router
- chart.js
- react-icons
- react-markdown
- vite
- full custom markdown editor
- PWA
- notification
- WEBP converter
- typescript

#### server
- c#
- .NET
- entity framework
- docker
- postgresql
- redis
- supabase file storage
- jwt
- crypto
- smtp server
- ulid


## video demo
[![demo](https://img.youtube.com/vi/ZhMCs5tlHf4/0.jpg)](https://www.youtube.com/watch?v=ZhMCs5tlHf4)

## to build
```sh
docker build -t buegee .
```

## to inspect image
```sh
docker run -it --rm --entrypoint /bin/sh buegee
```

## to run
```sh
 docker run -d -p 5018:5018 buegee
```

## to make first migrations

```sh
dotnet ef migrations add InitialCreate
```

## and then run
```sh
dotnet ef database update
```


# REST API

```http
GET /projects/{projectId}/activities/{page}?take={take}&sort={sort}
```

#### Description:
Retrieves a paginated list of activities for a specific project.

#### Parameters:
**projectId:** The identifier of the project.
**page:** The page number of activities to retrieve.
**take:** The number of activities to take per page.
**sort:** The sorting order for activities (options: "oldest" or default sorting order "newest").

#### Auth:
check if project public or private
if private the user must be authorized and is a member of this project

#### Response:
Status: 200 OK
Body: JSON response with the paginated list of activities.

___

```http
GET /projects/{projectId}/activities/count
```

#### Description:
Retrieves the count of activities for a specific project.

#### Parameters:
**projectId:** The identifier of the project.

#### Auth:
check if project public or private
if private the user must be authorized and is a member of this project

#### Response:
Status: 200 OK
Body: JSON response with the count of activities for the specified project.

___

```http
GET /projects/{projectId}/tickets/assigned?type={type}&priority={priority}&search={search}
```

#### Description:
Retrieves a list of assigned tickets for a specific project based on optional query parameters.

#### Parameters:
**projectId:** The identifier of the project.
**typeQuery:** Optional. Filter tickets by type.
**priorityQuery:** Optional. Filter tickets by priority.
**search:** Optional. Search term for filtering tickets by name.

#### Auth:
the user must be authorized and project member

#### Response:
Status: 200 OK
Body: JSON response with the list of assigned tickets.

___

```http
PATCH /projects/{projectId}/tickets/assigned
```
#### Description:
Updates the status of an assigned ticket for a specific project.
And add a log in activities table of this project that the user **(this user)** changed ticket **(this ticket)** status from old status to new status

#### Request Body:
Requires a JSON object containing the **ticketId** and **status** properties.

#### Auth:
the user must be authorized and project member
the project must not be archived

#### Response:
Status: 200 OK
Body: JSON response indicating successful status change.

___

# Roles
##### if project is private only members can see data related to the project
##### if project is archived no changes can be made to data related to the project

##### owner can add and remove new members, create tickets, update, delete, change setting of project, comment in tickets, view every thing in the project
##### project manger can create tickets, update, delete,  comment in tickets, view every thing in the project
##### developer can change status of tickets assigned to them,  comment in tickets, view every thing in the project



## database
##### make the dump file
```bash
PGSSLMODE=require PGPASSWORD=<your password> pg_dump -h <host> -U <user> -d <database> -p <port> -f <file name>.sql
```

##### and then dump
```bash
sudo psql -h <host> -p <port> -d <database> -U <user>
\i dump.sql
```
