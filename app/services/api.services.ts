export const smtp = {
    setSMTPConfiguration: "job-finders/create-smtp-config",
    sendEmail: "job-finders/send-email",
    mailHistory: "job-finders/mail-history",
    getJobFindings: "job-finders/job-findings",
    startFind: "job-finders/start-find",
    toggleApplied: (id: string) => `job-finders/job-findings/${id}/applied`
}

export const employee = {
    employeeLogin: "employees/login",
}