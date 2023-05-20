const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
// process.env.PORT is for Heroku and in general for the deployment environment, 3000 is for local development (we will have to specify the port in the URL)

const users = [];
// we will store the users in an array
const messages = [];
// we will store the messages in an array (called messagesStorage in the diagram)

// this is all just fancy way to log clients, if you don't want it just edit the console.log on connect and disconnect simpler
    const clients = {};
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
// end of the optional section

const httpServer = createServer();
const io = new Server(httpServer);
// we crate a socket.io server with the help of http

io.on('connection', socket => {
    // called when a new client connects

    clients[socket.id] = coolNames.pop(); // also optional

    console.log(`We have a new connection, from ${clients[socket.id]}!`);
    socket.emit("messages", messages);
    // we send all the current messages to the newly connected client

    socket.on("disconnect", () => {
        console.log(`Client ${clients[socket.id]} disconnected!`);
        // also optional
            coolNames = [...coolNames, clients[socket.id]];
            delete clients[socket.id];
        // end of optional code
    });

    socket.on("sendMessage", message => {
        console.log(`Client ${clients[socket.id]} sent a message: ${message}`);
        messages.push(message);
        io.emit("messages", messages);
    });
});

httpServer.listen(port);
console.log(`Server up and running on ${port}`);
// we pass the port to the listen method of the http server on which the socket.io is running