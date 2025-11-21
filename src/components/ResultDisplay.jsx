import React from "react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const ResultDisplay = ({ results }) => {
  if (!results || !results.shares || results.shares.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">No results to display.</p>
    );
  }

  const { netEstate, totalFractionAllocated, reconciliation, shares } = results;

  const allocatedShares = shares.filter((s) => s.status !== "EXCLUDED");
  const excludedHeirs = shares.filter((s) => s.status === "EXCLUDED");

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-3xl font-bold text-green-800 border-b-2 border-green-200 pb-3 mb-4">
        Inheritance Calculation Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6 p-4 border rounded-lg bg-green-50">
        <div>
          <p className="text-sm text-gray-600 font-medium">Net Estate Value</p>
          <p className="text-xl font-bold text-green-700">
            {formatCurrency(netEstate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Reconciliation Status
          </p>
          <p
            className={`text-xl font-bold ${
              reconciliation === "Balanced"
                ? "text-blue-600"
                : "text-orange-600"
            }`}
          >
            {reconciliation}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">
            Total Fraction Allocated
          </p>

          <p className="text-xl font-bold text-gray-800">
            {(totalFractionAllocated * 100).toFixed(4)}%
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Allocated Shares
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Share Fraction
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Share Amount ($)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocatedShares.map((share, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {share.heir} ({share.count})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {share.classification}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {share.share_fraction_of_total.toFixed(6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(share.share_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {excludedHeirs.length > 0 && (
        <div className="mt-6 p-4 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-red-700">
            Excluded Heirs (Hajb)
          </h4>
          <p className="text-sm text-gray-600">
            These individuals were present but are excluded from inheritance due
            to the presence of a closer heir:
            <span className="font-medium ml-1">
              {excludedHeirs.map((h) => h.heir).join(", ")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
