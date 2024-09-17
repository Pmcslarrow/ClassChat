import { useEffect, useState } from "react";
import Logo from "./Logo";
import { io } from 'socket.io-client'
const socket = io("http://localhost:5001", {
    transports: ['websocket'],
});

export default function JoinClassroom() {
    const [roomId, setRoomId] = useState<string>("")
    const [name, setName] = useState<string>("")


    function callback(message: string) {
        console.log(message)
    }

    function handleClick() {
        if ( roomId.length !== 6 ) { return; }
        if ( name.length === 0) { return; }

        socket.emit("joinRoom", roomId, name, callback)
    }

    return (
        <>
        <Logo />
        <div className="pad flex-row flex-center">
            <div>
                <label>Room ID:</label>
                <br />
                <input
                    id="join"
                    className="text-center"
                    value={roomId} 
                    onChange={e => setRoomId(e.target.value)}
                    maxLength={6}
                />
                <br />
                <br />
                <label>Name: </label>
                <br />
                <input 
                    id="join"
                    className="text-center"
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    maxLength={25}
                />

            </div>
        </div>

        <div className="pad">
            <div 
                id="join_button" 
                className="button bg-g max-content"
                onClick={handleClick}
            >
                    Join
            </div>
        </div>
        </>
    );
}