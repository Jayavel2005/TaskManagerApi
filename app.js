// modules initializing
const http = require("http");
const querystring = require("querystring");
const { MongoClient, ObjectId } = require("mongodb");


// database configuration
// New MongoDB object creation
const mongodb = new MongoClient('mongodb://localhost:27017/');
// database and collection name
const dbName = "taskDB";
const collectionName = "tasks"


const server = http.createServer(async (req, res) => {

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(
            {
                message: "API is running successfully",
                availableRoutes: ['/tasks', '/tasks/:id']
            }
        ));
    }

    // get all tasks
    else if (req.url === "/tasks" && req.method === "GET") {
        try {
            await mongodb.connect();
            const db = mongodb.db(dbName);
            const collection = db.collection(collectionName);
            const tasks = await collection.find().toArray();
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ data: { tasks } }));
        } catch (err) {
            res.writeHead(500, { "content-type": "application/json" })
            res.end(JSON.stringify({ message: err.message }));
        } finally {
            await mongodb.close();
        }
    }

    // get single task
    else if (req.url.startsWith("/tasks/") && req.method === "GET") {
        const taskId = req.url.split('/')[2];
        try {
            await mongodb.connect();
            const db = mongodb.db(dbName);
            const collection = db.collection(collectionName);
            const task = await collection.findOne({ _id: new ObjectId(taskId) });
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ data: { task } }))
        } catch (err) {
            res.writeHead(500, { "content-type": "application/json" })
            res.end(JSON.stringify({ message: err.message }));
        } finally {
            await mongodb.close();
        }

    }
    // create new task
    else if (req.url === '/tasks' && req.method === "POST") {
        const body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        })

        req.on("end", async () => {
            const newTask = JSON.parse(Buffer.concat(body).toString());
            newTask.completedStatus = false;
            // console.log(newTask);

            try {
                await mongodb.connect();
                const db = mongodb.db(dbName);
                const collection = db.collection(collectionName);
                const result = await collection.insertOne(newTask);
                res.writeHead(201, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: result }));

            } catch (error) {
                res.writeHead(500, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: error.message }));
            } finally {
                await mongodb.close();
            }
        })
    }

    // delete a task
    else if (req.url.startsWith("/tasks/") && req.method === "DELETE") {
        const taskId = req.url.split("/")[2];
        try {
            await mongodb.connect();
            const db = mongodb.db(dbName);
            const collection = db.collection(collectionName);
            const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
            res.writeHead(204);
            res.end();

        } catch (err) {
            res.writeHead(500, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: err.message }))
        } finally {
            await mongodb.close();
        }
    }

    else if (req.url.startsWith("/tasks/") && req.method === "PUT") {
        const taskId = req.url.split('/')[2];

        const body = [];
        req.on("data", (chunk) => {
            body.push(chunk);
        })

        req.on("end", async () => {
            const updatedTask = JSON.parse(Buffer.concat(body).toString());
            try {
                await mongodb.connect();
                const db = mongodb.db(dbName);
                const collection = db.collection(collectionName);

                const result = await collection.updateOne(
                    { _id: new ObjectId(taskId) },
                    { $set: updatedTask }
                );

                if (result.matchedCount === 0) {
                    res.writeHead(404, { "content-type": "application/json" });
                    return res.end(JSON.stringify({ message: "Task not found" }));
                }
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "Task updated successfully" }));

            } catch (err) {
                res.writeHead(500, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: err.message }));
            } finally {
                await mongodb.close();
            }
        })
    }
    else if (req.url.startsWith("/tasks/") && req.method === "PATCH") {
        const taskId = req.url.split('/')[2];
        const body = [];
        req.on("data", (chunk) => {
            body.push(chunk)
        })

        req.on("end", async () => {
            const updatedFields = JSON.parse(Buffer.concat(body).toString());
            try {
                await mongodb.connect();
                const db = mongodb.db(dbName);
                const collection = db.collection(collectionName);

                const result = await collection.updateOne({ _id: new ObjectId(taskId) }, { $set: updatedFields });
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "Task updated successfully" }));
            } catch (err) {
                res.writeHead(500, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: err.message }));
            } finally {
                await mongodb.close();

            }
        })
    }

    else {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "url not found" }));
    }
})
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
})