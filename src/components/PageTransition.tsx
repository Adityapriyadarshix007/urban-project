import React from 'react';
import Lottie from 'lottie-react';
import transitionAnimation from '../assets/page-transition.json';

const PageTransition = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-90">
      <Lottie
        animationData={transitionAnimation}
        loop={false}
        autoplay
        className="w-64 h-64"
      />
    </div>
  );
};

export default PageTransition;