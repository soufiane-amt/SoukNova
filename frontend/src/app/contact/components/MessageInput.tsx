'use client';

import { useState } from 'react';
import { poppins } from '@/layout';
import { CircularProgress } from '@mui/material';
import { MessageForm, MessageSchema } from '../schemas/messageSchema';

const inputClass = `text-md border py-2 px-4 rounded-md border-[#CBCBCB] ${poppins.className}`;

function MessageInput() {
  const [form, setForm] = useState<MessageForm>({
    firstName: '',
    lastName: '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof MessageForm, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof MessageForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccess(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    setSuccess(false);

    const result = MessageSchema.safeParse(form);
    if (!result.success) {
      const zodErrors: Partial<Record<keyof MessageForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof MessageForm;
        zodErrors[key] = issue.message;
      }
      setErrors(zodErrors);
      return;
    }

    // mock sending
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setSuccess(true);
      setForm({ firstName: '', lastName: '', message: '' });
    } catch (err) {
      setErrors({ message: 'Failed to send message, try again later ' + err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-5 md:w-3/5"
      data-aos="fade-right"
      data-aos-delay="200"
    >
      <div>
        <div className="flex flex-col mb-4">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            placeholder="First name"
            className={inputClass}
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={loading}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && (
            <p id="firstName-error" className="text-xs text-red-600 mt-1">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            placeholder="Last name"
            className={inputClass}
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={loading}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && (
            <p id="lastName-error" className="text-xs text-red-600 mt-1">
              {errors.lastName}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            MESSAGE
          </label>
          <textarea
            placeholder="Your message"
            className={`${inputClass} h-32 resize-y`}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            disabled={loading}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-red-600 mt-1">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold flex items-center justify-center disabled:opacity-60`}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: 'white' }} />
          ) : (
            'Send Message'
          )}
        </button>
        {success && (
          <p className="text-sm text-green-600 mt-2">
            Thanks — your message was sent.
          </p>
        )}
      </div>
    </form>
  );
}

export default MessageInput;
