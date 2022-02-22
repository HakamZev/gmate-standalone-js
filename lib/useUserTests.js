import useSWR from "swr";

export default function useUserTests() {
  const { data: tests, error } = useSWR("/api/get?q=my-tests");

  const isLoading = !tests && !error

  return { tests, isLoading };
}
