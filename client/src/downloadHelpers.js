import axios from "axios"

export const getReports = async () => {
  const localReports = JSON.parse(localStorage.getItem("reports")) || []
  const reportsResponse = await axios.post("http://localhost:8080/seens", localReports.filter((report) => report.status !== "seen").map((report) => report.id))
  const seens = reportsResponse.data
  //workaround for race condition
  const localReports2 = JSON.parse(localStorage.getItem("reports")) || []
  const newReports = localReports2.map((report) => ({
    ...report,
    status: seens.find((seenReport) => seenReport.id === report.id)?.status || report.status,
    updatedAt: seens.find((seenReport) => seenReport.id === report.id)?.updatedAt || report.updatedAt
  }))
  localStorage.setItem("reports", JSON.stringify(newReports));
  return newReports
}