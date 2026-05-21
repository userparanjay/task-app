import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/layout/AuthLayout';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage, getValidationErrors } from '../../utils/errors';
import { validateSignup } from '../../utils/validation';

export default function SignupPage() {
  const { signup, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (!authLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const validation = validateSignup(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const fieldErrors = getValidationErrors(err);
      if (fieldErrors) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      setApiError(getErrorMessage(err, 'Signup failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Get started with TaskFlow">
      {apiError && (
        <Alert variant="error" className="mb-4" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@company.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Min. 6 characters"
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
