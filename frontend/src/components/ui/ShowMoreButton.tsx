interface ShowMoreButtonProps {
  handleShowMore: () => void;
}

function ShowMoreButton({ handleShowMore }: ShowMoreButtonProps) {
  return (
    <div className="flex justify-center mt-8">
      <button
        aria-label="Show More"
        onClick={handleShowMore}
        className="cursor-pointer px-8 py-2 text-sm md:text-base font-medium text-black bg-white border rounded-full"
      >
        Show More
      </button>
    </div>
  );
}

export default ShowMoreButton;