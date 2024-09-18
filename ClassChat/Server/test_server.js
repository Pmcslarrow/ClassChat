import { io } from 'socket.io-client';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

describe("Socket.IO Server Testing", function() {
    let socket;

    beforeEach(function(done) {
        socket = io("http://localhost:5001", {
            transports: ['websocket'],
            reconnectionAttempts: 3,   
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            done();  
        });

        socket.on("connect_error", (err) => {
            console.error("Connection Error:", err);
            done.fail("Failed to connect to Socket.IO server");
        });
    });

    afterEach(function(done) {
        if (socket) socket.disconnect();

        setTimeout(done, 2000);
    });

    it("should create a new classroom", function(done) {
        socket.emit("newRoom", "AERICM", [{ question: "Bla bla", answer: "bla bla" }], (response, complete) => {
            console.log("Server Response:", response);
            expect(complete).toBe(true);
            done();
        });
    });

    it("should not create a new classroom (duplicate)", function(done) {
        socket.emit("newRoom", "AERICM", [{ question: "Bla bla", answer: "bla bla" }], (response, complete) => {
            console.log("Server Response:", response);
            expect(complete).toBe(false);
            done();
        });
    });
});
