import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Typography } from '@material-tailwind/react';
import { createEvent, updateEvent } from 'actions/event';
import { AppInputFile } from 'components/forms/file-dropzone';
import { Event, EventSchema } from 'lib/schema/event';
import { Controller, useForm } from 'react-hook-form';
import { convertToDateTimeLocalString } from 'utils';
import { z } from 'zod';

export const FormEvent = ({
  event,
  onSuccess,
}: {
  event: Event;
  onSuccess: (data) => void;
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      id: event?.id || null,
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date,
      person_responsibility: event.person_responsibility,
      google_docs_id: event.google_docs_id,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).map((key) => {
      formData.append(key, data[key]);
    });

    try {
      if (event.id) {
        const res = await updateEvent(event.id, formData);
        console.log({ res });
        onSuccess(res);
      } else {
        const res = await createEvent(formData);
        console.log({ res });
        onSuccess(res);
      }
    } catch (error) {
      alert(error.message ?? 'Unknown Error');
      console.error(error);
    }
  };

  // @ts-ignore
  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="place-content-center space-y-4">
        <Controller
          control={control}
          name="name"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                label="Name"
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.name ? true : false}
                placeholder="name"
                onChange={onChange}
                ref={ref}
                defaultValue={value ?? ''}
              />
              <small className="text-red-600">{errors?.name?.message}</small>
            </>
          )}
        />
        <Controller
          control={control}
          name="person_responsibility"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                label="Person In-Charge "
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.name ? true : false}
                placeholder="person name"
                onChange={onChange}
                ref={ref}
                defaultValue={value ?? ''}
              />
              <small className="text-red-600">
                {errors?.person_responsibility?.message}
              </small>
            </>
          )}
        /><Controller
          control={control}
          name="google_docs_id"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                label="Google Docs Document ID "
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.google_docs_id ? true : false}
                placeholder=""
                onChange={onChange}
                ref={ref}
                defaultValue={value ?? ''}
              />
              <small className="text-red-600">
                {errors?.google_docs_id?.message}
              </small>
            </>
          )}
        />
        <Controller
          control={control}
          name="start_date"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                type={'datetime-local'}
                label="Start Date"
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.start_date ? true : false}
                onChange={onChange}
                defaultValue={
                  !!value ? convertToDateTimeLocalString(value) : ''
                }
              />
              <small className="text-red-600">
                {errors?.end_date?.message}
              </small>
            </>
          )}
        />
        <Controller
          control={control}
          name="end_date"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                type={'datetime-local'}
                label="End Date"
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.end_date ? true : false}
                onChange={onChange}
                defaultValue={
                  !!value ? convertToDateTimeLocalString(value) : ''
                }
              />
              <small className="text-red-600">
                {errors?.end_date?.message}
              </small>
            </>
          )}
        />
        <Controller
          control={control}
          name="cert_template"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Typography variant="small">Certificate Template</Typography>
              <AppInputFile
                onFileSelected={(file) => onChange(file)}
                preview
                file={value}
                accept=".docx,.doc,.odf"
              />
              <small className="text-red-600">
                {errors && errors.cert_template?.message.toString()}
              </small>
            </>
          )}
        />
        <div className="flex gap-2">
          <Button className="flex-1" type="submit">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
