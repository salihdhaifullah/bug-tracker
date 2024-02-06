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

## Get activities
#### Description: Retrieves a paginated list of activities for a specific project.
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/activities/{page}?take={take}&sort={sort}`

#### Parameters:
`{projectId}`: The identifier of the project.
`{page}`: The page number of activities to retrieve.
`{take}`: The number of activities to take per page.
`{sort}`: The sorting order for activities (options: "oldest" or default sorting order "newest").

#### Auth: check if project public or private if private the user must be authorized and is a member of this project

#### Response:
`Status`: 200 OK
`Body`: JSON response with the paginated list of activities.

___

## Get Activities count
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/activities/count`
#### Description: Retrieves the count of activities for a specific project.

#### Parameters:
`projectId`: The identifier of the project.

#### Auth: check if project public or private if private the user must be authorized and is a member of this project

#### Response:
`Status`: 200 OK
`Body`: JSON response with the count of activities for the specified project.

___

## Get user assigned tickets
#### Description: Retrieves a list of user assigned tickets for a specific project based on optional query parameters.
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/tickets/assigned?type={type}&priority={priority}&search={search}`

#### Parameters:
`projectId:` The identifier of the project.
`typeQuery:` Optional. Filter tickets by type.
`priorityQuery:` Optional. Filter tickets by priority.
`search:` Optional. Search term for filtering tickets by name.

#### Auth: the user must be authorized and project member

#### Response:
`Status`: 200 OK
`Body`: JSON response with the list of assigned tickets.

___


## Update assigned ticket status
#### Description: Updates the status of an assigned ticket for a specific project And add a log in activities table of changes that happened

#### HTTP Method: `PATCH`
#### URL: `/api/projects/{projectId}/tickets/assigned`

#### Request Body: Requires a JSON object containing the `ticketId` and `status` properties.

#### Auth: the user must be authorized and project member, the project must not be archived

#### Response:
`Status`: 200 OK
`Body`: JSON response indicating successful status change.

___


## Delete Attachment
### Description: Deletes the specified attachment.
#### HTTP Method: `DELETE`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId}`
#### Auth: User must be authorized and have the role of `owner` or `project manager`.

#### Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.
`{attachmentId}`: ID of the attachment.

#### Responses:
`200 OK`: Attachment successfully deleted.
`404 Not Found`: Attachment not found.
`500 Internal Server Error`: Unexpected error.

## Update Attachment

#### Description: Updates the specified attachment.
#### HTTP Method: `PATCH`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/attachments/{attachmentId}`
#### Auth: User must be authorized and have the role of `owner` or `project manager`.
#### Parameters:
#### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.
`{attachmentId}`: ID of the attachment.

#### Request Body:
```json
{
  "title": "New Title", // Optional. The new title for the attachment.
  "contentType": "image/jpeg", // Optional. The content type of the updated attachment.
  "data": "base64EncodedData" // Optional. The base64 encoded data of the updated attachment.
}
```

#### Responses:
`200 OK`: Attachment successfully updated.
`404 Not Found`: Attachment not found.
`500 Internal Server Error`: Unexpected error.

___



## Login
#### Description: Authenticates a user and generates a session.
#### HTTP Method: `POST`
#### URL: `/api/auth/login`
#### Parameters:
#### Request Body (JSON):
```json
{
  "email": "example@example.com",
  "password": "user_password"
}
```

#### Responses:
`200 OK`: User logged in successfully. Returns user information and redirects to user profile.
`400 Bad Request`: Wrong email or password.
`404 Not Found`: Email does not exist. Suggests signing up.
`500 Internal Server Error`: Unexpected error.

___



## Sign-Up
#### Description: Registers a new user account and sends a verification code via email.
#### HTTP Method: `POST`
#### URL: `/api/auth/sing-up`

