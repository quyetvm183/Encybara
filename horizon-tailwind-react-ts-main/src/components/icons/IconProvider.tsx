import React from 'react';
import {
  MdEdit,
  MdSearch,
  MdCancel,
  MdClose,
  MdGridView,
  MdList,
  MdMenu,
  MdTableView,
  MdSupervisorAccount,
  MdFilterList,
  MdVisibility,
  MdArrowBack,
  MdArrowForward,
  MdAdd,
  MdDelete,
  MdSave,
  MdMail,
  MdPhone,
  MdPerson,
  MdLock,
  MdError,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdInfo,
  MdWarning,
  MdStar,
  MdHome,
  MdSettings,
  MdFolder,
  MdLogin,
  MdHelp,
  MdChat,
  MdBarChart,
  MdRefresh,
  MdNotifications,
} from 'react-icons/md';

export type IconName =
  | 'edit'
  | 'search'
  | 'cancel'
  | 'close'
  | 'grid'
  | 'list'
  | 'menu'
  | 'table'
  | 'role'
  | 'filter'
  | 'visibility'
  | 'back'
  | 'forward'
  | 'add'
  | 'delete'
  | 'save'
  | 'mail'
  | 'phone'
  | 'person'
  | 'lock'
  | 'error'
  | 'chevronDown'
  | 'chevronUp'
  | 'info'
  | 'warning'
  | 'star'
  | 'home'
  | 'settings'
  | 'folder'
  | 'login'
  | 'help'
  | 'chat'
  | 'chart'
  | 'loading'
  | 'notifications';

interface IconProviderProps {
  name: IconName;
  size?: number;
  className?: string;
}

const iconComponents = {
  edit: MdEdit,
  search: MdSearch,
  cancel: MdCancel,
  close: MdClose,
  grid: MdGridView,
  list: MdList,
  menu: MdMenu,
  table: MdTableView,
  role: MdSupervisorAccount,
  filter: MdFilterList,
  visibility: MdVisibility,
  back: MdArrowBack,
  forward: MdArrowForward,
  add: MdAdd,
  delete: MdDelete,
  save: MdSave,
  mail: MdMail,
  phone: MdPhone,
  person: MdPerson,
  lock: MdLock,
  error: MdError,
  chevronDown: MdKeyboardArrowDown,
  chevronUp: MdKeyboardArrowUp,
  info: MdInfo,
  warning: MdWarning,
  star: MdStar,
  home: MdHome,
  settings: MdSettings,
  folder: MdFolder,
  login: MdLogin,
  help: MdHelp,
  chat: MdChat,
  chart: MdBarChart,
  loading: MdRefresh,
  notifications: MdNotifications,
};

const IconProvider: React.FC<IconProviderProps> = ({
  name,
  size = 24,
  className = ''
}) => {
  const Icon = iconComponents[name];
  if (name === 'loading') {
    return <Icon size={size} className={`${className} animate-spin`} />;
  }
  return <Icon size={size} className={className} />;
};

export default IconProvider;