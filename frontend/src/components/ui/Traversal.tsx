import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TraversalProps {
  items: BreadcrumbItem[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const Traversal = ({ items }: TraversalProps) => {
  return (
    <motion.div
      className="flex min-h-5 items-center gap-4 font-inter text-sm font-medium text-[#605F5F] max-sm:text-xs py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex items-center gap-1 ${
            index === items.length - 1 ? "text-black truncate" : ""
          }`}
          variants={itemVariants}
        >
          {item.href ? (
            <a href={item.href} className="flex items-center gap-1">
              <p className="text-nowrap">{item.label}</p>
              {/* Show arrow if not last item */}
              {index < items.length - 1 && (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 
                  0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 
                  9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 
                  7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 
                  0-33.9l127-127.1z"></path>
                </svg>
              )}
            </a>
          ) : (
            <p className="text-nowrap">{item.label}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Traversal;
