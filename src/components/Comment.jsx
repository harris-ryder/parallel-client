import React from 'react'



function formatISODate(isoString) {
  // Convert ISO string to Date object
  const date = new Date(isoString);

  // Extract components
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  // Format the string
  const formattedDate = `${hours}:${formattedMinutes}${ampm} ${month} ${day}`;

  return formattedDate;
}

// Example usage:
const isoString = new Date().toISOString();
console.log(formatISODate(isoString)); // Output example: '3:54pm Apr 10'

export function Comment({ comment, key }) {

  let { name, description, date, maps } = comment


  return (
    <div key={key} className='comment'>
      <div className='comment-header'>
        <div className='profile-pic'></div>
        <div className='comment-info'>
          <h3 className='comment-name'>{name}</h3>
          <p className='comment-date'>{formatISODate(date)}</p>
        </div>
      </div>
      <p className='comment-description'>{description}</p>
    </div>
  )
}

