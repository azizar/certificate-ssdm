import React from 'react';
import { getDetailTemplate } from '../../../../actions/certificate';

export interface DriveProps {
  kind: string;
  copyRequiresWriterPermission: boolean;
  writersCanShare: boolean;
  viewedByMe: boolean;
  mimeType: string;
  exportLinks: any[];
  parents: any[];
  thumbnailLink: string;
  iconLink: string;
  shared: boolean;
  lastModifyingUser: any[];
  owners: any[];
  webViewLink: string;
  size: string;
  viewersCanCopyContent: boolean;
  permissions: any[];
  hasThumbnail: boolean;
  spaces: any[];
  id: string;
  name: string;
  starred: boolean;
  trashed: boolean;
  explicitlyTrashed: boolean;
  createdTime: string;
  modifiedTime: string;
  modifiedByMeTime: string;
  viewedByMeTime: string;
  quotaBytesUsed: string;
  version: string;
  ownedByMe: boolean;
  isAppAuthorized: boolean;
  capabilities: any[];
  thumbnailVersion: string;
  modifiedByMe: boolean;
  permissionIds: any[];
  linkShareMetadata: any[];
}

interface PageProps {
  params: {
    id: string;
  };
}

const ViewTemplate = async (props: PageProps) => {
  const data = await getDetailTemplate(props.params.id);
  console.log({ data });
  return (
    <div>
      <a href={data.data.exportLinks['application/pdf']} className={'h-[100vh] w-full'}>PDF</a>
      <pre>{JSON.stringify(data.data, null, 2)}</pre>
    </div>
  );
};

export default ViewTemplate;
