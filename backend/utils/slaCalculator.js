/**
 * Calculate Days Pending & Escalation Status
 */
export function calculateSlaStatus(submissionDate, thresholdDays = 10) {
  const submitTime = new Date(submissionDate).getTime();
  const currentTime = new Date().getTime();
  
  const diffTime = Math.max(0, currentTime - submitTime);
  const daysPending = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let escalationStatus = 'Normal';
  if (daysPending >= thresholdDays) {
    escalationStatus = 'Escalated';
  } else if (daysPending >= Math.floor(thresholdDays * 0.8)) {
    escalationStatus = 'Warning';
  }

  return {
    daysPending,
    escalationStatus,
    isOverdue: daysPending >= thresholdDays,
  };
}
