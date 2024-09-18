import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { io } from 'socket.io-client'

export default function Classroom() {
    const location = useLocation();
    const { questions = [], roomId, isTeacher } = location.state || {};
    const [students, setStudents] = useState<string[]>([])
    const [updatedRoomId, setUpdatedRoomId] = useState(roomId)
    const socket = io("http://localhost:5001", {
        transports: ['websocket'],
    });

    useEffect(() => {
        async function newRoomCallback( response: string, complete: boolean ) {
            console.log(response, complete)
        }

        const createNewClassroom = async () => {
            if (questions.length === 0) return;
            try {
                // await axios.delete("http://localhost:5001/ALL");
                socket.emit("newRoom", roomId, questions, newRoomCallback);
            } catch (error) {
                console.error("Error creating new classroom:", error);
            }
        };

        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5001/students', {
                    params: { roomId: updatedRoomId },
                });
                const students: string[] = response.data;
                setStudents(students);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        socket.on("refresh", fetchStudents);

        createNewClassroom();
        return () => {
            socket.off("refresh", fetchStudents); 
            socket.disconnect();
        };
    }, []);

    // EMPTY ARRAY HANDLING
    if (questions.length === 0) {
        return (
            <>
            <div id='button_classroom_wrapper' className='flex-col flex-center'>
                <div className='flex-row flex-center gap'>
                    <Link to='/new' className="button">Back</Link>
                </div>
            </div>
            </>
        )
    }

    function removeStudent(student: string) {
        setStudents(students.filter((curr) => student !== curr))
    }

    let studentDOM = students.map((student: string, i: number) => {
        return (
            <div key={student + i.toString()} className="flex-row gap">
                <FaRegTrashAlt className="trash" onClick={() => removeStudent(student)}/>
                <p>{student}</p>
            </div>
        )
    })

    return (
        <>
        <Logo />
        <div className="pad flex-row flex-center">
            <div>
                <label>Room ID:</label>
                <div id="room_id">{updatedRoomId}</div>
            </div>
        </div>

        <div className="pad flex-row separate">
            <div>
                <h2>Joined:</h2>
                <br />
                {studentDOM}
            </div>
            {isTeacher ? 
                <div className="button bg-g max-content">Start Class</div> :
                <></>
            }
        </div>
        </>
    );
}
