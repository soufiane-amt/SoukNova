import { poppins } from '@/layout';

const inputClass = `text-md border py-2 px-4 rounded-md border-[#CBCBCB] ${poppins.className}`;

function MessageInput() {
  return (
    <div className="my-5 md:w-3/5" data-aos="fade-right" data-aos-delay="200">
      <div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input placeholder="First name" className={inputClass} />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input placeholder="Last name" className={inputClass} />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            MESSAGE
          </label>
          <input placeholder="Your message" className={inputClass} />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold`}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
