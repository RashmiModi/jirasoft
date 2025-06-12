import { useState } from "react";
// ✅ Updated import: useActionState replaces deprecated useFormState
import { useActionState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useActionState(cb, undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
    } catch (err) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
