import React from 'react';

export default function Button({ variant, children, img, additionalClass }) {
  // Define the CSS classes based on the variant prop
  const getClassForVariant = () => {
    switch (variant) {
      case 1:
        return `${additionalClass} btn`;
      case 2:
        return `${additionalClass} btn btnCta`;
      case 3:
        return `${additionalClass} btn btnGrey`;
      case 4:
        return `${additionalClass} btn btnRed`;
      default:
        return `${additionalClass} btn`; // Default to variant1 if the prop is not 1, 2, 3, or 4
    }
  };

  // Get the CSS class based on the variant prop
  const buttonClass = getClassForVariant();

  return (
    <div className='btnGroup'>
      
      <button className={buttonClass} style={img ? { paddingRight: '30px' } : {}}>
        {children}
      </button>
      {img && <img src={img} className='btnIcon' />}
    </div>
  );
}
