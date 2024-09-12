import { Link } from "react-router-dom";
import Logo from "./Logo";

function App() {
  return (
    <>
        <Logo />

        <div id='button_classroom_wrapper' className='flex-col flex-center'>
            <div className='flex-row flex-center gap'>
                <Link to='/new' id='new_class'>NEW CLASSROOM</Link>
                <Link to='/join' id='new_class'>JOIN CLASSROOM</Link>
            </div>
        </div>
    </>
  )
}

export default App
