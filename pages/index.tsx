import type { NextPage } from "next"
import Link from "next/link"


const Home : NextPage = () => {

  return(
    <div>
      <h1 className="bg-red-500">Hello World!</h1>
      <Link href='/enter'>Enter</Link>
    </div>
  )
}

export default Home