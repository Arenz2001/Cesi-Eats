import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <footer className='h-[50vh] bg-gray-200'>
            <div className="flex w-2/5  m-auto  pt-24  justify-between ">
                <div className="">
                    <h1 className='pb-6 font-bold text-xl'>Services</h1>
                    <p className='pb-2'><Link href="#" >A propos de nous</Link></p>
                    <p className='pb-2'><Link href="#" >FAQ</Link></p>
                    <p><Link href="#">Contact</Link></p>
                </div>
                <div className="">
                    <h1 className='pb-6 font-bold text-xl'>Legal</h1>
                    <p className='pb-2'><Link href="#" >Politique de confidentialité</Link></p>
                    <p className='pb-2'><Link href="#" >Conditions générales</Link></p>
                    <p><Link href="#" >Politique relative aux cookies</Link></p>
                </div>
                <div className="">
                    <h1 className='pb-6 font-bold text-xl'>Aide</h1>
                    <p><Link href="#" >Politique de retour</Link></p>
                </div>
            </div>
            <div className="w-[90%] border-b-2 border-gray-400 m-auto pt-28"></div>
            <div className="flex items-center justify-center pt-8">
                <p>Copyright © CES'EATS 2025</p>
            </div>
        </footer>
    )
}
