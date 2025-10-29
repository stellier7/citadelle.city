import { useState } from 'react';
import { EscrowProject as EscrowProjectType } from '../types';

interface EscrowProjectProps {
  project: EscrowProjectType;
  onInvest: (amount: number) => void;
}

export const EscrowProject: React.FC<EscrowProjectProps> = ({ project, onInvest }) => {
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const progress = (project.currentAmount / project.targetAmount) * 100;
  const daysLeft = Math.ceil((project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    if (!isNaN(amount) && amount > 0) {
      onInvest(amount);
      setInvestmentAmount('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {project.city}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-900">
                ${project.currentAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time Left</span>
            <span className="font-medium text-gray-900">{daysLeft} days</span>
          </div>

          {project.status === 'active' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Investment amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleInvest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Invest
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Note: If the project doesn't reach its goal by the deadline, your investment will be returned.
              </p>
            </div>
          )}

          {project.status === 'completed' && (
            <div className="text-green-600 font-medium">Project successfully funded!</div>
          )}

          {project.status === 'failed' && (
            <div className="text-red-600 font-medium">Project did not reach its goal. Funds have been returned.</div>
          )}
        </div>
      </div>
    </div>
  );
}; 