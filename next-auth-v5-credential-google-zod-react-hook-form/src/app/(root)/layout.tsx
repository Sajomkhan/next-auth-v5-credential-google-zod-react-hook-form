import Navbar from "@/components/Navbar"
import { auth } from "@/auth"

const Layout = async ({children}: {children:React.ReactNode}) => {
  const session = await auth()
  return (
    <div className='flex flex-col gap-4'>
        <Navbar session={session}/>
        {children}
    </div>
  )
}

export default Layout