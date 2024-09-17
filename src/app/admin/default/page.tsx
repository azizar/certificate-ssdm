'use client';
import MiniCalendar from 'components/calendar/MiniCalendar';
import { IoMdDocument, IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import {
  MdBarChart,
  MdCalendarToday,
  MdDashboard,
  MdPerson,
  MdVerifiedUser,
} from 'react-icons/md';

import TaskCard from 'components/admin/default/TaskCard';
import Widget from 'components/widget/Widget';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BiSolidUser } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';

const Dashboard = () => {
  const { data } = useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async () => {
      return axios.get('/api/dashboard');
    },
  });

  const result = data?.data;

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaRegUser className="h-7 w-7" />}
          title={'Persons'}
          subtitle={result?.totalPerson ?? '0'}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={'Certificate'}
          subtitle={result?.totalCertificate ?? '0'}
        />
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={'Event'}
          subtitle={result?.totalEvent ?? '0'}
        />
        <Widget
          icon={<FaBuildingUser className="h-7 w-7" />}
          title={'User'}
          subtitle={result?.totalUser ?? '0'}
        />
        {/*<Widget*/}
        {/*  icon={<MdDashboard className="h-6 w-6" />}*/}
        {/*  title={'Your Balance'}*/}
        {/*  subtitle={'$1,000'}*/}
        {/*/>*/}
        {/*<Widget*/}
        {/*  icon={<MdBarChart className="h-7 w-7" />}*/}
        {/*  title={'New Tasks'}*/}
        {/*  subtitle={'145'}*/}
        {/*/>*/}
        {/*<Widget*/}
        {/*  icon={<IoMdHome className="h-6 w-6" />}*/}
        {/*  title={'Total Projects'}*/}
        {/*  subtitle={'$2433'}*/}
        {/*/>*/}
      </div>

      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div> */}

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        {/* <CheckTable tableData={tableDataCheck} /> */}

        {/* Traffic chart & Pie Chart */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div> */}

        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable tableData={tableDataComplex} /> */}

        {/* Task chart & Calendar */}

        <TaskCard />
        <MiniCalendar />
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <div className="grid grid-cols-1 rounded-[20px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
