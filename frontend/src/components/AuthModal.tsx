
import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = isRegister
        ? await api.register(name, email, password)
        : await api.login(email, password);

      login(data.user, data.token);
onClose();

if (data.user.role === 'ADMIN') {
  window.location.href = '/admin';
}
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#f8f7f3] p-8 shadow-2xl sm:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#55534d] hover:text-black"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="mb-3 text-xs tracking-[0.2em] text-[#b18b4d]">
          WELCOME TO SHOPSPHERE
        </p>

        <h2 className="display-font mb-2 text-3xl text-[#25241f]">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        <p className="mb-8 text-sm text-[#77736b]">
          {isRegister
            ? 'Create an account to enjoy a seamless shopping experience.'
            : 'Sign in to continue your shopping experience.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="mb-2 block text-xs tracking-wider text-[#55534d]">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full border border-[#dedad1] bg-white px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs tracking-wider text-[#55534d]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-[#dedad1] bg-white px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-wider text-[#55534d]">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={isRegister ? 8 : undefined}
              className="w-full border border-[#dedad1] bg-white px-4 py-3 text-sm outline-none focus:border-[#b18b4d]"
              placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#25241f] py-3.5 text-xs tracking-[0.18em] text-white transition-colors hover:bg-[#b18b4d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'PLEASE WAIT...'
              : isRegister
                ? 'CREATE ACCOUNT'
                : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#77736b]">
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-medium text-[#a17b40] hover:underline"
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
