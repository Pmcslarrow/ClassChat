import { useState } from "react";
import Logo from "./Logo";

interface Question {
    question: string;
    answer: string;
}

export default function NewClassroom() {
    const [questions, setQuestions] = useState<Question[]>()

    return (
        <>
        <Logo />
        <div className="flex-col">
            <h2>Discussion Question:</h2>
            <textarea />
            <h2>The Answer:</h2>
            <input className="input-box"></input>
        </div>
        </>
    )
}