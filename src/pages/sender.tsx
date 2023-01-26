import React, {useEffect, useState} from "react";
import * as Separator from '@radix-ui/react-separator';
import TabsDemo from "@/components/tabs";
import styles from '@/styles/tab.module.css'
import usePeerJs from "@/hooks/peerjs";

import separatorStyles from '@/styles/separator.module.css'

function SendFiles() {
  const IDS = {
    self: 'sender',
    peer: 'receiver'
  }
  let conn: any;
  const {getPeer} = usePeerJs(IDS.self)[1];

  useEffect(() => {
    const peer = getPeer();
    if (!peer) return;
    conn = peer.connect(IDS.peer)
  }, [getPeer])

  function onClickConnect(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const peer = getPeer();
    if (!peer) return;
    conn = peer.connect(IDS.peer)
  }


  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files)
    if (!e.currentTarget.files) return

    const file = e.currentTarget.files[0]
    // const blob = new Blob(e.currentTarget.files, { type: file.type })

    try {
      conn.send({
        file: file,
        filename: file.name,
        filetype: file.type
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div style={{ width: '100%' }}>
      <h1>Send Files</h1>
      <Separator.Root className={separatorStyles.SeparatorRoot} style={{ margin: '15px 0' }} />
      <div>
        <button className="Button violet" onClick={onClickConnect}>Connect</button>
      </div>
      <input type="file" onChange={onChange} />
    </div>
  )
}


export default function Sender() {
  const tabItems = [
    {
      id: 'sendFiles',
      label: 'Send Files',
      content: SendFiles()
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Tab 2 content</div>
    }
  ];
  return (
    <div className={styles.TabWrapper}>
      <TabsDemo items={tabItems}></TabsDemo>
    </div>
  )
}
