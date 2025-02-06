import { ReactElement } from 'react';
import { dummyData as data } from './dummy';
import { Button } from '@financeapp/frontend-common';

export const ManageUsersTableComponent = (): ReactElement => {
  return (
    <section>
      <div className="flex">
        <h2>Users</h2>
        <input type="text" placeholder="Filter" />
        <Button icon="user-plus" text="Add User" />
      </div>
      <div className="mt-4 border rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-start">Name</th>
              <th className="px-6 py-3 text-start">Email</th>
              <th className="px-6 py-3 text-start">Role</th>
              <th className="px-6 py-3 text-start">Verified</th>
              <th className="px-6 py-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-3 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-3 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-3 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-3 whitespace-nowrap">{user.accountVerified.toString()}</td>
                <td className="whitespace-nowrap flex">
                  <Button icon="key" size="sm" text="Reset password" />
                  <Button icon="trash" size="sm" color="danger" text="Delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
