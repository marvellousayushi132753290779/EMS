import axios from "axios";
import React, { useEffect, useState } from "react";

const AttendanceReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState();
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({ limit, skip });

      if (dateFilter) {
        query.append("date", dateFilter);
      }

      const response = await axios.get(
        `http://localhost:5000/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        if (skip === 0) {
          setReport(response.data.groupData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...response.data.groupData,
          }));
        }
      }

      setLoading(false);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadmore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  }

  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold mb-6">
        Attendance Report
      </h2>

      {/* Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Date</h2>
        <input
          type="date"
          className="border px-3 py-2 bg-gray-100"
          onChange={(e) => {setDateFilter(e.target.value); setSkip(0)}}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        Object.entries(report).map(([date, records]) => (
          <div className="mt-6 border-b pb-4" key={date}>
            <h2 className="text-xl font-semibold mb-2">{date}</h2>

            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">S No</th>
                  <th className="px-4 py-2 border">Employee ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Department</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((data, i) => (
                  <tr key={data.employeeId}>
                    <td className="px-4 py-2 border">{i + 1}</td>
                    <td className="px-4 py-2 border">{data.employeeId}</td>
                    <td className="px-4 py-2 border">{data.employeeName}</td>
                    <td className="px-4 py-2 border">{data.departmentName}</td>
                    <td className="px-4 py-2 border">{data.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="px-4 py-2 border bg-gray-100 text-lg font-semibold" onClick={handleLoadmore}>Load More</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AttendanceReport;