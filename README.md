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
#### Auth: User must have read access to the project.
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
#### Auth: User must be authorized and have permissions to edit the comment.
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
#### Auth: User must be authorized, have read access to the project, and the project must not be archived.
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
#### Auth: User must be authorized, have read access to the project, and be the commenter of the comment.
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
#### Auth: User must have read access to the project.
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
#### Auth: User must have read access to the project.
#### Parameters:
#### Path Parameters:
`{ticketId}`: ID of the ticket.
#### Responses:
`200 OK`: Comments count retrieved successfully. Returns the total count of comments.
`500 Internal Server Error`: Unexpected error.

___



## Explore Page
### Description: Retrieves a page of projects matching the search criteria.
### HTTP Method: `GET`
### URL: `/api/explore/{page}`

### Path Parameters:
`{page}`: Page number for pagination.

### Query Parameters:
`search (optional)`: Search query to filter projects.
`take (optional, default: 10)`: Number of projects to retrieve per page.

### Responses:
`200 OK`: Projects retrieved successfully. Returns a list of projects.
`500 Internal Server Error`: Unexpected error.

___

## Explore Count
### Description: Retrieves the total count of projects matching the search criteria.
### HTTP Method: `GET`
### URL: `/api/explore/count`

### Query Parameters:
`search (optional)`: Search query to filter projects.

### Responses:
`200 OK`: Projects count retrieved successfully. Returns the total count of projects.
`500 Internal Server Error`: Unexpected error.

___


## Delete Member
### Description: Removes a member from a project.
### HTTP Method: `DELETE`
### URL: `/api/projects/{projectId}/members/{memberId}`
### Auth: User must be authorized, the project must not be archived, and the user must be an owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.
`{memberId}`: ID of the member to delete.

### Responses:
`200 OK`: Member deleted successfully.
`404 Not Found`: Member not found.
`500 Internal Server Error`: Unexpected error.

___

## Update Member
### Description: Updates the role of a member in a project.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/members/{memberId}`
### Auth: User must be authorized, the project must not be archived, and the user must be an owner of the project.

### Path Parameters:
{projectId}: ID of the project.
{memberId}: ID of the member to update.

### Request Body (JSON):
```` json
{
  "role": "developer" // or "project_manger"
}
````

### Responses:
`200 OK`: Member role updated successfully.
`404 Not Found`: Member not found.
`500 Internal Server Error`: Unexpected error.
___


## Get Members Table Count
### Description: Retrieves the total count of members in the project matching the specified criteria.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members/table/count`
### Auth: User must have read access to the project.

### Path Parameters:
`{projectId}`: ID of the project.

### Query Parameters:
`role (optional)`: Filter members by role (e.g., "owner", "project_manager").
`search (optional)`: Search query to filter members by email or name.

### Responses:
`200 OK`: Members count retrieved successfully. Returns the total count of members.
`500 Internal Server Error`: Unexpected error.

___

## Get Members Table
### Description: Retrieves a table of members associated with the project matching the specified criteria.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members/table`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Query Parameters:
`role (optional)`: Filter members by role (e.g., "owner", "project_manager").
`search (optional)`: Search query to filter members by email or name.
`take (optional, default: 10)`: Number of members to retrieve per page.
`page (optional, default: 1)`: Page number for pagination.

### Responses:
`200 OK`: Members retrieved successfully. Returns a list of members.
`500 Internal Server Error`: Unexpected error.
___

## Get Project Content
### Description: Retrieves the content of the project.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/content`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Content retrieved successfully. Returns the content of the project.
`500 Internal Server Error`: Unexpected error.

___

## Update Project Content
### Description: Updates the content of the project.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/content`

### Auth: User must be the owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Request Body: JSON object containing the updated content.

### Responses:
`200 OK`: Content updated successfully.
`404 Not Found`: Content not found.
`500 Internal Server Error`: Unexpected error.

___


## Get Project
### Description: Retrieves information about a specific project.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Project information retrieved successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Read-Only Project
### Description: Retrieves information about whether the project is read-only or not.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/read-only`
### Auth: User must have read access to the project.

### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Read-only status retrieved successfully.
`500 Internal Server Error`: Unexpected error.

___

## Update Project
### Description: Updates the name of the project.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}`
### Auth: User must be the owner of the project.

### Path Parameters:
`{projectId}`: ID of the project.

### Request Body: JSON object containing the new name of the project.

### Responses:
`200 OK`: Project name updated successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___


## Delete Project
### Description: Deletes a project.
### HTTP Method: `DELETE`
### URL: `/api/projects/{projectId}`
### Auth: User must be the owner of the project.

### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Project deleted successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Danger Zone
### Description: Retrieves information about the danger zone settings of a specific project.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/danger-zone`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Danger zone settings retrieved successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___


## Update Visibility
### Description: Changes the visibility of the project (public or private).
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/danger-zone/visibility`
### Auth: User must be the owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Project visibility updated successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Update Archive
### Description: Archives or restores the project.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/danger-zone/archive`
### Auth: User must be the owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Project archived/restored successfully.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Transfer Project Ownership
### Description: Transfers project ownership to another member.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/danger-zone/transfer`
### Auth: User must be the owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Request Body: JSON object containing the ID of the member to whom ownership will be transferred.

### Responses:
`200 OK`: Project ownership transferred successfully.
`403 Forbidden`: User is not allowed to perform this action.
`404 Not Found`: Project or user not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Members
### Description: Retrieves project members.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Query Parameters:
`email (optional)`: Filter members by email.
`not-me (optional)`: Exclude the current user from the results.

### Responses:
`200 OK`: Members retrieved successfully.
`500 Internal Server Error`: Unexpected error.

___

## Add Member
### Description: Adds a new member to the project.
### HTTP Method: `POST`
### URL: `/api/projects/{projectId}/members`
### Auth: User must be the owner of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Request Body: JSON object containing information about the user to be invited (ID and role).

### Responses:
`201 Created`: User successfully invited to join the project.
`400 Bad Request`: User to invite does not exist.
`403 Forbidden`: User is not authorized to invite users.
`500 Internal Server Error`: Unexpected error.

___

## Leave Project
### Description: Allows a member to leave the project.
### HTTP Method: `DELETE`
### URL: `/api/projects/{projectId}/members`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: User successfully left the project.
`400 Bad Request`: Account not found.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Non-Members
### Description: Retrieves users who are not members of the project.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members/none-members`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Query Parameters:
`email (optional)`: Filter users by email.

### Responses:
`200 OK`: Non-members retrieved successfully.
`500 Internal Server Error`: Unexpected error.

___

## Get Role
### Description: Retrieves the role of user requesting this api.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members/role`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Role retrieved successfully.
`500 Internal Server Error`: Unexpected error.

___

### Get Members Chart
### Description: Retrieves data for generating member charts.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/members/chart`
### Auth: User must be a member of the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Data retrieved successfully.
`500 Internal Server Error`: Unexpected error.

___


## Create Ticket
### Description: Creates a new ticket in the project.
### HTTP Method: `POST`
### URL: `/api/projects/{projectId}/tickets`
### Auth: User must be a project owner or project manager.

### Path Parameters:
`{projectId}`: ID of the project.

### Request Body: JSON object containing ticket details (name, type, status, priority, assigned member ID).

### Responses:
`201 Created`: Ticket successfully created.
`400 Bad Request`: Invalid request body format.
`403 Forbidden`: User is not authorized to create a ticket in the project.
`404 Not Found`: User to assign the ticket to is not found.
`500 Internal Server Error`: Unexpected error.

___


## Get Ticket Attachments
### Description: Retrieves all attachments associated with a specific ticket.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/{ticketId}/attachments`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Responses:
`200 OK`: Attachments successfully retrieved.
`500 Internal Server Error`: Unexpected error.

__

## Upload Ticket Attachment
### Description: Uploads a new attachment for a specific ticket.
### HTTP Method: `POST`
### URL: `/api/projects/{projectId}/tickets/{ticketId}/attachments`
### Auth: User must be a project owner or project manager.
### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Request Body: JSON object containing attachment details (title, data, content type).

