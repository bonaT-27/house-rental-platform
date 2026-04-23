// Use type-only import for types
import type { PartialBy, HouseUpdateForm as HouseUpdateFormType } from '../types/utilityTypes';
import type { House } from '../types/house';
// Regular import for React
import { useState } from 'react';

interface HouseUpdateFormProps {
  house: PartialBy<House, 'description'>; // description is optional
  onUpdate: (updates: HouseUpdateFormType) => void;
}

export function HouseUpdateForm({ house, onUpdate }: HouseUpdateFormProps) {
  // description can be undefined now
  const [description, setDescription] = useState(house.description ?? '');
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onUpdate({ ...house, description });
    }}>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter property description..."
        />
      </div>
      <button type="submit">Update House</button>
    </form>
  );
}