'use client';

import Traversal from '../../components/ui/Traversal';
import { inter, poppins } from '@/layout';
import BenefitsDisplay from '@/home/components/BenefitsDisplay';
import { SiteFooter } from '../../components/layout/SiteFooter';
import 'aos/dist/aos.css';
import AboutUsCard from './components/AboutUsCard';
import ContactsInfo from './components/ContactsInfo';
import MessageInput from './components/MessageInput';
import MapLocation from './components/MapLocation';

function ContactPage() {
  return (
    <main>
      <div className="mx-10 md:mx-15 lg:mx-30 pt-5">
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
            <MapLocation />
          </div>
          <BenefitsDisplay />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default ContactPage;