### Responses:
`201 Created`: Attachment successfully uploaded.
`400 Bad Request`: Invalid request body format.
`403 Forbidden`: User is not authorized to upload attachments in the project.
`500 Internal Server Error`: Unexpected error.

___

## Get Ticket Content
### Description: Retrieves the content (markdown) of a specific ticket.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/{ticketId}/content`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Responses:
`200 OK`: Content successfully retrieved.
`500 Internal Server Error`: Unexpected error.

___

## Update Ticket Content
### Description: Updates the content of a specific ticket.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/tickets/{ticketId}/content`
### Auth: User must be a project owner or project manager.
### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Request Body: JSON object containing the updated content (markdown).

### Responses:
`200 OK`: Content successfully updated.
`400 Bad Request`: Invalid request body format.
`403 Forbidden`: User is not authorized to update content in the project.
`500 Internal Server Error`: Unexpected error.
___


## Create Ticket
### Description: Creates a new ticket within a project.
### HTTP Method: `POST`
### URL: `/api/projects/{projectId}/tickets/{ticketId}`
### Auth: User must be a project owner or project manager.

### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Request Body: JSON object containing ticket details.

### Responses:
`201 Created`: Ticket successfully created.
`400 Bad Request`: Invalid request body format.
`403 Forbidden`: User is not authorized to create a ticket in the project.
`500 Internal Server Error`: Unexpected error.

___

## Update Ticket
### Description: Updates an existing ticket within a project.
### HTTP Method: `PATCH`
### URL: `/api/projects/{projectId}/tickets/{ticketId}`
### Auth: User must be a project owner or project manager.

### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Request Body: JSON object containing updated ticket details.

### Responses:
`200 OK`: Ticket successfully updated.
`400 Bad Request`: Invalid request body format.
`403 Forbidden`: User is not authorized to update the ticket in the project.
`500 Internal Server Error`: Unexpected error.

___

## Get Ticket
### Description: Retrieves details of a specific ticket within a project.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/{ticketId}`
### Auth: User must have read access to the project.

### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Responses:
`200 OK`: Ticket details successfully retrieved.
`404 Not Found`: Ticket not found.
`500 Internal Server Error`: Unexpected error.

___

## Delete Ticket
### Description: Deletes a specific ticket within a project.
### HTTP Method: `DELETE`
### URL: `/api/projects/{projectId}/tickets/{ticketId}`
### Auth: User must be a project owner or project manager.

### Path Parameters:
`{projectId}`: ID of the project.
`{ticketId}`: ID of the ticket.

### Responses:
`200 OK`: Ticket successfully deleted.
`404 Not Found`: Ticket not found.
`500 Internal Server Error`: Unexpected error.
___


## Get Tickets Chart
### Description: Retrieves statistical data about the tickets in a project for visualization purposes.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/chart`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Responses:
`200 OK`: Statistical data successfully retrieved.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.
___


## Get Tickets Table
### Description: Retrieves paginated data about tickets in a project based on specified filters and search keyword.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/table/{page}`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.
`{page}`: Page number for pagination.

### Query Parameters:
`status`: Filter by ticket status.
`type`: Filter by ticket type.
`priority`: Filter by ticket priority.
`search`: Search keyword to filter tickets by name.
`take (optional)`: Number of items to take per page (default is 10).

### Responses:
`200 OK`: Paginated data about tickets successfully retrieved.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Tickets Table Count
### Description: Retrieves the total count of tickets in a project based on specified filters and search keyword.
### HTTP Method: `GET`
### URL: `/api/projects/{projectId}/tickets/table/count`
### Auth: User must have read access to the project.
### Path Parameters:
`{projectId}`: ID of the project.

### Query Parameters:
`status`: Filter by ticket status.
`type`: Filter by ticket type.
`priority`: Filter by ticket priority.
`search`: Search keyword to filter tickets by name.

### Responses:
`200 OK`: Total count of tickets successfully retrieved.
`404 Not Found`: Project not found.
`500 Internal Server Error`: Unexpected error.

___

