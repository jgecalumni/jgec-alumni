import Auth from '@/components/Auth/Auth'
import SectionHeader from '@/components/section-header' 
import React from 'react'

const Page = () => {
  return (
    <>
      <section className='w-full h-auto'>
        {/* Membership Banner */} 
        <SectionHeader
          highlightTitle="Membership"
          normalTitle="Form"
          description="Register here to join our alumni association."
          />
        <Auth />
      </section>
    </>
  )
}

export default Page
