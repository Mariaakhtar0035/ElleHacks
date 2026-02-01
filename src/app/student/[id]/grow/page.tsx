"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { getStudent } from "@/lib/store";
import { getProjections, getGrowthPercentage } from "@/lib/growthCalculator";

export default function GrowTokensPage() {
  const params = useParams();
  const studentId = params.id as string;

  const student = getStudent(studentId);
  if (!student) return null;

  const projections = getProjections(student.growTokens);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          Your Money is Growing!
        </h1>
        <p className="text-xl text-gray-700">
          If you wait... your tokens grow!
        </p>
      </div>

      {/* Growth Explanation */}
      <Card borderColor="border-amber-400" className="p-6 bg-amber-50">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div className="grow">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
              How Compound Growth Works
            </h3>
            <p className="text-gray-700">
              Your Grow tokens earn 2% more every week. The longer you wait, the
              more you&apos;ll have! This is called compound growth - your
              tokens earn tokens, and those new tokens earn even more tokens!
            </p>
          </div>
        </div>
      </Card>

      {/* Projections - achievement cards */}
      <div>
        <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
          Future Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            borderColor="border-emerald-500"
            className="p-6 text-center bounce-in"
          >
            <div className="text-5xl mb-3">🥉</div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
              In 1 Month
            </h3>
            <div className="flex justify-center">
              <TokenDisplay
                amount={projections.oneMonth}
                type="grow"
                size="lg"
                showLabel={false}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-bold text-emerald-600">
                +{getGrowthPercentage(student.growTokens, projections.oneMonth)}
                %
              </span>{" "}
              growth
            </div>
            <p className="text-xs text-gray-500 mt-2">
              That&apos;s {projections.oneMonth - student.growTokens} more
              tokens!
            </p>
          </Card>

          <Card
            borderColor="border-blue-500"
            className="p-6 text-center bounce-in"
          >
            <div className="text-5xl mb-3">🥈</div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
              In 6 Months
            </h3>
            <div className="flex justify-center">
              <TokenDisplay
                amount={projections.sixMonths}
                type="grow"
                size="lg"
                showLabel={false}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-bold text-blue-600">
                +
                {getGrowthPercentage(student.growTokens, projections.sixMonths)}
                %
              </span>{" "}
              growth
            </div>
            <p className="text-xs text-gray-500 mt-2">
              That&apos;s {projections.sixMonths - student.growTokens} more
              tokens!
            </p>
          </Card>

          <Card
            borderColor="border-purple-500"
            className="p-6 text-center bounce-in"
          >
            <div className="text-5xl mb-3">🥇</div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
              In 1 Year
            </h3>
            <div className="flex justify-center">
              <TokenDisplay
                amount={projections.oneYear}
                type="grow"
                size="lg"
                showLabel={false}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-bold text-purple-600">
                +{getGrowthPercentage(student.growTokens, projections.oneYear)}%
              </span>{" "}
              growth
            </div>
            <p className="text-xs text-gray-500 mt-2">
              That&apos;s {projections.oneYear - student.growTokens} more
              tokens!
            </p>
          </Card>
        </div>
      </div>

      {/* Vault / Investment Board - Growth chart */}
      <Card borderColor="border-gray-800" className="p-8 overflow-hidden">
        <div className="border-4 border-amber-600 rounded-2xl p-6 bg-linear-to-b from-amber-50 to-amber-100">
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-2 text-center">
            🏦 Investment Board
          </h3>
          <p className="text-center text-gray-600 mb-6">Growth over time</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-display font-bold text-gray-700">
                  Now
                </span>
                <span className="font-display font-bold text-blue-600">
                  {student.growTokens}
                </span>
              </div>
              <div
                className="h-8 bg-blue-500 rounded-xl chart-fill"
                style={{
                  width:
                    student.growTokens > 0
                      ? `${(student.growTokens / projections.oneYear) * 100}%`
                      : "1%",
                }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-display font-bold text-gray-700">
                  1 Month
                </span>
                <span className="font-display font-bold text-emerald-600">
                  {projections.oneMonth}
                </span>
              </div>
              <div
                className="h-8 bg-emerald-400 rounded-xl chart-fill"
                style={{
                  width: `${
                    student.growTokens > 0
                      ? (projections.oneMonth / projections.oneYear) * 100
                      : 100
                  }%`,
                }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-display font-bold text-gray-700">
                  6 Months
                </span>
                <span className="font-display font-bold text-blue-600">
                  {projections.sixMonths}
                </span>
              </div>
              <div
                className="h-8 bg-blue-400 rounded-xl chart-fill"
                style={{
                  width: `${
                    student.growTokens > 0
                      ? (projections.sixMonths / projections.oneYear) * 100
                      : 100
                  }%`,
                }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-display font-bold text-gray-700">
                  1 Year
                </span>
                <span className="font-display font-bold text-purple-600">
                  {projections.oneYear}
                </span>
              </div>
              <div
                className="h-8 bg-purple-400 rounded-xl chart-fill"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Key Takeaway */}
      <Card borderColor="border-purple-500" className="p-6 bg-purple-50">
        <div className="text-center">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
            The Power of Patience
          </h3>
          <p className="text-lg text-gray-700">
            The longer you wait, the more your tokens grow! This is why saving
            for the future is so important.
          </p>
        </div>
      </Card>
    </div>
  );
}
