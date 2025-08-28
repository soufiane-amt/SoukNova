'use client';

import { useLoader } from '../../components/ui/loader/useLoader';
import Loader from '../../components/ui/loader/Loader';
import Traversal from '../../components/ui/Traversal';
import Image from 'next/image';
import CustomButton from '../../components/ui/CustomButton';
import { inter, poppins } from '@/layout';
const promoHighlightImage = '/images/home/fourniture.png';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import BenefitsDisplay from '@/home/components/BenefitsDisplay';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const imageMap = '/images/contact/map.png';

interface ContactData {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const contacts: ContactData[] = [
  {
    title: 'ADDRESS',
    value: '234 Hai Trieu, Ho Chi Minh City, Viet Nam',
    icon: <BusinessOutlinedIcon sx={{ fontSize: 30 }} />,
  },
  {
    title: 'Contact Us',
    value: '+84 234 567 890',
    icon: <LocalPhoneOutlinedIcon sx={{ fontSize: 30 }} />,
  },
  {
    title: 'EMAIL',
    value: 'hello@souknova.com',
    icon: <EmailOutlinedIcon sx={{ fontSize: 30 }} />,
  },
];

function ContactsInfo() {
  return (
    <div className="my-15 text-center" data-aos="fade-up" data-aos-delay="200">
      <p
        className={`${poppins.className} mb-5 font-medium text-4xl`}
        data-aos="fade-up"
      >
        Contact Us
      </p>
      <div className="md:flex justify-between md:space-x-8">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className={`bg-[var(--color-neutral-bg)] flex flex-col items-center text-center p-5 mb-5 flex-1 ${inter.className}`}
            data-aos="fade-up"
            data-aos-delay={`${200 * (index + 1)}`}
          >
            <span>{contact.icon}</span>
            <p className="font-bold text-[var(--color-primary)] font-medium text-md my-1">
              {contact.title}
            </p>
            <p className="font-medium">{contact.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutUsCard() {
  return (
    <div
      className="bg-[var(--color-neutral-bg)] md:flex md:h-[413px]"
      data-aos="fade-up"
    >
      <div className="md:w-1/2 h-full" data-aos="fade-right">
        <Image
          src={promoHighlightImage}
          alt="Highlight promotion"
          width={600}
          height={400}
          className="w-full h-[367px] md:h-full"
        />
      </div>
      <div className="mt-10 p-5 md:w-1/2 md:p-15" data-aos="fade-left">
        <p
          className={`${poppins.className} mb-5 font-medium text-lg md:text-4xl mb-3`}
        >
          About Us
        </p>
        <p className="mb-3 text-[14px]">
          3legant is a gift & decorations store based in HCMC, Vietnam. Est
          since 2019. Our customer service is always prepared to support you
          24/7
        </p>
        <CustomButton label="Shop now" href="/shop" />
      </div>
    </div>
  );
}

function MapLoction() {
  return (
    <div
      className="relative md:w-2/5"
      data-aos="fade-left"
      data-aos-delay="200"
    >
      <Image
        src={imageMap}
        alt="Company location"
        width={500}
        height={500}
        className="max-h-[422.4px] min-h-[422.4px] w-[548px] max-2xl:w-full max-sm:h-[326.5px]"
      />
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width="65"
        height="64"
        viewBox="0 0 65 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32.5 58.6654C41.5 58.6654 56.5 42.1269 56.5 29.0357C56.5 15.9445 45.7548 5.33203 32.5 5.33203C19.2452 5.33203 8.5 15.9445 8.5 29.0357C8.5 42.1269 23.5 58.6654 32.5 58.6654ZM32.5 37.332C36.9183 37.332 40.5 33.7503 40.5 29.332C40.5 24.9138 36.9183 21.332 32.5 21.332C28.0817 21.332 24.5 24.9138 24.5 29.332C24.5 33.7503 28.0817 37.332 32.5 37.332Z"
          fill="#141718"
        />
        <circle cx="32.5" cy="29.6523" r="20" fill="#141718" />
        <path
          d="M40.5 29.6523V35.6523C40.5 37.8615 38.7091 39.6523 36.5 39.6523H28.5C26.2909 39.6523 24.5 37.8615 24.5 35.6523V29.6523"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M37.2688 19.6523H27.7313C25.9139 19.6523 24.2797 20.8971 23.6047 22.7954L22.8467 24.9272C22.6173 25.5725 22.4587 26.2631 22.626 26.9272C23.0224 28.5001 24.3083 29.6523 25.8334 29.6523C27.6743 29.6523 29.1667 27.9734 29.1667 25.9023C29.1667 27.9734 30.6591 29.6523 32.5 29.6523C34.341 29.6523 35.8334 27.9734 35.8334 25.9023C35.8334 27.9734 37.3257 29.6523 39.1667 29.6523C40.6918 29.6523 41.9777 28.5001 42.374 26.9272C42.5414 26.2631 42.3828 25.5725 42.1533 24.9272L41.3953 22.7954C40.7204 20.8971 39.0861 19.6523 37.2688 19.6523Z"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M29.5 36.6523C29.5 34.9955 30.8431 33.6523 32.5 33.6523C34.1569 33.6523 35.5 34.9955 35.5 36.6523V39.6523H29.5V36.6523Z"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MessageInput() {
  return (
    <div className="my-5 md:w-3/5" data-aos="fade-right" data-aos-delay="200">
      <div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            FIRST NAME
          </label>
          <input
            placeholder="First name"
            className={`text-md border py-2 px-4 rounded-md border border-[#CBCBCB] ${poppins.className}`}
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            SECOND NAME
          </label>
          <input
            placeholder="Last name"
            className="text-md border py-2 px-4 rounded-md border border-[#CBCBCB]"
          />
        </div>
        <div className="flex flex-col mb-8">
          <label className="font-bold text-[var(--color-primary)] text-xs mb-2">
            MESSAGE
          </label>
          <input
            placeholder="Your message"
            className="text-md border py-2 px-4 pb-35 md:pb-20 rounded-md border-[#CBCBCB]"
          />
        </div>
      </div>
      <div>
        <button
          className={`${poppins.className} bg-black text-white w-full py-2 rounded-md font-semibold`}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

function ContactPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);


  return (
    <main>
      <div className="mx-10 md:mx-15 lg:mx-30">
        <div>
          <div
            className="flex mt-4 space-x-2"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            <Traversal
              items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            />
          </div>
        </div>
        <div data-aos="fade-up">
          <div
            className="mb-10 space-y-6 md:w-2/3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p
              className={`text-[54px] font-medium leading-[58px] tracking-[-1px] max-sm:text-[28px] max-sm:leading-[34px] ${poppins.className}`}
            >
              We believe in sustainable decor. We’re passionate about life at
              home.
            </p>
            <p className={`leading-[26px] ${inter.className}`}>
              Our features timeless furniture, with natural fabrics, curved
              lines,
              <br /> plenty of mirrors and classic design, which can be
              incorporated into
              <br /> any decor project. The pieces enchant for their sobriety,
              to last
              <br /> for generations, faithful to the shapes of each period,
              with a touch
              <br /> of the present
            </p>
          </div>
          <AboutUsCard />
          <ContactsInfo />
          <div className="md:flex md:space-x-10">
            <MessageInput />
            <MapLoction />
          </div>
          <BenefitsDisplay />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default ContactPage;
