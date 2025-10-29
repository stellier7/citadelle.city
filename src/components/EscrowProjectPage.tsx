import { useParams, Link } from 'react-router-dom';
import { EscrowProject } from '../types';

interface EscrowProjectPageProps {
    escrowProjects: EscrowProject[];
}

export const EscrowProjectPage = ({ escrowProjects }: EscrowProjectPageProps) => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = escrowProjects.find(p => p.id === projectId);

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Project Not Found</h2>
                    <p className="text-gray-400">We couldn't find the investment opportunity you're looking for.</p>
                    <Link to="/get-in-early" className="mt-6 btn btn-primary">Back to All Investments</Link>
                </div>
            </div>
        );
    }

    const percentageFunded = (project.currentAmount / project.targetAmount) * 100;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="max-w-screen-xl mx-auto p-4 md:p-8">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/get-in-early" className="hover:text-red-400 transition-colors">Investments</Link>
                    <span>/</span>
                    <span className="text-white font-medium">{project.name}</span>
                </nav>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="aspect-video rounded-xl overflow-hidden">
                        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col">
                        <h1 className="text-4xl font-bold font-display text-white mb-2">{project.name}</h1>
                        <p className="text-gray-400 text-lg mb-6">{project.city}</p>
                        
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-red-500" style={{ width: `${percentageFunded}%` }} />
                        </div>
                        <div className="text-sm text-gray-400 mb-6 flex justify-between">
                            <span>{percentageFunded.toFixed(1)}% Funded</span>
                            <span>Target: ${project.targetAmount.toLocaleString()}</span>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed mb-8 flex-grow">{project.description || 'More details about this exciting investment opportunity will be available soon.'}</p>
                        
                        <div className="flex flex-col gap-3">
                            <button className="w-full btn btn-primary text-lg">Invest Now</button>
                            <button className="w-full btn btn-secondary text-lg">Contact Us</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 