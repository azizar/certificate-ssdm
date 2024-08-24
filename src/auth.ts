import NextAuth from 'next-auth';

type ErrorName = 'GET_TOKEN_ERROR' | 'UNKNOWN_ERROR' | 'SERVER_ERROR';

import authConfig from 'auth-config';

// declare module 'next-auth' {
//   /**
//    * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's postal address. */
//       address: string;
//       /**
//        * By default, TypeScript merges new interface properties and overwrites existing ones.
//        * In this case, the default session user properties will be overwritten,
//        * with the new ones defined above. To keep the default session user properties,
//        * you need to add them back into the newly declared interface.
//        */
//     } & DefaultSession['user'];
//   }
// }

// export class TokenError extends Error {
//   name: ErrorName;
//   message: string;
//   cause: any;

//   constructor({
//     message,
//     name,
//     cause,
//   }: {
//     name: ErrorName;
//     message: string;
//     cause?: any;
//   }) {
//     super();
//     this.name = name;
//     this.message = message;
//     this.cause = cause;
//   }
// }

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

// export interface Theme {
//   colorScheme?: 'auto' | 'dark' | 'light';
//   logo?: string;
//   brandColor?: string;
//   buttonText?: string;
// }

// export function html(params: { url: string; host: string; theme: Theme }) {
//   const { url, host, theme } = params;

//   const escapedHost = host.replace(/\./g, '&#8203;.');

//   const brandColor = theme.brandColor || '#346df1';
//   const buttonText = theme.buttonText || '#fff';

//   const color = {
//     background: '#f9f9f9',
//     text: '#444',
//     mainBackground: '#fff',
//     buttonBackground: brandColor,
//     buttonBorder: brandColor,
//     buttonText,
//   };

//   return `
//   <body style="background: ${color.background};">
//     <table width="100%" border="0" cellspacing="20" cellpadding="0"
//       style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
//       <tr>
//         <td align="center"
//           style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
//           Sign in to <strong>${escapedHost}</strong>
//         </td>
//       </tr>
//       <tr>
//         <td align="center" style="padding: 20px 0;">
//           <table border="0" cellspacing="0" cellpadding="0">
//             <tr>
//               <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
//                   target="_blank"
//                   style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
//                   in</a></td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//       <tr>
//         <td align="center"
//           style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
//           If you did not request this email you can safely ignore it.
//         </td>
//       </tr>
//     </table>
//   </body>
//   `;
// }

// export function text({ url, host }: { url: string; host: string }) {
//   return `Sign in to ${host}\n${url}\n\n`;
// }
