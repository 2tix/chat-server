const { Server } = require("socket.io");
const app = require("express")();
const server = require('http').createServer(app);
const cors = require("cors");

const port = process.env.PORT || 3000;
// process.env.PORT is for Heroku and in general for the deployment environment, 3000 is for local development (we will have to specify the port in the URL)

const messages = [];
// we will store the messages in an array (called messagesStorage in the diagram)

const clients = {};
// we will store the clients in an objects
const generateCoolNames = (adjectives, nouns) => {
    const coolNames = [];

    for (let adjective of adjectives) {
        for (let noun of nouns) {
            const coolName = `${adjective} ${noun}`;
            coolNames.push(coolName);
        }
    }

    return coolNames;
};

const adjectives = ["Black", "Silver", "Crimson", "Midnight", "Azure", "Sapphire", "Golden", "Amethyst", "Emerald", "Ruby", "Obsidian", "Jade", "Onyx", "Topaz", "Steel", "Electric", "Cobalt", "Platinum", "Copper", "Velvet"];
const nouns = ["Giraffe", "Falcon", "Phoenix", "Tiger", "Dragon", "Wolf", "Lion", "Hawk", "Panther", "Raven", "Serpent", "Fox", "Bear", "Eagle", "Leopard", "Cheetah", "Jaguar", "Puma", "Ocelot", "Cougar"];

let coolNames = generateCoolNames(adjectives, nouns);
// all with the coolNames is just to give a random name to the user (we could do it with IDs, but this is more fun)

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*", // also cors
        methods: ["GET", "POST"], // Specify the allowed HTTP methods
    },
});
// we crate a socket.io server with the help of http

io.on('connection', socket => {
    // called when a new client connects

    clients[socket.id] = coolNames.pop(); // also optional

    console.log(`We have a new connection, from ${clients[socket.id]}!`);
    socket.emit("you", clients[socket.id]);
    socket.emit("messages", messages);
    // we send all the current messages to the newly connected client

    socket.on("disconnect", () => {
        console.log(`Client ${clients[socket.id]} disconnected!`);
        coolNames = [...coolNames, clients[socket.id]];
        delete clients[socket.id];
    });

    socket.on("sendMessage", message => {
        // called when a client sends a message
        console.log(`Client ${clients[socket.id]} sent a message: ${message.text}`);
        messages.push({
            ...message,
            author: clients[socket.id]
        });
        // we add the message to the messages array
        io.emit("messages", messages);
        // we send the updated messages to all the clients (io.emit sends to all the clients, socket.emit sends to the client that sent the message)
    });
});
server.listen(port);
console.log(`Server up and running on ${port}`);
// we pass the port to the listen method of the http server on which the socket.io is running