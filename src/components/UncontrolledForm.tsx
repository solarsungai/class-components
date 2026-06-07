import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import schema from '../validation/schema';
import toBase64 from '../utils/toBase64';
import { addSubmission } from '../store/submissionsSlice';
import { type RootState } from '../store';

type UncontrolledFormProps = {
  onClose: () => void;
};

function UncontrolledForm({ onClose }: UncontrolledFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });

  const countries = useSelector((state: RootState) => state.countries);
  const [countryInput, setCountryInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countryInput.trim().toLowerCase())
  );

  const dispatch = useDispatch();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const age = formData.get('age');
    const email = formData.get('email');
    const gender = formData.get('gender');
    const terms = (formData.get('terms') === "on");
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
      image
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
      const imageBase64 = await toBase64(result.data.image);
      dispatch(addSubmission({
        name: result.data.name,
        age: result.data.age,
        email: result.data.email,
        gender: result.data.gender,
        terms: result.data.terms,
        country: result.data.country,
        image: imageBase64,
      }));
      onClose();
    }
  };

  function handlePasswordChange(pass: string) {
    setPasswordTouched(true);
    const hasNumber = [...pass].some(char => char !== ' ' && !isNaN(Number(char)));
    const hasUppercase = [...pass].some(char => char !== char.toLowerCase());
    const hasLowercase = [...pass].some(char => char !== char.toUpperCase());
    const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?~`';
    const hasSpecial = [...pass].some(char => specialChars.includes(char));
    setPasswordStrength({hasNumber, hasUppercase, hasLowercase, hasSpecial});
  };

  return (
    <>
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
      <input type="password" id="password" name="password" onChange={(e) => handlePasswordChange(e.target.value)}/>
      {errors.password && <span className="error">{errors.password}</span>}
      {passwordTouched && !passwordStrength.hasNumber && <span className="error">Password should contain minimum one number</span>}
      {passwordTouched && !passwordStrength.hasUppercase && <span className="error">Password should contain minimum one uppercase letter</span>}
      {passwordTouched && !passwordStrength.hasLowercase && <span className="error">Password should contain minimum one lowercase letter</span>}
      {passwordTouched && !passwordStrength.hasSpecial && <span className="error">Password should contain minimum one special char</span>}
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" name="confirmPassword" />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      <label htmlFor="country">Country</label>
        <div className="autocomplete-wrapper" style={{ position: 'relative' }}>
          <input
            type="text"
            id="country"
            name="country"
            value={countryInput}
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
            <ul className="suggestions-list" style={{ position: 'absolute', width: '100%', zIndex: 10 }}>
              {filteredCountries.map((country) => (
                <li
                  key={country}
                  onClick={() => {
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
      <button type="submit" className="submit-button">Submit</button>
    </form>
    </>
  );
}

export default UncontrolledForm;

