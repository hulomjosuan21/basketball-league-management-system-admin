"use client"
import { RichTextEditorField } from "@/components/RichTextFormEditor";
import { useForm, FormProvider } from "react-hook-form";

export default function Page() {
  const methods = useForm({
    defaultValues: {
      content: "", // initial value for content
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...methods}> {/* FormProvider wraps your form */}
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RichTextEditorField name="content" label="Article Content" />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </FormProvider>
  );
}
