import type { WorkflowEdge } from "@/types/workflow.type";
import { useUpdateConfigFlow } from "@/workflow/hooks/useUpdateConfigFlow";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

interface Props {
  edgeData: WorkflowEdge;
}

export default function EdgeConfig(props: Props) {
  const { edgeData } = props;
  const { updateEdge } = useUpdateConfigFlow();
  const methods = useForm({
    defaultValues: { ...edgeData.data },
  });

  useEffect(() => {
    const subscription = methods.watch(value => {
      updateEdge(edgeData.id, { ...value });
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <FormProvider {...methods}>
      {edgeData?.label}
      <Controller
        name="label"
        render={({ field }) => <input {...field} className="border" />}
      />
    </FormProvider>
  );
}
