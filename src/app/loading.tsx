import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = (props) => (
  <div className="h-screen w-full flex flex-col justify-center items-center">
    <FiLoader className="mx-auto size-12 animate-spin" />
  </div>
);

export default Loading;
