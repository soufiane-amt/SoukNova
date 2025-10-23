import { inter } from '@/layout';

export type StatusType = 'DELIVERED' | 'PROGRESS';

const baseText = `leading-loose ${inter.className}`;
const labelText = `${baseText} text-[var(--color-primary)]`;

export interface OrderInfoProps {
  id: number;
  date: string;
  status: StatusType;
  price: number;
}

function OrderInfo({ id, date, status, price }: OrderInfoProps) {
  return (
    <div className="flex md:flex-col justify-between text-sm border-b border-gray-300 py-3">
      <div className="md:grid md:grid-cols-4 gap-4 ">
        <p className={labelText}>Number Id</p>
        <p className={labelText}>Dates</p>
        <p className={labelText}>Status</p>
        <p className={labelText}>Price</p>
      </div>
      <div className="md:grid md:grid-cols-4 gap-4 ">
        <p className={baseText}>#{id}</p>
        <p className={baseText}>{date}</p>
        <p
          className={`${baseText} ${
            status === 'DELIVERED' ? 'text-green-600' : 'text-yellow-500'
          }`}
        >
          {status}
        </p>
        <p className={baseText}>${price}</p>
      </div>
    </div>
  );
}

export default OrderInfo;
