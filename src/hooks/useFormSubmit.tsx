import { useDispatch } from 'react-redux';
import toBase64 from '../utils/toBase64';
import { addSubmission } from '../store/submissionsSlice';

type FormSubmitType = {
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  image: File;
  terms: boolean;
};

function useFormSubmit (onClose: () => void) {
      const dispatch = useDispatch();

      async function submitForm(data: FormSubmitType) {
        const imageBase64 = await toBase64(data.image);
        dispatch(
            addSubmission({
            name: data.name,
            age: data.age,
            email: data.email,
            gender: data.gender,
            terms: data.terms,
            country: data.country,
            image: imageBase64,
            })
        );
        onClose();
      }

    return submitForm;
}

export default useFormSubmit ;