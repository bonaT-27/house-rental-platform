import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { houseSchema, HouseFormData } from '../schemas/houseSchema'; // Removed defaultHouseValues
import { useState } from 'react';

// Import CSS with proper type declaration
import './AddHouseForm.css';

interface AddHouseFormProps {
  onSuccess?: (data: HouseFormData) => void;
  onCancel?: () => void;
}

export function AddHouseForm({ onSuccess, onCancel }: AddHouseFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
    watch,
  } = useForm<HouseFormData>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      title: '',
      price: 0,
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      imageUrl: '',
      isAvailable: true,
      description: '',
    },
    mode: 'onChange',
  });

  const watchPrice = watch('price');
  const watchIsAvailable = watch('isAvailable');

  const onSubmit = (data: HouseFormData) => {
    console.log('✅ Form submitted with validated data:', data);
    setSubmitSuccess(true);
    
    if (onSuccess) {
      onSuccess(data);
    }
    
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleReset = () => {
    reset({
      title: '',
      price: 0,
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      imageUrl: '',
      isAvailable: true,
      description: '',
    });
    setSubmitSuccess(false);
  };

  const showPriceWarning = watchPrice > 5000 && watchIsAvailable;

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>🏠 Add New Property</h2>
        <p>List your property for rent</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          ✓ Property successfully added! You can add another property.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">
            Property Title *
            <span className="required-star">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Luxury Beachfront Villa"
            {...register('title')}
            className={errors.title ? 'error' : ''}
            autoComplete="off"
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
          <small className="hint">3-100 characters</small>
        </div>

        {/* Price Field */}
        <div className="form-group">
          <label htmlFor="price">
            Price per night (USD) *
          </label>
          <input
            id="price"
            type="number"
            step="1"
            placeholder="e.g., 299"
            {...register('price', { valueAsNumber: true })}
            className={errors.price ? 'error' : ''}
          />
          {errors.price && (
            <span className="error-message">{errors.price.message}</span>
          )}
          {showPriceWarning && (
            <span className="warning-message">
              ⚠️ Note: Houses over $5000/night must be marked as unavailable for pre-booking
            </span>
          )}
          <small className="hint">Maximum $10,000 per night</small>
        </div>

        {/* Location Field */}
        <div className="form-group">
          <label htmlFor="location">
            Location *
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g., Malibu, CA"
            {...register('location')}
            className={errors.location ? 'error' : ''}
            autoComplete="off"
          />
          {errors.location && (
            <span className="error-message">{errors.location.message}</span>
          )}
        </div>

        {/* Bedrooms Field */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bedrooms">
              Bedrooms *
            </label>
            <input
              id="bedrooms"
              type="number"
              step="1"
              min="1"
              max="10"
              {...register('bedrooms', { valueAsNumber: true })}
              className={errors.bedrooms ? 'error' : ''}
            />
            {errors.bedrooms && (
              <span className="error-message">{errors.bedrooms.message}</span>
            )}
          </div>

          {/* Bathrooms Field */}
          <div className="form-group">
            <label htmlFor="bathrooms">
              Bathrooms *
            </label>
            <input
              id="bathrooms"
              type="number"
              step="0.5"
              min="0.5"
              max="5"
              {...register('bathrooms', { valueAsNumber: true })}
              className={errors.bathrooms ? 'error' : ''}
            />
            {errors.bathrooms && (
              <span className="error-message">{errors.bathrooms.message}</span>
            )}
          </div>
        </div>

        {/* Image URL Field */}
        <div className="form-group">
          <label htmlFor="imageUrl">
            Image URL *
          </label>
          <input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/house-image.jpg"
            {...register('imageUrl')}
            className={errors.imageUrl ? 'error' : ''}
            autoComplete="off"
          />
          {errors.imageUrl && (
            <span className="error-message">{errors.imageUrl.message}</span>
          )}
          <small className="hint">Enter a valid URL for the property image</small>
        </div>

        {/* Availability Checkbox */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register('isAvailable')}
              disabled={watchPrice > 5000}
            />
            <span>Available for immediate booking</span>
          </label>
          {watchPrice > 5000 && (
            <span className="info-message">
              🔒 Luxury properties over $5000 cannot be marked as available
            </span>
          )}
          {errors.isAvailable && (
            <span className="error-message">{errors.isAvailable.message}</span>
          )}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your property's unique features, amenities, and nearby attractions..."
            {...register('description')}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
          <small className="hint">Maximum 500 characters</small>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting || !isDirty}
            className="btn-primary"
          >
            {isSubmitting ? 'Adding...' : '➕ Add Property'}
          </button>
        </div>

        {/* Form Status */}
        <div className="form-status">
          {!isDirty && (
            <span className="info-message">📝 Fill in the form to add a new property</span>
          )}
          {isDirty && !isValid && (
            <span className="warning-message">⚠️ Please fix the validation errors above</span>
          )}
          {isDirty && isValid && (
            <span className="success-message">✓ Form is ready to submit</span>
          )}
        </div>
      </form>
    </div>
  );
}