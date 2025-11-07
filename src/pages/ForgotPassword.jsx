import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ForgotPassword = () => {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - NeoAI</title>
        <meta name="description" content="Reset your NeoAI account password" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0573AC] via-[#013353] to-[#0573AC] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Link to="/" className="text-3xl font-bold text-[#0573AC]">
                NeoAI
              </Link>
              <h1 className="text-2xl font-bold text-[#013353] mt-4 mb-2">
                {emailSent ? 'Check your email' : 'Forgot Password'}
              </h1>
              <p className="text-gray-600">
                {emailSent 
                  ? 'We\'ve sent password reset instructions to your email address.'
                  : 'Enter your email address and we\'ll send you instructions to reset your password.'}
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>

                <div className="text-center text-sm">
                  <Link
                    to="/login"
                    className="text-[#0573AC] hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800">
                    If an account exists with <strong>{email}</strong>, you will receive password reset instructions shortly.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="block text-center btn-primary w-full"
                >
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;

