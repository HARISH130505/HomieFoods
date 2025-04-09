import React from 'react'

const Map = () => {
  return (
    <div>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.2500%2C13.0300%2C80.2900%2C13.0900&layer=mapnik&marker=13.0827%2C80.2707"
          width="100%"
          height="600"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className='rounded-xl'
        ></iframe>
    </div>
  )
}

export default Map