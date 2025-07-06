import React from 'react';

const Loader = () => {
  return (
    <div className='w-full h-full fixed flex justify-center items-center bg-gray-100 z-10'>
      <div className="custom-loader" />
    </div>
  );
};

export default Loader;