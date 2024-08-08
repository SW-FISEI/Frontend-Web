import React from 'react'

const sugerencias = () => {
  return (
    <div className='h-screen'>
      <div className='grid grid-cols-6 grid-rows-4 w-full h-full'>
        <div className='col-span-6 flex items-center ml-[10%]'>
          <h1 className='uppercase font-extrabold text-6xl'>Sugerencias</h1>
        </div>
        <div className='col-start-2 row-start-2'>
          <form action="">
            <label className='font-bold' htmlFor="sugerencia">Sugerencia</label>
            <textarea className='border border-[#e9e9e9] rounded-lg' name="sugerencia" id="sugerencia"></textarea>
          </form>
        </div>
        <div className='col-start-6 row-start-4 flex items-center justify-center'>
          <button className='border rounded-2xl px-5 py-2 text-white bg-[#450a0a]'>Enviar</button>
        </div>
      </div>
    </div>
  )
}

export default sugerencias