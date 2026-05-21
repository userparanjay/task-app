import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/layout/AuthLayout';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage, getValidationErrors } from '../../utils/errors';
import { validateLogin } from '../../utils/validation';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const validation = validateLogin(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      const fieldErrors = getValidationErrors(err);
      if (fieldErrors) {
        setErrors(fieldErrors);
      }
      setApiError(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your TaskFlow account">
      {searchParams.get('session') === 'expired' && (
        <Alert variant="warning" className="mb-4">
          Your session has expired. Please sign in again.
        </Alert>
      )}
      {apiError && (
        <Alert variant="error" className="mb-4" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@company.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
