import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { inter } from '@/layout';

interface AddressFieldProps {
  fieldName: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

function AddressField({
  fieldName,
  fullName,
  phoneNumber,
  address,
}: AddressFieldProps) {
  return (
    <div className="md:flex-1 border border-[var(--color-primary)] rounded-lg p-4">
      <div className="mb-2 flex justify-between">
        <p className={`font-semibold ${inter.className}`}>{fieldName}</p>
        <div className='flex items-center cursor-pointer'>
          <BorderColorOutlinedIcon  sx={{fontSize: 17, color: "var(--color-primary)"}} />
          <p className='ml-1    text-[var(--color-primary)] font-semibold text-[16px]'>Edit</p>
        </div>
      </div>
      <div className="text-sm space-y-1">
        <p>{fullName}</p>
        <p>{phoneNumber}</p>
        <p>{address}</p>
      </div>
    </div>
  );
}

export default AddressField;
