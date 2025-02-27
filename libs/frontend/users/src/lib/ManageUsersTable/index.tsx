'use client';
import { ReactElement } from 'react';
import { Button, classNames } from '@financeapp/frontend-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useManageUsers } from '../_Common/ManageUsers.Hook';
import { useVerifyUser } from '../_Common/VerifyUser.Hook';
import { usePasswordReset } from '../_Common';
import { AddUserButton } from '../AddUserButton';

export const ManageUsersTableComponent = (): ReactElement => {
  const { data } = useManageUsers();
  const verifyUserService = useVerifyUser();
  const resetPasswordService = usePasswordReset();

  const getEmailClass = (verified: boolean) =>
    classNames({
      'bg-cinnabar-800': !verified,
      'bg-mint-600': verified,
      'px-2 rounded-xl font-bold text-sm shadow-md': true,
    });

  return (
    <section className="h-full flex-1 flex-col">
      <div className="mb-5 flex items-center">
        <h2 className="flex-1 text-2xl">Users</h2>
        <AddUserButton />
      </div>

      <div className="flex h-[95%] flex-1 overflow-y-auto md:max-h-96">
        <table className="block h-0 w-full flex-1 border-collapse md:table">
          <thead className="bg-riverbed-950 absolute -top-full z-50 md:sticky md:top-0">
            <tr>
              <th className="px-3 py-2 text-start">Name</th>
              <th className="px-3 py-2 text-start">Email</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group md:max-h-96 md:overflow-y-auto">
            {data?.map((user) => (
              <tr
                key={user.id}
                className="border-riverbed-800 bg-riverbed-600 md:odd:bg-riverbed-800 md:even:bg-riverbed-600 mt-8 block border drop-shadow-md md:mt-0 md:table-row md:border-none md:drop-shadow-none"
              >
                <td className="block px-3 py-3 md:table-cell">
                  <div className="flex items-center before:pr-4 before:content-['Name:'] md:before:content-none">
                    {user.role === 'admin' && <FontAwesomeIcon icon="user-tie" className="pr-2" />}
                    <p className="flex-1 truncate">{user.name}</p>
                  </div>
                </td>
                <td className="block px-3 py-3 md:table-cell md:before:content-none">
                  <div className="flex before:pr-4 before:content-['Email:'] md:before:content-none">
                    <p className={getEmailClass(user.accountVerified)}>{user.email}</p>
                  </div>
                </td>
                <td className="block px-3 md:table-cell md:before:content-none">
                  <div className="flex before:pr-4 before:content-['Actions:'] md:justify-center md:before:content-none">
                    {!user.accountVerified ? (
                      <Button
                        icon="envelope-circle-check"
                        size="sm"
                        text="Verify email"
                        onClick={() => verifyUserService.send(user.id)}
                      />
                    ) : (
                      <div className="w-10" />
                    )}
                    <Button
                      icon="key"
                      size="sm"
                      text="Reset password"
                      onClick={() => resetPasswordService.send(user.id)}
                    />
                    {/* <Button icon="trash" size="sm" color="danger" text="Delete" /> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
