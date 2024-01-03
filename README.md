# buegee is .NET core 7 and react project management web app

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

### if project is private only members can see data related to the project
### if project is archived no changes can be made to data related to the project

### owner can add and remove new members, create tickets, update, delete, change setting of project, comment in tickets, view every thing in the project
### project manger can create tickets, update, delete,  comment in tickets, view every thing in the project
### developer can change status of tickets assigned to them,  comment in tickets, view every thing in the project

## REST API
auth/login POST
auth/sing-up POST
auth/demo GET
auth/account-verification POST
auth/forget-password POST
auth/reset-password PATCH
auth/logout DELETE

users/{userId} GET
users/{userId}/avatar PATCH
users/{userId}/bio PATCH

contents/{contentId} GET
contents/{contentId} PATCH

users/{userId}/projects POST
users/{userId}/projects/{page} GET
users/{userId}/projects/count GET

users/{userId}/projects/{projectId} GET
users/{userId}/projects/{projectId} PATCH
users/{userId}/projects/{projectId} DELETE

users/{userId}/projects/{projectId}/danger-zone GET
users/{userId}/projects/{projectId}/danger-zone/visibility PATCH
users/{userId}/projects/{projectId}/danger-zone/archive PATCH
users/{userId}/projects/{projectId}/danger-zone/transfer PATCH

explore/{page} GET
explore/count GET

users/{userId}/projects/{projectId}/members/{page} GET
users/{userId}/projects/{projectId}/members POST
users/{userId}/projects/{projectId}/members DELETE
users/{userId}/projects/{projectId}/members/none-members GET
users/{userId}/projects/{projectId}/members/chart GET

users/{userId}/projects/{projectId}/members/table/count GET
users/{userId}/projects/{projectId}/members/table GET

users/{userId}/projects/{projectId}/members/{memberId}/role GET
users/{userId}/projects/{projectId}/members/{memberId} DELETE
users/{userId}/projects/{projectId}/members/{memberId} PATCH

users/{userId}/projects/{projectId}/activities/{page} GET
users/{userId}/projects/{projectId}/activities/count GET

users/{userId}/projects/{projectId}/tickets/{ticketId} POST
users/{userId}/projects/{projectId}/tickets/{ticketId} PATCH
users/{userId}/projects/{projectId}/tickets/{ticketId} GET
users/{userId}/projects/{projectId}/tickets/{ticketId} DELETE

users/{userId}/projects/{projectId}/tickets/assigned/{userId} GET
users/{userId}/projects/{projectId}/tickets/assigned/{userId}/{ticketId} PATCH

users/{userId}/projects/{projectId}/tickets/table/{page} GET
users/{userId}/projects/{projectId}/tickets/table/count GET

users/{userId}/projects/{projectId}/tickets/{ticketId}/chart GET

users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments GET
users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments POST

users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId} DELETE
users/{userId}/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId} PATCH

users/{userId}/projects/{projectId}/tickets/{ticketId}/comments/{page} GET
users/{userId}/projects/{projectId}/tickets/{ticketId}/comments POST
users/{userId}/projects/{projectId}/tickets/{ticketId}/comments/count GET
users/{userId}/projects/{projectId}/tickets/{ticketId}/comments/{commentId} DELETE



## to dump to database

## make the dump file
```sh
PGSSLMODE=require PGPASSWORD=<your password> pg_dump -h <host> -U <user> -d <database> -p <port> -f <file name>.sql
```

## and then dump
```sh
sudo psql -h <host> -p <port> -d <database> -U <user>
\i dump.sql
```
