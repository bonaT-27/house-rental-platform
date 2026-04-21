import { useState } from 'react';
import { useHouseValidation } from '../hooks/useHouseValidation';
import { HouseFormData, defaultHouseValues } from '../schemas/houseSchema';

export function HouseForm() {
  const { errors, validateForm, clearErrors } = useHouseValidation();
  const [formData, setFormData] = useState<Partial<HouseFormData>>(defaultHouseValues);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const isValid = validateForm(formData);
    if (isValid) {
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  const handleChange = (field: keyof HouseFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New House</h2>
      
      {submitSuccess && (
        <div style={{ color: 'green', padding: '10px', marginBottom: '10px', backgroundColor: '#e6f7e6' }}>
          ✓ House added successfully!
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label>Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          style={{ width: '100%', padding: '8px', border: errors.title ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.title && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Price per night *</label>
        <input
          type="number"
          value={formData.price || ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value))}
          style={{ width: '100%', padding: '8px', border: errors.price ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.price && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.price}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Location *</label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          style={{ width: '100%', padding: '8px', border: errors.location ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.location && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.location}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Bedrooms *</label>
        <input
          type="number"
          value={formData.bedrooms || ''}
          onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
          style={{ width: '100%', padding: '8px', border: errors.bedrooms ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.bedrooms && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.bedrooms}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Bathrooms *</label>
        <input
          type="number"
          step="0.5"
          value={formData.bathrooms || ''}
          onChange={(e) => handleChange('bathrooms', parseFloat(e.target.value))}
          style={{ width: '100%', padding: '8px', border: errors.bathrooms ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.bathrooms && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.bathrooms}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Image URL *</label>
        <input
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          style={{ width: '100%', padding: '8px', border: errors.imageUrl ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.imageUrl && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.imageUrl}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="checkbox"
            checked={formData.isAvailable || false}
            onChange={(e) => handleChange('isAvailable', e.target.checked)}
          />
          Available for booking
        </label>
        {errors.isAvailable && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.isAvailable}</div>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Description (optional)</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px', border: errors.description ? '1px solid red' : '1px solid #ccc' }}
        />
        {errors.description && <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.description}</div>}
      </div>

      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Submit House
      </button>
    </form>
  );
}