/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
// In production (e.g. Railway), bind to all interfaces so the platform can route traffic.
const hostname = process.env.HOSTNAME || (dev ? "localhost" : "0.0.0.0");
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(httpServer);

    // Expose io globally for API routes to access (hack for custom server)
    global.io = io;

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join room (user room or post room)
        socket.on("join", (roomId) => {
            if (roomId) {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room: ${roomId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    // --- Phase B: Live Match Namespace ---
    const matchIo = io.of('/match');
    matchIo.on('connection', (socket) => {
        console.log("Client connected to /match:", socket.id);

        socket.on('join_match', (fixtureId) => {
            if (fixtureId) {
                const roomName = `match_${fixtureId}`;
                socket.join(roomName);
                console.log(`Socket ${socket.id} joined match room: ${roomName}`);
            }
        });

        // Note: Actual DB save will happen via an API route which will emit to this room.
        // We can just pipe events if needed, but best practice is API -> DB -> io.to().emit()

        socket.on('disconnect', () => {
            console.log("Client disconnected from /match:", socket.id);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, hostname, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
