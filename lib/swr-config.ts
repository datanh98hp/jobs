import { toast } from "sonner";
import { SWRGlobalConfig } from "swr";

const swrConfig = {
  // revalidateOnMount: true,
  revalidateOnFocus : false,
  refreshInterval: 30 * 60 * 1000, // 30 minutes

  onError: (error: { status: number; message: string }, key: string) => {
    if (error.status !== 403 && error.status !== 404) {

      toast.error(`${key} : ${error.message}`);
    }
  },
} as SWRGlobalConfig;

export default swrConfig;
