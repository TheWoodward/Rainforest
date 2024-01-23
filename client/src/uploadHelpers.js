import axios from "axios";

export const uploadLocalReports = async (onSuccess) => {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  const localReports = reports.filter(
    (report) => report.status === "created"
  );
  for (const localReport of localReports) {
    const response = await axios.post(
      "http://localhost:8080/upload",
      localReport
    );
    const responseId = response.data.id;
    onSuccess(responseId)
    const index = reports.findIndex((report) => report.id === responseId);
    if (reports[index]) {
      reports[index].status = response.data.status;
      reports[index].updatedAt = response.data.updatedAt;
    }
  }
  localStorage.setItem("reports", JSON.stringify(reports));
};
