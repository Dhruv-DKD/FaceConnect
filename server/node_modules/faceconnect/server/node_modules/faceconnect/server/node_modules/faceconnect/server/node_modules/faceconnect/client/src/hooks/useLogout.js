import { logout } from "../lib/api.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logoutMutation: mutate };
};

export default useLogout;
