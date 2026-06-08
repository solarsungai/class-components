import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import schema from '../validation/schema';
import useCountryAutocomplete from '../hooks/useCountryAutocomplete';
import useFormSubmit from '../hooks/useFormSubmit';

type FormData = z.infer<typeof schema>;

function RHFForm({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, setValue, control, watch, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const passwordValue = watch('password', '');

  const hasNumber = /\d/.test(passwordValue);
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);
  const isPasswordDirty = passwordValue.length > 0;

  const { countryInput, setCountryInput, filteredCountries } = useCountryAutocomplete();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const submitForm = useFormSubmit(onClose);

  async function onSubmit(data: FormData) {
    await submitForm(data);
    reset();
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
        <label htmlFor="age">Age</label>
        <input type="number" id="age" {...register('age')} />
        {errors.age && <span className="error">{errors.age.message}</span>}
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register('gender')}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <span className="error">{errors.gender.message}</span>}
        <label htmlFor="terms">Terms</label>
        <input type="checkbox" id="terms" {...register('terms')} />
        {errors.terms && <span className="error">{errors.terms.message}</span>}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
        {isPasswordDirty && (
          <div className="password-indicators">
            {!hasNumber && <span className="error">Password should contain minimum one number</span>}
            {!hasUppercase && <span className="error">Password should contain minimum one uppercase letter</span>}
            {!hasLowercase && <span className="error">Password should contain minimum one lowercase letter</span>}
            {!hasSpecial && <span className="error">Password should contain minimum one special char</span>}
          </div>
        )}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" {...register('confirmPassword')} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        <label htmlFor="country">Country</label>
        <div className="autocomplete-wrapper">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="country"
                autoComplete="off"
                placeholder="Type to search country..."
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => {
                  field.onBlur();
                  setTimeout(() => setIsDropdownOpen(false), 200);
                }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setCountryInput(e.target.value);
                  setIsDropdownOpen(true);
                }}
              />
            )}
          />
          {isDropdownOpen && countryInput.trim() !== '' && filteredCountries.length > 0 && (
            <ul className="suggestions-list" style={{ position: 'absolute', width: '100%', zIndex: 10 }}>
              {filteredCountries.map((country) => (
                <li
                  key={country}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setValue('country', country, { shouldValidate: true });
                    setCountryInput(country);
                    setIsDropdownOpen(false);
                  }}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.country && <span className="error">{errors.country.message}</span>}
        <label htmlFor="image">Image</label>
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, onBlur, ref } }) => (
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              onBlur={onBlur}
              ref={ref}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file);
                }
              }}
            />
          )}
        />
        {errors.image && <span className="error">{errors.image.message}</span>}
        <button type="submit" disabled={!isValid} className="submit-button">
          Submit
        </button>
      </form>
  );
}

export default RHFForm;
