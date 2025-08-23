import { inter } from "@/layout";

type StatusType = 'DELIVERD' | 'PROGRESS';

interface OrderInfoProps {
  id: number;
  date: string;
  status: StatusType;
  price: number;
}

function OrderInfo({ id, date, status, price }: OrderInfoProps) {
  return (
    <div className="flex md:flex-col justify-between text-sm border-b border-gray-300 py-3">
      <div className="md:grid md:grid-cols-4 md:grid-cols-4 gap-4 ">
        <p className={`leading-loose text-[var(--color-primary)] ${inter.className}`}>Number Id</p>
        <p className={`leading-loose text-[var(--color-primary)] ${inter.className}`}>Dates</p>
        <p className={`leading-loose text-[var(--color-primary)] ${inter.className}`}>Status</p>
        <p className={`leading-loose text-[var(--color-primary)] ${inter.className}`}>Price</p>
      </div>
      <div className="md:grid md:grid-cols-4 md:grid-cols-4 gap-4 ">
        <p className={`leading-loose ${inter.className}`}>#{id}</p>
        <p className={`leading-loose ${inter.className}`}>{date}</p>
        <p className={`leading-loose ${inter.className}`}>{status}</p>
        <p className={`leading-loose ${inter.className}`}>${price}</p>
      </div>
    </div>
  );
}

export default OrderInfo;
