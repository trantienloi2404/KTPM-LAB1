import { useState, ChangeEvent, FormEvent } from 'react';

interface FormHook<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: () => Promise<void>) => (e: FormEvent) => void;
  setFormError: (field: keyof T, message: string) => void;
  clearErrors: () => void;
  resetForm: () => void;
}

const useForm = <T extends Record<string, any>>(initialValues: T): FormHook<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear error when field is modified
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = (onSubmit: () => Promise<void>) => async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const setFormError = (field: keyof T, message: string) => {
    setErrors({
      ...errors,
      [field]: message,
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setValues(initialValues);
    clearErrors();
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFormError,
    clearErrors,
    resetForm,
  };
};

export default useForm;