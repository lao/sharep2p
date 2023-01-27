import React, {useEffect, useState} from "react";
import * as Separator from '@radix-ui/react-separator';
import TabsDemo from "@/components/tabs";
import styles from '@/styles/tab.module.css'
import usePeerJs from "@/hooks/peerjs";

import separatorStyles from '@/styles/separator.module.css'
import senderStyles from '@/styles/sender.module.css'

function SendFiles() {
  const IDS = {
    self: 'sender',
    peer: 'receiver'
  }
  let conn: any;
  const {getPeer} = usePeerJs(IDS.self)[1];
  const [files, setFiles] = useState<any>([])

  useEffect(() => {
    setConnectionWithPeer()
  }, [getPeer])

  function onClickConnect(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setConnectionWithPeer()
  }

  function setConnectionWithPeer() {
    const peer = getPeer();
    if (!peer) return;
    conn = peer.connect(IDS.peer)
    conn.on('open', () => {
      console.log('Connection established')
      conn.on('data', (data: any) => {
        console.log('Received', data)
      })
    })
  }

  function sendFileOnClick(e: React.MouseEvent<HTMLButtonElement>, file: any) {
    e.preventDefault();
    if (!conn) return;
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

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files)
    if (!e.currentTarget.files) return

    const file = e.currentTarget.files[0]
    // const blob = new Blob(e.currentTarget.files, { type: file.type })
    setFiles([...files, file])
  }

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const handleFileAddBlick = (event: React.MouseEvent<HTMLDivElement>) => {
    (hiddenFileInput?.current as any).click();
  };
  return (
    <div style={{ width: '100%' }}>
      <div>
        <button className="Button violet" onClick={onClickConnect}>Connect</button>
      </div>
      <Separator.Root className={separatorStyles.SeparatorRoot} style={{ margin: '15px 0' }} />
      <div className={senderStyles.FilesList}>
      {
        files.map((file: any, index: number) => (
          <div key={index} className={senderStyles.FilesListItem}>
            <p>{file.name}</p>
            <button className="Button violet" onClick={(e) => sendFileOnClick(e, file)}>Send</button>
          </div>
        ))
      }
      </div>
      <Separator.Root className={separatorStyles.SeparatorRoot} style={{ margin: '15px 0' }} />
      <div>
        <div className={senderStyles.FileAddButton} onClick={handleFileAddBlick}><svg viewBox="0 0 72 72"><path d="M36.493 72C16.118 72 0 55.883 0 36.493 0 16.118 16.118 0 36.493 0 55.882 0 72 16.118 72 36.493 72 55.882 55.883 72 36.493 72zM34 34h-9c-.553 0-1 .452-1 1.01v1.98A1 1 0 0 0 25 38h9v9c0 .553.452 1 1.01 1h1.98A1 1 0 0 0 38 47v-9h9c.553 0 1-.452 1-1.01v-1.98A1 1 0 0 0 47 34h-9v-9c0-.553-.452-1-1.01-1h-1.98A1 1 0 0 0 34 25v9z" fill="#5268ff" fill-rule="nonzero"></path></svg></div>
        <input type="file" style={{display: 'none'}}  ref={hiddenFileInput} onChange={onChange} />
      </div>
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
    // {
    //   id: 'tab2',
    //   label: 'Tab 2',
    //   content: <div>Tab 2 content</div>
    // }
  ];
  return (
    <div className={styles.TabWrapper}>
      <TabsDemo items={tabItems}></TabsDemo>
    </div>
  )
}
