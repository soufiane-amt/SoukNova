import { Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import { poppins } from '@/layout';

interface ArticlMetaDataProps {
  author: string;
  date: string;
}

function ArticlMetaData({ author, date }: ArticlMetaDataProps) {
  // Format the date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr.slice(0, -5);
    }
  };

  return (
    <div className={`flex items-center gap-4 mt-6 ${poppins.className}`}>
      {/* Author */}
      <div data-aos="fade-right" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#141718] to-[#343839] flex items-center justify-center text-white font-semibold text-sm">
          {author?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="text-sm font-medium text-[#141718]">{author}</p>
          <p className="text-xs text-[#6C7275]">Author</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200" />

      {/* Date */}
      <div
        data-aos="fade-right"
        data-aos-delay="100"
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#6C7275]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <span className="text-sm text-[#6C7275]">{date.slice(0, date.length - 5)}</span>
      </div>
    </div>
  );
}

export default ArticlMetaData;
