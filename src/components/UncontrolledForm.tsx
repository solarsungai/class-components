import { useState } from 'react';
import schema from '../validation/schema';
import usePasswordStrength from '../hooks/usePasswordStrength';
import useCountryAutocomplete from '../hooks/useCountryAutocomplete';
import useFormSubmit from '../hooks/useFormSubmit';

type UncontrolledFormProps = {
  onClose: () => void;
};

function UncontrolledForm({ onClose }: UncontrolledFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { handlePasswordChange, passwordTouched, passwordStrength } = usePasswordStrength();
  const { countryInput, setCountryInput, filteredCountries, countryInputRef } =
    useCountryAutocomplete();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const submitForm = useFormSubmit(onClose);

  const missingRequirements = [];
  if (passwordTouched) {
    if (!passwordStrength.hasNumber) missingRequirements.push('one number');
    if (!passwordStrength.hasUppercase) missingRequirements.push('one uppercase letter');
    if (!passwordStrength.hasLowercase) missingRequirements.push('one lowercase letter');
    if (!passwordStrength.hasSpecial) missingRequirements.push('one special char');
  }
  const passwordErrorMessage =
    missingRequirements.length > 0
      ? `Password should contain minimum ${missingRequirements.join(', ')}`
      : '';

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const name = formData.get('name') as string;
    const age = formData.get('age');
    const email = formData.get('email');
    const gender = formData.get('gender');
    const terms = formData.get('terms') === 'on';
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const country = formData.get('country');
    const image = formData.get('image') as File;

    const result = schema.safeParse({
      name,
      age,
      email,
      gender,
      terms,
      password,
      confirmPassword,
      country,
      image,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      await submitForm({
        name: result.data.name,
        age: result.data.age,
        email: result.data.email,
        gender: result.data.gender,
        terms: result.data.terms,
        country: result.data.country,
        image: result.data.image,
      });
      setErrors({});
      setCountryInput('');
      formElement.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" />
      {errors.name && <span className="error">{errors.name}</span>}
      <label htmlFor="age">Age</label>
      <input type="number" id="age" name="age" />
      {errors.age && <span className="error">{errors.age}</span>}
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" />
      {errors.email && <span className="error">{errors.email}</span>}
      <label htmlFor="gender">Gender</label>
      <select id="gender" name="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {errors.gender && <span className="error">{errors.gender}</span>}
      <label htmlFor="terms">Terms</label>
      <input type="checkbox" id="terms" name="terms" />
      {errors.terms && <span className="error">{errors.terms}</span>}
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={(e) => handlePasswordChange(e.target.value)}
      />
      {errors.password && <span className="error">{errors.password}</span>}
      <div className={`password-indicators ${passwordErrorMessage ? 'visible' : 'hidden'}`}>
        <span className="error">{passwordErrorMessage}</span>
      </div>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" name="confirmPassword" />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      <label htmlFor="country">Country</label>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          id="country"
          name="country"
          ref={countryInputRef}
          onChange={(e) => {
            setCountryInput(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsDropdownOpen(false), 200);
          }}
          autoComplete="off"
          placeholder="Type to search country..."
        />
        {isDropdownOpen && countryInput.trim() !== '' && filteredCountries.length > 0 && (
          <ul
            className="suggestions-list"
            style={{ position: 'absolute', width: '100%', zIndex: 10 }}
          >
            {filteredCountries.map((country) => (
              <li
                key={country}
                onClick={() => {
                  if (countryInputRef.current) countryInputRef.current.value = country;
                  setCountryInput(country);
                  setIsDropdownOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors.country && <span className="error">{errors.country}</span>}
      <label htmlFor="image">Image</label>
      <input type="file" id="image" name="image" />
      {errors.image && <span className="error">{errors.image}</span>}
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
