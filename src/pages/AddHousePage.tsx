import { useNavigate } from 'react-router-dom';
import { AddHouseForm } from '../components/AddHouseForm';
import { HouseFormData } from '../schemas/houseSchema';
import { useHouseStore } from '../store/houseStore';

export default function AddHousePage() {
  const navigate = useNavigate();
  const addHouse = useHouseStore((state) => state.addHouse);
  
  const handleSuccess = async (data: HouseFormData) => {
    await addHouse(data);
    navigate('/rentals');
  };
  
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Add New Property</h1>
      <AddHouseForm onSuccess={handleSuccess} onCancel={() => navigate('/rentals')} />
    </div>
  );
}