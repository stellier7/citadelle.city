import { Link } from 'react-router-dom';
import { EscrowProject } from '../types';

interface EscrowCardProps {
  project: EscrowProject;
}

export const EscrowCard = ({ project }: EscrowCardProps) => {
  const percentageFunded = (project.currentAmount / project.targetAmount) * 100;

  return (
    <div className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white font-display">{project.name}</h3>
          <div className="text-sm text-gray-400">
            ${project.targetAmount.toLocaleString()}
          </div>
        </div>
        
        <div className="h-0.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${percentageFunded}%` }}
          />
        </div>

        <div className="max-h-0 group-hover:max-h-[500px] overflow-hidden transition-all duration-700 ease-in-out">
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Raised:</span>
                      <span className="text-white font-medium">${project.currentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="text-red-400 font-medium">
                        {percentageFunded.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-2">
                  <Link to={`/escrow/${project.id}`} className="flex-1">
                    <button
                      className="w-full btn btn-secondary"
                    >
                      Learn More
                    </button>
                  </Link>
                  <button
                    className="w-full btn btn-primary flex-1"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 