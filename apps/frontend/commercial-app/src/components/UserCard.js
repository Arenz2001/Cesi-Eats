"use client";

const UserCard = ({ name, email, onModify, onSuspend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-gray-600 mb-4">{email}</p>
      
      <div className="flex justify-between mt-2">
        <button 
          onClick={onModify}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Modify
        </button>
        
        <button 
          onClick={onSuspend}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Suspend
        </button>
      </div>
    </div>
  );
};

export default UserCard; 