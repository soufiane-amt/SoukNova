type SidebarItemProps = {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active
        ? 'bg-black text-white'
        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
    }`}
    type="button"
  >
    <Icon
      size={20}
      className={active ? 'stroke-current' : 'group-hover:stroke-black'}
    />
    <span className="font-medium truncate">{label}</span>
  </button>
);
export default SidebarItem;