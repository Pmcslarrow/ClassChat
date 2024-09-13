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
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        console.log(questions)
    }, [questions])

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
            if (currentQuestion && currentAnswer) {
                let newEntry: Entry = {
                    question: currentQuestion,
                    answer: currentAnswer
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
            <tr>
                <th>Questions</th>
                <th>Answers</th>
                <th>Actions</th>
            </tr>
            {tableQuestions}
        </table>

        <div className='flex-col'>
            <div className='pad flex-row flex-center gap separate'>
                <div className='flex-row gap'>
                    <span className="button bg-g" onClick={handleAddQuestion}>Add Question</span>
                </div>
               
                <Link to='/new' className="button bg-o">Create Classroom</Link>
            </div>
        </div>

        </>
    )
}