#### Parameters:
#### Request Body (JSON):

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "example@example.com",
  "password": "user_password"
}
```

#### Responses:
`200 OK`: A verification code has been sent to the provided email address.
`404 Not Found`: The email address already exists. Suggests logging in.
`500 Internal Server Error`: Unexpected error.

___


## Account Verification
#### Description: Verifies the account using the provided verification code and completes the sign-up process.
#### HTTP Method: `POST`
#### URL: `/api/auth/account-verification`
#### Parameters:
#### Request Body (JSON):
```json
{
  "code": "verification_code"
}
```
#### Responses:
`201 Created`: Account successfully verified. Redirects to login page.
`400 Bad Request`: Incorrect verification code. Please try again.
`404 Not Found`: Session expired. Suggests signing up again.
`500 Internal Server Error`: Unexpected error.

___

## Forget Password
#### Description: Initiates the process for resetting the user's password by sending a verification code via email.
#### HTTP Method: `POST`
#### URL: `/api/auth/forget-password`
#### Parameters:
#### Request Body (JSON):
```json
{
  "email": "example@example.com"
}
```
#### Responses:
`200 OK`: A verification code has been sent to the provided email address.
`404 Not Found`: The email address does not exist. Suggests signing up.
`500 Internal Server Error`: Unexpected error.

___


## Reset Password
#### Description: Resets the user's password after verification.
#### HTTP Method: `PATCH`
#### URL: `/api/auth/reset-password`
#### Parameters:
#### Request Body (JSON):
```json
{
  "code": "verification_code",
  "newPassword": "new_password"
}
```

#### Responses:
`200 OK`: Password successfully updated. Redirects to login page.
`400 Bad Request`: Incorrect verification code. Please try again.
`404 Not Found`: Session expired or account does not exist. Suggests initiating password reset again or signing up.
`500 Internal Server Error`: Unexpected error.


___

## Logout
#### Description: Logs the user out by deleting the authentication cookie.
#### HTTP Method: `DELETE`
#### URL: `/api/auth/logout`
#### Responses:
`200 OK`: User logged out successfully. Redirects to the home page.
`500 Internal Server Error`: Unexpected error.
___


## Get Content
#### Description: Retrieves the content of a comment.
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments/{commentId}/content`
#### Permissions Required: User must have read access to the project.
#### Parameters:
#### Path Parameters:
`{commentId}`: ID of the comment.
#### Responses:
`200 OK`: Content retrieved successfully. Returns the markdown content of the comment.
`404 Not Found`: Content not found.
`500 Internal Server Error`: Unexpected error.

___

## Update Content
#### Description: Updates the content of a comment.
#### HTTP Method: `PATCH`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments/{commentId}/content`
#### Permissions Required: User must be authorized and have permissions to edit the comment.
#### Parameters:
#### Path Parameters:
`{commentId}`: ID of the comment.
#### Request Body (JSON):
```json
{
  "markdown": "Updated Markdown Content"
}
```
#### Responses:
`200 OK`: Content updated successfully.
`404 Not Found`: Content not found.
`500 Internal Server Error`: Unexpected error.
___

## Create Comment
#### Description: Creates a new comment on a ticket.
#### HTTP Method: `POST`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments`
#### Permissions Required: User must be authorized, have read access to the project, and the project must not be archived.
#### Parameters:
#### Path Parameters:
`{ticketId}`: ID of the ticket.
#### Request Body (JSON):
```json
{
  "markdown": "Comment Markdown Content"
}
```

#### Responses:
`201 Created`: Comment created successfully.
`500 Internal Server Error`: Unexpected error.

___

## Delete Comment
#### Description: Deletes a comment.
#### HTTP Method: `DELETE`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments/{commentId}`
#### Permissions Required: User must be authorized, have read access to the project, and be the commenter of the comment.
#### Parameters:
#### Path Parameters:
`{commentId}`: ID of the comment.
#### Responses:
`200 OK`: Comment deleted successfully.
`403 Forbidden`: User does not have permission to delete the comment.
`404 Not Found`: Comment not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Comments
#### Description: Retrieves comments on a ticket.
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments`
#### Permissions Required: User must have read access to the project.
#### Parameters:
#### Path Parameters:
`{ticketId}`: ID of the ticket.
#### Query Parameters:
`take`: Number of comments to retrieve (default: 10).
`page`: Page number for pagination (default: 1).

#### Responses:
`200 OK`: Comments retrieved successfully. Returns a list of comments.
`500 Internal Server Error`: Unexpected error.

#### Get Comments Count
#### Description: Retrieves the total count of comments on a ticket.
#### HTTP Method: `GET`
#### URL: `/api/projects/{projectId}/tickets/{ticketId}/comments/count
#### Permissions Required: User must have read access to the project.
#### Parameters:
#### Path Parameters:
`{ticketId}`: ID of the ticket.
#### Responses:
`200 OK`: Comments count retrieved successfully. Returns the total count of comments.
`500 Internal Server Error`: Unexpected error.

___

___



___


___



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
