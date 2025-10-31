# Task Manager API

A simple REST API built with core Node.js to manage tasks (create, read, update, and delete) without using any external frameworks.

## ✨ Features

* Create, Read, Update (both `PUT` and `PATCH`), and Delete tasks.
* Built with **pure Node.js** (no Express) for a lightweight footprint.
* Connects to a MongoDB database.

## 💻 Tech Stack

* **Server:** Node.js (core `http` module)
* **Database:** MongoDB (using the native `mongodb` driver)
* **Utility:** `nodemon` (for auto-restarting the server in development)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `mongodb://localhost:27017/`.

### Installation

1. Clone the repository:

    ```bash
    git clone [YOUR_REPO_URL]
    ```

2. Navigate to the project directory:

    ```bash
    cd taskmanagerapi
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Environment Variables

Your `app.js` file currently has the database connection string and port hardcoded. For better security and flexibility, it's recommended to use environment variables.

1. Create a file named `.env` in the root of your project.
2. Add the following variables:

    ```ini
    # .env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/
    DB_NAME=taskDB
    ```

3. (Optional but recommended) Update your `app.js` to use these variables:
    * Install `dotenv`: `npm install dotenv`
    * Add `require('dotenv').config();` to the top of `app.js`.
    * Change hardcoded values to `process.env.PORT`, `process.env.MONGO_URI`, and `process.env.DB_NAME`.

### Running the Server

Run the server in development mode (which uses `nodemon` to auto-reload on file changes):

```bash
npm run dev
```

## 📡 API Endpoints

All endpoints are relative to <http://localhost:3000>.

### Task Model

A task object in the database (tasks collection) has the following structure:

```json
{
  "_id": "67f5b9f7a7c1b8a8b1e1a3d1",
  "title": "My first task",
  "description": "Details about the task",
  "completedStatus": false
}
```

### Available Endpoints

#### GET /

**Description**: Checks the API status and lists available routes.

**Response**: 200 OK

```json
{
  "message": "API is running successfully",
  "availableRoutes": [
    "/tasks",
    "/tasks/:id"
  ]
}
```

#### GET /tasks

**Description**: Retrieves a list of all tasks.

**Response**: 200 OK

```json
{
  "data": {
    "tasks": [
      {
        "_id": "67f5b9f7a7c1b8a8b1e1a3d1",
        "title": "My first task",
        "completedStatus": false
      },
      {
        "_id": "67f5b9f7a7c1b8a8b1e1a3d2",
        "title": "Another task",
        "completedStatus": true
      }
    ]
  }
}
```

#### GET /tasks/:id

**Description**: Retrieves a single task by its _id.

**Example URL**: `/tasks/67f5b9f7a7c1b8a8b1e1a3d1`

**Response**: 200 OK

```json
{
  "data": {
    "task": {
      "_id": "67f5b9f7a7c1b8a8b1e1a3d1",
      "title": "My first task",
      "completedStatus": false
    }
  }
}
```

#### POST /tasks

**Description**: Creates a new task. The `completedStatus` is automatically set to `false`.

**Request Body**:

```json
{
  "title": "Write API documentation",
  "description": "Document all endpoints in the README"
}
```

**Response**: 201 Created (Returns the result from the MongoDB insertion)

```json
{
  "message": {
    "acknowledged": true,
    "insertedId": "67f5b9f7a7c1b8a8b1e1a3d3"
  }
}
```

#### PUT /tasks/:id

**Description**: Replaces an existing task with new data (full update).

**Example URL**: `/tasks/67f5b9f7a7c1b8a8b1e1a3d1`

**Request Body**: (Must provide all fields for replacement)

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completedStatus": true
}
```

**Response**: 200 OK

```json
{
  "message": "Task updated successfully"
}
```

#### PATCH /tasks/:id

**Description**: Updates one or more fields on an existing task (partial update).

**Example URL**: `/tasks/67f5b9f7a7c1b8a8b1e1a3d1`

**Request Body**: (Only provide fields you want to change)

```json
{
  "completedStatus": true
}
```

**Response**: 200 OK

```json
{
  "message": "Task updated successfully"
}
```

#### DELETE /tasks/:id

**Description**: Deletes a task by its _id.

**Example URL**: `/tasks/67f5b9f7a7c1b8a8b1e1a3d1`

**Response**: 204 No Content
