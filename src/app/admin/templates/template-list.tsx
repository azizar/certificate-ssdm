'use client';

import React, { useEffect } from 'react';
import { google } from 'googleapis';
import process from 'node:process';
import { templateLists } from '../../../actions/certificate';

const GoogleTemplateList = () => {
  useEffect(() => {
    templateLists().then((res) => console.log(res));
  }, []);
  return <div></div>;
};

export default GoogleTemplateList;
