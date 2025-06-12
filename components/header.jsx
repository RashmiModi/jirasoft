import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './user-menu'
import  {checkUser}  from '@/lib/checkUser'
import UserLoading from '@/components/user-loading'
const Header = async() => {
  await checkUser();
  return (
    <header className="bg-black shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={200}
            height={50}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/project/create">
            <Button className="bg-purple-500 text-white hover:bg-blue-600 flex items-center gap-1">
              <PenBox size={18} />
              <span>Create Project</span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton  forceRedirectUrl='/onboarding' >
          
              <Button variant={"outline"} className="bg-white text-white hover:bg-gray-100">
                Sign In</Button>
            </SignInButton>
           
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
      <UserLoading />
    </header>
  )
}

export default Header