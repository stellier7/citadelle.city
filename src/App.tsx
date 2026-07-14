import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { CityView } from './components/CityView';
import { GetInEarly } from './components/GetInEarly';
import { PropertyPage } from './components/PropertyPage';
import { EscrowProjectPage } from './components/EscrowProjectPage';
import { Developments } from './components/Developments';
import { DevelopmentDetail } from './components/DevelopmentDetail';
import { cities, escrowProjects } from './data';

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Header />
      <main className="bg-black text-white pt-16">
        <Routes>
          <Route path="/" element={<Home cities={cities} />} />
          <Route path="/developments" element={<Developments />} />
          <Route path="/developments/:projectId" element={<DevelopmentDetail />} />
          <Route path="/city/:cityId" element={<CityView cities={cities} escrowProjects={escrowProjects} />} />
          <Route path="/property/:propertyId" element={<PropertyPage cities={cities} />} />
          <Route path="/get-in-early" element={<GetInEarly escrowProjects={escrowProjects} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/escrow/:projectId" element={<EscrowProjectPage escrowProjects={escrowProjects} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;