import { io } from "socket.io-client";
import type { JobStatus } from "../api/client";

export function watchJob(
  jobId: string,
  accessToken: string,
  onUpdate: (p: JobStatus) => void
) {
  const socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
    {
      transports: ["websocket"],
      auth: { token: accessToken },
    }
  );
  socket.on("connect", () => socket.emit("subscribe-job", jobId));
  socket.on("job-status", (payload: JobStatus) => {
    if (payload?.jobId === jobId) onUpdate(payload);
  });
  return () => {
    socket.emit("unsubscribe-job", jobId);
    socket.disconnect();
  };
}
