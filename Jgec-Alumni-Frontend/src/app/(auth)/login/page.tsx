import Auth from '@/components/Auth/Auth'
import Login from '@/components/Auth/Login'
import SectionHeader from '@/components/section-header' 
import React from 'react'

const Page = () => {
  return (
    <>
      <section className='w-full h-auto'>
        {/* Membership Banner */} 
        <SectionHeader
          highlightTitle="Login"
          normalTitle="Form"
          description="Login here to join our alumni association."
          />
        <Login />
      </section>
    </>
  )
}

export default Page
