// 'use client';

'use client';
import { handleLogin } from 'actions/authentication';

import Default from 'components/auth/variants/DefaultAuthLayout';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from '../../auth';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { useFormState } from 'react-dom';

function SignInDefault() {
  const [formState, formAction] = useFormState(handleLogin, {
    message: ''
  });
  return (
    <Default
      showBackButton={false}
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Enter your email and sign in!
            </p>

            <div className="space-y-4">
              {/*{providerMap?.map((prov, i) => {*/}
              {/*  return (*/}
              {/*    <div key={i}>*/}
              {/*      {prov.id === 'credentials' ? (*/}
              {/*        <form*/}
              {/*          action={(data) => {*/}
              {/*            handleLogin(prov.id, data).then((resp) =>*/}
              {/*              console.log({ resp }),*/}
              {/*            );*/}
              {/*          }}*/}
              {/*          className="space-y-4"*/}
              {/*        >*/}
              {/*          <Input*/}
              {/*            name="identifier"*/}
              {/*            className="mb-3"*/}
              {/*            crossOrigin={undefined}*/}
              {/*            type="text"*/}
              {/*            label="Email or Username"*/}
              {/*            placeholder="email@domain.com"*/}
              {/*            variant="static"*/}
              {/*          />*/}
              {/*          <Input*/}
              {/*            name="password"*/}
              {/*            className="mb-3"*/}
              {/*            crossOrigin={undefined}*/}
              {/*            type="password"*/}
              {/*            label="Password"*/}
              {/*            placeholder="*********"*/}
              {/*            variant="static"*/}
              {/*          />*/}
              {/*          */}
              {/*          <div className="mb-4 flex items-center justify-between px-2">*/}
              {/*            <div className="mt-2 flex items-center">*/}
              {/*              <Checkbox />*/}
              {/*              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">*/}
              {/*                Keep me logged In*/}
              {/*              </p>*/}
              {/*            </div>*/}
              {/*            <a*/}
              {/*              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"*/}
              {/*              href=" "*/}
              {/*            >*/}
              {/*              Forgot Password?*/}
              {/*            </a>*/}
              {/*          </div>*/}
              {/*          <button className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">*/}
              {/*            Sign In*/}
              {/*          </button>*/}
              {/*          <div className="mb-6 flex items-center  gap-3">*/}
              {/*            <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />*/}
              {/*            <p className="text-base text-gray-600"> or </p>*/}
              {/*            <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />*/}
              {/*          </div>*/}
              {/*        </form>*/}
              {/*      ) : (*/}
              {/*        <form*/}
              {/*          action={(data) => {*/}
              {/*            console.log(data);*/}

              {/*            handleLogin(prov.id, data).then((resp) =>*/}
              {/*              console.log({ resp }),*/}
              {/*            );*/}
              {/*          }}*/}
              {/*          className="space-y-4"*/}
              {/*          key={i}*/}
              {/*        >*/}
              {/*          <Input*/}
              {/*            name="email"*/}
              {/*            className="mb-3"*/}
              {/*            crossOrigin={undefined}*/}
              {/*            type="text"*/}
              {/*            label="Email"*/}
              {/*            placeholder="email@domain.com"*/}
              {/*            variant="outlined"*/}
              {/*          />*/}
              {/*          <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white">*/}
              {/*            <div className="rounded-full text-xl">*/}
              {/*              <IoMail />*/}
              {/*            </div>*/}
              {/*            <button*/}
              {/*              className="text-sm font-medium text-navy-700 dark:text-white"*/}
              {/*              type={'submit'}*/}
              {/*            >*/}
              {/*              Sign In with{' '}*/}
              {/*              {prov.id === 'resend' ? 'Email' : prov.name}*/}
              {/*            </button>*/}
              {/*          </div>*/}
              {/*        </form>*/}
              {/*      )}*/}
              {/*    </div>*/}
              {/*  );*/}
              {/*})}*/}
              <div>
                <form action={formAction} className="space-y-4">
                  <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white">
                    <div className="rounded-full text-xl">
                      <FaGoogle />
                    </div>
                    <button
                      className="text-sm font-medium text-navy-700 dark:text-white"
                      type={'submit'}
                    >
                      Sign In with Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
