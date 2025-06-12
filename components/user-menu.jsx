'use client';

import { UserButton } from '@clerk/nextjs';
import { ChartNoAxesGantt } from 'lucide-react';
import React from 'react';

const UserMenu = () => {
    console.log('UserMenu rendered');
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'h-10 w-10',
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organizations"
          labelIcon={<ChartNoAxesGantt size={16} />}
          href="/onboarding"
        />

        <UserButton.Action label='manageAccount'/>
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
