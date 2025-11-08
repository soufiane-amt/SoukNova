import { Typography } from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';

interface ArticlMetaDataProps {
  author: string;
  date: string;
}

function ArticlMetaData({ author, date }: ArticlMetaDataProps) {
  const articleDate = date.slice(0, -5);
  return (
    <div className="flex mt-5">
      <div data-aos="fade-right" className="flex mr-5">
        <AccountCircleOutlinedIcon sx={{ color: 'var(--color-primary)', paddingRight:0.2 }} />
        <Typography color="var(--color-primary)">{author}</Typography>
      </div>
      <div data-aos="fade-right" data-aos-delay="200" className="flex">
        <DateRangeOutlinedIcon sx={{ color: 'var(--color-primary)',paddingRight:0.2 }} />
        <Typography color="var(--color-primary)">{articleDate}</Typography>
      </div>
    </div>
  );
}

export default ArticlMetaData;
