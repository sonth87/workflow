import type { TaskNode } from "@/types/workflow.type";
import useBuildDefaultValue from "@/workflow/hooks/useBuildDefaultValue";
import { useUpdateConfigFlow } from "@/workflow/hooks/useUpdateConfigFlow";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

interface Props {
  taskNode: TaskNode;
}

export default function TaskConfig({ taskNode }: Props) {
  const { updateNode } = useUpdateConfigFlow();
  const defaultValues = useBuildDefaultValue({
    fields: taskNode.data?.form_configs?.fields || [],
    responseData: taskNode.data,
  });
  const methods = useForm({
    defaultValues,
  });

  useEffect(() => {
    const subscription = methods.watch(value => {
      updateNode(taskNode.id, { data: { ...value } });
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <FormProvider {...methods}>
      {taskNode?.data?.label}
      <Controller
        name="label"
        render={({ field }) => <input {...field} className="border" />}
      />
    </FormProvider>
  );
}
