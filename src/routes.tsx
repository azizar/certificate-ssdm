// Admin Imports

// Icon Imports
import {
  MdEvent,
  MdGeneratingTokens,
  MdHome,
  MdPerson,
  MdPersonSearch,
} from 'react-icons/md';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Certificate',
    layout: '/admin',
    path: 'certificate',
    icon: <MdGeneratingTokens className="h-6 w-6" />,

    secondary: true,
  },
  {
    name: 'Event',
    layout: '/admin',
    path: 'event',
    icon: <MdEvent className="h-6 w-6" />,

    secondary: true,
  },
  {
    name: 'Person',
    layout: '/admin',
    path: 'person',
    icon: <MdPersonSearch className="h-6 w-6" />,

    secondary: true,
  },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: 'nft-marketplace',
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,

  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: 'data-tables',
  // },
  {
    name: 'Profile',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
  },
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: 'sign-in',
  //   icon: <MdLock className="h-6 w-6" />,
  // },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: 'rtl-default',
  //   icon: <MdHome className="h-6 w-6" />,
  // },
];
export default routes;
