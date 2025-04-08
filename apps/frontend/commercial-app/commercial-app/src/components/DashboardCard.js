"use client";

import { useRef, useEffect } from 'react';

const DashboardCard = ({ title, items = [] }) => {
  const listRef = useRef(null);

  // Effet pour simuler le défilement
  useEffect(() => {
    if (items.length > 0 && listRef.current) {
      const scrollHeight = listRef.current.scrollHeight;
      const height = listRef.current.clientHeight;
      
      if (scrollHeight > height) {
        // Ajouter un léger délai pour le défilement
        setTimeout(() => {
          listRef.current.scrollTop = 10;
        }, 1000);
      }
    }
  }, [items]);

  return (
    <div className="bg-card-bg p-6 rounded-lg shadow-sm border border-border-color">
      <h3 className="text-lg font-semibold mb-4 text-text-primary border-b border-border-color pb-2">{title}</h3>
      
      <div 
        ref={listRef}
        className="overflow-y-auto max-h-[200px] space-y-1 pr-2"
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="py-2 border-b border-border-color last:border-b-0 text-text-primary hover:bg-secondary px-2 rounded transition-colors">
              {item}
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-center py-8">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard; 