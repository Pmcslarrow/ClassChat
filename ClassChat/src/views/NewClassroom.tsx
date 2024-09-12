import { useState } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

interface Question {
    question: string;
    answer: string;
}

export default function NewClassroom() {
    const [questions, setQuestions] = useState<Question[]>()

    return (
        <>
        <Logo />
        <div className="flex-col pad">
            <h2>Discussion Question:</h2>
            <textarea id='discussion' placeholder="Enter here..."></textarea>

            <h2>The Answer:</h2>
            <textarea id='answer' placeholder="Enter here..."></textarea>
        </div>
        <div className='flex-col'>
            <div className='pad flex-row flex-center gap separate'>
                <div className='flex-row gap'>
                    <Link to='/' className="button">BACK</Link>
                    <Link to='/' className="button bg-g">NEW QUESTION</Link>
                </div>
               
                <Link to='/' className="button bg-o">CREATE CLASSROOM</Link>
            </div>
        </div>

        </>
    )
}