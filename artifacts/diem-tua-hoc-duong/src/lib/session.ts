export const getSessionId = (): string => {
  let sessionId = localStorage.getItem("dthd_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("dthd_session_id", sessionId);
  }
  return sessionId;
};
