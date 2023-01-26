import React, {useState} from "react";

import TabsDemo from "@/components/tabs";
import styles from '@/styles/tab.module.css'

function SendFiles() {
  let peer: any;
  let conn: any;
  const [peerJs, setPeerJs] = useState<any>([]);

  React.useEffect(() => {
    const fn = async () => {
      const result = (await import('peerjs')).default;
      // set it to state here
      setPeerJs([result]);
    }
    fn()
  }, []); // empty array here ensures this is only executed once (when that component mounts).
  
  React.useEffect(() => {
    if (peerJs[0]) {
      console.log(peerJs)
      peer = new peerJs[0]('sender', { host: 'localhost', port: 9000, path: '/' })
      conn = peer.connect('receiver')
      console.log(conn)
    }
  }, [peerJs]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files)
    if (!e.currentTarget.files) return

    const file = e.currentTarget.files[0]
    // const blob = new Blob(e.currentTarget.files, { type: file.type })

    try {
      if (!peer) {
        peer = new peerJs[0]('sender', { host: 'localhost', port: 9000, path: '/' })
      }
      if (!conn) {
        conn = peer.connect('receiver')
      }
      // timeout to give time for connection to be established?
      setTimeout(() => {
        console.log('open')
        conn.send({
          file: file,
          filename: file.name,
          filetype: file.type
        })
      })
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div style={{ width: '100%' }}>
      <h1>Send Files</h1>
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
