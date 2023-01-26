import React, { useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface TabsProps {
  items: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  default?: string;
}

const TabsDemo = (props: TabsProps) => {

  return (
    <Tabs.Root className="TabsRoot" defaultValue={props.default || props.items[0].id}>
      <Tabs.List className="TabsList" aria-label="Manage your account">
        {
          props.items.map((item) => (
            <Tabs.Trigger className="TabsTrigger" key={item.id} value={item.id}>
              {item.label}
            </Tabs.Trigger>
          ))
        }
      </Tabs.List>
      {
        props.items.map((item) => (
          <Tabs.Content className="TabsContent" key={item.id} value={item.id}>
            {item.content}
          </Tabs.Content>
        ))
      }
    </Tabs.Root>
  );
};

export default TabsDemo;