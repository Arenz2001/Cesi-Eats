import React from 'react';
import Image from 'next/image';
const Categories = ({ name, image }) => {
    return (
        <div className="m-6 p-4 bg-orange-100 rounded-lg text-center h-48">
            <h2 className="mt-2 text-lg font-bold">{name}</h2>
            <img src={image} alt={name} className="w-48 h-24 mx-auto mt-6" />
        </div>
    );
};

export default Categories;