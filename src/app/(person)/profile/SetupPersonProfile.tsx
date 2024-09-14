'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Typography } from '@material-tailwind/react';
import { createEvent, updateEvent } from 'actions/event';
import { AppInputFile } from 'components/forms/file-dropzone';
import { Event, EventSchema } from 'lib/schema/event';
import { Controller, useForm } from 'react-hook-form';
import { convertToDateTimeLocalString } from 'utils';
import { z } from 'zod';
import { PersonSchema } from '../../../lib/schema/person';
import { Session } from '@auth/core/types';

export const SetupPersonProfile = ({ session }: { session: Session }) => {
  console.log({ session });
  const {
    handleSubmit,
    control,
    getValues,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof PersonSchema>>({
    resolver: zodResolver(PersonSchema),
    values: {
      email: session.user.email,
      identifier: session.user.email,
      userId: session.user.id,
    },
    defaultValues: {
      name: session.user.name,
      title: '',
      pangkat: '',
    },
  });

  const onSubmit = async (data) => {};

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
                label="Nama Pada Certificate"
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
          name="title"
          render={({
            field: { onChange, onBlur, value, ref },
            formState,
            fieldState,
          }) => (
            <>
              <Input
                label="Gelar Belakang Sertifikat"
                variant="outlined"
                crossOrigin={undefined}
                error={errors?.title ? true : false}
                placeholder="M.Kom"
                onChange={onChange}
                ref={ref}
                defaultValue={value ?? ''}
              />
              <small className="text-red-600">{errors?.title?.message}</small>
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
