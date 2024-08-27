import React from 'react';
import GoogleTemplateList, { DriveFile } from './template-list';
import { templateLists } from '../../../actions/certificate';

const TemplatePages = async () => {
  const templates = await templateLists();
  if (templates.status === 200) {
    return <GoogleTemplateList files={templates.data.files as DriveFile[]} />;
  }

  return <div>Error.</div>
};

export default TemplatePages;
