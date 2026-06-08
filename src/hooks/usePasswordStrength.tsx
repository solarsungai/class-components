import { useState } from 'react';

function usePasswordStrength() {
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        hasNumber: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSpecial: false,
    });

    function handlePasswordChange(pass: string) {
        setPasswordTouched(true);
        const hasNumber = [...pass].some((char) => char !== ' ' && !isNaN(Number(char)));
        const hasUppercase = [...pass].some((char) => char !== char.toLowerCase());
        const hasLowercase = [...pass].some((char) => char !== char.toUpperCase());
        const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?~`';
        const hasSpecial = [...pass].some((char) => specialChars.includes(char));
        setPasswordStrength({ hasNumber, hasUppercase, hasLowercase, hasSpecial });
  }

    return { handlePasswordChange, passwordTouched, passwordStrength };
}

export default usePasswordStrength;