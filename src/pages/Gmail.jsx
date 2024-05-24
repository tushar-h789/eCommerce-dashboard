import { Link } from "react-router-dom"

const Gmail = () => {
  return (
    <div className="text-center my-[20%]">
        <h2 className="text-2xl ">Go to <Link to='https://mail.google.com/mail/u/0/#inbox' target="_blank"><span className="text-blue-500 font-bold">gmail</span></Link></h2>
    </div>
  )
}

export default Gmail