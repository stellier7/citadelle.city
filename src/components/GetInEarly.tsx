import { EscrowProject } from '../types';
import { EscrowCard } from './EscrowCard';

interface GetInEarlyProps {
  escrowProjects: EscrowProject[];
}

export const GetInEarly = ({ escrowProjects }: GetInEarlyProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 font-display">
          Get In Early
        </h1>
        <p className="text-xl text-gray-400">
          Be a part of the next big thing. Invest in startup cities and tokenized real-world assets.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {escrowProjects.map((project) => (
          <EscrowCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}; 