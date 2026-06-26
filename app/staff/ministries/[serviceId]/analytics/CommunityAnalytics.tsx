import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq } from 'drizzle-orm';
import { Users, Home, Church, Shield } from 'lucide-react';

import {
  VicariateMembershipChart,
  ParishMembershipChart,
  MembershipTrendChart,
} from './CommunityCharts';

export default async function CommunityAnalytics({
  serviceId,
}: {
  serviceId: string;
}) {
  const rawActivities = await db
    .select({
      id: ministryActivities.id,
      activityDate: ministryActivities.activityDate,
      organizationId: ministryActivities.organizationId,
      details: ministryActivities.details,
      parishName: organizations.name,
    })
    .from(ministryActivities)
    .innerJoin(
      organizations,
      eq(ministryActivities.organizationId, organizations.id)
    )
    .where(eq(ministryActivities.serviceId, serviceId));

  let totalMembers = 0;
  let totalHouseholds = 0;
    
  const vicariateMap: Record<string, number> = {};
  const parishMap: Record<string, number> = {};
  const membersHouseholdsData: {
    name: string;
    members: number;
    households: number;
  }[] = [];

  rawActivities.forEach((activity) => {
    const details = activity.details as any;

    const members = Number(details?.total_members) || 0;
    const households = Number(details?.total_households) || 0;

    const vicariate = details?.vicariate || 'Unknown';
    const parish = activity.parishName || 'Unknown Parish';

    totalMembers += members;
    totalHouseholds += households;

    vicariateMap[vicariate] =
      (vicariateMap[vicariate] || 0) + members;

    parishMap[parish] =
      (parishMap[parish] || 0) + members;

    membersHouseholdsData.push({
      name: parish,
      members,
      households,
    });
  });

  const vicariateChartData = Object.entries(vicariateMap)
    .map(([name, members]) => ({
      name,
      members,
    }))
    .sort((a, b) => b.members - a.members);

  const parishChartData = Object.entries(parishMap)
    .map(([name, members]) => ({
      name,
      members,
    }))
    .sort((a, b) => b.members - a.members);

  const reportingParishes = new Set(
    rawActivities.map((a) => a.organizationId)
  ).size;

  const reportingVicariates = new Set(
    rawActivities.map(
      (a) => (a.details as any)?.vicariate || 'Unknown'
    )
  ).size;

  const monthlyMembersMap: Record<string, number> = {};

  rawActivities.forEach((activity) => {
    const details = activity.details as any;

    const month = new Date(activity.activityDate).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: '2-digit',
      }
    );

    monthlyMembersMap[month] =
      (monthlyMembersMap[month] || 0) +
      (Number(details?.total_members) || 0);
  });

  const monthlyTrendData = Object.entries(monthlyMembersMap).map(
    ([month, members]) => ({
      month,
      members,
    })
  );

    // Monthly Membership Growth Calculation
    const monthlyMembers: Record<string, number> = {};

    rawActivities.forEach((activity) => {
      const details = activity.details as any;

      const date = new Date(activity.activityDate);

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      monthlyMembers[monthKey] =
        (monthlyMembers[monthKey] || 0) +
        (Number(details?.total_members) || 0);
    });

    const sortedMonths = Object.entries(monthlyMembers).sort(
      ([a], [b]) => a.localeCompare(b)
    );

    let growthRate = 0;
    let hasGrowthData = false;

    if (sortedMonths.length >= 2) {
      const previousMonth =
        sortedMonths[sortedMonths.length - 2][1];

      const currentMonth =
        sortedMonths[sortedMonths.length - 1][1];

      if (previousMonth > 0) {
        growthRate =
          ((currentMonth - previousMonth) /
            previousMonth) *
          100;

        hasGrowthData = true;
      }
    }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-[#0060AF] rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Current Members
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalMembers.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl">
            <Home size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Current Households
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {totalHouseholds.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
            <Church size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Reporting Parishes
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {reportingParishes}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Reporting Vicariates
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {reportingVicariates}
            </h3>
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Membership by Vicariate
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Total BEC members recorded per vicariate.
          </p>

          <VicariateMembershipChart
            data={vicariateChartData}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Membership by Parish
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Total BEC members recorded per parish.
          </p>

          <ParishMembershipChart
            data={parishChartData}
          />
        </div>

      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Membership Growth Insights
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Growth trends are calculated using monthly BEC census submissions.
        </p>

        <div className="flex flex-col items-center justify-center py-10">

          {hasGrowthData ? (
            <>
              <div
                className={`text-6xl font-bold ${
                  growthRate >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {growthRate >= 0 ? '+' : ''}
                {growthRate.toFixed(1)}%
              </div>

              <p className="mt-4 text-xl font-semibold text-gray-900">
                BEC Membership
                {growthRate >= 0 ? ' Grew' : ' Declined'}
              </p>

              <p className="text-gray-500 text-center max-w-xl mt-2">
                BEC membership
                {growthRate >= 0 ? ' increased' : ' decreased'} by{' '}
                <span className="font-semibold">
                  {Math.abs(growthRate).toFixed(1)}%
                </span>{' '}
                compared to the previous month.
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl font-bold text-[#0060AF]">
                N/A
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-900">
                BEC Membership Growth
              </p>

              <p className="text-gray-500 text-center max-w-lg mt-2">
                Additional monthly census submissions are required before
                membership growth can be calculated.
              </p>
            </>
          )}

          <MembershipTrendChart
            data={monthlyTrendData}
          />
        </div>
      </div>

    </div>
  );
}