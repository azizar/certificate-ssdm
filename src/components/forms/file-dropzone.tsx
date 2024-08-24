/* eslint-disable @next/next/no-img-element */
'use client';

// @ts-ignore

import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelected: (file: File) => void;
  file?: File;
  preview?: boolean;
}

const AppInputFile = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onFileSelected, preview, file, ...props }, ref) => {
    const onFileChange = React.useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
          const files = Array.from(e.target.files);

          onFileSelected(files[0]);
        }
      },
      [onFileSelected],
    );

    return (
      <div className="flex h-[150px] items-center justify-start">
        <label
          htmlFor={props.id || 'file-input'}
          className="dark:hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            {preview && file ? (
              <>
                <svg
                  className="size-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="max-w-full truncate text-sm text-gray-700 dark:text-gray-400">
                  <span className="max-w-1 truncate">{file?.name ?? ''}</span>
                  <span className="font-semibold">
                    {!file && 'Click to upload.'}
                  </span>
                </p>
              </>
            ) : (
              <>
                <svg
                  className="size-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="max-w-full truncate text-sm text-gray-700 dark:text-gray-400">
                  <span className="font-semibold">{'Click to upload.'}</span>
                </p>
              </>
            )}
          </div>
          <input
            id={props.id || 'file-input'}
            type="file"
            className="hidden"
            ref={ref}
            onChange={onFileChange}
            {...props}
          />
        </label>
      </div>
    );
  },
);
AppInputFile.displayName = 'AppInputFile';

export { AppInputFile };
