import React from 'react'

import{PiStarFill,PiStarHalfFill,PiStar} from 'react-icons/pi'


const Rating = ({rating = 0}) => {

  const fullStars =Math.floor(rating)
  const halfStars = rating%1 >=0.5
  const emptyStars = 5-fullStars-(halfStars ? 1 : 0);

  return (
    <div className='flex items-center'>
        {/* full stars */}
       {Array(fullStars).fill(
        <PiStarFill className='text-yellow-400 w-5 h-5 hover:text-yellow-600'/>
       )}
       {/* half stars */}
       {halfStars && <PiStarHalfFill className='text-yellow-400 w-5 h-5 hover:text-yellow-600'/>}
       {Array(emptyStars).fill(
        <PiStar  className='text-yellow-400 w-5 h-5 hover:text-yellow-600'/>
       )}
    </div>
  )
}

export default Rating
