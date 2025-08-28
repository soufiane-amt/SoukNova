import { inter } from '@/layout';
import OrderInfo from './OrderInfo';
import EmptySectionMessage from '../../../components/ui/EmptySection';

function OrderHistory() {
  return (
    <div className="w-full md:ml-10 md:mt-0 mt-5">
      <div className="mb-5">
        <p className={`${inter.className} font-semibold text-xl`}>
          Orders History
        </p>
      </div>
      <div>
        {/* <OrderInfo
          id={3456}
          date="October 17, 2023"
          status="DELIVERD"
          price={1234.0}
        /> */}
        {/* <OrderInfo
          id={3456}
          date="October 17, 2023"
          status="DELIVERD"
          price={1234.0}
        />
        <OrderInfo
          id={3456}
          date="October 17, 2023"
          status="DELIVERD"
          price={1234.0}
        />
        <OrderInfo
          id={3456}
          date="October 17, 2023"
          status="DELIVERD"
          price={1234.0}
        /> */}
      </div>
      <div className="mt-30">
        <EmptySectionMessage message="No Products In Order History" />
      </div>
    </div>
  );
}

export default OrderHistory;
