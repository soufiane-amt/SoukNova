'use client';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { inter, poppins } from '@/layout';

const inputClass = `text-md border py-2 px-4 rounded-md border-[#CBCBCB]`;

function AccountDetailsForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (formData.newPassword !== formData.repeatNewPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    const payload: Record<string, string> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-5 md:w-3/5 md:w-4/5 w-full px-[72px] max-lg:px-[32px] max-md:px-0 max-md:pt-10"
      data-aos="zoom-in"
      data-aos-delay="50"
    >
      {/* Account Details */}
      <div data-aos="fade-right" data-aos-delay="100">
        <p className={`${inter.className} font-semibold text-xl mt-10 mb-5`}>
          Account Details
        </p>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-left"
          data-aos-delay="50"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            name="firstName"
            placeholder="First name"
            className={inputClass}
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            name="lastName"
            placeholder="Last name"
            className={inputClass}
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-left"
          data-aos-delay="150"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password Section */}
      <div data-aos="fade-right" data-aos-delay="200">
        <p className={`${inter.className} font-semibold text-xl mt-10 mb-5`}>
          Password
        </p>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-left"
          data-aos-delay="250"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            OLD PASSWORD
          </label>
          <input
            name="oldPassword"
            type="password"
            placeholder="Old password"
            className={inputClass}
            value={formData.oldPassword}
            onChange={handleChange}
          />
        </div>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-right"
          data-aos-delay="300"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            NEW PASSWORD
          </label>
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            className={inputClass}
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div
          className="flex flex-col mb-8"
          data-aos="fade-left"
          data-aos-delay="350"
        >
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            REPEAT NEW PASSWORD
          </label>
          <input
            name="repeatNewPassword"
            type="password"
            placeholder="Repeat new Password"
            className={inputClass}
            value={formData.repeatNewPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div data-aos="zoom-in" data-aos-delay="400">
        <button
          type="submit"
          disabled={loading}
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold disabled:opacity-50`}
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* Feedback messages */}
      {error && (
        <p className="text-red-600 font-semibold mt-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 font-semibold mt-4">{success}</p>
      )}
    </form>
  );
}

export default AccountDetailsForm;
