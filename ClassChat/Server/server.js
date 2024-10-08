import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { createServer } from 'node:http'
import { Server } from 'socket.io'
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

const uri = process.env.REACT_APP_MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
const db = client.db("ClassChat")
const classrooms = db.collection('classrooms')

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}    

/* I/O Socket Programming */


io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("newRoom", async (roomId, entries, callback) => {
        try {
            let classExists = await classrooms.findOne({ room_id: roomId });
            if (classExists) {
                return callback("Classroom does not exist. Please try another code", false);
            }

            classrooms.insertOne({
                "room_id": roomId,
                "students": [],
                "entries": entries
            })
            
            socket.join(roomId);
            console.log("Room created in the database:", roomId);
            return callback("Successfully created a new room", true)
        } catch (err) {
            return callback("An error occurred. Please try again.", false);
        }
    })

    socket.on("joinRoom", async (roomId, name, callback) => {
        try {
            let classExists = await classrooms.findOne({ room_id: roomId });
    
            if (!classExists) {
                return callback("Classroom does not exist. Please try another code");
            }
    
            let userExists = await classrooms.findOne({
                room_id: roomId,
                students: { $eq: name }
            });
    
            if (userExists !== null) {
                return callback("User already exists");
            }
    
            await classrooms.updateOne(
                { room_id: roomId },
                { $push: { students: name } }
            );
    
            socket.join(roomId);
            socket.to(roomId).emit("refresh");
    
            callback(null, "User successfully added");
        } catch (error) {
            callback("An error occurred. Please try again.");
        }
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});



const start = async () => {
    try {
        await client.connect();

        server.listen(5001, () => {
            console.log("Server is running on port:", 5001);
        });
    } catch (err) {
        console.log("Error:", err.message);
    }
}

start();


app.get('/students', async (req, res) => {
    let roomId = req?.query?.roomId;

    try {
        let classroomsCursor = classrooms.find({room_id: { $eq: roomId }});
        let classroomArray = await classroomsCursor.toArray();
        console.log(classroomArray[0].students)
        res.send(classroomArray[0].students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).send("Error retrieving students");
    }
});

app.get('/generateId', async (req, res) => {
    let roomId = makeid(6)
    let truthy = await classrooms.findOne({ "room_id": roomId });
    let exists = truthy ? true : false;
    
    while (exists) {
        roomId = makeid(6)
        truthy = await classrooms.findOne({ "room_id": roomId });
        exists = truthy ? true : false;
    }

    res.send(roomId)
})

app.delete('/ALL', async (req, res) => {
    try {
        const result = await db.collection('classrooms').deleteMany({});
        res.status(200).send({ message: 'All documents deleted', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting documents:', error);
        res.status(500).send({ message: 'Failed to delete documents', error: error });
    }
});