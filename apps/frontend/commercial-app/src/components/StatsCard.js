"use client";

const StatsCard = ({ title, stats = {} }) => {
  return (
    <div className="bg-card-bg p-6 rounded-lg shadow-sm border border-border-color">
      <h3 className="text-xl font-semibold mb-6 text-text-primary border-b border-border-color pb-2">{title}</h3>
      
      <div className="space-y-4">
        {Object.entries(stats).map(([key, value], index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-border-color last:border-b-0">
            <span className="text-text-secondary font-medium">{key} :</span>
            <span className="text-lg font-medium text-text-primary bg-secondary px-3 py-1 rounded">{value}</span>
          </div>
        ))}
        
        {Object.keys(stats).length === 0 && (
          <p className="text-text-secondary text-center py-8">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 