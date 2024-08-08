import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const titulos = () => {
  return (
    <div className='h-screen'>
      <div className='grid grid-cols-4 grid-rows-8 w-full h-full'>
        <div className='row-start-1 col-start-1 col-span-4 flex items-center ml-[10%]'>
          <h1 className='uppercase font-bold text-6xl font-sans'>Titulos</h1>
        </div>
        <div className='row-start-2 col-start-1 col-span-3 relative ml-[4%] flex items-center justify-center'>
          <input className='border border-[#d2cdd2] rounded-xl placeholder:text-[#d2cdd2] pl-10 w-full py-2 shadow-md' type="text" placeholder='Buscar' />
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d2cdd2]" />
        </div>
        <div className='row-start-2 col-start-4 flex items-center justify-center'>
          <button className='rounded-2xl px-5 py-2 text-white bg-[#450a0a] inline-block shadow-md shadow-[#4c2626]'>Nuevo <Icon className='inline-block' icon="lucide:plus" /></button>
        </div>
        <div className='row-start-3 row-span-4 col-start-1 col-span-4'>
          <table>
            <thead>

            </thead>
          </table>
          <tbody>

          </tbody>
        </div>
      </div>
    </div>
  )
}

export default titulos