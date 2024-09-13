import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

interface Entry {
    question: string;
    answer: string;
}

export default function NewClassroom() {
    const [currentQuestion, setCurrentQuestion] = useState<string>();
    const [currentAnswer, setCurrentAnswer] = useState<string>();
    const [questions, setQuestions] = useState<Entry[]>([]);
    const [roomId, setRoomId] = useState<string>()
    const dialogRef = useRef<HTMLDialogElement>(null);
    const isTeacher = true;

    useEffect(() => {
        const roomId = makeid(6);
        setRoomId(roomId)
        console.log(roomId)
    }, [])

    function handleChangeQuestion(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCurrentQuestion(e.target.value)
    }

    function handleChangeAnswer(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCurrentAnswer(e.target.value);
    }

    function handleEntryDeletion(e: React.MouseEvent<HTMLTableCellElement>) {
        const entryId: number = parseInt(e.currentTarget.getAttribute('data-id') || "0", 10);
        setQuestions(
            questions.filter((entry: Entry, i: number) => entryId !== i)
        )
    }

    function handleAddQuestion() {
        if (dialogRef.current?.open) {
            if (currentQuestion?.trim() && currentAnswer?.trim()) {
                const newEntry: Entry = {
                    question: currentQuestion.trim(),
                    answer: currentAnswer.trim(),
                };
                setQuestions([...questions, newEntry]);
                setCurrentAnswer("");
                setCurrentQuestion("");
            }
            dialogRef.current?.close();
        } else {
            dialogRef.current?.showModal();
        }
    }
    

    const MAX_LETTERS = 100
    let tableQuestions = questions.map((entry: Entry, i: number) => {
        return (
            <tr key={i}>
                <td>{entry.question}</td>
                <td>{entry.answer.length > MAX_LETTERS ? entry.answer.substring(0, MAX_LETTERS) + '. . .' : entry.answer}</td>
                <td data-id={i} className="deletion button bg-r" onClick={handleEntryDeletion}>Delete</td>
            </tr>
        )
    })

    function makeid(length: number) {
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

    return (
        <>
        <Logo />
        <dialog id="modal" className="pad" ref={dialogRef}>
            <div className="flex-col pad">
                <h2>Discussion Question:</h2>
                <textarea id='discussion' placeholder="Enter here..." onChange={handleChangeQuestion} value={currentQuestion}></textarea>

                <h2>The Answer:</h2>
                <textarea id='answer' placeholder="Enter here..." onChange={handleChangeAnswer} value={currentAnswer}></textarea>
            </div>
            <div className="flex-row separate">
                <div id='close_modal' className="button bg-r" onClick={handleAddQuestion}>Close</div>
                <div id='submit_modal' className="button bg-g" onClick={handleAddQuestion}>Submit</div>
            </div>

        </dialog>

        <table id="questions_and_answers">
            <thead>
                <tr>
                    <th>Questions</th>
                    <th>Answers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tableQuestions}
            </tbody>
        </table>

        <div className='flex-col'>
            <div className='pad flex-row flex-center gap separate'>
                <div className='flex-row gap'>
                    <span className="button bg-g" onClick={handleAddQuestion}>Add Question</span>
                </div>
               
                <Link 
                    to={`/room/${roomId}`} 
                    className="button bg-o"
                    state={{ questions, roomId, isTeacher }}
                >
                    Create Classroom
                </Link>
            </div>
        </div>

        </>
    )
}