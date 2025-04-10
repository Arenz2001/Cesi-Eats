import React from 'react';

const Categories = ({ name, image, description, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            window.location.href = `/restaurants?cuisine=${name}`;
        }
    };

    return (
        <div 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer w-64"
            onClick={handleClick}
        >
            <div className="h-36 relative">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 text-center">
                <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
};

export default Categories;