// modules initializing
const http = require("http");
const querystring = require("querystring");
const { MongoClient } = require("mongodb");


// database configuration

// New MongoDB object creation
const mongodb = new MongoClient('mongodb://localhost:27017/');
// database and collection name
const dbName = "taskDB";
const collectionName = "tasks"


const server = http.createServer(async (req, res) => {

    // get all tasks
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(
            {
                message: "API is running successfully",
                availableRoutes: ['/tasks', '/tasks/:id']
            }
        ));
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