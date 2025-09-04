interface EmptySectionMessageProps {
  message: string;
}

function EmptySectionMessage({ message }: EmptySectionMessageProps) {
  return (
    <div>
      <p className=" font-inter text-[34px] font-semibold text-[#B1B5C3] text-center">
        {message}
      </p>
    </div>
  );
}

export default EmptySectionMessage;
