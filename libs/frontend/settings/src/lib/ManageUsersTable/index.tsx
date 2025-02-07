import { ReactElement } from 'react';
import { dummyData as data } from './dummy';
import { Button, classNames } from '@financeapp/frontend-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ManageUsersTableComponent = (): ReactElement => {
  const getEmailClass = (verified: boolean) =>
    classNames({
      'bg-cinnabar-800': !verified,
      'bg-mint-600': verified,
      'px-2 rounded-xl font-bold text-sm shadow-md': true,
    });

  return (
    <section>
      <div className="flex">
        <h2>Users</h2>
        <input type="text" placeholder="Filter" />
        <Button icon="user-plus" text="Add User" />
      </div>
      <div className="block max-h-96 overflow-y-auto mt-4">
        <table className="w-full">
          <thead className="bg-riverbed-950 sticky top-0 z-50">
            <tr>
              <th className="py-2 text-start">Name</th>
              <th className="py-2 text-start">Email</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-96 overflow-y-auto">
            {data.map((user) => (
              <tr
                key={user.id}
                className="even:bg-riverbed-600 odd:bg-riverbed-800 text-riverbed-50"
              >
                <td>
                  <div className="flex">
                    <p>{user.name}</p>
                    {user.role === 'admin' && <FontAwesomeIcon icon="user-tie" className="pl-2" />}
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <p className={getEmailClass(user.accountVerified)}>{user.email}</p>
                  </div>
                </td>
                <td>
                  <div className="flex justify-center">
                    <Button icon="key" size="sm" text="Verify email" />
                    <Button icon="key" size="sm" text="Reset password" />
                    <Button icon="trash" size="sm" color="danger" text="Delete" />
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
