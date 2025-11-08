import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { inter, poppins } from '@/layout';

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
    <div className="my-16 text-center" data-aos="fade-up" data-aos-delay="200">
      <p
        className={`${poppins.className} mb-5 font-medium text-4xl`}
        data-aos="fade-up"
      >
        Contact Us
      </p>
      <div className="md:flex justify-between md:space-x-8">
        {contacts.map((contact, index) => (
          <div
            key={contact.title}
            className={`bg-[var(--color-neutral-bg)] flex flex-col items-center text-center p-5 mb-5 flex-1 ${inter.className}`}
            data-aos="fade-up"
            data-aos-delay={`${200 * (index + 1)}`}
          >
            <span aria-hidden="true">{contact.icon}</span>
            <p className="text-[var(--color-primary)] font-medium text-md my-1">
              {contact.title}
            </p>
            <p className="font-medium">{contact.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsInfo;