## Get Content
### Description: Retrieves content associated with a user profile.
### HTTP Method: `GET`
### URL: `/api/users/{userId}/content`
### Auth: None
### Path Parameters:
`{userId}`: ID of the user.

### Responses:
`200 OK`: Content successfully retrieved.
`404 Not Found`: Content not found for the specified user.
`500 Internal Server Error`: Unexpected error.

___

## Update Content
### Description: Updates content associated with a user profile.
### HTTP Method: `PATCH`
### URL: `/api/users/{userId}/content`
### Auth: User must be authenticated and authorized to update their own content.
### Path Parameters:
`{userId}`: ID of the user.

### Request Body:
ContentDTO: Data Transfer Object containing the updated content.

### Responses:
`200 OK`: Content successfully updated.
`400 Bad Request`: Invalid request body.
`403 Forbidden`: User is not authorized to update the content.
`404 Not Found`: Content not found for the specified user.
`500 Internal Server Error`: Unexpected error.
___

## Get User
### Description: Retrieves user profile information.
### HTTP Method: `GET`
### URL: `/api/users/{userId}`
### Auth: None
### Path Parameters:
`{userId}`: ID of the user.

### Responses:
`200 OK`: User profile information successfully retrieved.
`404 Not Found`: User not found.
`500 Internal Server Error`: Unexpected error.

___

## Update Avatar
### Description: Updates the user's avatar.
### HTTP Method: `PATCH`
### URL: `/api/users/{userId}/avatar`
### Auth: User must be authenticated and authorized to update their own avatar.
### Path Parameters:
`{userId}`: ID of the user.

### Request Body:
### AvatarDTO: Data Transfer Object containing the new avatar data.

### Responses:
`200 OK`: Avatar successfully updated.
`400 Bad Request`: Invalid request body.
`401 Unauthorized`: User is not authorized to update the avatar.
`500 Internal Server Error`: Unexpected error.

___

## Update Bio
### Description: Updates the user's bio.
### HTTP Method: `PATCH`
### URL: `/api/users/{userId}/bio`
### Auth: User must be authenticated and authorized to update their own bio.
### Path Parameters:
`{userId}`: ID of the user.

### Request Body:
### BioDTO: Data Transfer Object containing the new bio data.

### Responses:
`200 OK`: Bio successfully updated.
`400 Bad Request`: Invalid request body.
`401 Unauthorized`: User is not authorized to update the bio.
`500 Internal Server Error`: Unexpected error.
___

## Create Project
### Description: Creates a new project.
### HTTP Method: `POST`
### URL: `/api/users/{userId}/projects`
### Auth: User must be authenticated.
### Path Parameters:
`{userId}`: ID of the user.

### Request Body:
### CreateProjectDTO: Data Transfer Object containing project creation information.

### Responses:
`201 Created`: Project successfully created.
`400 Bad Request`: Invalid request body.
`401 Unauthorized`: User is not authenticated.
`500 Internal Server Error`: Unexpected error.

___

## Get User Projects
### Description: Retrieves projects associated with a user, with optional filtering and pagination.
### HTTP Method: `GET`
### URL: `/api/users/{userId}/projects`
### Auth: None
### Path Parameters:
`{userId}`: ID of the user.

### Query Parameters:
`role`: Role filter (optional).
`search`: Search filter (optional).
`status`: Status filter (optional).
`take`: Number of projects to retrieve per page (default is 10).
`page`: Page number for pagination (default is 1).

### Responses:
`200 OK`: Projects successfully retrieved.
`500 Internal Server Error`: Unexpected error.

___

## Get User Projects Count
### Description: Retrieves the total count of projects associated with a user, with optional filtering.
### HTTP Method: `GET`
### URL: `/api/users/{userId}/projects/count`
### Auth: None
### Path Parameters:
`{userId}`: ID of the user.

### Query Parameters:
`role`: Role filter (optional).
`search`: Search filter (optional).
`status`: Status filter (optional).
`take`: Number of projects to retrieve per page (default is 10).

### Responses:
`200 OK`: Total count of projects successfully retrieved.
`500 Internal Server Error`: Unexpected error.
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
