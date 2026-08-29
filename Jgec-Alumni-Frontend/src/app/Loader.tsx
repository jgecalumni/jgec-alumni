
import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading: React.FC = () => {
    return (
        <section className='w-full min-h-screen h-full flex items-center justify-center'>
            <Loader2 className="animate-spin text-primary" size={40} />
        </section>
    )
}

export default Loading
