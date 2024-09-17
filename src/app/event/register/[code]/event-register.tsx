'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Typography } from '@material-tailwind/react';
import { personRegisterEvent } from 'actions/event';
import Default from 'components/auth/variants/DefaultAuthLayout';
import InputField from 'components/fields/InputField';
import { Event, EventRegister, EventRegisterSchema } from 'lib/schema/event';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';
import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Session } from '@auth/core/types';

export const EventRegisterForm = ({
  event,
  session,
}: {
  event: Event;
  session: Session;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventRegister>({
    resolver: zodResolver(EventRegisterSchema),
    defaultValues: {
      full_name: session?.user?.name || '',
      identifier: session?.user?.email || '',
      title: '',
      email: session?.user?.email || '',
    },
    values: {
      identifier: session?.user?.email || '',
      email: session?.user?.email || '',
    },
  });

  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationKey: ['register-event'],
    mutationFn: async (data: any) => {
      return axios.post('/api/event/register', data);
    },
  });

  const onSubmit = async (data: EventRegister) => {
    registerMutation.mutate(
      { ...data, event },
      {
        onError(error, variables, context) {
          console.error(error);
          alert('Absensi gagal !');
          setSuccess(false);
        },
        onSuccess(data, variables, context) {
          console.log(data?.status);
          alert('Absensi sukses.');
          setSuccess(true);
        },
      },
    );
  };

  return (
    <Default
      showBackButton={true}
      maincard={
        <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className=" w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Absensi Kegiatan <br />
              {event.name ?? ''}
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Kegiatan ini dimulai{' '}
              {event?.start_date
                ?.toLocaleString('id', {
                  dateStyle: 'long',
                  timeStyle: 'long',
                  hourCycle: 'h24',
                })
                .replace(/pukul/g, ' : ')}{' '}
              dan berakhir pada{' '}
              {event?.end_date
                ?.toLocaleString('id', {
                  dateStyle: 'long',
                  timeStyle: 'long',
                  hourCycle: 'h24',
                })
                .replace(/pukul/g, ' : ')}
            </p>

            <Alert
              color="gray"
              icon={<FaCheckCircle />}
              className="mb-2 items-center"
            >
              <Typography>
                {' '}
                Anda Login sebagai : {session?.user?.email || ''}
              </Typography>
            </Alert>

            {new Date().getTime() > event.end_date.getTime() && (
              <Alert
                color="yellow"
                icon={<MdWarning />}
                className="items-center"
              >
                <Typography variant="h6">Event Telah Berakhir</Typography>
              </Alert>
            )}

            {new Date().getTime() < event.start_date.getTime() && (
              <Alert
                color="yellow"
                icon={<MdWarning />}
                className="items-center"
              >
                <Typography variant="h6">Event Belum Dimulai</Typography>
              </Alert>
            )}

            {success && (
              <Alert
                color="green"
                icon={<FaCheckCircle />}
                className="items-center"
              >
                Absensi Kegiatan Berhasil.
              </Alert>
            )}

            {new Date().getTime() > event.start_date.getTime() &&
              new Date().getTime() < event.end_date.getTime() && (
                <div className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/*<Controller*/}
                    {/*  control={control}*/}
                    {/*  name="identifier"*/}
                    {/*  render={({*/}
                    {/*    field: { onChange, onBlur, value, ref },*/}
                    {/*    formState,*/}
                    {/*    fieldState,*/}
                    {/*  }) => (*/}
                    {/*    <>*/}
                    {/*      <InputField*/}
                    {/*        id="identifier"*/}
                    {/*        label="NIP / NRP"*/}
                    {/*        placeholder="12345678"*/}
                    {/*        variant="auth"*/}
                    {/*        state={errors.identifier?.message ? 'error' : ''}*/}
                    {/*        onChange={onChange}*/}
                    {/*      />*/}
                    {/*      <small className="text-red-600">*/}
                    {/*        {errors?.identifier?.message}*/}
                    {/*      </small>*/}
                    {/*    </>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    {/*<Controller*/}
                    {/*  control={control}*/}
                    {/*  name="email"*/}
                    {/*  render={({*/}
                    {/*    field: { onChange, onBlur, value, ref },*/}
                    {/*    formState,*/}
                    {/*    fieldState,*/}
                    {/*  }) => (*/}
                    {/*    <>*/}
                    {/*      <InputField*/}
                    {/*        id="email"*/}
                    {/*        label="Email"*/}
                    {/*        placeholder="email@mail.com"*/}
                    {/*        variant="auth"*/}
                    {/*        state={errors.identifier?.message ? 'error' : ''}*/}
                    {/*        onChange={onChange}*/}
                    {/*      />*/}
                    {/*      <small className="text-red-600">*/}
                    {/*        {errors?.email?.message}*/}
                    {/*      </small>*/}
                    {/*    </>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    <Controller
                      control={control}
                      name="full_name"
                      render={({
                        field: { onChange, onBlur, value, ref },
                        formState,
                        fieldState,
                      }) => (
                        <>
                          <InputField
                            id="full_name"
                            label="Nama Lengkap"
                            placeholder="John Doe"
                            variant="auth"
                            onChange={onChange}
                            state={errors?.full_name?.message ? 'error' : ''}
                          />
                          <small className="text-red-600">
                            {errors?.full_name?.message}
                          </small>
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
                          <InputField
                            id="gelar"
                            label="Gelar Lengkap"
                            placeholder="S.Pd"
                            variant="auth"
                            onChange={onChange}
                          />

                          <small className="text-red-600">
                            {errors?.title?.message}
                          </small>
                        </>
                      )}
                    />

                    <Button
                      disabled={registerMutation.isLoading}
                      loading={registerMutation.isLoading}
                      className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                      type="submit"
                    >
                      ABSEN SEKARANG
                    </Button>
                  </form>
                </div>
              )}
          </div>
        </div>
      }
    />
  );
};
